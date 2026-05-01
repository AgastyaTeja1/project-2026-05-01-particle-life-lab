import type { Preset, SimulationConfig } from '../types';

export const DEFAULT_COLORS_6 = ['#ff4444', '#44ff88', '#4488ff', '#ffdd44', '#ff44ff', '#44ffff'];
export const DEFAULT_COLORS_4 = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff'];
export const DEFAULT_COLORS_3 = ['#ff6b6b', '#a8dadc', '#e9c46a'];
export const DEFAULT_COLORS_2 = ['#f4a261', '#e76f51'];

export const PRESETS: Preset[] = [
  {
    name: 'Rainbow',
    description: 'Six species dance in cyclic harmony — every type chases the next',
    icon: '🌈',
    config: {
      numTypes: 6,
      colors: DEFAULT_COLORS_6,
      counts: [65, 65, 65, 65, 65, 65],
      rules: [
        [0.8, 0.5, -0.3, -0.5, 0.2, 0.7],
        [0.7, 0.8, 0.5, -0.3, -0.5, 0.2],
        [0.2, 0.7, 0.8, 0.5, -0.3, -0.5],
        [-0.5, 0.2, 0.7, 0.8, 0.5, -0.3],
        [-0.3, -0.5, 0.2, 0.7, 0.8, 0.5],
        [0.5, -0.3, -0.5, 0.2, 0.7, 0.8],
      ],
      maxRadius: 85,
      friction: 0.04,
      forceFactor: 2.0,
    },
  },
  {
    name: 'Mitosis',
    description: 'Particles cluster and split like biological cells dividing',
    icon: '🦠',
    config: {
      numTypes: 4,
      colors: DEFAULT_COLORS_4,
      counts: [100, 100, 100, 100],
      rules: [
        [0.5, -0.2, 0.8, -0.3],
        [-0.2, 0.5, -0.2, 0.8],
        [0.8, -0.2, 0.5, -0.2],
        [-0.3, 0.8, -0.2, 0.5],
      ],
      maxRadius: 60,
      friction: 0.05,
      forceFactor: 1.5,
    },
  },
  {
    name: 'Predator',
    description: 'Rock-paper-scissors dynamics: red hunts green, green hunts blue, blue hunts red',
    icon: '🔺',
    config: {
      numTypes: 3,
      colors: ['#ff4444', '#44ff44', '#4488ff'],
      counts: [150, 150, 150],
      rules: [
        [0.3, 0.9, -0.6],
        [-0.6, 0.3, 0.9],
        [0.9, -0.6, 0.3],
      ],
      maxRadius: 80,
      friction: 0.04,
      forceFactor: 2.2,
    },
  },
  {
    name: 'Galaxy',
    description: 'Spiral arms form as three particle clouds orbit and interact',
    icon: '🌌',
    config: {
      numTypes: 3,
      colors: ['#ffffff', '#aaaaff', '#ffaaaa'],
      counts: [200, 150, 100],
      rules: [
        [0.1, 0.8, -0.4],
        [-0.4, 0.1, 0.8],
        [0.8, -0.4, 0.1],
      ],
      maxRadius: 100,
      friction: 0.02,
      forceFactor: 2.5,
    },
  },
  {
    name: 'Slime Mold',
    description: 'Branching network structures grow like Physarum polycephalum',
    icon: '🍄',
    config: {
      numTypes: 2,
      colors: ['#f4a261', '#e9c46a'],
      counts: [280, 280],
      rules: [
        [0.6, 0.4],
        [0.4, 0.6],
      ],
      maxRadius: 70,
      friction: 0.08,
      forceFactor: 1.8,
    },
  },
  {
    name: 'Chaos',
    description: 'Fully random rules — unpredictable emergent complexity every run',
    icon: '🌀',
    config: {
      numTypes: 6,
      colors: DEFAULT_COLORS_6,
      counts: [80, 80, 80, 80, 80, 80],
      rules: [
        [0.5, -0.3, 0.1, 0.8, -0.5, 0.2],
        [-0.2, 0.6, -0.4, 0.3, 0.7, -0.1],
        [0.4, -0.6, 0.3, -0.2, 0.5, 0.8],
        [-0.8, 0.2, 0.6, 0.4, -0.3, 0.1],
        [0.1, 0.7, -0.5, -0.6, 0.2, 0.9],
        [-0.4, 0.3, 0.8, -0.7, 0.6, 0.1],
      ],
      maxRadius: 80,
      friction: 0.05,
      forceFactor: 2.0,
    },
  },
  {
    name: 'Worms',
    description: 'Particles self-organize into long wriggling chains',
    icon: '🪱',
    config: {
      numTypes: 4,
      colors: ['#80ffdb', '#52b788', '#40916c', '#1b4332'],
      counts: [120, 100, 80, 60],
      rules: [
        [0.0, 0.9, -0.3, 0.1],
        [-0.1, 0.0, 0.9, -0.3],
        [0.1, -0.3, 0.0, 0.9],
        [0.9, 0.1, -0.3, 0.0],
      ],
      maxRadius: 55,
      friction: 0.07,
      forceFactor: 1.6,
    },
  },
  {
    name: 'Fireworks',
    description: 'Explosive bursts of color — particles scatter then reaggregate',
    icon: '🎆',
    config: {
      numTypes: 5,
      colors: ['#ff595e', '#ffca3a', '#6a4c93', '#1982c4', '#ff99c8'],
      counts: [80, 80, 80, 80, 80],
      rules: [
        [0.9, -0.8, 0.2, -0.1, 0.5],
        [-0.8, 0.9, -0.8, 0.2, -0.1],
        [0.2, -0.8, 0.9, -0.8, 0.2],
        [-0.1, 0.2, -0.8, 0.9, -0.8],
        [0.5, -0.1, 0.2, -0.8, 0.9],
      ],
      maxRadius: 90,
      friction: 0.03,
      forceFactor: 3.0,
    },
  },
];

export function randomPresetConfig(numTypes: number, colors: string[]): SimulationConfig {
  const rules: number[][] = Array.from({ length: numTypes }, () =>
    Array.from({ length: numTypes }, () => Math.random() * 2 - 1)
  );
  return {
    numTypes,
    colors,
    counts: Array(numTypes).fill(Math.floor(400 / numTypes)),
    rules,
    maxRadius: 75,
    friction: 0.05,
    forceFactor: 2.0,
    dt: 1,
  };
}

export const DEFAULT_CONFIG: SimulationConfig = {
  ...PRESETS[0].config,
  dt: 1,
};
