import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Preset, SimulationConfig, TabId } from './types';
import StatsOverlay from './components/StatsOverlay';
import ControlPanel from './components/ControlPanel';
import RuleMatrix from './components/RuleMatrix';
import PresetSelector from './components/PresetSelector';
import { DEFAULT_CONFIG, randomPresetConfig } from './simulation/presets';
import { useSimulation } from './hooks/useSimulation';
import { getShareUrl, loadConfigFromUrl } from './utils/url';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'presets', label: 'Presets', icon: '✦' },
  { id: 'rules', label: 'Rules', icon: '⊞' },
  { id: 'controls', label: 'Physics', icon: '⚙' },
];

export default function App() {
  const [config, setConfig] = useState<SimulationConfig>(() => {
    const fromUrl = loadConfigFromUrl();
    return fromUrl ?? DEFAULT_CONFIG;
  });
  const [activePreset, setActivePreset] = useState<string>(() => {
    const fromUrl = loadConfigFromUrl();
    return fromUrl ? '' : 'Rainbow';
  });
  const [isPaused, setIsPaused] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('presets');
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [copyMsg, setCopyMsg] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { stats, reset } = useSimulation(canvasRef, config, isPaused);

  const handlePresetSelect = useCallback((preset: Preset) => {
    setConfig((prev) => ({ ...preset.config, dt: prev.dt }));
    setActivePreset(preset.name);
  }, []);

  const handleRuleChange = useCallback((i: number, j: number, value: number) => {
    setConfig((prev) => {
      const rules = prev.rules.map((row) => [...row]);
      rules[i][j] = value;
      return { ...prev, rules };
    });
    setActivePreset('');
  }, []);

  const handleParamChange = useCallback((key: keyof SimulationConfig, value: number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleCountChange = useCallback((typeIndex: number, value: number) => {
    setConfig((prev) => {
      const counts = [...prev.counts];
      counts[typeIndex] = value;
      return { ...prev, counts };
    });
    setActivePreset('');
  }, []);

  const handleRandomize = useCallback(() => {
    setConfig((prev) => {
      const next = randomPresetConfig(prev.numTypes, prev.colors);
      return { ...next, dt: prev.dt };
    });
    setActivePreset('');
  }, []);

  const handleShare = useCallback(async () => {
    const url = getShareUrl(config);
    try {
      await navigator.clipboard.writeText(url);
      setCopyMsg('Copied!');
    } catch {
      setCopyMsg('Failed');
    }
    setTimeout(() => setCopyMsg(''), 2000);
  }, [config]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
      if (e.key === 'r' || e.key === 'R') reset();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [reset]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      {/* Simulation canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-label="Particle life simulation"
      />

      {/* Stats */}
      <StatsOverlay stats={stats} />

      {/* Pause banner */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <div className="glass-panel px-6 py-3 rounded-2xl text-2xl font-mono font-bold text-white/80">
              ⏸ PAUSED
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="absolute top-3 right-3 z-20 flex gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsPaused((p) => !p)}
          className="glass-panel w-9 h-9 rounded-xl flex items-center justify-center text-sm
            hover:bg-white/20 transition-all"
          title={isPaused ? 'Resume (Space)' : 'Pause (Space)'}
          aria-label={isPaused ? 'Resume simulation' : 'Pause simulation'}
        >
          {isPaused ? '▶' : '⏸'}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={reset}
          className="glass-panel w-9 h-9 rounded-xl flex items-center justify-center text-base
            hover:bg-white/20 transition-all"
          title="Reset (R)"
          aria-label="Reset particles"
        >
          ↺
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleRandomize}
          className="glass-panel w-9 h-9 rounded-xl flex items-center justify-center
            hover:bg-white/20 transition-all"
          title="Randomize rules"
          aria-label="Randomize rules"
        >
          🎲
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleShare}
          className="glass-panel px-3 h-9 rounded-xl flex items-center gap-1.5 text-xs font-mono
            hover:bg-white/20 transition-all"
          title="Share"
          aria-label="Copy share link"
        >
          {copyMsg || '🔗 Share'}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsPanelOpen((p) => !p)}
          className="glass-panel w-9 h-9 rounded-xl flex items-center justify-center
            hover:bg-white/20 transition-all"
          title="Toggle panel"
          aria-label={isPanelOpen ? 'Close panel' : 'Open panel'}
        >
          {isPanelOpen ? '✕' : '⊞'}
        </motion.button>
      </div>

      {/* Side panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.aside
            initial={{ x: 290, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 290, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="absolute top-0 right-0 h-full w-72 z-10 flex flex-col"
            aria-label="Control panel"
          >
            <div className="glass-panel h-full flex flex-col border-l border-white/10">
              {/* Header */}
              <div className="px-4 pt-4 pb-3 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🧬</span>
                  <h1 className="font-mono font-bold text-sm text-white/90">Particle Life Lab</h1>
                </div>
                <p className="text-[11px] text-white/30 font-mono mt-0.5">
                  {activePreset || 'Custom'} · {config.numTypes} types · {stats.particleCount} particles
                </p>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/10 shrink-0" role="tablist">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    className={`flex-1 py-2 text-xs font-mono flex items-center justify-center gap-1
                      transition-all
                      ${activeTab === tab.id
                        ? 'text-white border-b-2 border-white/60'
                        : 'text-white/40 hover:text-white/70'
                      }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 min-h-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.12 }}
                  >
                    {activeTab === 'presets' && (
                      <PresetSelector activePreset={activePreset} onSelect={handlePresetSelect} />
                    )}
                    {activeTab === 'rules' && (
                      <RuleMatrix config={config} onRuleChange={handleRuleChange} />
                    )}
                    {activeTab === 'controls' && (
                      <ControlPanel
                        config={config}
                        onParamChange={handleParamChange}
                        onCountChange={handleCountChange}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-white/10 text-[10px] text-white/20 font-mono shrink-0">
                Space: pause · R: reset · click rules to edit
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Bottom hint when panel is closed */}
      <AnimatePresence>
        {!isPanelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 glass-panel px-4 py-2 rounded-xl
              text-xs font-mono text-white/40 pointer-events-none z-10"
          >
            🧬 {activePreset || 'Custom'} · {stats.particleCount} particles · {stats.fps} fps
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
