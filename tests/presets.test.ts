import { describe, it, expect } from 'vitest';
import { PRESETS, DEFAULT_CONFIG, randomPresetConfig, DEFAULT_COLORS_6 } from '../src/simulation/presets';

describe('PRESETS', () => {
  it('contains at least 5 presets', () => {
    expect(PRESETS.length).toBeGreaterThanOrEqual(5);
  });

  for (const preset of PRESETS) {
    it(`"${preset.name}" has valid structure`, () => {
      expect(preset.name).toBeTruthy();
      expect(preset.description).toBeTruthy();
      expect(preset.icon).toBeTruthy();
      expect(preset.config.numTypes).toBeGreaterThanOrEqual(2);
      expect(preset.config.numTypes).toBeLessThanOrEqual(8);
    });

    it(`"${preset.name}" rules matrix matches numTypes`, () => {
      const { numTypes, rules } = preset.config;
      expect(rules.length).toBeGreaterThanOrEqual(numTypes);
      for (let i = 0; i < numTypes; i++) {
        expect(rules[i].length).toBeGreaterThanOrEqual(numTypes);
        for (let j = 0; j < numTypes; j++) {
          expect(rules[i][j]).toBeGreaterThanOrEqual(-1);
          expect(rules[i][j]).toBeLessThanOrEqual(1);
        }
      }
    });

    it(`"${preset.name}" colors array has enough entries`, () => {
      expect(preset.config.colors.length).toBeGreaterThanOrEqual(preset.config.numTypes);
    });

    it(`"${preset.name}" counts array has enough entries`, () => {
      expect(preset.config.counts.length).toBeGreaterThanOrEqual(preset.config.numTypes);
      for (let i = 0; i < preset.config.numTypes; i++) {
        expect(preset.config.counts[i]).toBeGreaterThan(0);
      }
    });

    it(`"${preset.name}" physics params are positive`, () => {
      expect(preset.config.maxRadius).toBeGreaterThan(0);
      expect(preset.config.friction).toBeGreaterThanOrEqual(0);
      expect(preset.config.forceFactor).toBeGreaterThan(0);
    });
  }
});

describe('DEFAULT_CONFIG', () => {
  it('has dt property', () => {
    expect(DEFAULT_CONFIG.dt).toBeGreaterThan(0);
  });

  it('matches first preset config', () => {
    expect(DEFAULT_CONFIG.numTypes).toBe(PRESETS[0].config.numTypes);
    expect(DEFAULT_CONFIG.rules).toEqual(PRESETS[0].config.rules);
  });
});

describe('randomPresetConfig', () => {
  it('creates config with correct numTypes', () => {
    const cfg = randomPresetConfig(4, DEFAULT_COLORS_6);
    expect(cfg.numTypes).toBe(4);
  });

  it('creates rules in [-1, 1] range', () => {
    const cfg = randomPresetConfig(3, DEFAULT_COLORS_6);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        expect(cfg.rules[i][j]).toBeGreaterThanOrEqual(-1);
        expect(cfg.rules[i][j]).toBeLessThanOrEqual(1);
      }
    }
  });

  it('produces different rules each call', () => {
    const a = randomPresetConfig(4, DEFAULT_COLORS_6);
    const b = randomPresetConfig(4, DEFAULT_COLORS_6);
    const same = JSON.stringify(a.rules) === JSON.stringify(b.rules);
    // Astronomically unlikely to be identical
    expect(same).toBe(false);
  });
});
