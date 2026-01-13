import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Loader2, Play } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { IMAGE_MODELS_EXTENDED } from '../../lib/api';
import { ModelSelector } from '../NodeParams/ModelSelector';
import { AspectRatioSelector } from '../NodeParams/AspectRatioSelector';
import { ResolutionSelector } from '../NodeParams/ResolutionSelector';
import { CountSpinner } from '../NodeParams/CountSpinner';
import { DownloadButton } from '../NodeParams/DownloadButton';
import { ProgressBar } from '../NodeParams/ProgressBar';

export const ImageNode = memo(({ id, data, selected }: NodeProps) => {
  const generateFromText = useStore(s => s.generateFromText);
  const updateNode = useStore(s => s.updateNode);
  const nodes = useStore(s => s.nodes);
  const edges = useStore(s => s.edges);

  const nodeData = data as Record<string, unknown>;
  const [prompt, setPrompt] = useState<string>('');
  const [params, setParams] = useState({
    model: 'nano-banana-pro',
    aspectRatio: '1:1',
    resolution: '2K',
    count: 1
  });

  const handleGenerate = async () => {
    const incomingEdge = edges.find(e => e.target === id);
    if (!incomingEdge) {
      alert('Подключите вход (Текст) перед генерацией.');
      return;
    }

    const sourceNode = nodes.find(n => n.id === incomingEdge.source);
    if (!sourceNode) return;

    // Save params to node data
    updateNode(id, { params });
    await generateFromText(sourceNode.id, id);
  };

  const isLoading = nodeData?.state === 'loading';
  const progress = (nodeData?.progress as number) || 0;
  const currentStep = nodeData?.currentStep as string | undefined;

  return (
    <div className="w-[280px] relative">
      <div
        data-state={(nodeData?.state as string) || 'idle'}
        className={`node-card ${selected ? 'selected' : ''}`}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.04]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-50">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span className="text-[11px] font-medium text-white/65 flex-1">
            {(nodeData?.title as string) || 'Генератор изображений #1'}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); void handleGenerate(); }}
            disabled={isLoading}
            className="w-5 h-5 flex items-center justify-center text-white/40 hover:text-white transition-colors rounded"
          >
            {isLoading ? <Loader2 size={10} className="animate-spin" /> : <Play size={10} />}
          </button>
        </div>

        {/* Params panel - показывается только когда нода selected */}
        {selected && (
          <div className="px-3 py-2 border-b border-white/[0.04] space-y-2">
            <ModelSelector 
              value={params.model}
              options={IMAGE_MODELS_EXTENDED}
              onChange={(v) => setParams({...params, model: v})}
              category="image"
            />
            <div className="flex gap-2 items-center">
              <AspectRatioSelector 
                value={params.aspectRatio} 
                onChange={(v) => setParams({...params, aspectRatio: v})}
                options={['auto', '1:1', '21:9', '16:9', '9:16', '2:3', '3:4', '5:4', '4:5', '3:2']}
              />
              <ResolutionSelector 
                value={params.resolution} 
                onChange={(v) => setParams({...params, resolution: v})}
              />
              <CountSpinner 
                value={params.count} 
                onChange={(v) => setParams({...params, count: v})}
              />
            </div>
          </div>
        )}

        <Handle 
          type="target" 
          position={Position.Left} 
          id="ref-image"
          style={{ top: '60px' }}
        />
        <Handle 
          type="target" 
          position={Position.Left} 
          id="text-input"
          style={{ top: '90px' }}
        />

        {/* Входы с метками */}
        <div className="px-3 pt-3 space-y-2">
          {/* Вход 1: Опорное изображение */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/40">Опорное изображение</span>
          </div>

          {/* Вход 2: Текст */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/40">Текст</span>
          </div>

          {/* Редактируемое поле */}
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Запрос (связанный)"
            className="w-full bg-black/30 border border-white/[0.03] rounded-lg px-3 py-2 text-[12px] text-white/80 placeholder:text-white/20 outline-none focus:border-blue-500/30"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Progress bar */}
        {isLoading && progress > 0 && (
          <ProgressBar 
            progress={progress} 
            currentStep={currentStep}
            estimatedTime={nodeData?.estimatedTime as number | undefined}
          />
        )}

        {/* Preview */}
        <div className="px-3 py-2">
          <div className="w-full h-[140px] bg-black/30 border border-white/[0.03] rounded-lg overflow-hidden flex items-center justify-center relative">
            {nodeData?.imageUrl ? (
              <>
                <img src={nodeData.imageUrl as string} alt="Generated" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2">
                  <DownloadButton url={nodeData.imageUrl as string} filename="image" type="image" />
                </div>
              </>
            ) : (
              <span className="text-[10px] text-white/20">
                {isLoading ? <Loader2 className="animate-spin" size={16} /> : 'NO OUTPUT'}
              </span>
            )}
          </div>
        </div>

        <Handle 
          type="source" 
          position={Position.Right} 
          id="image-output"
        />

        {/* Выход с меткой */}
        <div className="px-3 pb-3 flex items-center justify-end gap-2">
          <span className="text-[10px] text-white/40">Сгенерированное изображение</span>
        </div>
      </div>
    </div>
  );
});

ImageNode.displayName = 'ImageNode';
