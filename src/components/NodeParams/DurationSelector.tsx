import { memo } from 'react';

interface DurationSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const DURATIONS = [5, 10, 15];

export const DurationSelector = memo(({ value, onChange }: DurationSelectorProps) => {
  return (
    <div className="flex gap-1">
      {DURATIONS.map(duration => (
        <button
          key={duration}
          onClick={(e) => {
            e.stopPropagation();
            onChange(duration);
          }}
          className={`px-2.5 py-1.5 rounded text-[10px] font-medium transition-all ${
            value === duration
              ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
              : 'bg-black/30 border border-white/10 text-white/60 hover:border-white/20'
          }`}
        >
          {duration}s
        </button>
      ))}
    </div>
  );
});

DurationSelector.displayName = 'DurationSelector';
