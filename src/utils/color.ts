/** Parse a hex color string to [r, g, b] array (0–255 each) */
export function hexToRgb(hex: string): [number, number, number] {
  const cleaned = hex.replace('#', '');
  const full = cleaned.length === 3
    ? cleaned.split('').map((c) => c + c).join('')
    : cleaned;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/** Convert [r,g,b] to hex string */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
}

/** Blend two hex colors by ratio t (0 = a, 1 = b) */
export function blendColors(a: string, b: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  return rgbToHex(
    r1 + (r2 - r1) * t,
    g1 + (g2 - g1) * t,
    b1 + (b2 - b1) * t
  );
}

/** Map a rule value (-1 to 1) to a color for the rule matrix cell */
export function ruleToColor(value: number): string {
  if (Math.abs(value) < 0.05) return 'rgba(100, 100, 120, 0.4)';
  if (value > 0) {
    const alpha = Math.min(value * 0.85 + 0.15, 1);
    return `rgba(68, 255, 120, ${alpha.toFixed(2)})`;
  }
  const alpha = Math.min(Math.abs(value) * 0.85 + 0.15, 1);
  return `rgba(255, 68, 68, ${alpha.toFixed(2)})`;
}

/** Clamp a value to [min, max] */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
