import React from 'react';
import { MousePointer2, Video, Film, Image as ImageIcon, Music, LayoutTemplate } from 'lucide-react';
import { useStore } from '../store/useStore';

export function CanvasEmptyState() {
    const createChain = useStore((state) => state.createChain);
    const setShowTemplates = (show: boolean) => {
        // This is a bit of a hack since we don't have direct access to App's state here
        // But we can trigger the templates button via DOM or move state to store later.
        // For now, let's assume we can pass a prop or use a global event.
        // A better way: Let's assume createChain handles 'workflow' to open templates,
        // or we dispatch a custom event.
        window.dispatchEvent(new CustomEvent('open-templates'));
    };

    const actions = [
        {
            id: 'text-to-video',
            label: 'Текст в Видео',
            icon: Video,
            gradient: 'from-blue-500/10 to-purple-500/10',
            border: 'border-blue-500/20',
            hover: 'hover:border-blue-500/40 hover:bg-white/5',
            iconColor: 'text-blue-400',
        },
        {
            id: 'change-background',
            label: 'Заменить фон',
            icon: ImageIcon,
            gradient: 'from-green-500/10 to-teal-500/10',
            border: 'border-green-500/20',
            hover: 'hover:border-green-500/40 hover:bg-white/5',
            iconColor: 'text-green-400',
        },
        {
            id: 'first-frame',
            label: 'Первый кадр в Видео',
            icon: Film,
            gradient: 'from-purple-500/10 to-pink-500/10',
            border: 'border-purple-500/20',
            hover: 'hover:border-purple-500/40 hover:bg-white/5',
            iconColor: 'text-purple-400',
        },
        {
            id: 'audio-to-video',
            label: 'Аудио в Видео',
            icon: Music,
            gradient: 'from-yellow-500/10 to-orange-500/10',
            border: 'border-yellow-500/20',
            hover: 'hover:border-yellow-500/40 hover:bg-white/5',
            iconColor: 'text-yellow-400',
        },
        {
            id: 'workflow',
            label: 'Воркфлоу',
            icon: LayoutTemplate,
            gradient: 'from-gray-500/10 to-slate-500/10',
            border: 'border-white/10',
            hover: 'hover:border-white/20 hover:bg-white/5',
            iconColor: 'text-white/60',
        }
    ];

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="flex flex-col items-center pointer-events-auto animate-in fade-in duration-700">

                {/* Helper Badge */}
                <div className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-white/10 rounded-full mb-8 shadow-2xl">
                    <div className="p-1 bg-white/10 rounded-full">
                        <MousePointer2 size={12} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-white/90">
                        <span className="font-bold text-white">Дважды кликните</span> по холсту для свободного творчества или выберите шаблон.
                    </span>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-3">
                    {actions.map((action) => (
                        <button
                            key={action.id}
                            onClick={() => {
                                if (action.id === 'workflow') {
                                    setShowTemplates(true);
                                } else {
                                    // @ts-ignore - createChain defined in store
                                    createChain(action.id);
                                }
                            }}
                            className={`
                flex items-center gap-2.5 px-4 py-2.5
                bg-[#141414] border ${action.border}
                rounded-xl transition-all duration-200
                ${action.hover}
                group
              `}
                        >
                            <action.icon size={16} className={`${action.iconColor} group-hover:scale-110 transition-transform`} />
                            <span className="text-sm font-medium text-white/80 group-hover:text-white">{action.label}</span>
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
}
