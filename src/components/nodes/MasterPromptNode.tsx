import { memo, useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Brain, Sparkles, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const MasterPromptNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNode = useStore(s => s.updateNode);
  const improvePrompt = useStore(s => s.improvePrompt);
  const nodeData = data as Record<string, unknown>;
  const [content, setContent] = useState<string>((nodeData?.content as string) || '');
  const isImproving = nodeData?.state === 'loading';

  // Sync content from store when AI updates it
  useEffect(() => {
    if (nodeData?.content && nodeData.content !== content) {
      setContent(nodeData.content as string);
    }
  }, [nodeData?.content]);

  const handleChange = (value: string) => {
    setContent(value);
    updateNode(id, { content: value });
  };

  const handleImprove = () => {
    if (!content) return;
    improvePrompt(id);
  };

  return (
    <div className={`
      node-master
      min-w-[280px] max-w-[400px]
      bg-[#2d2d2d]
      rounded-[28px] overflow-hidden
      transition-all duration-200
      shadow-xl shadow-black/60
      ${selected ? 'ring-2 ring-purple-400 shadow-2xl shadow-purple-500/40' : ''}
      ${isImproving ? 'opacity-80' : ''}
    `}>
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3"
        title="Connect input"
      />

      {/* Header */}
      <div className="px-3 py-2 border-b border-white/5 flex items-center gap-2">
        <Brain size={16} className="text-purple-400" />
        <input
          type="text"
          defaultValue={(nodeData?.title as string) || 'Master Prompt'}
          className="flex-1 bg-transparent text-sm font-semibold text-white outline-none"
          onChange={(e) => updateNode(id, { title: e.target.value })}
        />

        {/* Status badge */}
        {isImproving && (
          <div className="ml-auto flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded text-[10px] text-blue-300">
            <Loader2 size={10} className="animate-spin" />
            Generating...
          </div>
        )}

        {nodeData?.state === 'success' && (
          <div className="ml-auto px-2 py-1 bg-green-500/20 rounded text-[10px] text-green-300">
            ✓ Done
          </div>
        )}

        {nodeData?.state === 'error' && (
          <div className="ml-auto px-2 py-1 bg-red-500/20 rounded text-[10px] text-red-300" title={nodeData.error as string}>
            ✗ Error
          </div>
        )}

        {!nodeData?.state && (
          <div className="px-2 py-0.5 bg-purple-500/20 rounded text-[10px] text-purple-300 font-semibold">
            MASTER
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        {nodeData?.state === 'error' && (
          <div className="text-xs text-red-400 bg-red-400/10 p-2 rounded border border-red-400/20">
            {String(nodeData.error || 'Unknown error')}
          </div>
        )}
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Main subject and scene description..."
            className="w-full h-28 bg-black/20 border border-purple-500/20 rounded-lg px-3 py-2 text-sm text-white outline-none resize-none placeholder:text-white/30 focus:border-purple-500/50 transition-colors leading-relaxed custom-scrollbar"
          />
          {!content && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-2">
              <Brain size={24} className="text-purple-400/20" />
              <span className="text-xs text-white/20">Describe your main scene...</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-white/30">{content.length} chars</span>
            {content.length > 0 && (
              <span className="text-purple-400/60">• Master</span>
            )}
          </div>

          <button
            onClick={handleImprove}
            disabled={isImproving || !content}
            className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-purple-400 flex items-center gap-1.5 transition-colors border border-purple-500/20 hover:border-purple-500/40"
          >
            {isImproving ? (
              <>
                <Loader2 className="animate-spin" size={12} />
                Improving...
              </>
            ) : (
              <>
                <Sparkles size={12} />
                Enhance
              </>
            )}
          </button>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3"
        title="Connect to modifiers or generator"
      />
    </div>
  );
});

MasterPromptNode.displayName = 'MasterPromptNode';
