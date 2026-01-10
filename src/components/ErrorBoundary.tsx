import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    private handleReload = () => {
        window.location.reload();
    };

    private handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-canvas-bg flex items-center justify-center p-8">
                    <div className="max-w-md w-full bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-4 bg-red-500/10 border-b border-red-500/20 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                                <AlertTriangle className="text-red-400" size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">Something went wrong</h2>
                                <p className="text-xs text-white/50">An unexpected error occurred</p>
                            </div>
                        </div>

                        {/* Error details */}
                        <div className="p-6 space-y-4">
                            <div className="bg-black/30 rounded-xl p-4 overflow-auto max-h-40">
                                <p className="text-sm text-red-300 font-mono">
                                    {this.state.error?.message || 'Unknown error'}
                                </p>
                                {this.state.errorInfo && (
                                    <details className="mt-2">
                                        <summary className="text-xs text-white/40 cursor-pointer hover:text-white/60">
                                            Stack trace
                                        </summary>
                                        <pre className="mt-2 text-xs text-white/30 whitespace-pre-wrap">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </details>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={this.handleReset}
                                    className="flex-1 py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white/80 font-medium transition-colors"
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={this.handleReload}
                                    className="flex-1 py-2.5 px-4 bg-accent-blue hover:bg-accent-blue/80 rounded-xl text-sm text-white font-medium flex items-center justify-center gap-2 transition-colors"
                                >
                                    <RefreshCw size={14} />
                                    Reload Page
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    fallback?: ReactNode
) {
    return function WithErrorBoundaryWrapper(props: P) {
        return (
            <ErrorBoundary fallback={fallback}>
                <WrappedComponent {...props} />
            </ErrorBoundary>
        );
    };
}
