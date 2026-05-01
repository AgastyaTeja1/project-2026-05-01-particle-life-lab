export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: number;
}

export interface SimulationConfig {
  numTypes: number;
  colors: string[];
  counts: number[];
  rules: number[][];
  maxRadius: number;
  friction: number;
  forceFactor: number;
  dt: number;
}

export interface SimulationStats {
  fps: number;
  particleCount: number;
  frameTime: number;
}

export interface Preset {
  name: string;
  description: string;
  icon: string;
  config: Omit<SimulationConfig, 'dt'>;
}

export type TabId = 'controls' | 'rules' | 'presets';
