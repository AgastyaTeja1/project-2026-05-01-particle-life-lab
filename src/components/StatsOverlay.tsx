import type { SimulationStats } from '../types';

interface StatsOverlayProps {
  stats: SimulationStats;
}

export default function StatsOverlay({ stats }: StatsOverlayProps) {
  const fpsColor =
    stats.fps >= 55 ? '#44ff88' : stats.fps >= 30 ? '#ffdd44' : '#ff4444';

  return (
    <div
      className="absolute top-3 left-3 z-10 flex gap-3"
      aria-live="polite"
      aria-label="Simulation statistics"
    >
      <Stat label="FPS" value={stats.fps.toString()} color={fpsColor} />
      <Stat label="PARTICLES" value={stats.particleCount.toLocaleString()} />
      <Stat label="MS/FRAME" value={stats.frameTime.toString()} />
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="glass-panel px-2.5 py-1.5 rounded-lg text-xs font-mono">
      <span className="text-white/40 mr-1.5">{label}</span>
      <span className="font-semibold" style={{ color: color ?? '#ffffff' }}>
        {value}
      </span>
    </div>
  );
}
