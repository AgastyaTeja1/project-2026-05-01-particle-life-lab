import { describe, it, expect } from 'vitest';
import { hexToRgb, rgbToHex, blendColors, ruleToColor, clamp } from '../src/utils/color';

describe('hexToRgb', () => {
  it('parses 6-digit hex', () => {
    expect(hexToRgb('#ff0000')).toEqual([255, 0, 0]);
    expect(hexToRgb('#00ff00')).toEqual([0, 255, 0]);
    expect(hexToRgb('#0000ff')).toEqual([0, 0, 255]);
    expect(hexToRgb('#ffffff')).toEqual([255, 255, 255]);
    expect(hexToRgb('#000000')).toEqual([0, 0, 0]);
  });

  it('parses 3-digit shorthand hex', () => {
    expect(hexToRgb('#f00')).toEqual([255, 0, 0]);
    expect(hexToRgb('#0f0')).toEqual([0, 255, 0]);
    expect(hexToRgb('#fff')).toEqual([255, 255, 255]);
  });

  it('works without leading #', () => {
    expect(hexToRgb('ff4444')).toEqual([255, 68, 68]);
  });
});

describe('rgbToHex', () => {
  it('converts rgb to hex', () => {
    expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
    expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
    expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
  });

  it('roundtrips with hexToRgb', () => {
    const [r, g, b] = hexToRgb('#4488ff');
    expect(rgbToHex(r, g, b)).toBe('#4488ff');
  });
});

describe('blendColors', () => {
  it('returns first color at t=0', () => {
    expect(blendColors('#ff0000', '#0000ff', 0)).toBe('#ff0000');
  });

  it('returns second color at t=1', () => {
    expect(blendColors('#ff0000', '#0000ff', 1)).toBe('#0000ff');
  });

  it('returns midpoint at t=0.5', () => {
    const result = blendColors('#000000', '#ffffff', 0.5);
    const [r, g, b] = hexToRgb(result);
    expect(r).toBeCloseTo(128, -1);
    expect(g).toBeCloseTo(128, -1);
    expect(b).toBeCloseTo(128, -1);
  });
});

describe('ruleToColor', () => {
  it('returns grey-ish for near-zero values', () => {
    const color = ruleToColor(0);
    expect(color).toContain('rgba');
  });

  it('returns green-ish for positive values', () => {
    const color = ruleToColor(0.8);
    expect(color).toContain('68, 255');
  });

  it('returns red-ish for negative values', () => {
    const color = ruleToColor(-0.8);
    expect(color).toContain('255, 68');
  });
});

describe('clamp', () => {
  it('returns value within range unchanged', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('clamps to min', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('clamps to max', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('handles equal min and max', () => {
    expect(clamp(5, 3, 3)).toBe(3);
  });
});
