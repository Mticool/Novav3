import { MousePointer2, Hand, Scissors, MessageSquare, Undo2, Redo2, Settings } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store/useStore';

type Tool = 'select' | 'pan' | 'cut' | 'comment';

export function Toolbar() {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const undo = useStore((state) => state.undo);
  const redo = useStore((state) => state.redo);
  const canUndo = useStore((state) => state.canUndo);
  const canRedo = useStore((state) => state.canRedo);

  const handleUndo = () => {
    if (canUndo()) {
      undo();
    }
  };

  const handleRedo = () => {
    if (canRedo()) {
      redo();
    }
  };

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40">
      <div className="w-14 glass-panel rounded-2xl shadow-2xl shadow-black/70 flex flex-col items-center py-3 gap-1">
        {/* Selection Tool */}
        <ToolButton
          icon={MousePointer2}
          label="Selection"
          active={activeTool === 'select'}
          onClick={() => setActiveTool('select')}
        />

        {/* Pan Tool */}
        <ToolButton
          icon={Hand}
          label="Pan"
          active={activeTool === 'pan'}
          onClick={() => setActiveTool('pan')}
        />

        {/* Scissor/Cut Tool */}
        <ToolButton
          icon={Scissors}
          label="Cut"
          active={activeTool === 'cut'}
          onClick={() => setActiveTool('cut')}
        />

        {/* Comment Tool */}
        <ToolButton
          icon={MessageSquare}
          label="Comment"
          active={activeTool === 'comment'}
          onClick={() => setActiveTool('comment')}
        />

        {/* Divider */}
        <div className="w-10 h-px bg-white/5 my-1" />

        {/* Undo */}
        <ToolButton
          icon={Undo2}
          label="Undo (Ctrl+Z)"
          active={false}
          disabled={!canUndo()}
          onClick={handleUndo}
        />

        {/* Redo */}
        <ToolButton
          icon={Redo2}
          label="Redo (Ctrl+Shift+Z)"
          active={false}
          disabled={!canRedo()}
          onClick={handleRedo}
        />

        {/* Divider */}
        <div className="w-10 h-px bg-white/5 my-1" />

        {/* Settings */}
        <ToolButton
          icon={Settings}
          label="Settings"
          active={false}
          onClick={() => console.log('Settings clicked')}
        />
      </div>
    </div>
  );
}

interface ToolButtonProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
}

function ToolButton({ icon: Icon, label, active, disabled = false, onClick }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-10 h-10 rounded-xl
        flex items-center justify-center
        transition-all duration-200
        group relative
        ${
          active
            ? 'bg-accent-neon/20 text-accent-neon'
            : disabled
            ? 'text-white/10 cursor-not-allowed'
            : 'hover:bg-white/5 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] text-white/40 hover:text-white/80'
        }
      `}
      title={label}
    >
      <Icon size={18} className="transition-colors" />
      
      {/* Tooltip */}
      {!disabled && (
        <span className="absolute left-full ml-3 px-3 py-1.5 bg-black/90 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 backdrop-blur-sm">
          {label}
        </span>
      )}
    </button>
  );
}
