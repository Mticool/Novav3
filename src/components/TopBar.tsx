import { useState } from 'react';
import { FolderOpen, HelpCircle, FilePlus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { WorkflowTemplates } from './WorkflowTemplates';
import { restartOnboarding } from './OnboardingTour';

export function TopBar() {
  const projectName = useStore((state) => state.projectName);
  const setProjectName = useStore((state) => state.setProjectName);
  const clearWorkflow = useStore((state) => state.clearWorkflow);

  const [showTemplates, setShowTemplates] = useState(false);

  const handleNewWorkflow = () => {
    if (confirm('Вы уверены? Текущий проект будет очищен.')) {
      clearWorkflow();
    }
  };

  return (
    <>
      {/* Templates Modal */}
      {showTemplates && <WorkflowTemplates onClose={() => setShowTemplates(false)} />}

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
        </div>
      </div>
    </>
  );
}
