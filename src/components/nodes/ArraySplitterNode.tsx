import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitBranch } from 'lucide-react';

export const ArraySplitterNode = memo(({ data, selected }: NodeProps) => {
  const nodeData = data as Record<string, unknown>;

  return (
    <div className="w-[280px] relative">
      <div
        data-state={(nodeData?.state as string) || 'idle'}
        className={`node-card ${selected ? 'selected' : ''}`}
      >
        <Handle type="target" position={Position.Left} id="array-input" />
        <Handle type="source" position={Position.Right} id="item-1" style={{ top: '50px' }} />
        <Handle type="source" position={Position.Right} id="item-2" style={{ top: '80px' }} />
        <Handle type="source" position={Position.Right} id="item-3" style={{ top: '110px' }} />

        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.04]">
          <GitBranch size={12} className="opacity-50" />
          <span className="text-[11px] font-medium text-white/65 flex-1">
            {(nodeData?.title as string) || 'Array Splitter'}
          </span>
        </div>

        {/* Входы/выходы */}
        <div className="px-3 pt-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/40">Массив входов</span>
          </div>
        </div>

        <div className="px-3 pb-3 space-y-2 mt-2">
          <div className="flex items-center justify-end gap-2">
            <span className="text-[10px] text-white/40">Элемент 1</span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <span className="text-[10px] text-white/40">Элемент 2</span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <span className="text-[10px] text-white/40">Элемент 3</span>
          </div>
        </div>
      </div>
    </div>
  );
});

ArraySplitterNode.displayName = 'ArraySplitterNode';
