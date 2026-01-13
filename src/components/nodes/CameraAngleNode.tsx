import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { RotateCw, Play, Loader2, RotateCcw } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const CameraAngleNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNode = useStore(s => s.updateNode);
  const rotateCamera = useStore(s => s.rotateCamera);
  const nodes = useStore(s => s.nodes);
  const edges = useStore(s => s.edges);

  const nodeData = data as Record<string, unknown>;
  const params = (nodeData?.params as Record<string, number>) || { 
    rotate: 0, 
    vertical: 0, 
    zoom: 1 
  };
  
  const [rotate, setRotate] = useState(params.rotate || 0);
  const [vertical, setVertical] = useState(params.vertical || 0);
  const [zoom, setZoom] = useState(params.zoom || 1);

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

    updateNode(id, { state: 'loading', params: { rotate, vertical, zoom } });

    try {
      await rotateCamera(incomingEdge.source, id, rotate, 'front');
      updateNode(id, { params: { rotate, vertical, zoom } });
    } catch (error) {
      console.error('Camera processing failed:', error);
    }
  };

  const handleReset = () => {
    setRotate(0);
    setVertical(0);
    setZoom(1);
    updateNode(id, { params: { rotate: 0, vertical: 0, zoom: 1 } });
  };

  const isLoading = nodeData?.state === 'loading';

  return (
    <div className="w-[330px] relative">
      <div
        data-state={(nodeData?.state as string) || 'idle'}
        className={`node-card ${selected ? 'selected' : ''}`}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.04]">
          <RotateCw size={12} className="opacity-50" />
          <span className="text-[11px] font-medium text-white/65 flex-1">
            {(nodeData?.title as string) || 'Изменить угол камеры #1'}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); handleReset(); }}
            className="w-5 h-5 flex items-center justify-center text-white/30 hover:text-white transition-colors"
            title="Reset"
          >
            <RotateCcw size={10} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); void handleProcess(); }}
            disabled={isLoading}
            className="w-5 h-5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            {isLoading ? <Loader2 size={10} className="animate-spin" /> : <Play size={10} />}
          </button>
        </div>

        {/* Слайдеры */}
        <div className="px-3 pt-3 space-y-3">
          {/* Слайдер 1: Повернуть */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-white/40">Повернуть</label>
              <span className="text-[10px] text-blue-400 font-medium">{rotate} °</span>
            </div>
            <input
              type="range"
              value={rotate}
              onChange={(e) => {
                const val = Number(e.target.value);
                setRotate(val);
                updateNode(id, { params: { rotate: val, vertical, zoom } });
              }}
              min="0"
              max="360"
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Слайдер 2: Вертикальный */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-white/40">Вертикальный</label>
              <span className="text-[10px] text-blue-400 font-medium">{vertical} °</span>
            </div>
            <input
              type="range"
              value={vertical}
              onChange={(e) => {
                const val = Number(e.target.value);
                setVertical(val);
                updateNode(id, { params: { rotate, vertical: val, zoom } });
              }}
              min="-30"
              max="90"
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Слайдер 3: Масштаб */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-white/40">Масштаб</label>
              <span className="text-[10px] text-blue-400 font-medium">{zoom.toFixed(1)}</span>
            </div>
            <input
              type="range"
              value={zoom}
              onChange={(e) => {
                const val = Number(e.target.value);
                setZoom(val);
                updateNode(id, { params: { rotate, vertical, zoom: val } });
              }}
              min="0.5"
              max="3"
              step="0.1"
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        <Handle 
          type="target" 
          position={Position.Left} 
          id="input-image"
        />
        <Handle 
          type="source" 
          position={Position.Right} 
          id="output-image"
        />

        {/* Входы и выходы */}
        <div className="px-3 py-3 space-y-2">
          {/* Вход */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/40">Исходное изображение</span>
          </div>

          {/* Выход */}
          <div className="flex items-center justify-end gap-2">
            <span className="text-[10px] text-white/40">Результат</span>
          </div>
        </div>
      </div>
    </div>
  );
});

CameraAngleNode.displayName = 'CameraAngleNode';
