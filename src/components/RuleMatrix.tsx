import { useCallback } from 'react';
import { motion } from 'framer-motion';
import type { SimulationConfig } from '../types';
import { ruleToColor } from '../utils/color';

interface RuleMatrixProps {
  config: SimulationConfig;
  onRuleChange: (i: number, j: number, value: number) => void;
}

const RULE_STEPS = [-1, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 1];

function nextStep(current: number): number {
  const idx = RULE_STEPS.findIndex((s) => Math.abs(s - current) < 0.1);
  return RULE_STEPS[(idx + 1) % RULE_STEPS.length];
}

function prevStep(current: number): number {
  const idx = RULE_STEPS.findIndex((s) => Math.abs(s - current) < 0.1);
  return RULE_STEPS[(idx - 1 + RULE_STEPS.length) % RULE_STEPS.length];
}

export default function RuleMatrix({ config, onRuleChange }: RuleMatrixProps) {
  const { numTypes, colors, rules } = config;

  const handleClick = useCallback(
    (i: number, j: number) => {
      const current = rules[i]?.[j] ?? 0;
      onRuleChange(i, j, nextStep(current));
    },
    [rules, onRuleChange]
  );

  const handleRightClick = useCallback(
    (e: React.MouseEvent, i: number, j: number) => {
      e.preventDefault();
      const current = rules[i]?.[j] ?? 0;
      onRuleChange(i, j, prevStep(current));
    },
    [rules, onRuleChange]
  );

  return (
    <div>
      <p className="text-xs text-white/40 font-mono uppercase tracking-widest mb-3">
        Interaction Rules
      </p>
      <p className="text-[11px] text-white/30 mb-3 leading-relaxed">
        Click to increase · Right-click to decrease · Green = attract · Red = repel
      </p>

      <div className="overflow-auto">
        <table className="border-collapse text-center" style={{ fontSize: 10 }}>
          <thead>
            <tr>
              <th className="w-6 h-6" />
              {colors.slice(0, numTypes).map((c, j) => (
                <th key={j} className="w-8 h-6 pb-1">
                  <span
                    className="inline-block w-3 h-3 rounded-full mx-auto"
                    style={{ backgroundColor: c }}
                    title={`Type ${j}`}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rules.slice(0, numTypes).map((row, i) => (
              <tr key={i}>
                <td className="pr-1">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors[i] }}
                    title={`Type ${i}`}
                  />
                </td>
                {row.slice(0, numTypes).map((val, j) => (
                  <td key={j} className="p-0.5">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => handleClick(i, j)}
                      onContextMenu={(e) => handleRightClick(e, i, j)}
                      className="w-7 h-7 rounded font-mono text-[9px] font-semibold transition-all duration-150 cursor-pointer border border-white/10 hover:border-white/30"
                      style={{
                        backgroundColor: ruleToColor(val),
                        color: Math.abs(val) > 0.4 ? '#000' : '#fff',
                      }}
                      title={`${colors[i]} → ${colors[j]}: ${val.toFixed(2)}`}
                      aria-label={`Force from type ${j} on type ${i}: ${val.toFixed(2)}`}
                    >
                      {val.toFixed(1)}
                    </motion.button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full" style={{
          background: 'linear-gradient(to right, rgba(255,68,68,0.8), rgba(100,100,120,0.4), rgba(68,255,120,0.8))'
        }} />
        <div className="flex justify-between text-[10px] text-white/30 font-mono w-full -mt-1">
          <span>-1 repel</span>
          <span>0</span>
          <span>+1 attract</span>
        </div>
      </div>

      <button
        onClick={() => {
          for (let i = 0; i < numTypes; i++) {
            for (let j = 0; j < numTypes; j++) {
              onRuleChange(i, j, Math.round((Math.random() * 2 - 1) * 4) / 4);
            }
          }
        }}
        className="mt-3 w-full py-1.5 rounded-lg text-xs font-mono border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all active:scale-95"
      >
        🎲 Randomize Rules
      </button>
    </div>
  );
}
