import { useState } from 'react';
import { FolderOpen, Key, HelpCircle, FilePlus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { WorkflowTemplates } from './WorkflowTemplates';
import { restartOnboarding } from './OnboardingTour';

export function TopBar() {
  const projectName = useStore((state) => state.projectName);
  const setProjectName = useStore((state) => state.setProjectName);
  const clearWorkflow = useStore((state) => state.clearWorkflow);

  const [showTemplates, setShowTemplates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleNewWorkflow = () => {
    if (confirm('Вы уверены? Текущий проект будет очищен.')) {
      clearWorkflow();
    }
  };

  return (
    <>
      {/* Templates Modal */}
      {showTemplates && <WorkflowTemplates onClose={() => setShowTemplates(false)} />}

      {/* Settings Modal */}
      {showSettings && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setShowSettings(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] glass-panel rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Настройки API</h2>
              <button onClick={() => setShowSettings(false)} className="text-white/50 hover:text-white">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-white/50 mb-2">OpenAI API Key</label>
                <input
                  type="password"
                  defaultValue={localStorage.getItem('openai_api_key') || ''}
                  onChange={(e) => localStorage.setItem('openai_api_key', e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  placeholder="sk-..."
                />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-2">Kie.ai API Key</label>
                <input
                  type="password"
                  defaultValue={localStorage.getItem('kie_api_key') || ''}
                  onChange={(e) => localStorage.setItem('kie_api_key', e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                  placeholder="kie_..."
                />
              </div>
              <button
                onClick={() => { window.location.reload(); }}
                className="w-full py-2 bg-accent-neon text-black font-medium rounded-lg text-sm"
              >
                Сохранить и перезагрузить
              </button>
            </div>
          </div>
        </>
      )}

      <div className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-6 z-20 glass-panel border-t-0 border-l-0 border-r-0">
        {/* Левая часть: название проекта */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-transparent text-sm font-medium text-white outline-none hover:bg-white/5 px-3 py-1.5 rounded-full transition-colors"
            placeholder="Введите название проекта"
          />
        </div>

        {/* Правая часть: кнопки */}
        <div className="flex items-center gap-2">
          {/* New Workflow button */}
          <button
            onClick={handleNewWorkflow}
            className="px-4 py-2 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-sm text-accent-blue flex items-center gap-2 hover:bg-accent-blue/20 transition-all font-medium"
          >
            <FilePlus size={16} />
            <span>Новый</span>
          </button>

          {/* Templates button */}
          <button
            onClick={() => setShowTemplates(true)}
            className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-sm text-white/80 flex items-center gap-2 hover:bg-white/8 hover:border-white/10 transition-all"
          >
            <FolderOpen size={16} />
            <span>Шаблоны</span>
          </button>

          {/* Help/Tutorial button */}
          <button
            onClick={restartOnboarding}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/5 text-white/80 hover:bg-white/8 hover:border-white/10 transition-all flex items-center justify-center"
            title="Показать туториал"
          >
            <HelpCircle size={16} />
          </button>

          {/* API Settings button */}
          <button
            onClick={() => setShowSettings(true)}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/5 text-white/80 hover:bg-white/8 hover:border-white/10 transition-all flex items-center justify-center"
            title="Настройки API"
          >
            <Key size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
