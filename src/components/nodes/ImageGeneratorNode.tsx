import { memo, useMemo, useState } from 'react';
import { Handle, NodeProps, Position } from '@xyflow/react';
import { Image as ImageIcon, Settings2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { IMAGE_MODELS_EXTENDED } from '../../lib/api';
import { DownloadButton } from '../NodeParams/DownloadButton';
import { NodeToolbar } from './NodeToolbar';
import { ModelSelector, SelectorOption } from './ModelSelector';

type ImageParams = {
  model: string;
  aspectRatio: string;
  resolution: string;
  count: number;
};

const ASPECT_RATIO_OPTIONS: readonly SelectorOption[] = [
  { value: '1:1', label: '1:1' },
  { value: '16:9', label: '16:9' },
  { value: '9:16', label: '9:16' },
  { value: '4:3', label: '4:3' },
  { value: '3:4', label: '3:4' },
];

const RESOLUTION_OPTIONS: readonly SelectorOption[] = [
  { value: '1K', label: '1K' },
  { value: '2K', label: '2K' },
  { value: '4K', label: '4K' },
];

export const ImageGeneratorNode = memo(({ id, data, selected }: NodeProps) => {
  const generateFromText = useStore((s) => s.generateFromText);
  const updateNode = useStore((s) => s.updateNode);
  const deleteNode = useStore((s) => s.deleteNode);
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);

  const nodeData = (data || {}) as Record<string, unknown>;

  const modelOptions = useMemo<SelectorOption[]>(() => {
    return IMAGE_MODELS_EXTENDED.map((m) => ({ value: m.id, label: m.name }));
  }, []);

  const initialParams = (typeof nodeData.params === 'object' && nodeData.params !== null ? (nodeData.params as Partial<ImageParams>) : {}) as Partial<ImageParams>;
  const legacySettings = (typeof nodeData.settings === 'object' && nodeData.settings !== null ? (nodeData.settings as Record<string, unknown>) : {}) as Record<
    string,
    unknown
  >;

  const [params, setParams] = useState<ImageParams>({
    model: initialParams.model || (legacySettings.model as string) || 'nano-banana-pro',
    aspectRatio: initialParams.aspectRatio || '1:1',
    resolution: initialParams.resolution || '1K',
    count: typeof initialParams.count === 'number' ? initialParams.count : 1,
  });

  const [localPrompt, setLocalPrompt] = useState<string>((nodeData.prompt as string) || '');

  const isLoading = nodeData.state === 'loading';

  const handleGenerate = async () => {
    const incomingEdge = edges.find((e) => e.target === id);
    if (!incomingEdge) {
      alert('Подключите вход (Текст) перед генерацией.');
      return;
    }

    const sourceNode = nodes.find((n) => n.id === incomingEdge.source);
    if (!sourceNode) return;

    updateNode(id, { params, prompt: localPrompt });
    await generateFromText(sourceNode.id, id);
  };

  const handleDelete = () => {
    if (confirm('Удалить эту ноду?')) deleteNode(id);
  };

  return (
    <div className="relative w-[440px]">
      <NodeToolbar visible={selected} isLoading={!!isLoading} onRun={() => void handleGenerate()} onDelete={handleDelete} />

      <div className={`node relative ${selected ? 'selected' : ''}`}>
        {/* Handles (Inputs сверху) — точки справа, как в Pikaso */}
        <Handle type="target" position={Position.Right} id="ref-image" style={{ top: 86 }} />
        <Handle type="target" position={Position.Right} id="text-input" style={{ top: 114 }} />

        {/* Header */}
        <div className="node-header">
          <ImageIcon size={18} className="opacity-90 text-white" />
          <div className="flex-1 text-[15px] font-semibold text-white">{(nodeData.title as string) || 'Генератор изображений #1'}</div>
          <button type="button" className="text-white/60 hover:text-white transition-colors" onClick={(e) => e.stopPropagation()} aria-label="Link">
            🔗
          </button>
        </div>
        <div className="-mt-4 mb-6 h-px bg-white/10" />

        {/* Inputs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pr-4">
            <span className="node-label">Опорное изображение</span>
            <span className="text-white/30"> </span>
          </div>
          <div className="flex items-center justify-between pr-4">
            <span className="node-label">Текст</span>
            <span className="text-white/30"> </span>
          </div>
        </div>

        {/* Textarea */}
        <div className="mt-6">
          <textarea
            value={localPrompt}
            onChange={(e) => {
              const v = e.target.value;
              setLocalPrompt(v);
              updateNode(id, { prompt: v });
            }}
            placeholder="Опишите изображение, которое хотите сгенерировать..."
            className="node-textarea"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Preview */}
        <div className="mt-6">
          <div className="node-preview h-[200px] w-full overflow-hidden relative">
            {typeof nodeData.imageUrl === 'string' && nodeData.imageUrl ? (
              <>
                <img src={nodeData.imageUrl} alt="Generated" className="h-full w-full object-cover" />
                <div className="absolute right-3 top-3">
                  <DownloadButton url={nodeData.imageUrl} filename="image" type="image" />
                </div>
              </>
            ) : (
              <div className="node-preview-text">NO OUTPUT</div>
            )}
          </div>
        </div>

        {/* Outputs (снизу) */}
        <div className="mt-6 flex items-center justify-between text-[13px] font-medium text-white/80 pr-4">
          <span className="node-label">Сгенерированное изображение</span>
          <span className="text-white/30"> </span>
        </div>
        <Handle type="source" position={Position.Right} id="image-output" style={{ bottom: 208 }} />

        {/* Bottom models bar (СТРОГО ВНИЗУ) */}
        <div className="mt-6 border-t border-white/10 pt-5">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <ModelSelector
                value={params.model}
                options={modelOptions}
                onChange={(v) => setParams((p) => ({ ...p, model: v }))}
                ariaLabel="Image model"
              />
            </div>
            <ModelSelector
              value={params.aspectRatio}
              options={ASPECT_RATIO_OPTIONS}
              onChange={(v) => setParams((p) => ({ ...p, aspectRatio: v }))}
              ariaLabel="Aspect ratio"
            />
            <ModelSelector
              value={params.resolution}
              options={RESOLUTION_OPTIONS}
              onChange={(v) => setParams((p) => ({ ...p, resolution: v }))}
              ariaLabel="Resolution"
            />
            <button
              type="button"
              className="model-selector"
              onClick={(e) => {
                e.stopPropagation();
                void handleGenerate();
              }}
              disabled={!!isLoading}
              aria-label="Generate"
              title="Generate"
            >
              ▶
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <button
                type="button"
                className="model-selector px-3"
                onClick={(e) => {
                  e.stopPropagation();
                  setParams((p) => ({ ...p, count: Math.max(1, p.count - 1) }));
                }}
                aria-label="Decrease count"
              >
                -
              </button>
              <div className="min-w-[28px] text-center text-[14px] font-medium text-white">{params.count}</div>
              <button
                type="button"
                className="model-selector px-3"
                onClick={(e) => {
                  e.stopPropagation();
                  setParams((p) => ({ ...p, count: Math.min(8, p.count + 1) }));
                }}
                aria-label="Increase count"
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="model-selector px-3"
              onClick={(e) => e.stopPropagation()}
              aria-label="Settings"
              title="Settings"
            >
              <Settings2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ImageGeneratorNode.displayName = 'ImageGeneratorNode';

