import { describe, it, expect, beforeEach } from 'vitest';
import { ParticleSystem, computeForce } from '../src/simulation/engine';
import { DEFAULT_CONFIG } from '../src/simulation/presets';

describe('computeForce', () => {
  it('returns -1 at distance 0 (maximum repulsion)', () => {
    expect(computeForce(0, 1.0)).toBe(-1);
  });

  it('returns 0 at normalized distance = beta (0.3)', () => {
    expect(computeForce(0.3, 1.0)).toBeCloseTo(0, 5);
  });

  it('returns 0 at normalized distance >= 1', () => {
    expect(computeForce(1.0, 0.5)).toBe(0);
    expect(computeForce(1.5, 0.5)).toBe(0);
  });

  it('returns positive force for attractive rule in mid range', () => {
    const f = computeForce(0.6, 1.0);
    expect(f).toBeGreaterThan(0);
  });

  it('returns negative force for repulsive rule in mid range', () => {
    const f = computeForce(0.6, -1.0);
    expect(f).toBeLessThan(0);
  });

  it('returns 0 for zero-rule in mid range', () => {
    expect(computeForce(0.6, 0)).toBe(0);
  });

  it('force is proportional to attraction value', () => {
    const f1 = computeForce(0.5, 0.5);
    const f2 = computeForce(0.5, 1.0);
    expect(f2).toBeCloseTo(f1 * 2, 5);
  });
});

describe('ParticleSystem', () => {
  let system: ParticleSystem;

  beforeEach(() => {
    system = new ParticleSystem(800, 600, DEFAULT_CONFIG);
  });

  it('creates correct total particle count', () => {
    const total = DEFAULT_CONFIG.counts
      .slice(0, DEFAULT_CONFIG.numTypes)
      .reduce((a, b) => a + b, 0);
    expect(system.getParticles().length).toBe(total);
  });

  it('particles are created within canvas bounds', () => {
    for (const p of system.getParticles()) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThan(800);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThan(600);
    }
  });

  it('particles have valid type indices', () => {
    for (const p of system.getParticles()) {
      expect(p.type).toBeGreaterThanOrEqual(0);
      expect(p.type).toBeLessThan(DEFAULT_CONFIG.numTypes);
    }
  });

  it('step() changes particle positions', () => {
    const before = system.getParticles().map((p) => ({ x: p.x, y: p.y }));
    // Run multiple steps to ensure particles move
    for (let i = 0; i < 5; i++) system.step();
    const after = system.getParticles();
    const anyMoved = after.some((p, i) => p.x !== before[i].x || p.y !== before[i].y);
    expect(anyMoved).toBe(true);
  });

  it('particles stay within bounds after many steps', () => {
    for (let i = 0; i < 20; i++) system.step();
    for (const p of system.getParticles()) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThan(800);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThan(600);
    }
  });

  it('reset() randomizes particle positions', () => {
    const before = system.getParticles().map((p) => ({ x: p.x, y: p.y }));
    system.reset();
    const after = system.getParticles();
    // With random init, it is astronomically unlikely all positions match
    const allSame = after.every(
      (p, i) => Math.abs(p.x - before[i].x) < 0.001 && Math.abs(p.y - before[i].y) < 0.001
    );
    expect(allSame).toBe(false);
  });

  it('reset() preserves particle count', () => {
    const countBefore = system.getParticles().length;
    system.reset();
    expect(system.getParticles().length).toBe(countBefore);
  });

  it('resize() keeps simulation running', () => {
    system.resize(1920, 1080);
    expect(() => system.step()).not.toThrow();
  });

  it('updateConfig() with same counts does not change particle count', () => {
    const count = system.getParticles().length;
    system.updateConfig({ ...DEFAULT_CONFIG, forceFactor: 3 });
    expect(system.getParticles().length).toBe(count);
  });

  it('updateConfig() with different counts reinitializes particles', () => {
    const newCounts = DEFAULT_CONFIG.counts.map((c) => c + 10);
    system.updateConfig({ ...DEFAULT_CONFIG, counts: newCounts });
    const expected = newCounts.slice(0, DEFAULT_CONFIG.numTypes).reduce((a, b) => a + b, 0);
    expect(system.getParticles().length).toBe(expected);
  });
});
