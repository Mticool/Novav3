import { memo } from 'react';

interface FPSSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const FPS_OPTIONS = [24, 30, 60];

export const FPSSelector = memo(({ value, onChange }: FPSSelectorProps) => {
  return (
    <div className="flex gap-1">
      {FPS_OPTIONS.map(fps => (
        <button
          key={fps}
          onClick={(e) => {
            e.stopPropagation();
            onChange(fps);
          }}
          className={`px-2 py-1.5 rounded text-[10px] font-medium transition-all ${
            value === fps
              ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
              : 'bg-black/30 border border-white/10 text-white/60 hover:border-white/20'
          }`}
        >
          {fps}fps
        </button>
      ))}
    </div>
  );
});

FPSSelector.displayName = 'FPSSelector';
