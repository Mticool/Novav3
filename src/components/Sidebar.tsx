import { useState } from 'react';
import { Plus, Library, Clock, LucideIcon, MousePointer2, Hand, Scissors, MessageSquare, Undo2, Redo2, Settings } from 'lucide-react';
import { AddNodesMenu } from './AddNodesMenu';
import { useStore } from '../store/useStore';

interface SidebarProps {
  onOpenLibrary?: () => void;
  onOpenHistory?: () => void;
}

export function Sidebar({ onOpenLibrary, onOpenHistory }: SidebarProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);
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
    <>
      {/* Unified left toolbar - Tools + Add Nodes + Library */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-30">
        <div className="w-16 glass-panel rounded-2xl shadow-2xl shadow-black/70 flex flex-col items-center py-3 gap-2">
          {/* Tools Section */}
          <SidebarButton icon={MousePointer2} label="Selection" active />
          <SidebarButton icon={Hand} label="Pan" />
          <SidebarButton icon={Scissors} label="Cut" />
          <SidebarButton icon={MessageSquare} label="Comment" />

          <div className="w-12 h-px bg-white/5 my-1" />

          {/* Add Nodes */}
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className={`
              sidebar-add-button
              w-11 h-11 rounded-xl flex items-center justify-center
              transition-all duration-200
              ${showAddMenu
                ? 'bg-accent-neon/20 text-accent-neon'
                : 'bg-white/5 hover:bg-white/8 text-white/60 hover:text-white'
              }
            `}
            title="Добавить узел"
          >
            <Plus size={20} />
          </button>

          <SidebarButton icon={Library} label="Библиотека" onClick={onOpenLibrary} />

          <div className="w-12 h-px bg-white/5 my-1" />

          {/* History */}
          <button
            onClick={handleUndo}
            disabled={!canUndo()}
            className={`
              w-11 h-11 rounded-xl flex items-center justify-center
              transition-all duration-200
              ${!canUndo()
                ? 'text-white/10 cursor-not-allowed'
                : 'hover:bg-white/5 text-white/40 hover:text-white/80'
              }
            `}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={18} />
          </button>

          <button
            onClick={handleRedo}
            disabled={!canRedo()}
            className={`
              w-11 h-11 rounded-xl flex items-center justify-center
              transition-all duration-200
              ${!canRedo()
                ? 'text-white/10 cursor-not-allowed'
                : 'hover:bg-white/5 text-white/40 hover:text-white/80'
              }
            `}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 size={18} />
          </button>

          <div className="w-12 h-px bg-white/5 my-1" />

          <SidebarButton icon={Clock} label="История" onClick={onOpenHistory} />
          <SidebarButton icon={Settings} label="Settings" />
        </div>
      </div>

      {/* Выезжающее меню Add Nodes */}
      {showAddMenu && (
        <AddNodesMenu onClose={() => setShowAddMenu(false)} />
      )}
    </>
  );
}

function SidebarButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-11 h-11 rounded-xl
        flex items-center justify-center
        transition-all duration-200
        group relative
        ${active
          ? 'bg-white/10 text-white'
          : 'hover:bg-white/5 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]'
        }
      `}
      title={label}
    >
      <Icon size={20} className={`transition-colors ${active ? 'text-white' : 'text-white/40 group-hover:text-white/80'}`} />
    </button>
  );
}

