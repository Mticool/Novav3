import { memo, useState } from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';

interface ApiKeyPromptProps {
  onSave: (openaiKey: string, kieKey: string) => void;
}

export const ApiKeyPrompt = memo(({ onSave }: ApiKeyPromptProps) => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [kieKey, setKieKey] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const handleSave = () => {
    if (!kieKey.trim()) {
      alert('Kie.ai API key is required!');
      return;
    }
    onSave(openaiKey.trim(), kieKey.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in">
      <div className="w-full max-w-md bg-[#1a1a1a] rounded-2xl shadow-2xl shadow-blue-500/20 border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">API Keys Required</h2>
              <p className="text-xs text-white/50">Powered by Kie.ai - Multi-Model AI</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Info Banner */}
          <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
            <AlertCircle size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-300/90 leading-relaxed">
              Your API keys are stored <span className="font-semibold">locally in your browser</span> and never sent to any server except the official AI providers.
            </div>
          </div>

          {/* Kie.ai Key (Required) */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-white">
              <span>Kie.ai API Key</span>
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-semibold rounded">REQUIRED</span>
              <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-purple-300 text-[10px] font-semibold rounded">NEW</span>
            </label>
            <input
              type="password"
              value={kieKey}
              onChange={(e) => setKieKey(e.target.value)}
              placeholder="kie_xxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
            <p className="text-xs text-white/40">
              Get your key at <a href="https://kie.ai/dashboard/keys" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline">kie.ai/dashboard/keys</a>
            </p>
            <div className="mt-2 p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded text-xs text-white/60">
              <div className="font-semibold text-purple-300 mb-1">✨ Kie.ai includes:</div>
              <div className="space-y-0.5 text-[11px]">
                <div>• <span className="text-blue-300">Gemini 2.5 Flash</span> - Ultra-fast image generation</div>
                <div>• <span className="text-green-300">FLUX 1-Dev</span> - High quality images</div>
                <div>• <span className="text-yellow-300">Veo 3.1</span> - Cinematic video</div>
                <div>• <span className="text-pink-300">Kling v2.6</span> - Realistic video</div>
                <div>• <span className="text-orange-300">Hailuo 2.3</span> - Character-focused video</div>
              </div>
            </div>
          </div>

          {/* OpenAI Key (Optional) */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-white">
              <span>OpenAI API Key</span>
              <span className="px-2 py-0.5 bg-white/10 text-white/50 text-[10px] font-semibold rounded">OPTIONAL</span>
            </label>
            <input
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/30 outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all"
            />
            <p className="text-xs text-white/40">
              Only needed for "Enhance Prompt" feature. Get at <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 underline">platform.openai.com</a>
            </p>
          </div>

          {/* Additional Info Toggle */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-xs text-white/50 hover:text-white/70 underline transition-colors"
          >
            {showInfo ? 'Hide' : 'Show'} model details
          </button>

          {showInfo && (
            <div className="p-3 bg-white/5 rounded-lg text-xs text-white/60 space-y-2">
              <div className="font-semibold text-white/80 mb-1">🎨 Image Models:</div>
              <div className="space-y-1 ml-2">
                <div>• <span className="font-semibold text-blue-400">Gemini Flash</span> - 2-3s generation</div>
                <div>• <span className="font-semibold text-green-400">FLUX Dev</span> - Balanced quality/speed</div>
                <div>• <span className="font-semibold text-purple-400">SeeDream</span> - Character consistency</div>
              </div>
              <div className="font-semibold text-white/80 mb-1 mt-2">🎬 Video Models:</div>
              <div className="space-y-1 ml-2">
                <div>• <span className="font-semibold text-yellow-400">Veo 3.1</span> - Cinematic quality</div>
                <div>• <span className="font-semibold text-pink-400">Kling v2.6</span> - Photorealistic</div>
                <div>• <span className="font-semibold text-orange-400">Hailuo 2.3</span> - Character focus</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#151515] border-t border-white/10 flex gap-3">
          <button
            onClick={handleSave}
            disabled={!kieKey.trim()}
            className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-blue-600/30 disabled:to-purple-600/30 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-white shadow-lg shadow-purple-600/20 transition-all"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
});

ApiKeyPrompt.displayName = 'ApiKeyPrompt';
