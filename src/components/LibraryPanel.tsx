import { useState } from 'react';
import { X, Search, Image, Video, Wand2, SplitSquareHorizontal, Camera, Upload, Type, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';

interface LibraryPanelProps {
    onClose: () => void;
}

type NodeType = 'text' | 'image' | 'video' | 'masterPrompt' | 'modifier' | 'generator' | 'camera' | 'imageUpload' | 'arraySplitter';

const NODE_LIBRARY = [
    {
        category: 'Input',
        nodes: [
            { type: 'text' as NodeType, name: 'Текст', icon: Type, description: 'Gemini 1.5 Pro', color: 'bg-white/10 text-white' },
            { type: 'imageUpload' as NodeType, name: 'Загрузка', icon: Upload, description: 'Изображения / Видео / Аудио', color: 'bg-white/10 text-white' },
        ],
    },
    {
        category: 'Generation',
        nodes: [
            { type: 'image' as NodeType, name: 'Изображение', icon: Image, description: 'Banana Pro', color: 'bg-white/10 text-white' },
            { type: 'video' as NodeType, name: 'Видео', icon: Video, description: 'Kling 2.6 / Sora 2', color: 'bg-white/10 text-white' },
            { type: 'generator' as NodeType, name: 'Универсальный', icon: Sparkles, description: 'Изображение и Видео', color: 'bg-white/10 text-white' },
        ],
    },
    {
        category: 'Tools',
        nodes: [
            { type: 'masterPrompt' as NodeType, name: 'Помощник', icon: Wand2, description: 'Улучшение промптов', color: 'bg-white/10 text-white' },
            { type: 'modifier' as NodeType, name: 'Модификатор', icon: Wand2, description: 'Стили и эффекты', color: 'bg-white/10 text-white' },
            { type: 'camera' as NodeType, name: 'Камера', icon: Camera, description: 'Контроль персонажа', color: 'bg-white/10 text-white' },
            { type: 'arraySplitter' as NodeType, name: 'Разделитель', icon: SplitSquareHorizontal, description: 'Для пакетной обработки', color: 'bg-white/10 text-white' },
        ],
    },
];

export function LibraryPanel({ onClose }: LibraryPanelProps) {
    const addNodeAt = useStore((s) => s.addNodeAt);
    const [search, setSearch] = useState('');

    const handleAddNode = (type: NodeType) => {
        // Add node at center of screen
        addNodeAt(type, { x: 400, y: 300 });
        onClose();
    };

    const filteredLibrary = NODE_LIBRARY.map((category) => ({
        ...category,
        nodes: category.nodes.filter(
            (node) =>
                node.name.toLowerCase().includes(search.toLowerCase()) ||
                node.description.toLowerCase().includes(search.toLowerCase())
        ),
    })).filter((category) => category.nodes.length > 0);

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-transparent z-50" onClick={onClose} />

            {/* Panel - Floating like screenshot */}
            <div className="fixed left-6 top-1/2 -translate-y-1/2 w-[240px] bg-[#141414] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-left-4 fade-in duration-200">
                {/* Header */}
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between shrink-0">
                    <h2 className="text-sm font-semibold text-white/90">Добавить ноду</h2>
                    {/* Hiding close button for cleaner look, click outside closing is enough */}
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Search */}
                <div className="px-4 py-2 border-b border-white/5 shrink-0">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Поиск узлов..."
                            className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 outline-none focus:border-white/20"
                        />
                    </div>
                </div>

                {/* Node list */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
                    {filteredLibrary.map((category) => (
                        <div key={category.category}>
                            <h3 className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2 px-1">
                                {category.category}
                            </h3>
                            <div className="space-y-1">
                                {category.nodes.map((node) => (
                                    <button
                                        key={node.type}
                                        onClick={() => handleAddNode(node.type)}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${node.color}`}>
                                            <node.icon size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-white group-hover:text-accent-neon transition-colors">
                                                {node.name}
                                            </div>
                                            <div className="text-xs text-white/40 truncate">{node.description}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
