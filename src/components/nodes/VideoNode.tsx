import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Play, Loader2, Video as VideoIcon } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const VideoNode = memo(({ id, data, selected }: NodeProps) => {
  const generateFromText = useStore(s => s.generateFromText);
  const nodes = useStore(s => s.nodes);
  const edges = useStore(s => s.edges);

  const nodeData = data as Record<string, unknown>;
  const [prompt, setPrompt] = useState<string>('');

  const handleGenerate = async () => {
    const incomingEdge = edges.find(e => e.target === id);
    if (!incomingEdge) {
      alert('Подключите вход перед генерацией.');
      return;
    }

    const sourceNode = nodes.find(n => n.id === incomingEdge.source);
    if (!sourceNode) return;

    await generateFromText(sourceNode.id, id);
  };

  const isLoading = nodeData?.state === 'loading';

  return (
    <div className="w-[330px] relative">
      <div
        data-state={(nodeData?.state as string) || 'idle'}
        className={`node-card ${selected ? 'selected' : ''}`}
      >
        <Handle type="target" position={Position.Left} id="start-image" style={{ top: '60px' }} />
        <Handle type="target" position={Position.Left} id="end-image" style={{ top: '90px' }} />
        <Handle type="target" position={Position.Left} id="text-input" style={{ top: '120px' }} />

        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.04]">
          <VideoIcon size={12} className="opacity-50" />
          <span className="text-[11px] font-medium text-white/65 flex-1">
            {(nodeData?.title as string) || 'Генератор видео #1'}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); void handleGenerate(); }}
            disabled={isLoading}
            className="w-5 h-5 flex items-center justify-center text-white/40 hover:text-white transition-colors rounded"
          >
            {isLoading ? <Loader2 size={10} className="animate-spin" /> : <Play size={10} />}
          </button>
        </div>

        {/* Входы */}
        <div className="px-3 pt-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/40">Начальное изображение</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/40">Конечное изображение</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/40">Текст</span>
          </div>

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Опишите видео..."
            className="w-full bg-black/30 border border-white/[0.03] rounded-lg px-3 py-2 text-[12px] text-white/80 placeholder:text-white/20 outline-none focus:border-blue-500/30"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Preview */}
        <div className="px-3 py-2">
          <div className="w-full h-[140px] bg-black/30 border border-white/[0.03] rounded-lg overflow-hidden flex items-center justify-center">
            {nodeData?.videoUrl && typeof nodeData.videoUrl === 'string' ? (
              <video src={nodeData.videoUrl} controls className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] text-white/20">
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : 'NO OUTPUT'}
              </span>
            )}
          </div>
        </div>

        <Handle type="source" position={Position.Right} id="start-out" style={{ top: '60px' }} />
        <Handle type="source" position={Position.Right} id="end-out" style={{ top: '90px' }} />
        <Handle type="source" position={Position.Right} id="video-output" />

        {/* Выходы */}
        <div className="px-3 pb-3 space-y-2">
          <div className="flex items-center justify-end gap-2">
            <span className="text-[10px] text-white/40">Начальное изображение</span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <span className="text-[10px] text-white/40">Конечное изображение</span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <span className="text-[10px] text-white/40">Сгенерированное видео</span>
          </div>
        </div>
      </div>
    </div>
  );
});

VideoNode.displayName = 'VideoNode';
