import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Loader2, Play, Zap } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const GeneratorNode = memo(({ id, data, selected }: NodeProps) => {
  const generateFromText = useStore(s => s.generateFromText);
  const edges = useStore(s => s.edges);
  const nodes = useStore(s => s.nodes);

  const nodeData = data as Record<string, unknown>;
  const [mode] = useState<'image' | 'video'>((nodeData?.mode as 'image' | 'video') || 'image');

  const handleRun = async () => {
    const incomingEdges = edges.filter(e => e.target === id);
    if (incomingEdges.length === 0) {
      alert('Подключите промпт перед генерацией.');
      return;
    }

    const sourceNode = nodes.find(n => n.id === incomingEdges[0].source);
    if (!sourceNode) return;

    await generateFromText(sourceNode.id, id);
  };

  const isLoading = nodeData?.state === 'loading';

  return (
    <div className="w-[280px] relative">
      <div
        data-state={(nodeData?.state as string) || 'idle'}
        className={`node-card ${selected ? 'selected' : ''}`}
      >
        <Handle type="target" position={Position.Left} id="prompt-input" />
        <Handle type="target" position={Position.Left} id="ref-image" style={{ top: '60px' }} />

        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.04]">
          <Zap size={12} className="opacity-50" />
          <span className="text-[11px] font-medium text-white/65 flex-1">
            {(nodeData?.title as string) || `Генератор ${mode === 'image' ? 'изображений' : 'видео'} #1`}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); void handleRun(); }}
            disabled={isLoading}
            className="w-5 h-5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            {isLoading ? <Loader2 size={10} className="animate-spin" /> : <Play size={10} />}
          </button>
        </div>

        {/* Входы */}
        <div className="px-3 pt-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/40">Промпт</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/40">Опорное изображение</span>
          </div>
        </div>

        {/* Preview */}
        <div className="px-3 py-2">
          <div className="w-full h-[140px] bg-black/30 border border-white/[0.03] rounded-lg overflow-hidden flex items-center justify-center">
            {nodeData?.outputUrl && typeof nodeData.outputUrl === 'string' ? (
              mode === 'video' ? (
                <video src={nodeData.outputUrl} controls className="w-full h-full object-cover" />
              ) : (
                <img src={nodeData.outputUrl} alt="Generated" className="w-full h-full object-cover" />
              )
            ) : (
              <span className="text-[10px] text-white/20">
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : 'NO OUTPUT'}
              </span>
            )}
          </div>
        </div>

        <Handle type="source" position={Position.Right} id="output" />

        {/* Выход */}
        <div className="px-3 pb-3 flex items-center justify-end gap-2">
          <span className="text-[10px] text-white/40">{mode === 'image' ? 'Изображение' : 'Видео'}</span>
        </div>
      </div>
    </div>
  );
});

GeneratorNode.displayName = 'GeneratorNode';
