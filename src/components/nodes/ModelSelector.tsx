import { memo, useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export type SelectorOption = {
  value: string;
  label: string;
};

interface ModelSelectorProps {
  value: string;
  options: readonly SelectorOption[];
  onChange: (value: string) => void;
  ariaLabel?: string;
}

export const ModelSelector = memo(({ value, options, onChange, ariaLabel }: ModelSelectorProps) => {
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    return options.find((o) => o.value === value)?.label || options[0]?.label || '';
  }, [options, value]);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="model-selector w-full flex items-center justify-between gap-2"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown size={14} className={`ml-2 opacity-80 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          />
          <div className="absolute z-50 mt-2 w-max min-w-full max-w-[360px] overflow-hidden rounded-[12px] border border-white/10 bg-[#1f1f1f] shadow-2xl">
            <div className="max-h-[260px] overflow-y-auto custom-scrollbar">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-[14px] transition-colors hover:bg-white/5 ${
                    opt.value === value ? 'bg-white/5 text-white' : 'text-white/80'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
});

ModelSelector.displayName = 'ModelSelector';

