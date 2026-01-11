import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Type, Sparkles, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const TextNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNode = useStore(s => s.updateNode);
  const improvePrompt = useStore(s => s.improvePrompt);
  const nodeData = data as Record<string, unknown>;
  const [content, setContent] = useState<string>((nodeData?.content as string) || '');
  const [isImproving, setIsImproving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleImprove = async () => {
    if (!content) return;
    setIsImproving(true);
    await improvePrompt(id);
    setIsImproving(false);
    const updatedContent = useStore.getState().nodes.find(n => n.id === id)?.data.content as string | undefined;
    if (updatedContent) setContent(updatedContent);
  };

  return (
    <div
      data-state={(nodeData?.state as string) || 'idle'}
      className={`
        node-card
        ${selected ? 'selected' : ''}
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="node-handle !-left-1.5"
      />

      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Type size={16} className="text-green-300/90" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white truncate node-title">{(nodeData?.title as string) || 'Текст'}</div>
          <div className="text-xs text-white/40 node-detail">Промпт</div>
        </div>
      </div>

      <div className="px-4 py-3 bg-[#080808] relative">
        {isEditing ? (
          /* Editing State */
          <textarea
            value={content}
            autoFocus
            onBlur={() => setIsEditing(false)}
            onChange={(e) => {
              const value = e.target.value;
              setContent(value);
              updateNode(id, { content: value });
            }}
            placeholder=" "
            className="w-full h-32 bg-transparent border-none text-sm text-white/90 outline-none resize-none leading-relaxed custom-scrollbar relative z-10"
          />
        ) : (
          /* View State */
          <div
            className="w-full h-32 text-sm text-white/80 overflow-y-auto leading-relaxed custom-scrollbar relative"
            onDoubleClick={() => setIsEditing(true)}
          >
            {content ? (
              <>
                {content}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="text-xs text-white/60 bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm">Дважды кликните для редактирования</span>
                </div>
              </>
            ) : (
              /* Empty/Inactive State */
              <div className="absolute inset-0">
                <div className="text-xs text-white/40 mb-2">Попробуйте:</div>
                <div className="space-y-1">
                  <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors w-full">
                    <span className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center">✎</span> Написать свой контент
                  </button>
                  <div className="flex items-center gap-2 text-xs text-white/30"><span className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center">📹</span> Текст в Видео</div>
                  <div className="flex items-center gap-2 text-xs text-white/30"><span className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center">🖼️</span> Промпт из картинки</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Bar / Toolbar */}
      {isEditing && (
        <div className="px-4 py-2 bg-[#141414] border-t border-white/5 flex gap-2 overflow-x-auto">
          {['H1', 'H2', 'B', 'I'].map(tag => (
            <button key={tag} className="text-[10px] text-white/50 hover:text-white bg-white/5 px-2 py-1 rounded hover:bg-white/10">{tag}</button>
          ))}
        </div>
      )}

      {!isEditing && (
        <div className="px-4 py-3 bg-[#0a0a0a] flex items-center justify-between border-t border-white/5 node-detail">
          <div className="text-xs text-white/30">
            {content.length} симв.
          </div>

          <button
            onClick={handleImprove}
            disabled={isImproving || !content}
            className="px-3 py-1.5 btn-neon rounded-xl text-xs flex items-center gap-1.5"
          >
            {isImproving ? (
              <>
                <Loader2 className="animate-spin" size={12} />
                Улучшение...
              </>
            ) : (
              <>
                <Sparkles size={12} />
                Улучшить
              </>
            )}
          </button>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="node-handle !-right-1.5"
      />
    </div>
  );
});

TextNode.displayName = 'TextNode';
