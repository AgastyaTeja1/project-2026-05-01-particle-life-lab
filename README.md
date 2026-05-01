# 🧬 Particle Life Lab

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.1-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-84%20passing-44ff88?style=flat-square)](#testing)
[![License](https://img.shields.io/badge/License-MIT-white?style=flat-square)](LICENSE)

> **Watch life emerge.** An interactive particle simulator where stunning self-organizing patterns arise from just two simple rules: *attract* and *repel*.

---

## ✨ What Is Particle Life?

Particle Life is a cellular automaton-inspired simulation where colored particles interact based on a user-defined "rule matrix". Each cell in the matrix specifies how strongly particles of type A attract (+1) or repel (−1) particles of type B. From these minimal rules, **astonishingly complex life-like behaviors emerge** spontaneously:

- Biological cell division and mitosis
- Predator-prey cyclic dominance (rock-paper-scissors)
- Galaxy-like spiral arms
- Slime-mold branching networks
- Self-organizing worms and filaments

The simulation runs in real-time at 60fps in the browser — no server, no GPU required.

---

## 🎯 Features

- **8 hand-crafted presets** — Rainbow, Mitosis, Predator, Galaxy, Slime Mold, Chaos, Worms, Fireworks
- **Interactive rule matrix** — click any cell to cycle through attraction/repulsion values; watch the simulation respond instantly
- **Live physics controls** — adjust max interaction radius, force factor, friction, and time step with instant feedback
- **Per-type particle counts** — add or remove particles of each species on the fly
- **Shareable URLs** — your exact configuration is encoded in the URL; copy and share with one click
- **Randomize rules** — generate surprise emergent behaviors with a single button
- **Motion trail rendering** — particles leave glowing trails as they move, revealing flow patterns
- **Pause / resume** — freeze the simulation at any moment (Space key)
- **Spatial grid optimization** — O(n) neighbor search instead of O(n²); handles 500+ particles at 60fps
- **Keyboard shortcuts** — Space to pause, R to reset
- **Glassmorphism UI** — frosted-glass control panel with smooth Framer Motion animations
- **Toroidal topology** — particles wrap seamlessly around all edges

---

## 🛠 Tech Stack

| Technology | Purpose | Why Chosen |
|---|---|---|
| **React 18** | UI framework | Hooks + concurrent mode for responsive controls |
| **TypeScript 5.3 (strict)** | Type safety | Catches bugs in simulation math at compile time |
| **Vite 5** | Dev server + bundler | Near-instant HMR, fast production builds |
| **Tailwind CSS 3.4** | Styling | Utility-first, pairs perfectly with glassmorphism |
| **Framer Motion 11** | UI animations | Smooth panel slides, staggered preset cards |
| **Canvas 2D API** | Particle rendering | Zero dependencies, hardware-accelerated compositing |
| **Vitest** | Testing | Native Vite integration, ESM-first |
| **nginx** | Production serving | Static file serving with gzip + cache headers |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Browser                            │
│                                                         │
│  ┌──────────────┐    ┌───────────────────────────────┐  │
│  │  React App   │    │  Canvas 2D (full viewport)    │  │
│  │              │    │                               │  │
│  │  ┌─────────┐ │    │  requestAnimationFrame loop   │  │
│  │  │ Control │ │    │  ┌────────────────────────┐   │  │
│  │  │  Panel  │ │    │  │  ParticleSystem.step() │   │  │
│  │  │ (glass) │ │    │  │  ┌──────────────────┐  │   │  │
│  │  └─────────┘ │    │  │  │ buildSpatialGrid │  │   │  │
│  │              │    │  │  │ applyForces      │  │   │  │
│  │  SimConfig   ├────►  │  │ integrate        │  │   │  │
│  │  (useState)  │    │  │  └──────────────────┘  │   │  │
│  │              │    │  └────────────────────────┘   │  │
│  │  useSimula-  ◄────┤  renderFrame()                │  │
│  │  tion hook   │    │                               │  │
│  └──────────────┘    └───────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Data flow:**
1. `SimulationConfig` state lives in `App` (React)
2. `useSimulation` hook holds the `ParticleSystem` in a ref — imperatively driven
3. Config changes propagate via `updateConfig()` without re-creating particles (unless counts change)
4. Canvas renders at native browser frame rate; React only updates the stats display (every 200ms)

---

## 📁 Project Structure

```
particle-life-lab/
├── src/
│   ├── main.tsx                  # React app entry point
│   ├── App.tsx                   # Root component; all state lives here
│   ├── index.css                 # Tailwind base + glass panel styles
│   ├── types/
│   │   └── index.ts              # Particle, SimulationConfig, Preset, etc.
│   ├── simulation/
│   │   ├── engine.ts             # ParticleSystem class + computeForce()
│   │   └── presets.ts            # 8 preset configs + randomPresetConfig()
│   ├── hooks/
│   │   └── useSimulation.ts      # RAF loop, canvas render, resize observer
│   ├── components/
│   │   ├── Canvas.tsx            # Canvas element (forwardRef, optional)
│   │   ├── StatsOverlay.tsx      # FPS / particle count / frame time display
│   │   ├── ControlPanel.tsx      # Sliders for physics params + particle counts
│   │   ├── RuleMatrix.tsx        # n×n clickable interaction matrix
│   │   └── PresetSelector.tsx    # Preset card grid
│   └── utils/
│       ├── color.ts              # hexToRgb, rgbToHex, blendColors, ruleToColor
│       └── url.ts                # encodeConfig, decodeConfig, getShareUrl
├── tests/
│   ├── engine.test.ts            # ParticleSystem + computeForce unit tests
│   ├── presets.test.ts           # All presets structure validation
│   ├── color.test.ts             # Color utility functions
│   └── url.test.ts               # URL encode/decode round-trip tests
├── public/
│   └── favicon.svg               # SVG particle icon
├── Dockerfile                    # Multi-stage: build → nginx
├── Dockerfile.dev                # Dev container with hot reload
├── docker-compose.yml            # Production: nginx on port 3000
├── docker-compose.dev.yml        # Dev: Vite dev server on port 5173
├── nginx.conf                    # nginx SPA config + cache headers
├── index.html                    # HTML entry point
├── vite.config.ts                # Vite + Vitest config
├── tsconfig.json                 # Strict TypeScript config
├── tailwind.config.js            # Tailwind theme customization
├── eslint.config.js              # ESLint rules
└── .prettierrc                   # Prettier formatting config
```

---

## 🚀 Quick Start (Docker)

```bash
git clone https://github.com/AgastyaTeja1/project-2026-05-01-particle-life-lab.git
cd project-2026-05-01-particle-life-lab
cp .env.example .env
docker-compose up -d
```

Open **http://localhost:3000** — no configuration needed.

---

## 💻 Local Dev Setup

### Prerequisites

- Node.js 20+
- npm 10+

### Steps

```bash
# 1. Clone and enter the repo
git clone https://github.com/AgastyaTeja1/project-2026-05-01-particle-life-lab.git
cd project-2026-05-01-particle-life-lab

# 2. Install dependencies
npm install

# 3. Configure environment (optional — no secrets required)
cp .env.example .env

# 4. Start dev server with hot reload
npm run dev
# → http://localhost:5173

# 5. Run tests
npm test

# 6. Build for production
npm run build

# 7. Preview production build
npm run preview
```

---

## 🔧 Environment Variables

| Variable | Required | Default | Description | Example |
|---|---|---|---|---|
| `VITE_APP_TITLE` | No | `"Particle Life Lab"` | Page title shown in browser tab | `"My Lab"` |
| `VITE_ENABLE_RECORDING` | No | `false` | Enable canvas recording feature flag | `true` |

No secrets or API keys required — the simulation runs entirely client-side.

---

## 🧪 Testing

```bash
npm test         # run all tests once
npm run test:watch  # watch mode
```

**84 tests across 4 suites:**

| Suite | Tests | What's covered |
|---|---|---|
| `engine.test.ts` | 17 | `computeForce` boundary conditions; `ParticleSystem` init, step, bounds, reset, resize, updateConfig |
| `presets.test.ts` | 46 | All 8 presets: structure, rules bounds, color/count arrays, physics params; `randomPresetConfig` |
| `color.test.ts` | 15 | `hexToRgb`, `rgbToHex`, `blendColors` round-trips, `ruleToColor` sign, `clamp` |
| `url.test.ts` | 6 | `encodeConfig`/`decodeConfig` round-trip, rules fidelity, invalid input, 2-type config |

---

## 🎮 How to Use

### Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` | Pause / Resume |
| `R` | Reset (redistribute particles randomly) |

### Rule Matrix

The **Rules** tab shows an n×n grid where row i = particle type i and column j = the force applied by type j on type i.

- **Left-click** a cell to step through values: `0 → 0.25 → 0.5 → 0.75 → 1 → -1 → -0.75 → ...`
- **Right-click** a cell to step in the opposite direction
- **Green cells** = attraction (type j pulls type i closer)
- **Red cells** = repulsion (type j pushes type i away)
- **Grey cells** = no interaction

Changes take effect immediately in the live simulation.

### Sharing

Click **🔗 Share** to copy a URL that encodes the entire configuration. Send it to anyone and they'll see the same simulation starting state.

---

## 🧮 The Physics

### Force Function

For a pair of particles A and B at normalized distance `r ∈ [0, 1]` (where 1 = `maxRadius`):

```
f(r, a) = 
  r/β − 1,          if r < β           (short-range repulsion, β = 0.3)
  a × triangle(r),  if β ≤ r < 1       (medium-range interaction)
  0,                if r ≥ 1           (no force at long range)

triangle(r) = 1 − |2r − 1 − β| / (1 − β)   (peaks at r = (1+β)/2 ≈ 0.65)
```

Where `a ∈ [−1, 1]` is the rule matrix value for the particle type pair.

This creates a characteristic potential well: **always-repulsive at close range** (preventing collapse) and **tunable at medium range** (enabling attraction, repulsion, or indifference).

### Spatial Grid Optimization

Naïve force computation is O(n²) per frame. With `n = 400` particles at 60fps that's 9.6M distance checks per second.

Particle Life Lab uses a **spatial hash grid** with cell size = `maxRadius`:
- Build grid: O(n) — each particle inserted into one cell
- Find neighbors: check 9 surrounding cells (3×3) per particle
- Average neighbors per lookup: `n / (W/R × H/R) × 9 ≈ 9 × n × R² / (W × H)`
- For default params (n=400, R=85, W=1920, H=1080): ~8,000 checks/frame vs 160,000 naive

This enables smooth 60fps with 500+ particles.

### Integration

```
vx += Fx × forceFactor × dt
vy += Fy × forceFactor × dt
vx *= (1 − friction)
vy *= (1 − friction)
x  += vx × dt
y  += vy × dt
// wrap at boundaries (toroidal space)
```

---

## 🎨 Design System

### Color Palette

| Role | Value | Usage |
|---|---|---|
| Background | `#000000` | Canvas, app background |
| Glass panel | `rgba(0,0,0,0.70)` + `backdrop-blur(12px)` | All UI panels |
| Panel border | `rgba(255,255,255,0.10)` | Panel edges, dividers |
| Text primary | `rgba(255,255,255,0.90)` | Labels, headings |
| Text muted | `rgba(255,255,255,0.40)` | Secondary text |
| Attract green | `rgba(68,255,120,α)` | Rule matrix positive cells |
| Repel red | `rgba(255,68,68,α)` | Rule matrix negative cells |

### Design Trends Implemented

1. **Glassmorphism** — `bg-black/70 backdrop-blur-md` frosted panels with `border-white/10` edges
2. **Motion UI** — Framer Motion spring animations for panel slide-in/out, staggered preset card reveals, tab transitions with `mode="wait"`
3. **Micro-interactions** — `whileTap={{ scale: 0.9 }}` on all buttons, `active:scale-95` press feedback, hover color shifts
4. **Gradient accents** — gradient text for the logo, gradient legend bar in the rule matrix
5. **Dark-only mode** — pure dark canvas background lets particle colors pop with maximum contrast
6. **Motion trails** — `rgba(0,0,0,0.18)` overlay each frame creates velocity blur, revealing flow fields

### Typography

- **JetBrains Mono** (primary) — technical aesthetic, perfect for a scientific simulator
- Fallbacks: Fira Code, monospace

---

## 🐳 Deployment

### Docker (any server)

```bash
# Build and run
docker-compose up -d --build

# Check logs
docker-compose logs -f

# Stop
docker-compose down
```

Exposed port: **3000** → nginx serving the static Vite build.

### Railway

```bash
# Connect repo in Railway dashboard → Deploy
# Railway auto-detects Dockerfile
```

### Fly.io

```bash
fly launch --name particle-life-lab
fly deploy
```

### DigitalOcean App Platform

1. Connect GitHub repo
2. Select "Dockerfile" as build method
3. Deploy → DigitalOcean serves on managed HTTPS

### Static Hosting (Vercel / Netlify / GitHub Pages)

Since this is a pure frontend app, you can deploy the `dist/` folder directly:

```bash
npm run build
# Upload dist/ to any static host
```

**Vercel:** `vercel deploy --prod`  
**Netlify:** `netlify deploy --prod --dir dist`  
**GitHub Pages:** use the `gh-pages` npm package

---

## ⚡ Performance

| Metric | Value |
|---|---|
| Target frame rate | 60fps |
| Default particle count | 390 (Rainbow preset) |
| Max tested | 1000 particles at stable 60fps |
| Bundle size (gzip) | ~90 KB (Framer Motion dominates) |
| First contentful paint | < 500ms |

**Optimizations:**
- Spatial grid reduces force computation from O(n²) to O(n)
- Canvas render groups particles by type (one `ctx.beginPath()` per type, not per particle)
- React state updates are throttled to 200ms for stats; simulation runs at native RAF rate
- `configRef` pattern avoids restarting the animation loop on every config change
- nginx gzip compression + `immutable` cache headers for JS/CSS assets

---

## 🔒 Security

| Concern | Mitigation |
|---|---|
| XSS | Pure frontend, no user-supplied HTML rendered as markup |
| URL injection | `decodeConfig()` wraps `JSON.parse` in try/catch; returns `null` on any malformed input |
| CSP | nginx `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff` |
| Secrets | None — fully client-side, no API keys |
| Dependency audits | `npm audit` (4 moderate severity in dev-only transitive deps) |

---

## ⚠️ Known Limitations

- **No WebGL backend** — Canvas 2D limits particle counts to ~1000 before frame drops; WebGL would enable 10,000+
- **Single-threaded simulation** — the force computation runs on the main thread; a Web Worker port would eliminate jank
- **No video export** — `MediaRecorder` + canvas capture would enable GIF/WebM download (flagged under `VITE_ENABLE_RECORDING`)
- **Mobile touch control** — touch events on the rule matrix are functional but small cells are hard to tap on phone screens
- **No persistent presets** — custom rule configurations are only shareable via URL; `localStorage` persistence would be a useful addition
- **Deterministic seeding** — simulation is not seeded; the same preset produces different patterns each run (by design, but may be surprising)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make your changes following the coding standards below
4. Run `npm test && npm run build` — both must pass
5. Submit a pull request with a clear description

### Coding Standards

- **TypeScript strict mode** — no `any`, all types explicit
- **No `console.log`** in production code
- **Simulation logic** goes in `src/simulation/` — keep it framework-agnostic
- **UI logic** goes in `src/components/` — keep it display-only, no physics math
- **Tests required** for any new simulation or utility function
- Run `npm run lint:fix && npm run format` before committing

---

## 📜 License

MIT © 2026 — see [LICENSE](LICENSE) for details.

---

*Built on 2026-05-01 as a daily project. Inspired by the work of Jeffrey Ventrella (Clusters), Lenia, and the broader artificial life research community.*
