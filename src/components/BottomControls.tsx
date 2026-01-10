import { useReactFlow } from '@xyflow/react';
import { ZoomIn, ZoomOut, Maximize2, Play, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store/useStore';

export function BottomControls() {
    const { zoomIn, zoomOut, fitView } = useReactFlow();
    const nodes = useStore(s => s.nodes);
    const executeNodeChain = useStore(s => s.executeNodeChain);

    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState<string>('');

    // Find the last node in the workflow (typically video or image output)
    const findEndNodes = () => {
        const edges = useStore.getState().edges;
        const sources = new Set(edges.map(e => e.source));

        // End nodes are nodes that are not sources of any edge
        return nodes.filter(n => !sources.has(n.id));
    };

    const handleRunAll = async () => {
        const endNodes = findEndNodes();
        if (endNodes.length === 0) {
            alert('Нет узлов для выполнения');
            return;
        }

        setIsRunning(true);

        try {
            for (let i = 0; i < endNodes.length; i++) {
                const node = endNodes[i];
                setProgress(`${i + 1}/${endNodes.length}: ${node.data?.title || node.type}`);
                await executeNodeChain(node.id);
            }
            setProgress('✓ Готово!');
            setTimeout(() => setProgress(''), 2000);
        } catch (error) {
            setProgress('Ошибка');
            console.error('Run All error:', error);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bottom-controls">
            <div className="flex items-center gap-1 px-2 py-2 glass-panel rounded-full shadow-2xl shadow-black/50">
                {/* Zoom controls */}
                <button
                    onClick={() => zoomOut()}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                    title="Уменьшить"
                >
                    <ZoomOut size={18} />
                </button>

                <button
                    onClick={() => zoomIn()}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                    title="Увеличить"
                >
                    <ZoomIn size={18} />
                </button>

                <button
                    onClick={() => fitView({ padding: 0.2, duration: 300 })}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
                    title="Вписать в экран"
                >
                    <Maximize2 size={18} />
                </button>

                {/* Divider */}
                <div className="w-px h-6 bg-white/10 mx-1" />

                {/* Run All button */}
                <button
                    onClick={handleRunAll}
                    disabled={isRunning || nodes.length === 0}
                    className="h-9 px-4 btn-neon rounded-full flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Запустить весь workflow"
                >
                    {isRunning ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            <span className="text-xs">{progress}</span>
                        </>
                    ) : (
                        <>
                            <Play size={16} />
                            <span>Run All</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
