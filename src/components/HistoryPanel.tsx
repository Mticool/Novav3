import { X, RotateCcw, Trash2, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';

interface HistoryPanelProps {
    onClose: () => void;
}

interface HistoryEntry {
    id: string;
    timestamp: Date;
    action: string;
    details: string;
}

// Simple in-memory history (in production, would be stored in state)
const historyLog: HistoryEntry[] = [];

export function addHistoryEntry(action: string, details: string) {
    historyLog.unshift({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        timestamp: new Date(),
        action,
        details,
    });
    // Keep only last 50 entries
    if (historyLog.length > 50) {
        historyLog.pop();
    }
}

export function HistoryPanel({ onClose }: HistoryPanelProps) {
    const clearWorkflow = useStore((s) => s.clearWorkflow);
    const nodes = useStore((s) => s.nodes);
    const edges = useStore((s) => s.edges);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    };

    const handleClearHistory = () => {
        historyLog.length = 0;
        onClose();
    };

    const handleResetCanvas = () => {
        if (confirm('Очистить весь canvas?')) {
            clearWorkflow();
            addHistoryEntry('Очистка', 'Canvas очищен');
            onClose();
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />

            {/* Panel */}
            <div className="fixed left-20 top-1/2 -translate-y-1/2 w-[320px] max-h-[70vh] glass-panel rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-white/50" />
                        <h2 className="text-sm font-semibold text-white">История</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Stats */}
                <div className="px-4 py-3 bg-white/5 border-b border-white/5 shrink-0">
                    <div className="flex items-center justify-between text-xs text-white/50">
                        <span>Узлов: {nodes.length}</span>
                        <span>Связей: {edges.length}</span>
                    </div>
                </div>

                {/* History list */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {historyLog.length === 0 ? (
                        <div className="p-8 text-center text-white/30">
                            <Clock size={24} className="mx-auto mb-2 opacity-50" />
                            <p className="text-xs">История пуста</p>
                            <p className="text-xs mt-1">Действия будут появляться здесь</p>
                        </div>
                    ) : (
                        <div className="p-2 space-y-1">
                            {historyLog.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-white/80">{entry.action}</span>
                                        <span className="text-[10px] text-white/30">{formatTime(entry.timestamp)}</span>
                                    </div>
                                    <p className="text-[11px] text-white/40 mt-0.5 truncate">{entry.details}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="px-4 py-3 border-t border-white/5 flex gap-2 shrink-0">
                    <button
                        onClick={handleClearHistory}
                        className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-white/70 flex items-center justify-center gap-2 transition-colors"
                    >
                        <Trash2 size={12} />
                        Очистить историю
                    </button>
                    <button
                        onClick={handleResetCanvas}
                        className="flex-1 py-2 px-3 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-xs text-red-400 flex items-center justify-center gap-2 transition-colors"
                    >
                        <RotateCcw size={12} />
                        Сброс canvas
                    </button>
                </div>
            </div>
        </>
    );
}
