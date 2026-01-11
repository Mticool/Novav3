import React, { memo, useState } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Sparkles, Settings, Loader2, ChevronDown, Download } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface GeneratorNodeData extends Record<string, unknown> {
  generationType?: 'image' | 'video';
  selectedModel?: string;
  settings?: {
    resolution?: string;
    duration?: number;
    fps?: number;
    steps?: number;
    guidance?: number;
  };
  state?: 'idle' | 'loading' | 'success' | 'error';
  imageUrl?: string;
  videoUrl?: string;
  thumbnail?: string;
  title?: string;
  error?: string;
  generatedPrompt?: string;
}

type GeneratorNodeType = Node<GeneratorNodeData>;

const MODELS = {
  image: [
    { id: 'flux-dev', name: 'FLUX Dev', speed: 'Fast', quality: 'High' },
    { id: 'flux-pro', name: 'FLUX Pro', speed: 'Medium', quality: 'Ultra' },
    { id: 'sd-xl', name: 'SDXL', speed: 'Fast', quality: 'Medium' },
    { id: 'dall-e-3', name: 'DALL-E 3', speed: 'Medium', quality: 'High' },
  ],
  video: [
    { id: 'luma-dream', name: 'Luma Dream Machine', speed: 'Slow', quality: 'High' },
    { id: 'kling-o1', name: 'Kling O1', speed: 'Medium', quality: 'Ultra' },
    { id: 'runway-gen3', name: 'Runway Gen-3', speed: 'Fast', quality: 'High' },
    { id: 'pika', name: 'Pika', speed: 'Fast', quality: 'Medium' },
  ],
};

