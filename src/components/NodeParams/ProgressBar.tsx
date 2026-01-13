import { memo } from 'react';

interface ProgressBarProps {
  progress: number;
  estimatedTime?: number;
  currentStep?: string;
}

export const ProgressBar = memo(({ progress, estimatedTime, currentStep }: ProgressBarProps) => {
  return (
    <div className="px-3 pb-2">
      {currentStep && (
        <div className="text-[10px] text-white/40 mb-1">{currentStep}</div>
      )}
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {estimatedTime !== undefined && estimatedTime > 0 && (
        <div className="text-[10px] text-white/40 mt-1 text-right">
          ~{estimatedTime}s
        </div>
      )}
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';
