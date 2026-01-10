import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { toast } from '../components/Toast';
import { debounce } from '../lib/utils';

const AUTO_SAVE_KEY = 'nodav3_autosave';
const AUTO_SAVE_DELAY = 30000; // 30 seconds
const LAST_SAVE_KEY = 'nodav3_last_save';

interface AutoSaveData {
    nodes: unknown[];
    edges: unknown[];
    projectName: string;
    savedAt: string;
}

export function useAutoSave(enabled: boolean = true) {
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);
    const projectName = useStore((state) => state.projectName);
    const loadWorkflow = useStore((state) => state.loadWorkflow);

    const lastSaveRef = useRef<string>('');
    const hasLoadedRef = useRef(false);

    // Save function
    const save = useCallback(() => {
        if (!enabled || nodes.length === 0) return;

        const data: AutoSaveData = {
            nodes,
            edges,
            projectName,
            savedAt: new Date().toISOString(),
        };

        const dataString = JSON.stringify(data);

        // Skip if nothing changed
        if (dataString === lastSaveRef.current) return;

        try {
            localStorage.setItem(AUTO_SAVE_KEY, dataString);
            localStorage.setItem(LAST_SAVE_KEY, data.savedAt);
            lastSaveRef.current = dataString;

            console.log('🔄 Auto-saved at', new Date().toLocaleTimeString());
        } catch (error) {
            console.error('Auto-save failed:', error);
            toast.error('Автосохранение не удалось', 'Проверьте доступное место в браузере');
        }
    }, [enabled, nodes, edges, projectName]);

    // Debounced save - using useCallback to avoid dependency issues
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSave = useCallback(
        debounce(save, 2000), // Save 2s after last change
        [save]
    );

    // Auto-save on changes
    useEffect(() => {
        if (enabled && hasLoadedRef.current) {
            debouncedSave();
        }
    }, [nodes, edges, enabled, debouncedSave]);

    // Periodic save
    useEffect(() => {
        if (!enabled) return;

        const interval = setInterval(save, AUTO_SAVE_DELAY);
        return () => clearInterval(interval);
    }, [enabled, save]);

    // Load on mount
    useEffect(() => {
        if (hasLoadedRef.current) return;
        hasLoadedRef.current = true;

        try {
            const saved = localStorage.getItem(AUTO_SAVE_KEY);
            if (!saved) return;

            const data: AutoSaveData = JSON.parse(saved);

            // Check if there's actual data
            if (!data.nodes || data.nodes.length === 0) return;

            // Check if current canvas is empty
            const currentNodes = useStore.getState().nodes;
            if (currentNodes.length > 0) return;

            // Show recovery option
            const savedDate = new Date(data.savedAt);
            const timeAgo = getTimeAgo(savedDate);

            toast.custom({
                type: 'info',
                title: 'Восстановить последнюю сессию?',
                message: `Сохранено ${timeAgo}`,
                duration: 15000,
                action: {
                    label: 'Восстановить',
                    onClick: () => {
                        loadWorkflow(JSON.stringify({
                            version: '1.0',
                            name: data.projectName,
                            nodes: data.nodes,
                            edges: data.edges,
                        }));
                        toast.success('Сессия восстановлена');
                    },
                },
            });
        } catch (error) {
            console.error('Failed to load auto-save:', error);
        }
    }, [loadWorkflow]);

    // Save before unload
    useEffect(() => {
        if (!enabled) return;

        const handleBeforeUnload = () => {
            save();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [enabled, save]);

    return { save };
}

function getTimeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return 'только что';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} мин. назад`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ч. назад`;
    return `${Math.floor(seconds / 86400)} дн. назад`;
}

// Manual save function
export function manualSave(): boolean {
    try {
        const state = useStore.getState();
        const data: AutoSaveData = {
            nodes: state.nodes,
            edges: state.edges,
            projectName: state.projectName,
            savedAt: new Date().toISOString(),
        };

        localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(data));
        localStorage.setItem(LAST_SAVE_KEY, data.savedAt);

        toast.success('Проект сохранён');
        return true;
    } catch {
        toast.error('Не удалось сохранить', 'Проверьте доступное место');
        return false;
    }
}

// Get last save time
export function getLastSaveTime(): Date | null {
    try {
        const saved = localStorage.getItem(LAST_SAVE_KEY);
        return saved ? new Date(saved) : null;
    } catch {
        return null;
    }
}

// Clear auto-save
export function clearAutoSave(): void {
    try {
        localStorage.removeItem(AUTO_SAVE_KEY);
        localStorage.removeItem(LAST_SAVE_KEY);
    } catch {
        // Ignore
    }
}
