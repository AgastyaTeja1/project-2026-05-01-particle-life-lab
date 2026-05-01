import type { SimulationConfig } from '../types';
import { clamp } from '../utils/color';

interface ControlPanelProps {
  config: SimulationConfig;
  onParamChange: (key: keyof SimulationConfig, value: number) => void;
  onCountChange: (typeIndex: number, value: number) => void;
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
}

function Slider({ label, value, min, max, step, unit = '', onChange }: SliderProps) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-mono">
        <span className="text-white/60">{label}</span>
        <span className="text-white/90 font-semibold">
          {value.toFixed(step < 1 ? 2 : 0)}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(clamp(parseFloat(e.target.value), min, max))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer
          bg-white/10 accent-white"
        aria-label={label}
      />
      <div className="flex justify-between text-[10px] text-white/20 font-mono">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

export default function ControlPanel({ config, onParamChange, onCountChange }: ControlPanelProps) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs text-white/40 font-mono uppercase tracking-widest mb-3">
          Physics
        </p>
        <div className="space-y-4">
          <Slider
            label="Max Radius"
            value={config.maxRadius}
            min={30}
            max={150}
            step={5}
            unit="px"
            onChange={(v) => onParamChange('maxRadius', v)}
          />
          <Slider
            label="Force Factor"
            value={config.forceFactor}
            min={0.5}
            max={5}
            step={0.1}
            onChange={(v) => onParamChange('forceFactor', v)}
          />
          <Slider
            label="Friction"
            value={config.friction}
            min={0}
            max={0.3}
            step={0.01}
            onChange={(v) => onParamChange('friction', v)}
          />
          <Slider
            label="Time Step"
            value={config.dt}
            min={0.2}
            max={3}
            step={0.1}
            onChange={(v) => onParamChange('dt', v)}
          />
        </div>
      </div>

      <div>
        <p className="text-xs text-white/40 font-mono uppercase tracking-widest mb-3">
          Particle Counts
        </p>
        <div className="space-y-3">
          {config.colors.slice(0, config.numTypes).map((color, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-white/60">Type {i}</span>
                </div>
                <span className="text-white/90 font-semibold">{config.counts[i]}</span>
              </div>
              <input
                type="range"
                min={0}
                max={200}
                step={10}
                value={config.counts[i]}
                onChange={(e) => onCountChange(i, parseInt(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10 accent-white"
                aria-label={`Count for type ${i}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
