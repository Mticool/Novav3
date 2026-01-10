import { memo, useMemo } from 'react';
import { Brain, Image as ImageIcon, Video as VideoIcon, X } from 'lucide-react';

type NodeType = 'image' | 'video' | 'masterPrompt';

export interface ConnectSuggestMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onPick: (type: NodeType) => void;
}

export const ConnectSuggestMenu = memo(({ x, y, onClose, onPick }: ConnectSuggestMenuProps) => {
  const items = useMemo(() => ([
    { type: 'image' as const, label: 'Генератор изображений', Icon: ImageIcon, color: 'bg-indigo-500/20 text-indigo-200' },
    { type: 'video' as const, label: 'Генератор видео', Icon: VideoIcon, color: 'bg-purple-500/20 text-purple-200' },
    { type: 'masterPrompt' as const, label: 'Помощник', Icon: Brain, color: 'bg-emerald-500/20 text-emerald-200' },
  ]), []);

  const style: React.CSSProperties = {
    left: Math.min(x, window.innerWidth - 300),
    top: Math.min(y, window.innerHeight - 220),
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 w-[280px] rounded-2xl bg-[#141414]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/70 p-2"
        style={style}
      >
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="text-xs text-white/50">Что подключить дальше?</div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-1">
          {items.map(({ type, label, Icon, color }) => (
            <button
              key={type}
              onClick={() => onPick(type)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
            >
              <div className={`w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center ${color}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <div className="text-sm text-white/90 font-medium">{label}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
});

ConnectSuggestMenu.displayName = 'ConnectSuggestMenu';


