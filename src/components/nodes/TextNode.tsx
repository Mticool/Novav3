import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useStore } from '../../store/useStore';

export const TextNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNode = useStore(s => s.updateNode);
  const nodeData = data as Record<string, unknown>;
  const [content, setContent] = useState<string>((nodeData?.content as string) || '');

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    updateNode(id, { content: newContent });
  };

  return (
    <div className="w-[440px] relative">
      <div className={`node relative ${selected ? 'selected' : ''}`}>
        <Handle type="target" position={Position.Left} id="text-input" style={{ top: 78 }} />

        {/* Header */}
        <div className="node-header">
          <svg className="h-[18px] w-[18px] opacity-90 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7V4h16v3M9 20h6M12 4v16" />
          </svg>
          <div className="flex-1 text-[15px] font-semibold text-white">
            {(nodeData?.title as string) || 'Текст #1'}
          </div>
        </div>

        <div className="mt-4">
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Введите текст..."
            className="node-textarea"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        <div className="mt-4 flex items-center justify-end">
          <span className="node-label">Текст</span>
        </div>

        <Handle type="source" position={Position.Right} id="text-output" style={{ bottom: 54 }} />
      </div>
    </div>
  );
});

TextNode.displayName = 'TextNode';
