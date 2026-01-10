import { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface OnboardingStep {
    title: string;
    description: string;
    target?: string; // CSS selector for element to highlight
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
    action?: string; // Optional action text
}

const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        title: '👋 Добро пожаловать!',
        description: 'Это визуальный редактор workflow для создания AI-контента. Соединяйте узлы для создания цепочек генерации изображений и видео.',
        position: 'center',
    },
    {
        title: '➕ Добавление узлов',
        description: 'Нажмите на кнопку "+" чтобы добавить узлы на canvas. Каждый узел выполняет свою функцию: ввод текста, генерация изображений, видео и т.д.',
        target: '.sidebar-add-button',
        position: 'right',
    },
    {
        title: '🎨 Canvas',
        description: 'Перетаскивайте узлы на холсте. Используйте колёсико мыши для масштабирования, или зажмите пробел и двигайте мышью для навигации.',
        position: 'center',
    },
    {
        title: '🔗 Соединение узлов',
        description: 'Соединяйте точки выхода (справа) с точками входа (слева) других узлов. Данные будут передаваться по этим связям.',
        position: 'center',
    },
    {
        title: '⚙️ Настройка узлов',
        description: 'Каждый узел имеет свои настройки. Выберите модель, параметры и нажмите кнопку Play для генерации.',
        position: 'center',
    },
    {
        title: '▶️ Запуск workflow',
        description: 'Нажмите "Run All" внизу экрана чтобы запустить весь workflow от начала до конца.',
        target: '.bottom-controls',
        position: 'top',
    },
    {
        title: '✨ Готово!',
        description: 'Используйте Библиотеку для быстрого доступа к узлам, Шаблоны для готовых примеров, и Историю для отслеживания действий. Удачи!',
        position: 'center',
        action: 'Начать работу',
    },
];

const ONBOARDING_KEY = 'nodav3_onboarding_completed';

export function OnboardingTour() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [cardPosition, setCardPosition] = useState({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });

    useEffect(() => {
        // Check if user has completed onboarding
        const completed = localStorage.getItem(ONBOARDING_KEY);
        if (!completed) {
            // Show onboarding after a short delay
            setTimeout(() => setIsVisible(true), 500);
        }
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const step = ONBOARDING_STEPS[currentStep];

        // Calculate position based on target element
        if (step.target) {
            const element = document.querySelector(step.target);
            if (element) {
                const rect = element.getBoundingClientRect();
                const cardWidth = 420;
                const cardHeight = 250; // approximate
                const spacing = 20;

                let top = '50%';
                let left = '50%';
                let transform = 'translate(-50%, -50%)';

                switch (step.position) {
                    case 'right':
                        top = `${rect.top + rect.height / 2}px`;
                        left = `${rect.right + spacing}px`;
                        transform = 'translateY(-50%)';
                        break;
                    case 'left':
                        top = `${rect.top + rect.height / 2}px`;
                        left = `${rect.left - cardWidth - spacing}px`;
                        transform = 'translateY(-50%)';
                        break;
                    case 'top':
                        top = `${rect.top - cardHeight - spacing}px`;
                        left = `${rect.left + rect.width / 2}px`;
                        transform = 'translateX(-50%)';
                        break;
                    case 'bottom':
                        top = `${rect.bottom + spacing}px`;
                        left = `${rect.left + rect.width / 2}px`;
                        transform = 'translateX(-50%)';
                        break;
                }

                setCardPosition({ top, left, transform });
            }
        } else {
            // Center position for non-targeted steps
            setCardPosition({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
        }
    }, [currentStep, isVisible]);

    const handleNext = () => {
        if (currentStep < ONBOARDING_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        localStorage.setItem(ONBOARDING_KEY, 'skipped');
        setIsVisible(false);
    };

    const handleComplete = () => {
        localStorage.setItem(ONBOARDING_KEY, 'completed');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    const step = ONBOARDING_STEPS[currentStep];
    const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] animate-in fade-in duration-300" />

            {/* Spotlight effect for targeted elements */}
            {step.target && (
                <style>{`
          ${step.target} {
            position: relative;
            z-index: 101 !important;
            box-shadow: 0 0 0 4px rgba(239, 254, 23, 0.3), 0 0 40px rgba(239, 254, 23, 0.4) !important;
            border-radius: 16px !important;
          }
        `}</style>
            )}

            {/* Tutorial Card */}
            <div
                className="fixed z-[102] glass-panel rounded-2xl shadow-2xl w-[420px] max-w-[90vw] animate-in slide-in-from-bottom duration-300"
                style={{
                    top: cardPosition.top,
                    left: cardPosition.left,
                    transform: cardPosition.transform,
                }}
            >
                {/* Progress bar */}
                <div className="h-1 bg-white/5 rounded-t-2xl overflow-hidden">
                    <div
                        className="h-full bg-accent-neon transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Close button */}
                    <button
                        onClick={handleSkip}
                        className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <X size={16} />
                    </button>

                    {/* Step indicator */}
                    <div className="mb-3 text-xs text-white/40">
                        Шаг {currentStep + 1} из {ONBOARDING_STEPS.length}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-white mb-3">{step.title}</h2>

                    {/* Description */}
                    <p className="text-sm text-white/70 leading-relaxed mb-6">{step.description}</p>

                    {/* Navigation */}
                    <div className="flex items-center gap-2">
                        {currentStep > 0 && (
                            <button
                                onClick={handleBack}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white/80 flex items-center gap-2 transition-colors"
                            >
                                <ArrowLeft size={14} />
                                Назад
                            </button>
                        )}

                        <button
                            onClick={handleSkip}
                            className="px-4 py-2 rounded-lg text-sm text-white/50 hover:text-white/80 transition-colors"
                        >
                            Пропустить
                        </button>

                        <button
                            onClick={handleNext}
                            className="ml-auto px-6 py-2 btn-neon rounded-lg text-sm font-medium flex items-center gap-2"
                        >
                            {step.action || (currentStep < ONBOARDING_STEPS.length - 1 ? 'Далее' : 'Завершить')}
                            {currentStep < ONBOARDING_STEPS.length - 1 ? (
                                <ArrowRight size={14} />
                            ) : (
                                <Check size={14} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Dots indicator */}
                <div className="px-6 pb-4 flex items-center justify-center gap-1.5">
                    {ONBOARDING_STEPS.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentStep(index)}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${index === currentStep
                                    ? 'w-6 bg-accent-neon'
                                    : index < currentStep
                                        ? 'bg-accent-neon/50'
                                        : 'bg-white/20'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

// Function to restart onboarding
export function restartOnboarding() {
    localStorage.removeItem(ONBOARDING_KEY);
    window.location.reload();
}
