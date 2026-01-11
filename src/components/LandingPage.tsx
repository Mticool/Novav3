import { Github, Zap, Cpu, Sparkles, Layout, Play, Image as ImageIcon, Video, Wand2, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// --- Components for the Animation ---

const AnimatedNode = ({ type, x, y, delay, label }: { type: string, x: number, y: number, delay: number, label: string }) => {
    const iconMap: Record<string, any> = {
        text: Wand2,
        image: ImageIcon,
        video: Video,
        play: Play
    };
    const Icon = iconMap[type] || Sparkles;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, x, y }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.5, type: 'spring' }}
            className="absolute p-4 bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex items-center gap-3 z-10"
            style={{ width: 180 }}
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${type === 'video' ? 'bg-purple-500/20 text-purple-400' : type === 'image' ? 'bg-blue-500/20 text-blue-400' : 'bg-[#EFFE17]/20 text-[#EFFE17]'}`}>
                <Icon size={20} />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">{type}</span>
                <span className="text-xs font-semibold text-white/90 truncate">{label}</span>
            </div>
            {/* Connection partials */}
            <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#1a1a1a] border-2 border-white/20 rounded-full" />
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#1a1a1a] border-2 border-white/20 rounded-full" />
        </motion.div>
    );
};

const AnimatedConnection = ({ from, to, delay }: { from: { x: number, y: number }, to: { x: number, y: number }, delay: number }) => {
    // Path calculation
    const dx = to.x - from.x;
    const path = `M ${from.x + 180} ${from.y + 40} C ${from.x + 180 + dx / 2} ${from.y + 40}, ${from.x + 180 + dx / 2} ${to.y + 40}, ${to.x} ${to.y + 40}`;

    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <motion.path
                d={path}
                stroke="url(#grad)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay, duration: 1.5, ease: "easeInOut" }}
            />
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#white" stopOpacity="0.1" />
                    <stop offset="50%" stopColor="#EFFE17" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#EFFE17" stopOpacity="0.2" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export function LandingPage() {
    const setView = useStore((state) => state.setView);
    const clearWorkflow = useStore((state) => state.clearWorkflow);
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setStep(s => (s + 1) % 5);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const handleCreate = () => {
        clearWorkflow();
        setView('editor');
    };

    const features = [
        {
            icon: Zap,
            title: 'Интеллектуальные ноды',
            description: 'Каждая нода — это мини-приложение, которое знает свою роль в цепочке генерации.',
            color: 'text-yellow-400',
            bg: 'bg-yellow-400/10'
        },
        {
            icon: Layout,
            title: 'Визуальный холст',
            description: 'Стройте процессы создания контента так же просто, как рисуете схемы в Logic.',
            color: 'text-blue-400',
            bg: 'bg-blue-400/10'
        },
        {
            icon: Cpu,
            title: 'AI Масштабирование',
            description: 'От текста до 4K видео — объединяйте лучшие модели мира в один поток.',
            color: 'text-purple-400',
            bg: 'bg-purple-400/10'
        }
    ];

    return (
        <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col overflow-x-hidden selection:bg-[#EFFE17] selection:text-black">
            {/* Static Grid Background */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }}
            />

            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#EFFE17]/5 rounded-full blur-[150px]" />
            </div>

            {/* Navigation */}
            <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 group cursor-pointer"
                >
                    <div className="w-10 h-10 bg-[#EFFE17] rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300 shadow-[0_0_30px_rgba(239,254,23,0.3)]">
                        <Sparkles size={22} className="text-black" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter">novav<span className="text-[#EFFE17]">3</span></span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-8"
                >
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/50">
                        <a href="#" className="hover:text-[#EFFE17] transition-colors">Функции</a>
                        <a href="#" className="hover:text-[#EFFE17] transition-colors">Цены</a>
                        <a href="#" className="hover:text-[#EFFE17] transition-colors">Сообщество</a>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300 text-sm font-bold backdrop-blur-md"
                    >
                        Запустить
                    </button>
                </motion.div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-8 flex flex-col items-center">
                <div className="grid lg:grid-cols-2 gap-16 items-center w-full pt-12 lg:pt-24 min-h-[70vh]">

                    {/* Left: Content */}
                    <div className="flex flex-col text-center lg:text-left items-center lg:items-start z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFFE17]/10 border border-[#EFFE17]/20 mb-8"
                        >
                            <span className="w-2 h-2 rounded-full bg-[#EFFE17] animate-pulse" />
                            <span className="text-xs font-bold tracking-widest uppercase text-[#EFFE17]">Production Ready AI</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.9]"
                        >
                            Собери свой <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">Контент</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-white/50 mb-12 max-w-xl leading-relaxed font-medium"
                        >
                            Профессиональный холст для генеративного видеопродакшена. Объединяйте лучшие модели мира в визуальные цепочки и получайте результат за секунды.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center gap-6"
                        >
                            <button
                                onClick={handleCreate}
                                className="group relative px-10 py-5 bg-[#EFFE17] text-black font-black rounded-2xl transition-all duration-300 hover:scale-105 shadow-[0_0_50px_rgba(239,254,23,0.3)] flex items-center gap-3 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                <span>Начать бесплатно</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="flex items-center gap-3 px-8 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 font-bold backdrop-blur-md">
                                <Play size={18} fill="currentColor" />
                                <span>Смотреть демо</span>
                            </button>
                        </motion.div>
                    </div>

                    {/* Right: Animation */}
                    <div className="relative h-[500px] w-full hidden lg:block">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-[40px] border border-white/5 backdrop-blur-[2px] overflow-hidden">
                            {/* Animated Fake Canvas */}
                            <AnimatePresence>
                                <AnimatedNode type="text" x={50} y={100} delay={0.5} label="Cinematic Prompt" />
                                {step >= 1 && <AnimatedConnection from={{ x: 50, y: 100 }} to={{ x: 280, y: 50 }} delay={0} />}
                                {step >= 1 && <AnimatedNode type="image" x={280} y={50} delay={0.1} label="Character Design" />}

                                {step >= 2 && <AnimatedConnection from={{ x: 280, y: 50 }} to={{ x: 50, y: 250 }} delay={0} />}
                                {step >= 2 && <AnimatedNode type="image" x={50} y={250} delay={0.1} label="Environment" />}

                                {step >= 3 && <AnimatedConnection from={{ x: 50, y: 250 }} to={{ x: 280, y: 300 }} delay={0} />}
                                {step >= 3 && <AnimatedNode type="video" x={280} y={300} delay={0.1} label="Sora 2 Production" />}

                                {step >= 4 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        className="absolute right-10 bottom-10 w-[200px] aspect-video bg-[#EFFE17]/10 rounded-2xl border-2 border-[#EFFE17]/40 overflow-hidden shadow-[0_0_50px_rgba(239,254,23,0.2)] z-20 flex items-center justify-center group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                                            <span className="text-[10px] font-black text-white/90">Final Render.mp4</span>
                                        </div>
                                        <Play size={32} className="text-[#EFFE17] animate-pulse" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 blur-[80px] rounded-full animate-pulse" />
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                    </div>
                </div>

                {/* Proof Section */}
                <div className="w-full mt-24 mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Почему выбирают <span className="text-[#EFFE17]">novav3</span></h2>
                        <p className="text-white/40">Инструменты нового поколения для тех, кто ценит скорость и качество.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-10 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all duration-500 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className={`w-14 h-14 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10 shadow-lg`}>
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="text-xl font-black mb-4 relative z-10">{feature.title}</h3>
                                <p className="text-white/40 text-base leading-relaxed relative z-10 font-medium">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            {/* CTA Section */}
            <section className="relative z-10 bg-[#EFFE17] py-24 px-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-full bg-white/20 -skew-x-12 translate-x-[200px]" />
                <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
                    <h2 className="text-black text-5xl md:text-7xl font-black tracking-tight mb-8">
                        Готовы автоматизировать <br /> свое творчество?
                    </h2>
                    <button
                        onClick={handleCreate}
                        className="px-12 py-6 bg-black text-white font-black rounded-2xl text-xl hover:scale-105 transition-transform shadow-2xl"
                    >
                        Начать сейчас
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-20 px-8 bg-[#0a0a0a]">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <Sparkles size={24} className="text-[#EFFE17]" />
                            <span className="text-2xl font-black tracking-tighter">novav<span className="text-[#EFFE17]">3</span></span>
                        </div>
                        <p className="text-white/40 max-w-sm mb-8 leading-relaxed font-medium">
                            Новый стандарт создания AI контента. Профессиональный холст для медиа-продакшена будущего.
                        </p>
                        <div className="flex items-center gap-6">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#EFFE17] hover:text-black transition-all">
                                <Github size={20} />
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-black mb-6 uppercase text-xs tracking-widest text-[#EFFE17]">Продукт</h4>
                        <ul className="space-y-4 text-sm text-white/40 font-bold">
                            <li><a href="#" className="hover:text-white transition-colors">Функции</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Интеграции</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Обновления</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-black mb-6 uppercase text-xs tracking-widest text-[#EFFE17]">Компания</h4>
                        <ul className="space-y-4 text-sm text-white/40 font-bold">
                            <li><a href="#" className="hover:text-white transition-colors">О нас</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Блог</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-xs font-bold uppercase tracking-widest text-white/20">
                    <span>© 2026 Novav3 AI. Все права защищены.</span>
                    <div className="flex items-center gap-12">
                        <a href="#" className="hover:text-white transition-colors">Конфиденциальность</a>
                        <a href="#" className="hover:text-white transition-colors">Условия</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
