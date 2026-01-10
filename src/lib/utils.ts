/**
 * Utility functions for performance optimization
 */

/**
 * Debounce function - delays execution until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            func.apply(this, args);
            timeoutId = null;
        }, wait);
    };
}

/**
 * Throttle function - ensures the function is called at most once per wait milliseconds
 */
export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let lastTime = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        const now = Date.now();
        const remaining = wait - (now - lastTime);

        if (remaining <= 0 || remaining > wait) {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            lastTime = now;
            func.apply(this, args);
        } else if (!timeoutId) {
            timeoutId = setTimeout(() => {
                lastTime = Date.now();
                timeoutId = null;
                func.apply(this, args);
            }, remaining);
        }
    };
}

/**
 * Create a cancellable promise
 */
export function cancellable<T>(promise: Promise<T>): {
    promise: Promise<T>;
    cancel: () => void;
    isCancelled: () => boolean;
} {
    let isCancelled = false;

    const wrappedPromise = new Promise<T>((resolve, reject) => {
        promise.then(
            (value) => {
                if (!isCancelled) {
                    resolve(value);
                }
            },
            (error) => {
                if (!isCancelled) {
                    reject(error);
                }
            }
        );
    });

    return {
        promise: wrappedPromise,
        cancel: () => {
            isCancelled = true;
        },
        isCancelled: () => isCancelled,
    };
}

/**
 * Sleep for a specified duration
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
    fn: () => Promise<T>,
    options: {
        maxAttempts?: number;
        initialDelay?: number;
        maxDelay?: number;
        backoffFactor?: number;
        onRetry?: (error: unknown, attempt: number) => void;
    } = {}
): Promise<T> {
    const {
        maxAttempts = 3,
        initialDelay = 1000,
        maxDelay = 30000,
        backoffFactor = 2,
        onRetry,
    } = options;

    let lastError: unknown;
    let delay = initialDelay;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            if (attempt === maxAttempts) {
                throw error;
            }

            if (onRetry) {
                onRetry(error, attempt);
            }

            await sleep(delay);
            delay = Math.min(delay * backoffFactor, maxDelay);
        }
    }

    throw lastError;
}

/**
 * Memoize a function with optional TTL
 */
export function memoize<T extends (...args: Parameters<T>) => ReturnType<T>>(
    fn: T,
    options: {
        ttl?: number;
        maxSize?: number;
        keyFn?: (...args: Parameters<T>) => string;
    } = {}
): T {
    const { ttl, maxSize = 100, keyFn = (...args) => JSON.stringify(args) } = options;
    const cache = new Map<string, { value: ReturnType<T>; timestamp: number }>();

    return ((...args: Parameters<T>): ReturnType<T> => {
        const key = keyFn(...args);
        const cached = cache.get(key);

        if (cached) {
            if (!ttl || Date.now() - cached.timestamp < ttl) {
                return cached.value;
            }
            cache.delete(key);
        }

        const result = fn(...args);

        // Enforce max size
        if (cache.size >= maxSize) {
            const firstKey = cache.keys().next().value;
            if (firstKey) {
                cache.delete(firstKey);
            }
        }

        cache.set(key, { value: result, timestamp: Date.now() });
        return result;
    }) as T;
}
