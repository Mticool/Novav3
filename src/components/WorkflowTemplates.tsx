import { useState, useRef } from 'react';
import { X, Download, Upload, Trash2, FileJson, Grid3X3, Sparkles, Video, Image as ImageIcon, ShoppingBag, Users } from 'lucide-react';
import { useStore } from '../store/useStore';

interface WorkflowTemplatesProps {
    onClose: () => void;
}

interface SavedWorkflow {
    id: string;
    name: string;
    createdAt: string;
    nodes: unknown[];
    edges: unknown[];
}

// Built-in preset templates
const PRESET_TEMPLATES = [
    {
        id: 'text-to-image',
        name: 'Текст → Изображение',
        description: 'Простая генерация изображения из текста',
        icon: ImageIcon,
        workflow: {
            version: '1.0',
            name: 'Текст → Изображение',
            nodes: [
                {
                    id: 'text_1',
                    type: 'text',
                    position: { x: 100, y: 200 },
                    data: { title: 'Текст #1', content: '', state: 'idle' },
                },
                {
                    id: 'image_1',
                    type: 'image',
                    position: { x: 450, y: 200 },
                    data: {
                        title: 'Генератор изображений #1',
                        state: 'idle',
                        settings: { model: 'nano-banana-pro', resolution: 'square_hd' }
                    },
                },
            ],
            edges: [{ id: 'e1', source: 'text_1', target: 'image_1' }],
        },
    },
    {
        id: 'text-to-video',
        name: 'Текст → Изображение → Видео',
        description: 'Полный пайплайн: текст → картинка → видео',
        icon: Video,
        workflow: {
            version: '1.0',
            name: 'Текст → Изображение → Видео',
            nodes: [
                {
                    id: 'text_1',
                    type: 'text',
                    position: { x: 100, y: 200 },
                    data: { title: 'Текст #1', content: '', state: 'idle' },
                },
                {
                    id: 'image_1',
                    type: 'image',
                    position: { x: 450, y: 200 },
                    data: {
                        title: 'Генератор изображений #1',
                        state: 'idle',
                        settings: { model: 'nano-banana-pro', resolution: 'landscape_hd' }
                    },
                },
                {
                    id: 'video_1',
                    type: 'video',
                    position: { x: 800, y: 200 },
                    data: {
                        title: 'Генератор видео #1',
                        state: 'idle',
                        settings: { model: 'kling-2.6', duration: 5 }
                    },
                },
            ],
            edges: [
                { id: 'e1', source: 'text_1', target: 'image_1' },
                { id: 'e2', source: 'image_1', target: 'video_1' },
            ],
        },
    },
    {
        id: 'assistant-flow',
        name: 'Помощник + Генерация',
        description: 'AI улучшает промпт перед генерацией',
        icon: Sparkles,
        workflow: {
            version: '1.0',
            name: 'Помощник + Генерация',
            nodes: [
                {
                    id: 'text_1',
                    type: 'text',
                    position: { x: 100, y: 200 },
                    data: { title: 'Идея', content: '', state: 'idle' },
                },
                {
                    id: 'master_1',
                    type: 'masterPrompt',
                    position: { x: 450, y: 200 },
                    data: { title: 'Помощник #1', content: '', state: 'idle' },
                },
                {
                    id: 'image_1',
                    type: 'image',
                    position: { x: 800, y: 200 },
                    data: {
                        title: 'Генератор изображений #1',
                        state: 'idle',
                        settings: { model: 'nano-banana-pro', resolution: 'square_hd' }
                    },
                },
            ],
            edges: [
                { id: 'e1', source: 'text_1', target: 'master_1' },
                { id: 'e2', source: 'master_1', target: 'image_1' },
            ],
        },
    },
    {
        id: 'character-styles',
        name: 'Персонаж в разных стилях',
        description: 'Создайте персонажа в нескольких стилях одновременно',
        icon: Grid3X3,
        workflow: {
            version: '1.0',
            name: 'Персонаж в разных стилях',
            nodes: [
                {
                    id: 'text_base',
                    type: 'text',
                    position: { x: 50, y: 250 },
                    data: { title: 'Базовый промпт', content: 'женщина, портрет, детализированный', state: 'idle' },
                },
                {
                    id: 'splitter_1',
                    type: 'arraySplitter',
                    position: { x: 450, y: 550 },
                    data: {
                        title: 'Разделитель',
                        delimiter: '*',
                        outputCount: 3,
                        state: 'idle'
                    },
                },
                {
                    id: 'text_styles',
                    type: 'text',
                    position: { x: 50, y: 550 },
                    data: { title: 'Список стилей', content: 'аниме стиль * фотореализм * акварель', state: 'idle' },
                },
                {
                    id: 'modifier_1',
                    type: 'modifier',
                    position: { x: 850, y: 100 },
                    data: { title: 'Стиль 1', content: '', state: 'idle' },
                },
                {
                    id: 'modifier_2',
                    type: 'modifier',
                    position: { x: 850, y: 400 },
                    data: { title: 'Стиль 2', content: '', state: 'idle' },
                },
                {
                    id: 'modifier_3',
                    type: 'modifier',
                    position: { x: 850, y: 700 },
                    data: { title: 'Стиль 3', content: '', state: 'idle' },
                },
                {
                    id: 'image_1',
                    type: 'image',
                    position: { x: 1250, y: 100 },
                    data: {
                        title: 'Изображение 1',
                        state: 'idle',
                        settings: { model: 'seedream-4.5', resolution: 'square_hd' }
                    },
                },
                {
                    id: 'image_2',
                    type: 'image',
                    position: { x: 1250, y: 400 },
                    data: {
                        title: 'Изображение 2',
                        state: 'idle',
                        settings: { model: 'seedream-4.5', resolution: 'square_hd' }
                    },
                },
                {
                    id: 'image_3',
                    type: 'image',
                    position: { x: 1250, y: 700 },
                    data: {
                        title: 'Изображение 3',
                        state: 'idle',
                        settings: { model: 'seedream-4.5', resolution: 'square_hd' }
                    },
                },
            ],
            edges: [
                { id: 'e1', source: 'text_base', target: 'modifier_1' },
                { id: 'e2', source: 'text_base', target: 'modifier_2' },
                { id: 'e3', source: 'text_base', target: 'modifier_3' },
                { id: 'e4', source: 'text_styles', target: 'splitter_1' },
                { id: 'e5', source: 'splitter_1', target: 'modifier_1', sourceHandle: 'output-0' },
                { id: 'e6', source: 'splitter_1', target: 'modifier_2', sourceHandle: 'output-1' },
                { id: 'e7', source: 'splitter_1', target: 'modifier_3', sourceHandle: 'output-2' },
                { id: 'e8', source: 'modifier_1', target: 'image_1' },
                { id: 'e9', source: 'modifier_2', target: 'image_2' },
                { id: 'e10', source: 'modifier_3', target: 'image_3' },
            ],
        },
    },
    {
        id: 'ai-timelapse',
        name: 'AI Timelapse Pipeline',
        description: 'Таймлапс через ноды: Prompt → Photo (NB) → Photo (NB Edit) → Veo I2V',
        icon: Video,
        workflow: {
            version: '1.0',
            name: 'AI Timelapse Pipeline',
            nodes: [
                // Этап 1: Начало (Cinematic Macro)
                {
                    id: 'prompt_1',
                    type: 'text',
                    position: { x: 50, y: 50 },
                    data: {
                        title: '1. Рождение (Cinematic)',
                        content: 'Cinematic shot of a rose bud, early morning dew droplets, soft volumetric lighting, 8k resolution, macro photography, shallow depth of field, magical atmosphere',
                        state: 'idle'
                    },
                },
                {
                    id: 'photo_1',
                    type: 'image',
                    position: { x: 450, y: 50 },
                    data: {
                        title: 'Фото: Бутон (Flux)',
                        state: 'idle',
                        settings: { model: 'flux-2', resolution: 'landscape_hd' }
                    },
                },
                {
                    id: 'video_1',
                    type: 'video',
                    position: { x: 900, y: 50 },
                    data: {
                        title: 'Видео: Пробуждение (Hailuo)',
                        state: 'idle',
                        settings: { model: 'hailuo-2', duration: 6 }
                    },
                },

                // Этап 2: Расцвет (Peak Beauty)
                {
                    id: 'prompt_2',
                    type: 'text',
                    position: { x: 50, y: 550 },
                    data: {
                        title: '2. Расцвет (Vibrant)',
                        content: 'Cinematic shot of a fully blooming red rose, golden hour sunlight, vibrant velvet petals, highly detailed, photorealistic, premium nature documentary style',
                        state: 'idle'
                    },
                },
                {
                    id: 'photo_2',
                    type: 'image',
                    position: { x: 450, y: 550 },
                    data: {
                        title: 'Фото: Пик цветения',
                        state: 'idle',
                        settings: { model: 'flux-2', resolution: 'landscape_hd' }
                    },
                },
                {
                    id: 'video_2',
                    type: 'video',
                    position: { x: 900, y: 550 },
                    data: {
                        title: 'Видео: Цветение (Hailuo)',
                        state: 'idle',
                        settings: { model: 'hailuo-2', duration: 6 }
                    },
                },

                // Этап 3: Финал (Ethereal Decay)
                {
                    id: 'prompt_3',
                    type: 'text',
                    position: { x: 50, y: 1050 },
                    data: {
                        title: '3. Финал (Mystic)',
                        content: 'Cinematic shot of a withering rose, falling petals, dramatic twilight lighting, emotional atmosphere, dark background, ultra realistic 8k, slow motion feel',
                        state: 'idle'
                    },
                },
                {
                    id: 'photo_3',
                    type: 'image',
                    position: { x: 450, y: 1050 },
                    data: {
                        title: 'Фото: Увядание',
                        state: 'idle',
                        settings: { model: 'flux-2', resolution: 'landscape_hd' }
                    },
                },
                {
                    id: 'video_3',
                    type: 'video',
                    position: { x: 900, y: 1050 },
                    data: {
                        title: 'Видео: Финал (Hailuo)',
                        state: 'idle',
                        settings: { model: 'hailuo-2', duration: 6 }
                    },
                },
            ],
            edges: [
                // Прямой поток для каждого этапа
                { id: 'e1', source: 'prompt_1', target: 'photo_1' },
                { id: 'e2', source: 'photo_1', target: 'video_1' },

                { id: 'e3', source: 'prompt_2', target: 'photo_2' },
                { id: 'e4', source: 'photo_2', target: 'video_2' },

                { id: 'e5', source: 'prompt_3', target: 'photo_3' },
                { id: 'e6', source: 'photo_3', target: 'video_3' },
            ],
        },
    },
    {
        id: 'fashion-photoshoot',
        name: 'Fashion Photoshoot',
        description: 'Модель + Одежда → Фотосессия в разных позах → Апскейл',
        icon: ImageIcon,
        workflow: {
            version: '1.0',
            name: 'Fashion Photoshoot',
            nodes: [
                // Загрузка модели (Subject)
                {
                    id: 'subject_upload',
                    type: 'imageUpload',
                    position: { x: 50, y: 100 },
                    data: {
                        title: '📸 Фото модели (Subject)',
                        state: 'idle',
                        hint: 'Загрузите фото человека/модели. Лучше всего — портрет или фото в полный рост на нейтральном фоне.'
                    },
                },
                // Загрузка одежды (Outfit)
                {
                    id: 'outfit_upload',
                    type: 'imageUpload',
                    position: { x: 50, y: 350 },
                    data: {
                        title: '👗 Фото одежды (Outfit)',
                        state: 'idle',
                        hint: 'Загрузите фото одежды/аксессуаров которые нужно надеть на модель.'
                    },
                },
                // Промпт для фотосессии
                {
                    id: 'photoshoot_prompt',
                    type: 'text',
                    position: { x: 400, y: 180 },
                    data: {
                        title: '📝 Промпт фотосессии',
                        content: '💡 ПОДСКАЗКА: Опишите сцену фотосессии\n\nПример промпта:\n"Грид 2x2 с фото модели в разных позах.\nМодель одета в одежду с изображения 2.\nСтудийный белый фон, профессиональное освещение.\nКаждое фото — полный рост, разные позы.\nСтиль: высокая мода, editorial fashion."\n\n👆 Замените этот текст на свой промпт',
                        state: 'idle'
                    },
                },
                // Генерация грида поз
                {
                    id: 'pose_grid',
                    type: 'image',
                    position: { x: 750, y: 180 },
                    data: {
                        title: '🎨 Грид поз (4 варианта)',
                        state: 'idle',
                        settings: { model: 'gpt-image-1.5', resolution: 'square_hd' },
                        hint: 'Сюда придёт грид 2x2 с 4 разными позами модели в выбранной одежде.'
                    },
                },
                // Подсказка для выбора
                {
                    id: 'select_hint',
                    type: 'text',
                    position: { x: 1100, y: 100 },
                    data: {
                        title: '💡 Подсказка',
                        content: '⬅️ Выберите лучшее фото из грида\n\n1. Скачайте грид\n2. Обрежьте нужное фото\n3. Загрузите в ноду "Выбранное фото" ниже\n\nИли используйте внешний инструмент для обрезки',
                        state: 'idle'
                    },
                },
                // Загрузка выбранного фото
                {
                    id: 'selected_photo',
                    type: 'imageUpload',
                    position: { x: 1100, y: 320 },
                    data: {
                        title: '✅ Выбранное фото',
                        state: 'idle',
                        hint: 'Загрузите лучшее фото из грида (обрезанное) для финального апскейла.'
                    },
                },
                // Апскейл финала
                {
                    id: 'final_upscale',
                    type: 'image',
                    position: { x: 1450, y: 320 },
                    data: {
                        title: '⬆️ Финальный апскейл 4K',
                        state: 'idle',
                        settings: { model: 'gpt-image-1.5', resolution: 'landscape_hd' },
                        hint: 'Финальное изображение в высоком разрешении с сохранением деталей одежды и лица.'
                    },
                },
            ],
            edges: [
                // Модель и одежда → Промпт
                { id: 'e1', source: 'subject_upload', target: 'photoshoot_prompt' },
                { id: 'e2', source: 'outfit_upload', target: 'photoshoot_prompt' },
                // Промпт → Генерация грида
                { id: 'e3', source: 'photoshoot_prompt', target: 'pose_grid' },
                // Выбранное фото → Апскейл
                { id: 'e4', source: 'selected_photo', target: 'final_upscale' },
                // Модель → Апскейл (для reference лица)
                { id: 'e5', source: 'subject_upload', target: 'final_upscale' },
            ],
        },
    },
    {
        id: 'ugc-video',
        name: 'UGC Ролик для TikTok',
        description: 'Распаковка / обзор продукта в стиле UGC',
        icon: Users,
        workflow: {
            version: '1.0',
            name: 'UGC Ролик для TikTok',
            nodes: [
                // Комментарий секции
                {
                    id: 'comment_ugc',
                    type: 'comment',
                    position: { x: 80, y: 40 },
                    data: {
                        title: '📱 UGC: Распаковка для TikTok / Instagram',
                    },
                },
                // Промпт для UGC
                {
                    id: 'ugc_prompt',
                    type: 'text',
                    position: { x: 80, y: 120 },
                    data: {
                        title: 'UGC Промпт',
                        content: 'Девушка 25-30 лет делает распаковку косметики в стиле UGC для TikTok. На столе — баночка крема с золотистой крышкой. Она открывает коробку, достает баночку, показывает текстуру крема на руке. Мягкий естественный свет из окна, уютная домашняя атмосфера. Формат вертикальный 9:16, съемка на смартфон, живой и искренний стиль.',
                        state: 'idle',
                    },
                },
                // Генерация первого кадра
                {
                    id: 'ugc_image',
                    type: 'image',
                    position: { x: 450, y: 120 },
                    data: {
                        title: 'Первый кадр',
                        state: 'idle',
                        settings: {
                            model: 'gpt-image-1.5',
                            resolution: 'portrait_hd',
                        },
                    },
                },
                // Генерация видео
                {
                    id: 'ugc_video',
                    type: 'video',
                    position: { x: 820, y: 120 },
                    data: {
                        title: 'UGC Видео',
                        state: 'idle',
                        settings: {
                            model: 'sora-2',
                            resolution: 'portrait_hd',
                            duration: 5,
                        },
                    },
                },
                // Референс продукта
                {
                    id: 'comment_ref',
                    type: 'comment',
                    position: { x: 80, y: 320 },
                    data: {
                        title: '🖼️ Опционально: Загрузите фото продукта',
                    },
                },
                {
                    id: 'product_ref',
                    type: 'imageUpload',
                    position: { x: 80, y: 400 },
                    data: {
                        title: 'Фото продукта',
                        state: 'idle',
                    },
                },
            ],
            edges: [
                { id: 'e1', source: 'ugc_prompt', target: 'ugc_image' },
                { id: 'e2', source: 'ugc_image', target: 'ugc_video' },
                { id: 'e3', source: 'product_ref', target: 'ugc_image' },
            ],
        },
    },
    {
        id: 'product-video',
        name: 'Продуктовое Видео',
        description: 'Hero Shot продукта с кинематографичным движением',
        icon: ShoppingBag,
        workflow: {
            version: '1.0',
            name: 'Продуктовое Видео',
            nodes: [
                // Загрузка продукта
                {
                    id: 'product_upload',
                    type: 'imageUpload',
                    position: { x: 80, y: 200 },
                    data: {
                        title: '📸 Фото продукта',
                        state: 'idle',
                        hint: 'Загрузите качественное фото продукта на нейтральном фоне',
                    },
                },
                // Промпт сцены
                {
                    id: 'scene_prompt',
                    type: 'text',
                    position: { x: 80, y: 400 },
                    data: {
                        title: '🎬 Промпт сцены',
                        content: 'Hero shot продукта на глянцевой черной поверхности с отражением. Плавное круговое движение камеры вокруг продукта. Драматичное студийное освещение с мягкими бликами. Кинематографичная атмосфера премиум-бренда. 4K качество.',
                        state: 'idle',
                    },
                },
                // Генерация Hero Image
                {
                    id: 'hero_image',
                    type: 'image',
                    position: { x: 450, y: 280 },
                    data: {
                        title: '🖼️ Hero Image',
                        state: 'idle',
                        settings: {
                            model: 'gpt-image-1.5',
                            resolution: 'landscape_hd',
                        },
                    },
                },
                // Генерация видео
                {
                    id: 'hero_video',
                    type: 'video',
                    position: { x: 820, y: 280 },
                    data: {
                        title: '🎥 Product Video',
                        state: 'idle',
                        settings: {
                            model: 'veo-3.1',
                            resolution: 'landscape_hd',
                            duration: 5,
                        },
                    },
                },
                // Апскейл финала
                {
                    id: 'upscale_video',
                    type: 'generator',
                    position: { x: 1150, y: 280 },
                    data: {
                        title: '⬆️ Upscale 4K',
                        generationType: 'upscale',
                        state: 'idle',
                    },
                },
            ],
            edges: [
                { id: 'e1', source: 'product_upload', target: 'hero_image' },
                { id: 'e2', source: 'scene_prompt', target: 'hero_image' },
                { id: 'e3', source: 'hero_image', target: 'hero_video' },
                { id: 'e4', source: 'hero_video', target: 'upscale_video' },
            ],
        },
    },
];

