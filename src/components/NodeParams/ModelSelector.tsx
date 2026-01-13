import { memo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface ModelOption {
  id: string;
  name: string;
  time: string;
  quality: string;
}

interface ModelSelectorProps {
  value: string;
  options: readonly ModelOption[];
  onChange: (value: string) => void;
  category: 'image' | 'video';
}

export const ModelSelector = memo(({ value, options, onChange }: ModelSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const selected = options.find(o => o.id === value);

  const filteredOptions = options.filter(opt => 
    opt.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-[#2a2a2a] border border-white/10 rounded-lg text-sm text-white hover:border-white/20 transition-colors"
      >
        <span className="truncate font-medium">{selected?.name || 'Select model'}</span>
        <ChevronDown size={14} className={`ml-2 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => {
              setIsOpen(false);
              setSearchQuery('');
            }}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#1f1f1f] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
            {/* Search Input */}
            <div className="p-3 border-b border-white/5">
              <div className="flex items-center gap-2 px-3 py-2 bg-[#2a2a2a] rounded-lg">
                <Search size={14} className="text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск"
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* Options List */}
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              {filteredOptions.map(option => (
                <button
                  key={option.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(option.id);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-white/5 flex items-center justify-between transition-colors ${
                    value === option.id ? 'bg-white/5' : ''
                  }`}
                >
                  <span className="text-white text-sm font-medium">{option.name}</span>
                  <span className="text-white/40 text-xs ml-3 flex-shrink-0">~{option.time}</span>
                </button>
              ))}
              {filteredOptions.length === 0 && (
                <div className="px-4 py-3 text-white/40 text-sm">Ничего не найдено</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
});

ModelSelector.displayName = 'ModelSelector';
