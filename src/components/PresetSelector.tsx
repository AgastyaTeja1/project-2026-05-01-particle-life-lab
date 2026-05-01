import { motion } from 'framer-motion';
import type { Preset } from '../types';
import { PRESETS } from '../simulation/presets';

interface PresetSelectorProps {
  activePreset: string;
  onSelect: (preset: Preset) => void;
}

export default function PresetSelector({ activePreset, onSelect }: PresetSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-white/40 font-mono uppercase tracking-widest mb-3">
        Select a Life Form
      </p>
      {PRESETS.map((preset, i) => (
        <motion.button
          key={preset.name}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          onClick={() => onSelect(preset)}
          className={`
            w-full text-left px-3 py-2.5 rounded-xl border transition-all duration-200
            flex items-start gap-3 group
            ${
              activePreset === preset.name
                ? 'border-white/30 bg-white/10 shadow-lg'
                : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20'
            }
          `}
          aria-pressed={activePreset === preset.name}
        >
          <span className="text-xl leading-none mt-0.5 shrink-0">{preset.icon}</span>
          <div>
            <div className="font-semibold text-sm text-white/90 font-mono">{preset.name}</div>
            <div className="text-xs text-white/40 mt-0.5 leading-snug">{preset.description}</div>
            <div className="flex gap-1 mt-1.5">
              {preset.config.colors.slice(0, preset.config.numTypes).map((c, j) => (
                <span
                  key={j}
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: c }}
                  aria-hidden="true"
                />
              ))}
              <span className="text-[10px] text-white/30 ml-1 font-mono">
                {preset.config.counts.slice(0, preset.config.numTypes).reduce((a, b) => a + b, 0)} particles
              </span>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
