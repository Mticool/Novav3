import { useState } from 'react';
import { Plus, Library, Clock, MousePointer2, LucideIcon } from 'lucide-react';
import { AddNodesMenu } from './AddNodesMenu';

interface SidebarProps {
  onOpenLibrary?: () => void;
  onOpenHistory?: () => void;
}

export function Sidebar({ onOpenLibrary, onOpenHistory }: SidebarProps) {
  const [showAddMenu, setShowAddMenu] = useState(false);

  return (
    <>
      {/* Floating left toolbar (Glassmorphism style) */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-30">
        <div className="w-14 glass-panel rounded-2xl shadow-2xl shadow-black/70 flex flex-col items-center py-2 gap-1">
          {/* Selection tool */}
          <SidebarButton icon={MousePointer2} label="Выбор" active />

          <div className="w-10 h-px bg-white/5 my-1" />

          {/* Add Nodes */}
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className={`
              sidebar-add-button
              w-10 h-10 rounded-xl flex items-center justify-center
              transition-all duration-200
              ${showAddMenu
                ? 'bg-accent-neon/20 text-accent-neon'
                : 'bg-white/5 hover:bg-white/8 text-white/60 hover:text-white'
              }
            `}
            title="Добавить узел"
          >
            <Plus size={18} />
          </button>

          <SidebarButton icon={Library} label="Библиотека" onClick={onOpenLibrary} />

          <div className="w-10 h-px bg-white/5 my-1" />

          <SidebarButton icon={Clock} label="История" onClick={onOpenHistory} />
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
        w-10 h-10 rounded-xl
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
      <Icon size={18} className={`transition-colors ${active ? 'text-white' : 'text-white/40 group-hover:text-white/80'}`} />
    </button>
  );
}

