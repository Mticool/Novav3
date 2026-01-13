import { memo, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ResolutionSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const RESOLUTIONS = [
  { id: '1K', label: '1K', pixels: '1024px' },
  { id: '2K', label: '2K', pixels: '2048px' },
  { id: '4K', label: '4K', pixels: '4096px' },
];

export const ResolutionSelector = memo(({ value, onChange }: ResolutionSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = RESOLUTIONS.find(r => r.id === value);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#2a2a2a] border border-white/10 rounded-lg text-sm text-white hover:border-white/20 transition-colors"
      >
        <span className="font-medium">{selected?.label}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 bg-[#1f1f1f] border border-white/10 rounded-xl shadow-2xl z-50 min-w-[100px] overflow-hidden">
            {RESOLUTIONS.map(res => (
              <button
                key={res.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(res.id);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left hover:bg-white/5 transition-colors ${
                  value === res.id ? 'bg-white/5' : ''
                }`}
              >
                <div className="text-white text-sm font-medium">{res.label}</div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

ResolutionSelector.displayName = 'ResolutionSelector';
