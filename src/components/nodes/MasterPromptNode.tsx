import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { FileText } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const MasterPromptNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNode = useStore(s => s.updateNode);
  const nodeData = data as Record<string, unknown>;
  const [prompt, setPrompt] = useState<string>((nodeData?.prompt as string) || '');

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value;
    setPrompt(newPrompt);
    updateNode(id, { prompt: newPrompt });
  };

  return (
    <div className="w-[280px] relative">
      <div
        data-state={(nodeData?.state as string) || 'idle'}
        className={`node-card ${selected ? 'selected' : ''}`}
      >
        <Handle type="source" position={Position.Right} id="prompt-output" />

        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.04]">
          <FileText size={12} className="opacity-50" />
          <span className="text-[11px] font-medium text-white/65 flex-1">
            {(nodeData?.title as string) || 'Master Prompt'}
          </span>
        </div>

        {/* Content */}
        <div className="p-3">
          <textarea
            value={prompt}
            onChange={handlePromptChange}
            placeholder="Введите базовый промпт..."
            className="w-full min-h-[120px] bg-black/30 border border-white/[0.03] rounded-lg px-3 py-2 text-[12px] text-white/80 placeholder:text-white/20 outline-none focus:border-blue-500/30 resize-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Выход */}
        <div className="px-3 pb-3 flex items-center justify-end gap-2">
          <span className="text-[10px] text-white/40">Промпт</span>
        </div>
      </div>
    </div>
  );
});

MasterPromptNode.displayName = 'MasterPromptNode';
