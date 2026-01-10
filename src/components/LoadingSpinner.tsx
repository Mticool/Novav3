import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    message?: string;
    fullScreen?: boolean;
}

const sizeMap = {
    sm: 16,
    md: 24,
    lg: 40,
};

export function LoadingSpinner({
    size = 'md',
    message,
    fullScreen = false
}: LoadingSpinnerProps) {
    const content = (
        <div className="flex flex-col items-center justify-center gap-3">
            <Loader2
                size={sizeMap[size]}
                className="animate-spin text-accent-blue"
            />
            {message && (
                <p className="text-sm text-white/50">{message}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen bg-canvas-bg flex items-center justify-center">
                {content}
            </div>
        );
    }

    return content;
}

// Skeleton loader for nodes
export function NodeSkeleton() {
    return (
        <div className="w-[280px] animate-pulse">
            <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
                {/* Header skeleton */}
                <div className="px-4 py-3 border-b border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-lg" />
                    <div className="flex-1">
                        <div className="h-4 bg-white/10 rounded w-24" />
                    </div>
                </div>

                {/* Content skeleton */}
                <div className="p-4 space-y-3">
                    <div className="h-20 bg-white/5 rounded-lg" />
                    <div className="h-8 bg-white/5 rounded-lg" />
                </div>
            </div>
        </div>
    );
}

// Skeleton for the canvas loading
export function CanvasSkeleton() {
    return (
        <div className="h-full w-full bg-canvas-bg flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="flex gap-4 justify-center">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="w-16 h-16 bg-white/5 rounded-xl animate-pulse"
                            style={{ animationDelay: `${i * 150}ms` }}
                        />
                    ))}
                </div>
                <p className="text-sm text-white/40">Loading workspace...</p>
            </div>
        </div>
    );
}
