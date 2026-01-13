import { memo } from 'react';
import { Link, Loader2, Play, Trash2 } from 'lucide-react';

interface NodeToolbarProps {
  visible: boolean;
  isLoading?: boolean;
  onConnect?: () => void;
  onRun?: () => void;
  onDelete?: () => void;
}

export const NodeToolbar = memo(({ visible, isLoading, onConnect, onRun, onDelete }: NodeToolbarProps) => {
  if (!visible) return null;

  return (
    <div className="node-toolbar node-toolbar--center">
      <button
        type="button"
        className="node-action-button"
        title="Подключиться к"
        onClick={(e) => {
          e.stopPropagation();
          onConnect?.();
        }}
      >
        <Link size={14} />
        <span className="ml-1.5">Подключиться к</span>
        <span className="ml-1 text-[10px] opacity-70">▼</span>
      </button>

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

