import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Camera, Play, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const CameraNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNode = useStore(s => s.updateNode);
  const rotateCamera = useStore(s => s.rotateCamera);
  const nodes = useStore(s => s.nodes);
  const edges = useStore(s => s.edges);

  const nodeData = data as Record<string, unknown>;
  const [angle, setAngle] = useState<number>(((nodeData?.angle as number) ?? 0));
  const [view] = useState<string>('front');

  const handleProcess = async () => {
    const incomingEdge = edges.find(e => e.target === id);
    if (!incomingEdge) {
      alert('Подключите входное изображение.');
      return;
    }

    const sourceNode = nodes.find(n => n.id === incomingEdge.source);
    if (!sourceNode || (!sourceNode.data.imageUrl && !sourceNode.data.outputImage)) {
      alert('Источник должен содержать изображение.');
      return;
    }

    updateNode(id, { state: 'loading', angle });
    await rotateCamera(incomingEdge.source, id, angle, view);
  };

  const isLoading = nodeData?.state === 'loading';

  return (
    <div className="w-[280px] relative">
      <div
        data-state={(nodeData?.state as string) || 'idle'}
        className={`node-card ${selected ? 'selected' : ''}`}
      >
        <Handle type="target" position={Position.Left} id="input-image" />
        <Handle type="source" position={Position.Right} id="output-image" />

        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.04]">
          <Camera size={12} className="opacity-50" />
          <span className="text-[11px] font-medium text-white/65 flex-1">
            {(nodeData?.title as string) || 'Camera Control'}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); void handleProcess(); }}
            disabled={isLoading}
            className="w-5 h-5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            {isLoading ? <Loader2 size={10} className="animate-spin" /> : <Play size={10} />}
          </button>
        </div>

        {/* Входы/выходы */}
        <div className="px-3 pt-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/40">Исходное изображение</span>
          </div>
        </div>

        {/* Slider */}
        {selected && (
          <div className="px-3 py-3 space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-white/40">Угол поворота</label>
              <span className="text-[10px] text-blue-400 font-medium">{angle} °</span>
            </div>
            <input
              type="range"
              value={angle}
              onChange={(e) => {
                const val = Number(e.target.value);
                setAngle(val);
                updateNode(id, { angle: val });
              }}
              min="0"
              max="360"
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* Выход */}
        <div className="px-3 pb-3 flex items-center justify-end gap-2">
          <span className="text-[10px] text-white/40">Результат</span>
        </div>
      </div>
    </div>
  );
});

CameraNode.displayName = 'CameraNode';
