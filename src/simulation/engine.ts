import type { Particle, SimulationConfig } from '../types';

const BETA = 0.3;

/** Force function: repulsion below beta, attraction/repulsion in (beta, 1), zero above 1 */
export function computeForce(rNormalized: number, attraction: number): number {
  if (rNormalized < BETA) {
    return rNormalized / BETA - 1;
  }
  if (rNormalized < 1) {
    return attraction * (1 - Math.abs(2 * rNormalized - 1 - BETA) / (1 - BETA));
  }
  return 0;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private grid = new Map<number, number[]>();
  private gridW = 0;
  private gridH = 0;
  private cellSize = 0;

  constructor(
    private width: number,
    private height: number,
    private config: SimulationConfig
  ) {
    this.rebuildGrid();
    this.initParticles();
  }

  private rebuildGrid() {
    this.cellSize = this.config.maxRadius;
    this.gridW = Math.ceil(this.width / this.cellSize) + 1;
    this.gridH = Math.ceil(this.height / this.cellSize) + 1;
  }

  private initParticles() {
    this.particles = [];
    const { numTypes, counts } = this.config;
    for (let t = 0; t < numTypes; t++) {
      const count = counts[t] ?? 50;
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          type: t,
        });
      }
    }
  }

  updateConfig(next: SimulationConfig) {
    const typeCountChanged =
      next.numTypes !== this.config.numTypes ||
      next.counts.some((c, i) => c !== this.config.counts[i]);

    this.config = next;
    this.rebuildGrid();

    if (typeCountChanged) {
      this.initParticles();
    }
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.rebuildGrid();
  }

  reset() {
    this.initParticles();
  }

  getParticles(): Readonly<Particle[]> {
    return this.particles;
  }

  step() {
    this.buildSpatialGrid();
    this.applyForces();
    this.integrate();
  }

  private buildSpatialGrid() {
    this.grid.clear();
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const cx = Math.floor(p.x / this.cellSize);
      const cy = Math.floor(p.y / this.cellSize);
      const key = cx * this.gridH + cy;
      let cell = this.grid.get(key);
      if (!cell) {
        cell = [];
        this.grid.set(key, cell);
      }
      cell.push(i);
    }
  }

  private applyForces() {
    const { maxRadius, friction, forceFactor, rules, dt } = this.config;
    const maxRadius2 = maxRadius * maxRadius;

    for (let i = 0; i < this.particles.length; i++) {
      const a = this.particles[i];
      const cx = Math.floor(a.x / this.cellSize);
      const cy = Math.floor(a.y / this.cellSize);

      let fx = 0;
      let fy = 0;

      for (let ddx = -1; ddx <= 1; ddx++) {
        for (let ddy = -1; ddy <= 1; ddy++) {
          const nx = cx + ddx;
          const ny = cy + ddy;
          if (nx < 0 || nx >= this.gridW || ny < 0 || ny >= this.gridH) continue;

          const cell = this.grid.get(nx * this.gridH + ny);
          if (!cell) continue;

          for (const j of cell) {
            if (i === j) continue;
            const b = this.particles[j];

            // Wrapping distance
            let rx = b.x - a.x;
            let ry = b.y - a.y;
            if (rx > this.width * 0.5) rx -= this.width;
            else if (rx < -this.width * 0.5) rx += this.width;
            if (ry > this.height * 0.5) ry -= this.height;
            else if (ry < -this.height * 0.5) ry += this.height;

            const r2 = rx * rx + ry * ry;
            if (r2 >= maxRadius2 || r2 < 0.0001) continue;

            const r = Math.sqrt(r2);
            const rn = r / maxRadius;
            const g = rules[a.type]?.[b.type] ?? 0;
            const f = computeForce(rn, g);

            const inv = f / r;
            fx += rx * inv;
            fy += ry * inv;
          }
        }
      }

      a.vx += fx * forceFactor * dt;
      a.vy += fy * forceFactor * dt;
      a.vx *= 1 - friction;
      a.vy *= 1 - friction;
    }
  }

  private integrate() {
    const { dt } = this.config;
    for (const p of this.particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      // Toroidal wrap
      p.x = ((p.x % this.width) + this.width) % this.width;
      p.y = ((p.y % this.height) + this.height) % this.height;
    }
  }
}
