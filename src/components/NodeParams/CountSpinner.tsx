import { memo } from 'react';
import { Minus, Plus, Settings } from 'lucide-react';

interface CountSpinnerProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const CountSpinner = memo(({ value, onChange, min = 1, max = 4 }: CountSpinnerProps) => {
  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 bg-[#2a2a2a] border border-white/10 rounded-lg px-2 py-2">
        <button
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Minus size={14} />
        </button>
        <span className="text-sm text-white font-medium w-6 text-center">{value}</span>
        <button
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>
      <button
        className="w-9 h-9 flex items-center justify-center bg-[#2a2a2a] border border-white/10 rounded-lg text-white/60 hover:text-white hover:border-white/20 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <Settings size={14} />
      </button>
    </div>
  );
});

CountSpinner.displayName = 'CountSpinner';
