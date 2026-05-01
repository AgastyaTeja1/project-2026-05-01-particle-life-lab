import type { SimulationConfig } from '../types';

interface SerializedConfig {
  n: number;
  c: string[];
  k: number[];
  r: number[][];
  mr: number;
  f: number;
  ff: number;
}

export function encodeConfig(config: SimulationConfig): string {
  const payload: SerializedConfig = {
    n: config.numTypes,
    c: config.colors.slice(0, config.numTypes),
    k: config.counts.slice(0, config.numTypes),
    r: config.rules.slice(0, config.numTypes).map((row) => row.slice(0, config.numTypes)),
    mr: config.maxRadius,
    f: config.friction,
    ff: config.forceFactor,
  };
  return btoa(JSON.stringify(payload));
}

export function decodeConfig(encoded: string): SimulationConfig | null {
  try {
    const payload = JSON.parse(atob(encoded)) as SerializedConfig;
    if (!payload.n || !Array.isArray(payload.r)) return null;
    return {
      numTypes: payload.n,
      colors: payload.c,
      counts: payload.k,
      rules: payload.r,
      maxRadius: payload.mr,
      friction: payload.f,
      forceFactor: payload.ff,
      dt: 1,
    };
  } catch {
    return null;
  }
}

export function getShareUrl(config: SimulationConfig): string {
  const encoded = encodeConfig(config);
  const url = new URL(window.location.href);
  url.searchParams.set('c', encoded);
  return url.toString();
}

export function loadConfigFromUrl(): SimulationConfig | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('c');
  if (!encoded) return null;
  return decodeConfig(encoded);
}
