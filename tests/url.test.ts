import { describe, it, expect } from 'vitest';
import { encodeConfig, decodeConfig } from '../src/utils/url';
import { DEFAULT_CONFIG } from '../src/simulation/presets';

describe('encodeConfig / decodeConfig', () => {
  it('round-trips a config faithfully', () => {
    const encoded = encodeConfig(DEFAULT_CONFIG);
    const decoded = decodeConfig(encoded);

    expect(decoded).not.toBeNull();
    expect(decoded!.numTypes).toBe(DEFAULT_CONFIG.numTypes);
    expect(decoded!.maxRadius).toBe(DEFAULT_CONFIG.maxRadius);
    expect(decoded!.friction).toBe(DEFAULT_CONFIG.friction);
    expect(decoded!.forceFactor).toBe(DEFAULT_CONFIG.forceFactor);
  });

  it('round-trips rules matrix', () => {
    const encoded = encodeConfig(DEFAULT_CONFIG);
    const decoded = decodeConfig(encoded);

    for (let i = 0; i < DEFAULT_CONFIG.numTypes; i++) {
      for (let j = 0; j < DEFAULT_CONFIG.numTypes; j++) {
        expect(decoded!.rules[i][j]).toBeCloseTo(DEFAULT_CONFIG.rules[i][j], 5);
      }
    }
  });

  it('round-trips colors', () => {
    const encoded = encodeConfig(DEFAULT_CONFIG);
    const decoded = decodeConfig(encoded);
    expect(decoded!.colors).toEqual(DEFAULT_CONFIG.colors.slice(0, DEFAULT_CONFIG.numTypes));
  });

  it('decodeConfig returns null for invalid input', () => {
    expect(decodeConfig('not-base64!!!')).toBeNull();
    expect(decodeConfig('aW52YWxpZA==')).toBeNull(); // valid base64 but not valid JSON structure
  });

  it('encoded string is a valid base64 string', () => {
    const encoded = encodeConfig(DEFAULT_CONFIG);
    expect(() => atob(encoded)).not.toThrow();
  });

  it('encodes 2-type config correctly', () => {
    const twoType = {
      ...DEFAULT_CONFIG,
      numTypes: 2,
      colors: ['#ff0000', '#0000ff'],
      counts: [100, 100],
      rules: [[0.5, -0.5], [-0.5, 0.5]],
    };
    const encoded = encodeConfig(twoType);
    const decoded = decodeConfig(encoded);
    expect(decoded!.numTypes).toBe(2);
    expect(decoded!.rules[0][1]).toBeCloseTo(-0.5, 5);
  });
});
