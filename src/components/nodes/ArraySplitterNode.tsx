import { memo, useState, useEffect, useMemo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { SplitSquareHorizontal, ChevronDown } from 'lucide-react';
import { useStore } from '../../store/useStore';

const DELIMITERS = [
    { id: 'asterisk', label: '*', value: '*' },
    { id: 'newline', label: 'Новая строка', value: '\n' },
    { id: 'comma', label: 'Запятая', value: ',' },
    { id: 'semicolon', label: 'Точка с запятой', value: ';' },
    { id: 'pipe', label: '|', value: '|' },
];

export const ArraySplitterNode = memo(({ id, data, selected }: NodeProps) => {
    const updateNode = useStore(s => s.updateNode);
    const nodes = useStore(s => s.nodes);
    const edges = useStore(s => s.edges);

    const [delimiter, setDelimiter] = useState<string>((data?.delimiter as string) || '*');
    const [showDelimiterPicker, setShowDelimiterPicker] = useState(false);
    const [outputCount, setOutputCount] = useState<number>((data?.outputCount as number) || 4);

    // Get input text from connected node
    const getInputText = () => {
        const incomingEdge = edges.find(e => e.target === id);
        if (!incomingEdge) return '';

        const sourceNode = nodes.find(n => n.id === incomingEdge.source);
        return (sourceNode?.data?.content || sourceNode?.data?.output || '') as string;
    };

    // Split the input text
    const inputText = getInputText();
    const splitItems = useMemo(() =>
        inputText
            ? inputText.split(delimiter).map(s => s.trim()).filter(Boolean)
            : [],
        [inputText, delimiter]
    );

    // Update node data when delimiter changes
    useEffect(() => {
        updateNode(id, { delimiter, outputCount, items: splitItems });
    }, [delimiter, outputCount, id, updateNode, splitItems]);

    const currentDelimiter = DELIMITERS.find(d => d.value === delimiter);

    return (
        <div className="w-[260px]">
            {/* Title */}
            <div className="mb-2 flex items-center gap-2 text-xs text-white/60">
                <SplitSquareHorizontal size={14} className="text-white/50" />
                <span className="text-white/80 font-medium">{(data?.title as string) || 'Array Splitter'}</span>
            </div>

            <div
                className={`
          node-card
          relative
          ${selected ? 'selected' : ''}
        `}
            >
                {/* Input handle */}
                <Handle
                    type="target"
                    position={Position.Left}
                    className="node-handle !-left-1.5"
                />

                {/* Header */}
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-white/50">Разделитель:</span>
                        <div className="relative">
                            <button
                                onClick={() => setShowDelimiterPicker(!showDelimiterPicker)}
                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs text-white flex items-center gap-2 transition-colors"
                            >
                                <span className="font-mono">{currentDelimiter?.label || String(delimiter)}</span>
                                <ChevronDown size={12} className={showDelimiterPicker ? 'rotate-180' : ''} />
                            </button>

                            {showDelimiterPicker && (
                                <>
                                    <div className="fixed inset-0 z-20" onClick={() => setShowDelimiterPicker(false)} />
                                    <div className="absolute top-full left-0 mt-1 w-40 bg-[#141414] border border-white/10 rounded-xl shadow-2xl z-30 overflow-hidden">
                                        {DELIMITERS.map(d => (
                                            <button
                                                key={d.id}
                                                onClick={() => { setDelimiter(d.value); setShowDelimiterPicker(false); }}
                                                className={`w-full px-3 py-2 text-left text-xs hover:bg-white/5 transition-colors ${delimiter === d.value ? 'bg-accent-neon/10 text-accent-neon' : 'text-white/70'}`}
                                            >
                                                <span className="font-mono mr-2">{d.value === '\n' ? '↵' : d.value}</span>
                                                {d.label}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Preview of split items with handles */}
                <div className="px-4 py-3 space-y-2">
                    {Array.from({ length: outputCount }).map((_, index) => {
                        const item = splitItems[index] || '';
                        return (
                            <div
                                key={index}
                                className="relative flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg"
                            >
                                <span className="w-5 h-5 rounded-full bg-accent-neon/20 text-accent-neon text-xs flex items-center justify-center font-medium">
                                    {index + 1}
                                </span>
                                <span className="text-xs text-white/70 truncate flex-1">
                                    {item || 'Подключите ввод'}
                                </span>
                                {/* Handle for this output */}
                                <Handle
                                    type="source"
                                    position={Position.Right}
                                    id={`output-${index}`}
                                    className="node-handle !-right-1.5"
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Output count control */}
                <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-white/50">Выходов:</span>
                    <div className="flex items-center gap-1">
                        {[2, 3, 4, 6].map(count => (
                            <button
                                key={count}
                                onClick={() => setOutputCount(count)}
                                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${outputCount === count
                                    ? 'bg-accent-neon text-black'
                                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                                    }`}
                            >
                                {count}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});

ArraySplitterNode.displayName = 'ArraySplitterNode';