export function WorkflowTemplates({ onClose }: WorkflowTemplatesProps) {
    const saveWorkflow = useStore(s => s.saveWorkflow);
    const loadWorkflow = useStore(s => s.loadWorkflow);
    const clearWorkflow = useStore(s => s.clearWorkflow);

    const [activeTab, setActiveTab] = useState<'templates' | 'saved'>('templates');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get saved workflows from localStorage
    const getSavedWorkflows = () => {
        try {
            const saved = localStorage.getItem('savedWorkflows');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    };

    const [savedWorkflows, setSavedWorkflows] = useState<SavedWorkflow[]>(getSavedWorkflows());

    const handleLoadTemplate = (template: typeof PRESET_TEMPLATES[0]) => {
        loadWorkflow(JSON.stringify(template.workflow));
        onClose();
    };

    const handleSaveCurrent = () => {
        const workflowJson = saveWorkflow();
        const workflow = JSON.parse(workflowJson);

        // Add to saved list
        const updated = [...savedWorkflows, { ...workflow, id: Date.now().toString() }];
        localStorage.setItem('savedWorkflows', JSON.stringify(updated));
        setSavedWorkflows(updated);
    };

    const handleExport = () => {
        const workflowJson = saveWorkflow();
        const blob = new Blob([workflowJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `workflow-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const json = event.target?.result as string;
            loadWorkflow(json);
            onClose();
        };
        reader.readAsText(file);
    };

    const handleDeleteSaved = (id: string) => {
        const updated = savedWorkflows.filter((w: SavedWorkflow) => w.id !== id);
        localStorage.setItem('savedWorkflows', JSON.stringify(updated));
        setSavedWorkflows(updated);
    };

    const handleClear = () => {
        if (confirm('Очистить текущий workflow?')) {
            clearWorkflow();
            onClose();
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-h-[80vh] glass-panel rounded-2xl shadow-2xl shadow-black/70 z-50 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Шаблоны Workflows</h2>
                        <p className="text-xs text-white/40">Создавайте, сохраняйте и загружайте workflows</p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-6 py-3 border-b border-white/5 flex gap-2">
                    <button
                        onClick={() => setActiveTab('templates')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'templates'
                            ? 'bg-accent-neon text-black'
                            : 'bg-white/5 text-white/70 hover:bg-white/10'
                            }`}
                    >
                        <Grid3X3 size={14} className="inline mr-2" />
                        Шаблоны
                    </button>
                    <button
                        onClick={() => setActiveTab('saved')}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'saved'
                            ? 'bg-accent-neon text-black'
                            : 'bg-white/5 text-white/70 hover:bg-white/10'
                            }`}
                    >
                        <FileJson size={14} className="inline mr-2" />
                        Сохранённые ({savedWorkflows.length})
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[400px] custom-scrollbar">
                    {activeTab === 'templates' && (
                        <div className="grid grid-cols-2 gap-3">
                            {PRESET_TEMPLATES.map(template => (
                                <button
                                    key={template.id}
                                    onClick={() => handleLoadTemplate(template)}
                                    className="p-4 bg-white/5 hover:bg-white/8 border border-white/5 hover:border-accent-neon/30 rounded-xl text-left transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-accent-neon/20 flex items-center justify-center mb-3 group-hover:bg-accent-neon/30 transition-colors">
                                        <template.icon size={20} className="text-accent-neon" />
                                    </div>
                                    <div className="text-sm font-medium text-white">{template.name}</div>
                                    <div className="text-xs text-white/40 mt-1">{template.description}</div>
                                </button>
                            ))}
                        </div>
                    )}

                    {activeTab === 'saved' && (
                        <div className="space-y-2">
                            {savedWorkflows.length === 0 ? (
                                <div className="text-center py-8 text-white/30">
                                    <FileJson size={32} className="mx-auto mb-2 opacity-50" />
                                    <div>Нет сохранённых workflows</div>
                                </div>
                            ) : (
                                savedWorkflows.map((workflow: SavedWorkflow) => (
                                    <div key={workflow.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl group">
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-white">{workflow.name}</div>
                                            <div className="text-xs text-white/40">
                                                {new Date(workflow.createdAt).toLocaleDateString('ru-RU')}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => { loadWorkflow(JSON.stringify(workflow)); onClose(); }}
                                            className="px-3 py-1.5 bg-accent-neon/20 text-accent-neon text-xs font-medium rounded-lg hover:bg-accent-neon/30 transition-colors"
                                        >
                                            Загрузить
                                        </button>
                                        <button
                                            onClick={() => handleDeleteSaved(workflow.id)}
                                            className="p-2 text-white/30 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Footer actions */}
                <div className="px-6 py-4 border-t border-white/5 flex items-center gap-2">
                    <button
                        onClick={handleSaveCurrent}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-sm text-white/80 flex items-center gap-2 transition-all"
                    >
                        <Download size={14} />
                        Сохранить текущий
                    </button>

                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-sm text-white/80 flex items-center gap-2 transition-all"
                    >
                        <FileJson size={14} />
                        Экспорт JSON
                    </button>

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-sm text-white/80 flex items-center gap-2 transition-all"
                    >
                        <Upload size={14} />
                        Импорт
                    </button>

                    <button
                        onClick={handleClear}
                        className="ml-auto px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-full text-sm text-red-400 flex items-center gap-2 transition-all"
                    >
                        <Trash2 size={14} />
                        Очистить
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                    />
                </div>
            </div>
        </>
    );
}
