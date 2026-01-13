import { memo, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AspectRatioSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options?: string[];
}

const ASPECT_RATIOS: Record<string, { icon: string; label: string }> = {
  'auto': { icon: '⬜', label: 'Auto' },
  '1:1': { icon: '⬜', label: '1:1' },
  '21:9': { icon: '▭', label: '21:9' },
  '16:9': { icon: '▭', label: '16:9' },
  '9:16': { icon: '▯', label: '9:16' },
  '2:3': { icon: '▯', label: '2:3' },
  '3:4': { icon: '▯', label: '3:4' },
  '5:4': { icon: '▭', label: '5:4' },
  '4:5': { icon: '▯', label: '4:5' },
  '3:2': { icon: '▭', label: '3:2' },
};

export const AspectRatioSelector = memo(({ value, onChange, options }: AspectRatioSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const availableOptions = options || Object.keys(ASPECT_RATIOS);
  const selected = ASPECT_RATIOS[value];

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#2a2a2a] border border-white/10 rounded-lg text-sm text-white hover:border-white/20 transition-colors"
      >
        <span className="text-base">{selected?.icon || '⬜'}</span>
        <span className="font-medium">{selected?.label || value}</span>
        <ChevronDown size={14} className={`ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 bg-[#1f1f1f] border border-white/10 rounded-xl shadow-2xl z-50 min-w-[140px] overflow-hidden">
            {availableOptions.map(ratio => {
              const config = ASPECT_RATIOS[ratio];
              if (!config) return null;
              
              return (
                <button
                  key={ratio}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(ratio);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left hover:bg-white/5 flex items-center gap-3 transition-colors ${
                    value === ratio ? 'bg-white/5' : ''
                  }`}
                >
                  <span className="text-base">{config.icon}</span>
                  <span className="text-white text-sm font-medium">{config.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
});

AspectRatioSelector.displayName = 'AspectRatioSelector';
