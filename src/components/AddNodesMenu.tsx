import { X, Search, Type, Image, Video, Brain, Wand2, Palette, RotateCw, Upload, SplitSquareHorizontal, Sparkles, Move3d } from 'lucide-react';
import { useState } from 'react';
import { useStore, NodeType } from '../store/useStore';

interface AddNodesMenuProps {
  onClose: () => void;
}

export function AddNodesMenu({ onClose }: AddNodesMenuProps) {
  const addNode = useStore((state) => state.addNode);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      title: 'TOP',
      items: [
        {
          icon: Upload,
          label: 'Загрузить',
          subtitle: 'Изображение или видео',
          type: 'imageUpload' as const,
        },
        {
          icon: Image,
          label: 'Медиа',
          subtitle: 'Библиотека медиафайлов',
          type: null as any,
        },
      ]
    },
    {
      title: 'УЗЛЫ',
      items: [
        {
          icon: Type,
          label: 'Текст',
          subtitle: 'Текстовый узел для промптов',
          type: 'text' as const
        },
        {
          icon: Image,
          label: 'Генератор изображений',
          subtitle: 'AI генерация изображений',
          type: 'image' as const
        },
        {
          icon: Video,
          label: 'Генератор видео',
          subtitle: 'AI генерация видео',
          type: 'video' as const
        },
        {
          icon: Sparkles,
          label: 'Помощник',
          subtitle: 'AI-помощник — ваш творческий партнер',
          badge: 'AI' as const,
          badgeColor: 'bg-purple-500/20 text-purple-400' as const,
          type: 'assistant' as const
        },
        {
          icon: Wand2,
          label: 'Улучшение качества изображений',
          subtitle: 'Upscale и улучшение деталей',
          badge: 'PRO' as const,
          badgeColor: 'bg-orange-500/20 text-orange-400' as const,
          type: 'enhancement' as const
        },
        {
          icon: Move3d,
          label: 'Угол обзора камеры',
          subtitle: 'Поворот, наклон, масштаб',
          badge: 'NEW' as const,
          badgeColor: 'bg-blue-500/20 text-blue-400' as const,
          type: 'cameraAngle' as const
        },
      ]
    },
    {
      title: 'ИНСТРУМЕНТЫ',
      items: [
        {
          icon: RotateCw,
          label: 'Камера (вращение)',
          subtitle: 'Изменение ракурса камеры',
          badge: 'BETA' as const,
          badgeColor: 'bg-cyan-500/20 text-cyan-400' as const,
          type: 'camera' as const
        },
        {
          icon: Brain,
          label: 'Мастер промпт',
          subtitle: 'Улучшение текстовых промптов',
          badge: 'GPT-4o' as const,
          badgeColor: 'bg-green-500/20 text-green-400' as const,
          type: 'masterPrompt' as const
        },
        {
          icon: Palette,
          label: 'Модификатор стиля',
          subtitle: 'Стиль, освещение, настроение',
          type: 'modifier' as const
        },
        {
          icon: SplitSquareHorizontal,
          label: 'Array Splitter',
          subtitle: 'Разделение массивов данных',
          badge: 'NEW' as const,
          badgeColor: 'bg-cyan-500/20 text-cyan-400' as const,
          type: 'arraySplitter' as const
        },
        {
          icon: Type,
          label: 'Комментарий',
          subtitle: 'Добавить заметку на холст',
          type: 'comment' as const
        },
      ]
    },
  ];

  const handleAddNode = (type: NodeType) => {
    addNode(type);
    onClose();
  };

  // Filter items based on search
  const filteredCategories = categories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20"
        onClick={onClose}
      />

      {/* Меню */}
      <div className="fixed left-[76px] top-1/2 -translate-y-1/2 w-[320px] glass-panel rounded-2xl shadow-2xl shadow-black/70 z-30 animate-slide-in-from-left max-h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar">
        {/* Header with Close */}
        <div className="sticky top-0 bg-[#0c0c0c]/95 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between z-10">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">Добавить узел</span>
            <span className="text-xs text-white/30">Поиск и создание блоков</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-white/5">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Поиск"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/5 rounded-full text-sm text-white outline-none placeholder:text-white/25 focus:border-white/15 focus:bg-white/8 transition-all"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="p-3 space-y-4">
          {filteredCategories.map((category) => (
            <div key={category.title}>
              {/* Category Title */}
              <div className="px-2 mb-2">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">
                  {category.title}
                </span>
              </div>

              {/* Category Items */}
              <div className="space-y-1">
                {category.items.map((item: any) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.type) {
                        handleAddNode(item.type);
                      }
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group text-left"
                  >
                    {/* Lucide Icon */}
                    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/70 group-hover:text-white group-hover:bg-white/8 transition-all">
                      <item.icon size={18} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white group-hover:text-white/90">
                        {item.label}
                      </div>
                      {item.subtitle && (
                        <div className="text-xs text-white/40 mt-0.5">
                          {item.subtitle}
                        </div>
                      )}
                    </div>

                    {/* Badge */}
                    {'badge' in item && item.badge && 'badgeColor' in item && item.badgeColor && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${item.badgeColor as string} flex-shrink-0`}>
                        {item.badge as string}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="px-4 py-8 text-center">
            <div className="text-white/30 text-sm">Ничего не найдено</div>
          </div>
        )}
      </div>
    </>
  );
}