export const GeneratorNode = memo(({ id, data, selected }: NodeProps<GeneratorNodeType>) => {
  const updateNode = useStore(s => s.updateNode);
  const generateFromText = useStore(s => s.generateFromText);
  const nodes = useStore(s => s.nodes);
  const edges = useStore(s => s.edges);

  const generationType = data?.generationType ?? 'image';
  const models = MODELS[generationType];

  const [selectedModel, setSelectedModel] = useState<string>(data?.selectedModel || models[0].id);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [settings, setSettings] = useState(() => {
    const existingSettings = data?.settings ?? {};
    return {
      resolution: existingSettings?.resolution ?? 'square_hd',
      duration: existingSettings?.duration ?? 5,
      fps: existingSettings?.fps ?? 24,
      steps: existingSettings?.steps ?? 28,
      guidance: existingSettings?.guidance ?? 3.5,
    };
  });

  const handleGenerate = () => {
    // Найти все входящие ноды и собрать промпт
    const incomingEdges = edges.filter(e => e.target === id);
    if (incomingEdges.length === 0) {
      alert('Connect prompt nodes first!');
      return;
    }

    // Собрать промпт из всех источников
    let fullPrompt = '';
    incomingEdges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      if (sourceNode?.data?.content) {
        fullPrompt += sourceNode.data.content + ' ';
      }
      if (sourceNode?.data?.selectedOption) {
        fullPrompt += sourceNode.data.selectedOption + ', ';
      }
      if (sourceNode?.data?.customValue) {
        fullPrompt += sourceNode.data.customValue + ', ';
      }
    });

    // Обновить ноду временным промптом для генерации
    updateNode(id, {
      generatedPrompt: fullPrompt.trim(),
      selectedModel,
      settings
    });

    // Запустить генерацию (берем первую source ноду как основу)
    const primarySource = nodes.find(n => n.id === incomingEdges[0].source);
    if (primarySource) {
      generateFromText(primarySource.id, id);
    }
  };

  const isLoading = data?.state === 'loading';
  const imageUrl = data?.imageUrl;
  const videoUrl = data?.videoUrl;
  const thumbnail = data?.thumbnail;
  const hasResult = Boolean(imageUrl) || Boolean(videoUrl);
  const hasError = data?.state === 'error';

  const renderResultPreview = (): React.ReactNode => {
    if (!hasResult) return null;

    return (
      <div className="space-y-2">
        <div className="relative group">
          {generationType === 'image' && imageUrl && (
            <>
              <img
                src={imageUrl}
                alt="Generated"
                className="w-full h-64 object-cover rounded-lg shadow-lg cursor-pointer"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <div className="text-white text-sm font-medium">{settings.resolution}</div>
              </div>
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1 text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                {models.find(m => m.id === selectedModel)?.name}
              </div>
            </>
          )}
          {generationType === 'video' && videoUrl && (
            <>
              <video
                src={videoUrl}
                className="w-full h-64 object-cover rounded-lg shadow-lg bg-black"
                controls
                poster={thumbnail}
              />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1 text-xs text-white/80">
                {settings.duration}s • {settings.resolution}
              </div>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <button className="flex-1 py-2 px-3 bg-accent-blue/10 hover:bg-accent-blue/20 rounded-lg text-xs text-accent-blue flex items-center justify-center gap-2 transition-colors">
            <Download size={14} />
            Download
          </button>
          <button
            onClick={handleGenerate}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-white/70 transition-colors"
          >
            🔄
          </button>
        </div>
      </div>
    );
  };

  const resultPreviewElement: React.ReactNode = renderResultPreview();

  return (
    <div className={`
      custom-node
      node-generator
      min-w-[320px] max-w-[400px]
      overflow-hidden
      ${selected ? 'ring-2 ring-cyan-400 shadow-2xl shadow-cyan-500/40' : ''}
      ${hasError ? 'ring-2 ring-red-500/50' : ''}
      ${isLoading ? 'opacity-80' : ''}
    `}>
      <Handle type="target" position={Position.Left} className="!w-3 !h-3" title="Connect prompts" />

      {/* Header */}
      <div className="px-3 py-2 border-b border-white/5 flex items-center gap-2">
        <Sparkles size={16} className="text-accent-blue" />
        <input
          type="text"
          defaultValue={data?.title || `${generationType === 'image' ? 'Image' : 'Video'} Generator`}
          className="flex-1 bg-transparent text-sm font-semibold text-white outline-none node-title"
          onChange={(e) => updateNode(id, { title: e.target.value })}
        />

        {/* Status badge */}
        {data?.state === 'loading' && (
          <div className="ml-auto flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded text-[10px] text-blue-300">
            <Loader2 size={10} className="animate-spin" />
            Generating...
          </div>
        )}

        {data?.state === 'success' && (
          <div className="ml-auto px-2 py-1 bg-green-500/20 rounded text-[10px] text-green-300">
            ✓ Done
          </div>
        )}

        {data?.state === 'error' && (
          <div className="ml-auto px-2 py-1 bg-red-500/20 rounded text-[10px] text-red-300">
            ✗ Error
          </div>
        )}
      </div>

      {/* Model Selection */}
      <div className="p-3 space-y-3 node-detail">
        <div className="space-y-2">
          <label className="text-xs text-white/50 uppercase tracking-wide">Model</label>
          <select
            value={selectedModel}
            onChange={(e) => {
              setSelectedModel(e.target.value);
              updateNode(id, { selectedModel: e.target.value });
            }}
            className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white outline-none focus:border-accent-blue/50 transition-colors"
          >
            {models.map((model) => (
              <option key={model.id} value={model.id} className="bg-gray-900">
                {model.name} • {model.quality} • {model.speed}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Settings */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-white/40 block mb-1">Resolution</label>
            <select
              value={settings.resolution}
              onChange={(e) => {
                const newSettings = { ...settings, resolution: e.target.value };
                setSettings(newSettings);
                updateNode(id, { settings: newSettings });
              }}
              className="w-full px-2 py-1.5 bg-black/20 border border-white/5 rounded text-xs text-white outline-none"
            >
              <option value="square_hd">1:1 HD</option>
              <option value="portrait_hd">9:16 HD</option>
              <option value="landscape_hd">16:9 HD</option>
            </select>
          </div>

          {generationType === 'video' && (
            <div>
              <label className="text-xs text-white/40 block mb-1">Duration</label>
              <select
                value={settings.duration}
                onChange={(e) => {
                  const newSettings = { ...settings, duration: parseInt(e.target.value) };
                  setSettings(newSettings);
                  updateNode(id, { settings: newSettings });
                }}
                className="w-full px-2 py-1.5 bg-black/20 border border-white/5 rounded text-xs text-white outline-none"
              >
                <option value="5">5s</option>
                <option value="10">10s</option>
                <option value="15">15s</option>
              </select>
            </div>
          )}
        </div>

        {/* Advanced Settings */}
        <div className="space-y-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-white/70 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Settings size={12} />
              Advanced Settings
            </div>
            <ChevronDown
              size={14}
              className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            />
          </button>

          {showAdvanced && (
            <div className="space-y-2 px-2">
              <div>
                <label className="text-xs text-white/40 block mb-1">
                  Steps: {settings.steps}
                </label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={settings.steps}
                  onChange={(e) => {
                    const newSettings = { ...settings, steps: parseInt(e.target.value) };
                    setSettings(newSettings);
                    updateNode(id, { settings: newSettings });
                  }}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-xs text-white/40 block mb-1">
                  Guidance: {settings.guidance}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={settings.guidance}
                  onChange={(e) => {
                    const newSettings = { ...settings, guidance: parseFloat(e.target.value) };
                    setSettings(newSettings);
                    updateNode(id, { settings: newSettings });
                  }}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Result Preview */}
        {resultPreviewElement !== null ? resultPreviewElement : null}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-2.5 px-3 bg-accent-blue hover:bg-accent-blue/80 disabled:bg-accent-blue/50 disabled:cursor-not-allowed rounded-lg text-sm text-white font-medium flex items-center justify-center gap-2 transition-colors overflow-hidden whitespace-nowrap"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin shrink-0" size={16} />
              <span className="truncate">Generating...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} className="shrink-0" />
              <span className="truncate">Run {generationType === 'image' ? 'Image' : 'Video'}</span>
            </>
          )}
        </button>

        {/* Error Message */}
        {hasError && (
          <div className="text-xs text-red-400 bg-red-500/10 rounded px-3 py-2">
            {data?.error || 'Error occurred'}
          </div>
        )}

        {/* Generated Prompt Preview */}
        {data?.generatedPrompt && (
          <div className="text-xs text-white/40 bg-black/20 rounded px-3 py-2">
            <div className="font-semibold mb-1">Combined Prompt:</div>
            {data.generatedPrompt}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} className="!w-3 !h-3" title="Connect to next node" />
    </div>
  );
});

GeneratorNode.displayName = 'GeneratorNode';

