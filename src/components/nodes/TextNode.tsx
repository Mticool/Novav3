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
    <div className="w-[280px] relative">
      <div
        data-state={(nodeData?.state as string) || 'idle'}
        className={`node-card ${selected ? 'selected' : ''}`}
      >
        {/* Handle слева (вход) - невидимый по умолчанию */}
        <Handle 
          type="target" 
          position={Position.Left} 
          id="text-input"
        />

        {/* Header */}
        <div className="node-header">
          <svg className="node-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
          </svg>
          <span className="node-title">
            {(nodeData?.title as string) || 'Текст #1'}
          </span>
        </div>

        {/* Редактируемое поле */}
        <div className="p-3">
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Введите текст..."
            className="w-full min-h-[80px]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Output handle с меткой */}
        <div className="px-3 pb-3 flex items-center justify-end gap-2">
          <span className="label-output">Текст</span>
        </div>
        
        <Handle 
          type="source" 
          position={Position.Right} 
          id="text-output"
        />
      </div>
    </div>
  );
});

TextNode.displayName = 'TextNode';
