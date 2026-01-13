import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Sparkles, Play, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { DownloadButton } from '../NodeParams/DownloadButton';

export const EnhancementNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNode = useStore(s => s.updateNode);
  const nodes = useStore(s => s.nodes);
  const edges = useStore(s => s.edges);

  const nodeData = data as Record<string, unknown>;
  const params = (nodeData?.params as Record<string, number>) || { sharpness: 50, contrast: 50 };
  
  const [sharpness, setSharpness] = useState(params.sharpness || 50);
  const [contrast, setContrast] = useState(params.contrast || 50);

  const handleEnhance = async () => {
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

    updateNode(id, { state: 'loading', progress: 0 });

    // Имитация обработки
    setTimeout(() => {
      const inputImage = sourceNode.data.imageUrl || sourceNode.data.outputImage;
      updateNode(id, {
        inputImage: inputImage,
        outputImage: inputImage,
        state: 'success',
        progress: 100,
        params: { sharpness, contrast }
      });
    }, 1500);
  };

  const isLoading = nodeData?.state === 'loading';

  return (
    <div className="w-[280px] relative">
      <div
        data-state={(nodeData?.state as string) || 'idle'}
        className={`node-card ${selected ? 'selected' : ''}`}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.04]">
          <Sparkles size={12} className="opacity-50" />
          <span className="text-[11px] font-medium text-white/65 flex-1">
            {(nodeData?.title as string) || 'Улучшение качества изображений #1'}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); void handleEnhance(); }}
            disabled={isLoading}
            className="w-5 h-5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            {isLoading ? <Loader2 size={10} className="animate-spin" /> : <Play size={10} />}
          </button>
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
        <div className="px-3 pt-3 space-y-2">
          {/* Вход */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/40">Исходное изображение</span>
          </div>

          {/* Выход */}
          <div className="flex items-center justify-end gap-2">
            <span className="text-[10px] text-white/40">Улучшенное качество изображения</span>
          </div>
        </div>

        {/* Preview */}
        {nodeData?.outputImage && typeof nodeData.outputImage === 'string' ? (
          <div className="px-3 py-2">
            <div className="w-full h-[100px] bg-black/30 border border-white/[0.03] rounded-lg overflow-hidden relative">
              <img 
                src={nodeData.outputImage} 
                alt="Enhanced" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <DownloadButton url={nodeData.outputImage} filename="enhanced" type="image" />
              </div>
            </div>
          </div>
        ) : null}

        {/* Слайдеры (показываем только если нода выбрана) */}
        {selected ? (
          <div className="px-3 pb-3 space-y-3">
            {/* Резкость */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-white/40">Резкость</label>
                <span className="text-[10px] text-blue-400 font-medium">{sharpness}</span>
              </div>
              <input
                type="range"
                value={sharpness}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSharpness(val);
                  updateNode(id, { params: { sharpness: val, contrast } });
                }}
                min="0"
                max="100"
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Контраст */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-white/40">Контраст</label>
                <span className="text-[10px] text-blue-400 font-medium">{contrast}</span>
              </div>
              <input
                type="range"
                value={contrast}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setContrast(val);
                  updateNode(id, { params: { sharpness, contrast: val } });
                }}
                min="0"
                max="100"
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
});

EnhancementNode.displayName = 'EnhancementNode';
