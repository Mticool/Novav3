import { memo, useState } from 'react';
import { Link, Loader2, Play, Trash2, Type, Image, Video, Brain, Wand2, Sparkles, Move3d } from 'lucide-react';
import { NodeType } from '../../store/useStore';

interface NodeToolbarProps {
  visible: boolean;
  isLoading?: boolean;
  nodeId?: string;
  onConnectToNode?: (targetType: NodeType) => void;
  onRun?: () => void;
  onDelete?: () => void;
}

const NODE_TYPES_FOR_CONNECTION = [
  { type: 'text' as const, icon: Type, label: 'Текст' },
  { type: 'image' as const, icon: Image, label: 'Генератор изображений' },
  { type: 'video' as const, icon: Video, label: 'Генератор видео' },
  { type: 'assistant' as const, icon: Sparkles, label: 'Ассистент' },
  { type: 'enhancement' as const, icon: Wand2, label: 'Улучшение' },
  { type: 'cameraAngle' as const, icon: Move3d, label: 'Угол камеры' },
  { type: 'masterPrompt' as const, icon: Brain, label: 'Мастер промпт' },
];

export const NodeToolbar = memo(({ visible, isLoading, onConnectToNode, onRun, onDelete }: NodeToolbarProps) => {
  const [showConnectMenu, setShowConnectMenu] = useState(false);

  if (!visible) return null;

  return (
    <div className="node-toolbar node-toolbar--center">
      {/* Connect to button with dropdown */}
      <div className="relative">
        <button
          type="button"
          className="node-action-button"
          title="Подключиться к"
          onClick={(e) => {
            e.stopPropagation();
            setShowConnectMenu(!showConnectMenu);
          }}
        >
          <Link size={14} />
          <span className="ml-1.5">Подключиться к</span>
          <span className="ml-1 text-[10px] opacity-70">▼</span>
        </button>

        {/* Dropdown menu */}
        {showConnectMenu && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowConnectMenu(false)}
            />

            {/* Menu */}
            <div className="absolute top-full left-0 mt-1 w-56 bg-[#2a2a2a] rounded-lg shadow-2xl border border-white/10 py-1 z-50">
              {NODE_TYPES_FOR_CONNECTION.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 transition-colors text-left text-sm text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onConnectToNode?.(item.type);
                    setShowConnectMenu(false);
                  }}
                >
                  <item.icon size={14} className="text-white/70" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <button
        type="button"
        className="node-action-button"
        title="Генерировать"
        disabled={!!isLoading}
        onClick={(e) => {
          e.stopPropagation();
          onRun?.();
        }}
      >
        {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
      </button>

      <button
        type="button"
        className="node-action-button"
        title="Удалить"
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
});

NodeToolbar.displayName = 'NodeToolbar';
