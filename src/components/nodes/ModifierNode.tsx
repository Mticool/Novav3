import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Camera, Palette, Sun, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

type ModifierType = 'angle' | 'style' | 'lighting';

const MODIFIERS = {
  angle: {
    icon: Camera,
    color: 'blue',
    label: 'Camera Angle',
    options: [
      'Close-up',
      'Medium shot',
      'Wide shot',
      "Bird's eye view",
      'Low angle',
      'High angle',
      'Dutch angle',
      'Over-the-shoulder',
    ],
  },
  style: {
    icon: Palette,
    color: 'pink',
    label: 'Art Style',
    options: [
      'Cinematic',
      'Photorealistic',
      'Anime',
      '3D render',
      'Oil painting',
      'Watercolor',
      'Sketch',
      'Neon',
      'Vintage',
    ],
  },
  lighting: {
    icon: Sun,
    color: 'yellow',
    label: 'Lighting',
    options: [
      'Golden hour',
      'Blue hour',
      'Studio lighting',
      'Natural light',
      'Dramatic shadows',
      'Soft diffused',
      'Neon lights',
      'Backlit',
      'Rim lighting',
    ],
  },
};

export const ModifierNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNode = useStore(s => s.updateNode);
  const nodeData = data as Record<string, unknown>;
  const modifierType = ((nodeData?.modifierType as string) || 'angle') as ModifierType;
  const config = MODIFIERS[modifierType];
  const Icon = config.icon;

  const [selectedOption, setSelectedOption] = useState<string>((nodeData?.selectedOption as string) || config.options[0]);
  const [customValue, setCustomValue] = useState<string>((nodeData?.customValue as string) || '');

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    updateNode(id, { selectedOption: option });
  };

  const handleCustomChange = (value: string) => {
    setCustomValue(value);
    updateNode(id, { customValue: value });
  };

  const colorClass = {
    blue: 'border-blue-500 ring-blue-500/50',
    pink: 'border-pink-500 ring-pink-500/50',
    yellow: 'border-yellow-500 ring-yellow-500/50',
  }[config.color];

  const textColorClass = {
    blue: 'text-blue-400',
    pink: 'text-pink-400',
    yellow: 'text-yellow-400',
  }[config.color];

  return (
    <div className={`
      custom-node
      node-modifier
      min-w-[320px] max-w-[380px]
      overflow-hidden
      ${selected ? `ring-2 ${colorClass} shadow-2xl` : ''}
    `}>
      <Handle type="target" position={Position.Left} className="!w-3 !h-3" title="Connect from prompt" />

      {/* Header */}
      <div className="px-3 py-2 border-b border-white/5 flex items-center gap-2">
        <Icon size={16} className={textColorClass} />
        <span className="flex-1 text-sm font-semibold text-white node-title">
          {config.label}
        </span>

        {/* Status badge */}
        {nodeData?.state === 'loading' && (
          <div className="ml-auto flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded text-[10px] text-blue-300">
            <Loader2 size={10} className="animate-spin" />
            Generating...
          </div>
        )}

        {nodeData?.state === 'success' && (
          <div className="ml-auto px-2 py-1 bg-green-500/20 rounded text-[10px] text-green-300">
            ✓ Done
          </div>
        )}

        {nodeData?.state === 'error' && (
          <div className="ml-auto px-2 py-1 bg-red-500/20 rounded text-[10px] text-red-300">
            ✗ Error
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2 node-detail">
        {/* Selected Preview */}
        <div className="bg-black/20 rounded-lg px-3 py-2 border border-white/5">
          <div className="text-xs text-white/40 mb-1">Selected:</div>
          <div className={`text-sm font-medium ${textColorClass}`}>
            {customValue || selectedOption}
          </div>
        </div>

        {/* Preset options */}
        <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
          {config.options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionChange(option)}
              className={`
                w-full text-left px-3 py-2 rounded-lg text-xs
                transition-all duration-200
                ${selectedOption === option
                  ? `bg-${config.color}-500/20 ${textColorClass} border border-${config.color}-500/50 font-medium`
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-transparent hover:translate-x-0.5'
                }
              `}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Custom input */}
        <div className="relative">
          <input
            type="text"
            value={customValue}
            onChange={(e) => handleCustomChange(e.target.value)}
            placeholder="Custom modifier..."
            className="w-full px-3 py-2 bg-black/20 border border-white/5 rounded-lg text-xs text-white outline-none placeholder:text-white/30 focus:border-white/20 transition-colors"
          />
          {customValue && (
            <button
              onClick={() => handleCustomChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!w-3 !h-3" title="Connect to generator" />
    </div>
  );
});

ModifierNode.displayName = 'ModifierNode';
