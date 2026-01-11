import { Github, Zap, Cpu, Sparkles, Layout, Play, ArrowRight, Layers, MousePointer2, Share2, Globe, Shield, FastForward } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { ReactFlowProvider } from '@xyflow/react';
import { HeroCanvas } from './HeroCanvas';

export function LandingPage() {
    const setView = useStore((state) => state.setView);
    const clearWorkflow = useStore((state) => state.clearWorkflow);

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

    const steps = [
        {
            num: '01',
            title: 'Создайте схему',
            desc: 'Добавьте ноды для текста, изображений и камер. Соедините их простым перетаскиванием.'
        },
        {
            num: '02',
            title: 'Выберите модели',
            desc: 'Используйте Sora 2, Kling или Flux для достижения нужного качества и стиля.'
        },
        {
            num: '03',
            title: 'Рендерите в 4K',
            desc: 'Запустите процесс и получите готовый медиа-контент профессионального уровня за минуты.'
        }
    ];

    const capabilities = [
        { icon: Layers, title: 'Multi-layering', desc: 'Наслоение эффектов и стилей через цепочки модификаторов.' },
        { icon: MousePointer2, title: 'Real-time Controls', desc: 'Мгновенное изменение параметров без перезагрузки всей схемы.' },
        { icon: Share2, title: 'Collaboration', desc: 'Делитесь готовыми воркфлоу с командой в один клик.' },
        { icon: Globe, title: 'API Driven', desc: 'Полная интеграция с вашей инфраструктурой через гибкий API.' },
        { icon: Shield, title: 'Enterprise Privacy', desc: 'Ваши данные и генерации защищены по высшим стандартам.' },
        { icon: FastForward, title: 'Speed of Light', desc: 'Оптимизировано для минимальной задержки между идеей и финалом.' }
    ];

    return (
        <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col overflow-x-hidden selection:bg-[#EFFE17] selection:text-black">
            {/* Background */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }}
            />
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#EFFE17]/5 rounded-full blur-[150px]" />
            </div>

            {/* Navigation */}
            <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-[1400px] mx-auto w-full">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-10 h-10 bg-[#EFFE17] rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300 shadow-[0_0_30px_rgba(239,254,23,0.3)]">
                        <Sparkles size={22} className="text-black" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter">novav<span className="text-[#EFFE17]">3</span></span>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-12">
                    <div className="hidden lg:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-white/50">
                        <a href="#features" className="hover:text-[#EFFE17] transition-colors">Функции</a>
                        <a href="#workflow" className="hover:text-[#EFFE17] transition-colors">Воркфлоу</a>
                        <a href="#models" className="hover:text-[#EFFE17] transition-colors">Модели</a>
                    </div>
                    <button onClick={handleCreate} className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300 text-xs font-black uppercase tracking-widest backdrop-blur-md">
                        Войти в систему
                    </button>
                </motion.div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex-1 max-w-[1400px] mx-auto w-full px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center w-full pt-12 lg:pt-24 min-h-[85vh]">
                    <div className="flex flex-col text-center lg:text-left items-center lg:items-start z-10">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFFE17]/10 border border-[#EFFE17]/20 mb-8">
                            <span className="w-2 h-2 rounded-full bg-[#EFFE17] animate-pulse" />
                            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#EFFE17]">Advanced Production Engine</span>
                        </motion.div>

                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl sm:text-7xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.85]">
                            Будущее <br />
                            <span className="text-white relative">Медиа <span className="absolute -right-8 top-0 text-[#EFFE17] text-4xl">★</span></span>
                        </motion.h1>

                        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-white/40 mb-12 max-w-xl leading-relaxed font-bold">
                            Профессиональный визуальный редактор для создания AI-контента. От текста до кинематографичного 4K видео в одном окне.
                        </motion.p>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center gap-6">
                            <button onClick={handleCreate} className="group relative px-10 py-5 bg-[#EFFE17] text-black font-black rounded-[20px] transition-all duration-300 hover:scale-105 shadow-[0_0_50px_rgba(239,254,23,0.3)] flex items-center gap-3">
                                <span>Запустить воркфлоу</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="flex items-center gap-3 px-8 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[20px] transition-all duration-300 font-black text-xs uppercase tracking-widest backdrop-blur-md">
                                <Play size={16} fill="currentColor" />
                                <span>Демо ролик</span>
                            </button>
                        </motion.div>
                    </div>

                    <div className="relative h-[600px] w-full hidden lg:block rounded-[40px] border border-white/5 bg-[#080808]/50 overflow-hidden shadow-2xl">
                        <ReactFlowProvider>
                            <HeroCanvas />
                        </ReactFlowProvider>
                    </div>
                </div>

                {/* Features Section */}
                <section id="features" className="w-full mt-40">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="p-12 rounded-[40px] bg-[#0A0A0A] border border-white/5 hover:border-white/20 transition-all duration-500 group">
                                <div className={`w-16 h-16 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                    <feature.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{feature.title}</h3>
                                <p className="text-white/40 text-lg leading-relaxed font-bold">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Workflow Steps */}
                <section id="workflow" className="w-full mt-60 py-20">
                    <div className="flex flex-col lg:flex-row gap-20 items-center">
                        <div className="lg:w-1/2">
                            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter mb-12">Как это работает</h2>
                            <div className="space-y-12">
                                {steps.map((step, i) => (
                                    <div key={i} className="flex gap-8 group">
                                        <div className="text-4xl font-black text-[#EFFE17] opacity-20 group-hover:opacity-100 transition-opacity leading-none pt-1">
                                            {step.num}
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-black mb-3 uppercase tracking-tight">{step.title}</h4>
                                            <p className="text-white/40 text-lg font-bold">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2 p-2 bg-[#121212] border border-white/10 rounded-[40px] shadow-2xl">
                            <div className="aspect-video bg-black rounded-[32px] overflow-hidden flex items-center justify-center group relative">
                                <img src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1200&q=80" alt="Workflow Tool" className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                <div className="absolute w-20 h-20 bg-[#EFFE17] rounded-full flex items-center justify-center text-black shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                                    <Play size={32} fill="currentColor" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Capabilities Grid */}
                <section className="w-full mt-60 mb-60">
                    <div className="text-center mb-32">
                        <h2 className="text-5xl lg:text-8xl font-black tracking-tighter mb-8 italic">Технологии будущего</h2>
                        <p className="text-white/40 text-xl font-bold max-w-2xl mx-auto italic">Максимальная мощь в ваших руках. Никаких ограничений, только чистое творчество.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                        {capabilities.map((cap, idx) => (
                            <div key={idx} className="flex flex-col">
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#EFFE17] mb-6">
                                    <cap.icon size={24} />
                                </div>
                                <h4 className="text-xl font-black uppercase tracking-tight mb-4">{cap.title}</h4>
                                <p className="text-white/30 font-bold leading-relaxed">{cap.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Final CTA */}
            <section className="relative z-10 w-full px-8 py-40 overflow-hidden text-center bg-[#EFFE17]">
                <div className="max-w-[1400px] mx-auto flex flex-col items-center">
                    <h2 className="text-black text-6xl md:text-9xl font-black tracking-tighter mb-12 leading-[0.85]">
                        НАЧНИ СОЗДАВАТЬ <br /> ПРЯМО СЕЙЧАС
                    </h2>
                    <button onClick={handleCreate} className="group px-12 py-8 bg-black text-white font-black rounded-[24px] text-2xl hover:scale-105 active:scale-95 transition-all shadow-4xl flex items-center gap-6">
                        <span>ВОЙТИ В СИСТЕМУ</span>
                        <ArrowRight size={32} />
                    </button>
                    <div className="mt-12 text-black/40 text-xs font-black uppercase tracking-widest">
                        FREE ACCESS DURING BETA • PRODUCTION READY • NO CREDIT CARD REQUIRED
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 bg-[#050505] border-t border-white/5 pt-32 pb-20 px-8">
                <div className="max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
                        <div className="col-span-2">
                            <div className="flex items-center gap-2 mb-8">
                                <Sparkles size={32} className="text-[#EFFE17]" />
                                <span className="text-3xl font-black tracking-tighter italic">novav<span className="text-[#EFFE17]">3</span></span>
                            </div>
                            <p className="text-white/30 text-lg font-bold max-w-sm leading-relaxed mb-12 italic">
                                Мы строим самый мощный визуальный движок для AI-продакшена. Революция контента начинается здесь.
                            </p>
                            <div className="flex gap-6">
                                <a href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-[#EFFE17] hover:text-black transition-all">
                                    <Github size={24} />
                                </a>
                                <a href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-[#EFFE17] hover:text-black transition-all">
                                    <Sparkles size={24} />
                                </a>
                            </div>
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#EFFE17] mb-10">Продукт</h5>
                            <ul className="space-y-6 text-sm font-black uppercase tracking-widest text-white/50">
                                <li><a href="#" className="hover:text-white transition-colors">Функции</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Модели</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#EFFE17] mb-10">Компания</h5>
                            <ul className="space-y-6 text-sm font-black uppercase tracking-widest text-white/50">
                                <li><a href="#" className="hover:text-white transition-colors">О нас</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Карьера</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                        <span>© 2026 NOVAV3 TECHNOLOGY. ALL RIGHTS RESERVED.</span>
                        <div className="flex gap-12">
                            <a href="#" className="hover:text-white transition-colors">PRIVACY POLICY</a>
                            <a href="#" className="hover:text-white transition-colors">TERMS OF SERVICE</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
