import { Github, Plus, Zap, Cpu, Sparkles, Layout } from 'lucide-react';
import { useStore } from '../store/useStore';

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
            title: 'Быстрая генерация',
            description: 'Создавайте изображения и видео за считанные секунды с помощью передовых AI моделей.',
            color: 'text-yellow-400',
            bg: 'bg-yellow-400/10'
        },
        {
            icon: Layout,
            title: 'Визуальные воркфлоу',
            description: 'Стройте сложные цепочки генерации с помощью интуитивного интерфейса узлов.',
            color: 'text-blue-400',
            bg: 'bg-blue-400/10'
        },
        {
            icon: Cpu,
            title: 'Мощные модели',
            description: 'Доступ к Kling, Sora 2, Flux и многим другим моделям в одном месте.',
            color: 'text-purple-400',
            bg: 'bg-purple-400/10'
        }
    ];

    return (
        <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col overflow-x-hidden selection:bg-[#EFFE17] selection:text-black">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-[#EFFE17]/5 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-10 h-10 bg-[#EFFE17] rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300 shadow-[0_0_20px_rgba(239,254,23,0.3)]">
                        <Sparkles size={22} className="text-black" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">nodaRoom <span className="text-[#EFFE17]">AI</span></span>
                </div>
                <div className="flex items-center gap-6">
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="text-white/60 hover:text-white transition-colors">
                        <Github size={20} />
                    </a>
                    <button
                        onClick={handleCreate}
                        className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300 text-sm font-medium backdrop-blur-md"
                    >
                        Войти
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-32 max-w-5xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <span className="w-2 h-2 rounded-full bg-[#EFFE17] animate-pulse" />
                    <span className="text-[10px] sm:text-xs font-medium tracking-wide uppercase text-white/70">Новое поколение видеопродакшена</span>
                </div>

                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    Творите магию <br />
                    <span className="text-[#EFFE17] relative">
                        с помощью AI
                        <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="#EFFE17" strokeWidth="2" fill="none" opacity="0.5" />
                        </svg>
                    </span>
                </h1>

                <p className="text-lg sm:text-xl text-white/50 mb-12 max-w-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                    Профессиональная платформа для создания видео и изображений. <br className="hidden sm:block" />
                    Стройте воркфлоу, объединяйте модели и получайте кинематографический результат.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
                    <button
                        onClick={handleCreate}
                        className="group relative px-8 py-4 bg-[#EFFE17] text-black font-bold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(239,254,23,0.4)] hover:shadow-[0_0_60px_rgba(239,254,23,0.6)]"
                    >
                        <div className="flex items-center gap-2">
                            <Plus size={20} />
                            <span>Создать воркфлоу</span>
                        </div>
                    </button>
                    <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300 font-medium backdrop-blur-md">
                        Посмотреть демо
                    </button>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-32 w-full animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-500">
                    {features.map((feature, idx) => (
                        <div key={idx} className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-300 text-left group">
                            <div className={`w-12 h-12 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                            <p className="text-white/40 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-12 px-8">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 opacity-50">
                        <Sparkles size={16} />
                        <span className="text-sm font-medium">© 2026 nodaRoom AI. Все права защищены.</span>
                    </div>
                    <div className="flex items-center gap-8 text-sm text-white/40">
                        <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
                        <a href="#" className="hover:text-white transition-colors">Условия использования</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
