import { useEffect, useRef, useCallback, useState } from 'react';
import type { SimulationConfig, SimulationStats } from '../types';
import { ParticleSystem } from '../simulation/engine';

const TRAIL_ALPHA = 0.18;
const PARTICLE_RADIUS = 3;
const FPS_SMOOTHING = 0.1;

function renderFrame(
  ctx: CanvasRenderingContext2D,
  system: ParticleSystem,
  colors: string[],
  width: number,
  height: number
) {
  ctx.fillStyle = `rgba(0, 0, 0, ${TRAIL_ALPHA})`;
  ctx.fillRect(0, 0, width, height);

  const particles = system.getParticles();

  // Group by type to batch canvas state changes
  const byType: number[][] = [];
  for (const p of particles) {
    if (!byType[p.type]) byType[p.type] = [];
    byType[p.type].push(p.x, p.y);
  }

  ctx.save();
  for (let t = 0; t < byType.length; t++) {
    const coords = byType[t];
    if (!coords || coords.length === 0) continue;

    ctx.fillStyle = colors[t] ?? '#ffffff';
    ctx.shadowColor = colors[t] ?? '#ffffff';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    for (let i = 0; i < coords.length; i += 2) {
      ctx.moveTo(coords[i] + PARTICLE_RADIUS, coords[i + 1]);
      ctx.arc(coords[i], coords[i + 1], PARTICLE_RADIUS, 0, Math.PI * 2);
    }
    ctx.fill();
  }
  ctx.restore();
}

export function useSimulation(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  config: SimulationConfig,
  isPaused: boolean
) {
  const systemRef = useRef<ParticleSystem | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const fpsRef = useRef<number>(60);
  const isPausedRef = useRef(isPaused);
  const configRef = useRef(config);

  const [stats, setStats] = useState<SimulationStats>({
    fps: 60,
    particleCount: 0,
    frameTime: 0,
  });

  // Keep refs in sync
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    configRef.current = config;
    systemRef.current?.updateConfig(config);
  }, [config]);

  const reset = useCallback(() => {
    systemRef.current?.reset();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
      systemRef.current?.resize(canvas.width, canvas.height);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const resizeObserver = new ResizeObserver(setCanvasSize);
    resizeObserver.observe(canvas);
    setCanvasSize();

    systemRef.current = new ParticleSystem(canvas.width, canvas.height, configRef.current);

    let statsTimer = 0;

    function loop(ts: number) {
      rafRef.current = requestAnimationFrame(loop);
      if (!canvas || !ctx || !systemRef.current) return;

      if (isPausedRef.current) {
        lastTimeRef.current = ts;
        return;
      }

      const raw = ts - lastTimeRef.current;
      const dt = Math.min(raw, 50);
      lastTimeRef.current = ts;

      fpsRef.current =
        fpsRef.current * (1 - FPS_SMOOTHING) + (dt > 0 ? (1000 / dt) * FPS_SMOOTHING : 0);

      systemRef.current.step();
      renderFrame(ctx, systemRef.current, configRef.current.colors, canvas.width, canvas.height);

      statsTimer += raw;
      if (statsTimer > 200) {
        statsTimer = 0;
        setStats({
          fps: Math.round(fpsRef.current),
          particleCount: systemRef.current.getParticles().length,
          frameTime: Math.round(dt),
        });
      }
    }

    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      systemRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef]);

  return { stats, reset };
}
