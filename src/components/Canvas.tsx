import { forwardRef, useImperativeHandle, useRef } from 'react';
import type { SimulationConfig } from '../types';
import { useSimulation } from '../hooks/useSimulation';

interface CanvasProps {
  config: SimulationConfig;
  isPaused: boolean;
  onStats?: (stats: { fps: number; particleCount: number; frameTime: number }) => void;
}

export interface CanvasHandle {
  reset: () => void;
}

const Canvas = forwardRef<CanvasHandle, CanvasProps>(({ config, isPaused }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { reset } = useSimulation(canvasRef, config, isPaused);

  useImperativeHandle(ref, () => ({ reset }), [reset]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-label="Particle life simulation canvas"
    />
  );
});

Canvas.displayName = 'Canvas';
export default Canvas;
