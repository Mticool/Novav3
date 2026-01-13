import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { MessageSquare, Play, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const AssistantNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNode = useStore(s => s.updateNode);
  const improvePrompt = useStore(s => s.improvePrompt);
  
  const nodeData = data as Record<string, unknown>;
  const [prompt, setPrompt] = useState<string>((nodeData?.prompt as string) || '');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Введите запрос для помощника');
      return;
    }

    setIsProcessing(true);
    updateNode(id, { state: 'loading', prompt });

    try {
      // Use GPT-4o to improve/generate prompt
      await improvePrompt(id);
      const updatedNode = useStore.getState().nodes.find(n => n.id === id);
      if (updatedNode?.data.improvedPrompt) {
        updateNode(id, { 
          state: 'success',
          response: updatedNode.data.improvedPrompt 
        });
      }
    } catch (error) {
      console.error('Assistant generation failed:', error);
      updateNode(id, { state: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value;
    setPrompt(newPrompt);
    updateNode(id, { prompt: newPrompt });
  };

  const tags = ['Медиа', 'Текст'];

  return (
    <div className="w-[280px] relative">
      <div
        data-state={(nodeData?.state as string) || 'idle'}
        className={`node-card ${selected ? 'selected' : ''}`}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.04]">
          <MessageSquare size={12} className="opacity-50" />
          <span className="text-[11px] font-medium text-white/65 flex-1">
            {(nodeData?.title as string) || 'Помощник #1'}
          </span>
        </div>

        {/* Большое textarea */}
        <div className="p-3">
          <textarea
            value={prompt}
            onChange={handlePromptChange}
            placeholder="Опишите что хотите создать..."
            className="w-full min-h-[120px] bg-black/30 border border-white/[0.03] rounded-lg px-3 py-2 text-[12px] text-white/80 placeholder:text-white/20 outline-none focus:border-blue-500/30 resize-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Play button */}
        <div className="px-3 pb-2 flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              void handleGenerate();
            }}
            disabled={!prompt.trim() || isProcessing}
            className="w-8 h-8 flex items-center justify-center bg-black/30 border border-white/10 rounded-lg text-white/60 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {isProcessing ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
          </button>

          {/* Tags */}
          <div className="flex gap-2">
            {tags.map(tag => (
              <span 
                key={tag}
                className="text-[10px] px-2 py-1 bg-white/5 border border-white/5 rounded text-white/40"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Response display (if any) */}
        {nodeData?.response && typeof nodeData.response === 'string' ? (
          <div className="px-3 pb-2">
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded text-[11px] text-blue-300/80">
              {nodeData.response}
            </div>
          </div>
        ) : null}

        {/* Output handle */}
        <Handle type="source" position={Position.Right} id="text-output" />

        {/* Выход с меткой */}
        <div className="px-3 pb-3 flex items-center justify-end gap-2">
          <span className="text-[10px] text-white/40">Текст</span>
        </div>
      </div>
    </div>
  );
});

AssistantNode.displayName = 'AssistantNode';
