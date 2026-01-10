import { create } from 'zustand';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface ToastStore {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => string;
    removeToast: (id: string) => void;
    clearAll: () => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
    toasts: [],

    addToast: (toast) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const newToast: Toast = { ...toast, id };

        set((state) => ({
            toasts: [...state.toasts, newToast],
        }));

        // Auto-remove after duration (default 5s)
        const duration = toast.duration ?? 5000;
        if (duration > 0) {
            setTimeout(() => {
                get().removeToast(id);
            }, duration);
        }

        return id;
    },

    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        }));
    },

    clearAll: () => {
        set({ toasts: [] });
    },
}));

// Convenience functions
export const toast = {
    success: (title: string, message?: string) =>
        useToastStore.getState().addToast({ type: 'success', title, message }),

    error: (title: string, message?: string) =>
        useToastStore.getState().addToast({ type: 'error', title, message, duration: 8000 }),

    info: (title: string, message?: string) =>
        useToastStore.getState().addToast({ type: 'info', title, message }),

    warning: (title: string, message?: string) =>
        useToastStore.getState().addToast({ type: 'warning', title, message }),

    custom: (toast: Omit<Toast, 'id'>) =>
        useToastStore.getState().addToast(toast),
};

// Icon map
const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
};

// Color map
const colors = {
    success: {
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        icon: 'text-green-400',
        title: 'text-green-300',
    },
    error: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        icon: 'text-red-400',
        title: 'text-red-300',
    },
    info: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        icon: 'text-blue-400',
        title: 'text-blue-300',
    },
    warning: {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
        icon: 'text-yellow-400',
        title: 'text-yellow-300',
    },
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
    const Icon = icons[toast.type];
    const colorScheme = colors[toast.type];

    useEffect(() => {
        // Animation cleanup
        const timer = setTimeout(() => { }, 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`
        flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm
        shadow-lg shadow-black/20 animate-in slide-in-from-right
        ${colorScheme.bg} ${colorScheme.border}
        min-w-[300px] max-w-[400px]
      `}
        >
            <Icon size={20} className={colorScheme.icon} />

            <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${colorScheme.title}`}>
                    {toast.title}
                </p>
                {toast.message && (
                    <p className="text-xs text-white/50 mt-0.5">
                        {toast.message}
                    </p>
                )}
                {toast.action && (
                    <button
                        onClick={toast.action.onClick}
                        className="mt-2 text-xs text-accent-blue hover:text-accent-blue/80 font-medium transition-colors"
                    >
                        {toast.action.label}
                    </button>
                )}
            </div>

            <button
                onClick={onRemove}
                className="p-1 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition-colors"
            >
                <X size={14} />
            </button>
        </div>
    );
}

export function ToastContainer() {
    const toasts = useToastStore((state) => state.toasts);
    const removeToast = useToastStore((state) => state.removeToast);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
            {toasts.map((t) => (
                <ToastItem
                    key={t.id}
                    toast={t}
                    onRemove={() => removeToast(t.id)}
                />
            ))}
        </div>
    );
}
