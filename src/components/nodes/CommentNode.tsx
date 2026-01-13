import { memo, useState } from 'react';
import { NodeProps } from '@xyflow/react';
import { MessageSquare } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const CommentNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNode = useStore(s => s.updateNode);
  const nodeData = data as Record<string, unknown>;
  const [comment, setComment] = useState<string>((nodeData?.comment as string) || '');

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value;
    setComment(newComment);
    updateNode(id, { comment: newComment });
  };

  return (
    <div className="w-[280px] relative">
      <div
        className={`node-card border-yellow-500/20 ${selected ? 'selected' : ''}`}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.04]">
          <MessageSquare size={12} className="opacity-50 text-yellow-400" />
          <span className="text-[11px] font-medium text-white/65 flex-1">
            {(nodeData?.title as string) || 'Comment'}
          </span>
        </div>

        {/* Content */}
        <div className="p-3">
          <textarea
            value={comment}
            onChange={handleCommentChange}
            placeholder="Add comment..."
            className="w-full min-h-[80px] bg-black/30 border border-white/[0.03] rounded-lg px-3 py-2 text-[12px] text-white/80 placeholder:text-white/20 outline-none focus:border-yellow-500/30 resize-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </div>
  );
});

CommentNode.displayName = 'CommentNode';
