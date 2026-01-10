import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Upload, Loader2, ChevronDown, Image as ImageIcon, Search, Play, Settings } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { IMAGE_MODELS_EXTENDED } from '../../lib/api';

export const ImageNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNode = useStore(s => s.updateNode);
  const generateFromText = useStore(s => s.generateFromText);
  const nodes = useStore(s => s.nodes);
  const edges = useStore(s => s.edges);

  const nodeData = data as Record<string, unknown>;
  const nodeSettings = typeof nodeData?.settings === 'object' && nodeData?.settings !== null
    ? nodeData.settings as Record<string, unknown>
    : {};
  const initialModel = (nodeSettings?.model as string) || 'bytedance/seedream-4-4k';
  const [viewMode, setViewMode] = useState<'thumbnail' | 'full'>('thumbnail');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [modelSearch, setModelSearch] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>(initialModel);
  const [settings, setSettings] = useState({
    model: initialModel,
    resolution: (nodeSettings?.resolution as string) || 'square_hd',
    steps: (nodeSettings?.steps as number) || 28,
    guidance: (nodeSettings?.guidance as number) || 7.5,
    seed: (nodeSettings?.seed as number) || -1,
  });

  const handleGenerate = async () => {
    const incomingEdge = edges.find(e => e.target === id);
    if (!incomingEdge) {
      alert('Подключите вход (Текст/Помощник) перед генерацией.');
      return;
    }

    const sourceNode = nodes.find(n => n.id === incomingEdge.source);
    if (!sourceNode || (sourceNode.type !== 'text' && sourceNode.type !== 'masterPrompt')) {
      alert('Источник должен быть узлом "Текст" или "Помощник".');
      return;
    }

    const prompt = sourceNode.data.content as string | undefined;
    if (!prompt) {
      alert('Введите промпт в узле "Текст".');
      return;
    }

    // Save settings before generation
    const updatedSettings = { ...settings, model: selectedModel };
    updateNode(id, { settings: updatedSettings });

    // Real API generation via store (handles loading/success/error)
    await generateFromText(sourceNode.id, id);
  };

  const updateSetting = (key: string, value: string | number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updateNode(id, { settings: newSettings });
  };

  const isLoading = nodeData?.state === 'loading';
  const hasError = nodeData?.state === 'error';

  // Filter models based on search
  const filteredModels = IMAGE_MODELS_EXTENDED.filter(model =>
    model.name.toLowerCase().includes(modelSearch.toLowerCase())
  );

  const currentModel = IMAGE_MODELS_EXTENDED.find(m => m.id === selectedModel);
  const aspectLabel =
    settings.resolution === 'portrait_hd' ? '9:16' :
      settings.resolution === 'landscape_hd' ? '16:9' : '1:1';
  const [variants, setVariants] = useState<number>((nodeSettings?.variants as number) || 1);

  return (
    <div className="w-[380px]">
      {/* Title (outside card) */}
      <div className="mb-2 flex items-center gap-2 text-xs text-white/60">
        <ImageIcon size={14} className="text-white/50" />
        <span className="text-white/80 font-medium truncate">{(nodeData?.title as string) || 'Генератор изображений'}</span>
      </div>

      <div
        data-state={(nodeData?.state as string) || 'idle'}
        className={`
          relative
          bg-[#0D0D0D]
          rounded-[28px]
          overflow-hidden
          transition-all duration-200
          shadow-xl shadow-black/70
          border
          ${nodeData?.state === 'loading' ? 'border-accent-neon/30' :
            nodeData?.state === 'success' ? 'border-green-500/30' :
              nodeData?.state === 'error' ? 'border-red-500/30' :
                'border-white/10'
          }
          ${selected ? 'ring-2 ring-accent-neon/40 shadow-2xl shadow-accent-neon/10' : ''}
          ${isLoading ? 'opacity-90' : ''}
        `}
      >
        {/* Side handles with mini icons */}
        <Handle type="target" position={Position.Left} className="!absolute !-left-3 !top-1/2 !-translate-y-1/2">
          <span className="text-[10px] font-bold">T</span>
        </Handle>
        <Handle type="source" position={Position.Right} className="!absolute !-right-3 !top-1/2 !-translate-y-1/2">
          <ImageIcon size={12} />
        </Handle>

        {/* Preview / Placeholder */}
        <div className="relative">
          {nodeData?.imageUrl ? (
            <div className="relative group">
              <img
                src={nodeData.imageUrl as string}
                alt="Generated"
                className="w-full h-[280px] object-cover cursor-pointer bg-black"
                onClick={() => setViewMode(viewMode === 'thumbnail' ? 'full' : 'thumbnail')}
              />

              {/* Upload button in corner */}
              <button className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-xl transition-opacity opacity-0 group-hover:opacity-100 border border-white/10">
                <Upload size={14} className="text-white" />
              </button>

              {/* Bottom overlay with actions */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const link = document.createElement('a');
                    link.href = nodeData.imageUrl as string;
                    link.download = 'image.png';
                    link.click();
                  }}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-xs text-white border border-white/10"
                >
                  Скачать
                </button>
              </div>
            </div>
          ) : (
            <div className="relative h-[280px] bg-[#080808] flex flex-col items-center justify-center">
              {isLoading ? (
                <>
                  <Loader2 className="text-blue-500 animate-spin mb-2" size={32} />
                  <span className="text-xs text-white/50">Генерация...</span>
                  {nodeData?.progress !== undefined && (
                    <div className="mt-3 w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300 shadow-lg shadow-blue-500/50"
                        style={{ width: `${nodeData.progress as number}%` }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-start justify-center h-full w-full px-6 pointer-events-none">
                  <div className="text-xs text-white/40 mb-3">Попробуйте:</div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-xs text-white/30"><Upload size={10} /> Изображение в Изображение</li>
                    <li className="flex items-center gap-2 text-xs text-white/30"><span className="w-3 h-3 flex items-center justify-center">📹</span> Изображение в Видео</li>
                    <li className="flex items-center gap-2 text-xs text-white/30"><span className="w-3 h-3 flex items-center justify-center">✨</span> Заменить фон</li>
                    <li className="flex items-center gap-2 text-xs text-white/30"><span className="w-3 h-3 flex items-center justify-center">⏩</span> Первый кадр в Видео</li>
                  </ul>
                </div>
              )}

              {/* Upload button */}
              <button className="absolute top-2 right-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs text-white flex items-center gap-1.5">
                <Upload size={12} />
                Загрузить
              </button>
            </div>
          )}
        </div>

        {/* Bottom control strip */}
        <div className="px-3 py-3 bg-[#0a0a0a] border-t border-white/5">
          <div className="flex items-center gap-2">
            {/* Model */}
            <button
              onClick={(e) => { e.stopPropagation(); setShowModelPicker(!showModelPicker); }}
              disabled={isLoading}
              className="px-3 py-2 bg-white/5 hover:bg-white/8 border border-white/5 rounded-full text-xs text-white/80 flex items-center gap-2 disabled:opacity-50"
            >
              <span className="truncate max-w-[120px]">{currentModel?.name || 'Seedream 4 4K'}</span>
              <ChevronDown size={12} className={`${showModelPicker ? 'rotate-180' : ''} transition-transform`} />
            </button>

            {/* Aspect ratio */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const next = settings.resolution === 'square_hd' ? 'landscape_hd' : settings.resolution === 'landscape_hd' ? 'portrait_hd' : 'square_hd';
                updateSetting('resolution', next);
              }}
              className="px-3 py-2 bg-white/5 hover:bg-white/8 border border-white/5 rounded-full text-xs text-white/70"
              title="Соотношение сторон"
            >
              {aspectLabel}
            </button>

            {/* Variants */}
            <div className="flex items-center bg-white/5 border border-white/5 rounded-full overflow-hidden">
              <button
                onClick={(e) => { e.stopPropagation(); const v = Math.max(1, variants - 1); setVariants(v); updateSetting('variants', v); }}
                className="px-2 py-2 text-white/60 hover:text-white"
                aria-label="minus"
              >
                –
              </button>
              <div className="px-2 text-xs text-white/70 min-w-[18px] text-center">{variants}</div>
              <button
                onClick={(e) => { e.stopPropagation(); const v = Math.min(4, variants + 1); setVariants(v); updateSetting('variants', v); }}
                className="px-2 py-2 text-white/60 hover:text-white"
                aria-label="plus"
              >
                +
              </button>
            </div>

            {/* Settings */}
            <button
              onClick={(e) => { e.stopPropagation(); setShowAdvanced(!showAdvanced); }}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/8 border border-white/5 flex items-center justify-center text-white/70"
              title="Настройки"
            >
              <Settings size={16} />
            </button>

            {/* Play */}
            <button
              onClick={(e) => { e.stopPropagation(); void handleGenerate(); }}
              disabled={isLoading}
              className="ml-auto w-10 h-10 rounded-full btn-neon flex items-center justify-center disabled:opacity-50"
              title="Генерировать"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
            </button>
          </div>

          {hasError && (
            <div className="mt-2 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              {(nodeData?.error as string) || 'Generation failed'}
            </div>
          )}
        </div>

        {/* Model dropdown anchored above bottom strip */}
        {showModelPicker && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setShowModelPicker(false)} />
            <div className="absolute left-3 right-3 bottom-[78px] z-40 bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-3 border-b border-white/10">
                <div className="relative">
                  <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    value={modelSearch}
                    onChange={(e) => setModelSearch(e.target.value)}
                    placeholder="Поиск"
                    className="w-full pl-7 pr-2 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none placeholder:text-white/30 focus:border-white/20"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <div
                className="overflow-y-auto max-h-[320px] custom-scrollbar"
                onWheel={(e) => e.stopPropagation()}
              >
                {filteredModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedModel(model.id);
                      updateNode(id, { settings: { ...settings, model: model.id } });
                      setShowModelPicker(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 transition-colors ${selectedModel === model.id ? 'bg-blue-500/10' : ''}`}
                  >
                    <span className={`text-sm ${selectedModel === model.id ? 'text-white font-medium' : 'text-white/80'}`}>{model.name}</span>
                    <span className="text-xs text-white/40">{model.time}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div >
  );
});

ImageNode.displayName = 'ImageNode';
