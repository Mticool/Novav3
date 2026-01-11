import { memo, useState } from 'react';
import { NodeProps } from '@xyflow/react';
import { MessageSquare } from 'lucide-react';
import { useStore } from '../../store/useStore';

/**
 * CommentNode - Узел комментария/метки секции
 * Стиль: как в Pletor.ai - бежевый/оранжевый фон, без handles
 */
export const CommentNode = memo(({ id, data, selected }: NodeProps) => {
    const updateNode = useStore(s => s.updateNode);
    const nodeData = data as Record<string, unknown>;
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState((nodeData?.title as string) || 'Комментарий');

    const handleSave = () => {
        updateNode(id, { title });
        setIsEditing(false);
    };

    return (
        <div
            className={`
        node-card
        bg-amber-500/20
        border border-amber-500/40
        ${selected ? 'selected' : ''}
      `}
        >
            {/* No handles - this is a comment/label node */}

            <div className="flex items-start gap-2">
                <MessageSquare
                    size={16}
                    className="text-amber-400/80 mt-0.5 flex-shrink-0"
                />

                {isEditing ? (
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        className="flex-1 bg-transparent border-none text-sm text-amber-100 outline-none placeholder:text-amber-300/50"
                        autoFocus
                    />
                ) : (
                    <span
                        onClick={() => setIsEditing(true)}
                        className="text-sm text-amber-100 font-medium cursor-text leading-relaxed"
                    >
                        {title}
                    </span>
                )}
            </div>
        </div>
    );
});

CommentNode.displayName = 'CommentNode';
