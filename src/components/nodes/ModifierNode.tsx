import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Edit3 } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const ModifierNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNode = useStore(s => s.updateNode);
  const nodeData = data as Record<string, unknown>;
  const [modifier, setModifier] = useState<string>((nodeData?.modifier as string) || '');

  const handleModifierChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newModifier = e.target.value;
    setModifier(newModifier);
    updateNode(id, { modifier: newModifier });
  };

  return (
    <div className="w-[280px] relative">
      <div
        data-state={(nodeData?.state as string) || 'idle'}
        className={`node-card ${selected ? 'selected' : ''}`}
      >
        <Handle type="target" position={Position.Left} id="prompt-input" />
        <Handle type="source" position={Position.Right} id="prompt-output" />

        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.04]">
          <Edit3 size={12} className="opacity-50" />
          <span className="text-[11px] font-medium text-white/65 flex-1">
            {(nodeData?.title as string) || 'Modifier'}
          </span>
        </div>

        {/* Вход */}
        <div className="px-3 pt-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] text-white/40">Базовый промпт</span>
          </div>

          <textarea
            value={modifier}
            onChange={handleModifierChange}
            placeholder="Добавить модификацию..."
            className="w-full min-h-[80px] bg-black/30 border border-white/[0.03] rounded-lg px-3 py-2 text-[12px] text-white/80 placeholder:text-white/20 outline-none focus:border-blue-500/30 resize-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Выход */}
        <div className="px-3 pb-3 flex items-center justify-end gap-2">
          <span className="text-[10px] text-white/40">Модифицированный промпт</span>
        </div>
      </div>
    </div>
  );
});

ModifierNode.displayName = 'ModifierNode';
