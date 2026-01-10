/**
 * Safe localStorage utilities with error handling and type safety
 */

const STORAGE_PREFIX = 'nodav3_';

interface StorageOptions {
    prefix?: string;
    ttl?: number; // Time-to-live in milliseconds
}

interface StoredItem<T> {
    value: T;
    timestamp: number;
    ttl?: number;
}

/**
 * Safely get item from localStorage with JSON parsing
 */
export function getStorageItem<T>(key: string, defaultValue: T, options?: StorageOptions): T {
    try {
        const prefixedKey = (options?.prefix ?? STORAGE_PREFIX) + key;
        const item = localStorage.getItem(prefixedKey);

        if (!item) return defaultValue;

        const parsed = JSON.parse(item) as StoredItem<T>;

        // Check TTL if set
        if (parsed.ttl && Date.now() - parsed.timestamp > parsed.ttl) {
            localStorage.removeItem(prefixedKey);
            return defaultValue;
        }

        return parsed.value;
    } catch (error) {
        console.warn(`Failed to get storage item "${key}":`, error);
        return defaultValue;
    }
}

/**
 * Safely set item in localStorage with JSON serialization
 */
export function setStorageItem<T>(key: string, value: T, options?: StorageOptions): boolean {
    try {
        const prefixedKey = (options?.prefix ?? STORAGE_PREFIX) + key;
        const item: StoredItem<T> = {
            value,
            timestamp: Date.now(),
            ttl: options?.ttl,
        };
        localStorage.setItem(prefixedKey, JSON.stringify(item));
        return true;
    } catch (error) {
        console.warn(`Failed to set storage item "${key}":`, error);
        return false;
    }
}

/**
 * Safely remove item from localStorage
 */
export function removeStorageItem(key: string, options?: StorageOptions): boolean {
    try {
        const prefixedKey = (options?.prefix ?? STORAGE_PREFIX) + key;
        localStorage.removeItem(prefixedKey);
        return true;
    } catch (error) {
        console.warn(`Failed to remove storage item "${key}":`, error);
        return false;
    }
}

/**
 * Clear all items with the given prefix
 */
export function clearStoragePrefix(prefix: string = STORAGE_PREFIX): number {
    let cleared = 0;
    try {
        const keys = Object.keys(localStorage);
        for (const key of keys) {
            if (key.startsWith(prefix)) {
                localStorage.removeItem(key);
                cleared++;
            }
        }
    } catch (error) {
        console.warn('Failed to clear storage:', error);
    }
    return cleared;
}

/**
 * Get storage usage info
 */
export function getStorageInfo(): { used: number; available: number; items: number } {
    try {
        let used = 0;
        let items = 0;

        for (const key of Object.keys(localStorage)) {
            if (key.startsWith(STORAGE_PREFIX)) {
                const value = localStorage.getItem(key);
                if (value) {
                    used += key.length + value.length;
                    items++;
                }
            }
        }

        // Estimate available space (usually ~5MB)
        const available = 5 * 1024 * 1024 - used;

        return { used, available, items };
    } catch {
        return { used: 0, available: 0, items: 0 };
    }
}
