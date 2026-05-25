# Elenza Platform - System Restore Point (v15.1)

**Date**: 2026-05-18
**Status**: Configured Nginx for dual HTTP (Port 80) and HTTPS (Port 443) reverse proxying with a self-signed SSL certificate on the VPS (54.162.197.40) to seamlessly handle modern browser HTTPS force-upgrades.

## 1. Production VPS Deployment Architecture

- **Host IP**: `http://54.162.197.40` (Port 80/443 SSL)
- **Files Location**: `/home/ubuntu/elenza/`
- **Reverse Proxy**: Nginx configured to route incoming Port 80 and Port 443 (SSL) traffic to Next.js (port 3000) and Express (port 3001) under a single host mapping to bypass port firewalls and CORS blocks.
- **Process management**: PM2 daemonizing:
  - `elenza-server` (Express API)
  - `elenza-client` (Next.js production runtime)
  - Processes saved (`pm2 save`) to auto-boot upon system restarts.

## 2. Virtual Memory Calibration (OOM Protection)
- Calibrated a **2GB swapfile** on the Ubuntu instance (`/swapfile`) to expand RAM from 1GB to 3GB, completely eliminating kernel Out-Of-Memory compilation kills during static Next.js production builds.

## 3. Unified Bottom Navigation Layout Architecture

The three-layered floating navigation architecture is completely polished and stable:
- **Layer 1: `MainBottomNav` (z-index: 10)**: The glassmorphic backplate (`pointer-events-none`) for backdrop styling.
- **Layer 2: `FloatingCenterButton` (z-index: 20)**: The elevated gold circle Brew Lab button (`-translate-y-5`).
- **Layer 3: `FloatingQuickActions` (z-index: 30)**: Houses standard buttons, aligned symmetrically around a central `w-16` spacer to avoid collision.
- **Micro-Animations**: Added spring transitions (`stiffness: 350, damping: 25`), scale reactions (`whileHover: { scale: 1.06, y: -2 }`, `whileTap: { scale: 0.94 }`), and glowing HSL text shadow drops to standard navigation tabs.

## 2. Refinements & Enhancements

### 2.1 Home Screen Cinematic Atmospheric Polish
- Added slow pulsing radial glow backdrop overlays (`scale: [1, 1.2, 1]`, `opacity: [0.15, 0.3, 0.15]`) using Gold/Cyan highlights to the machine showcase.
- Integrated a glossy skewed linear reflection swipe animation on the hero machine frame.
- Rich home-screen density elements added lower down:
  - **Recipe Previews**: Quick cards showing the Double Espresso and Flat White specifications.
  - **Barista AI Recommendation Capsule**: Recommends a custom blend/grind based on physical daily routines.
  - **Weekly Analytics Summary**: Renders total cups count.
  - **Activity Timeline Logs**: Lists previous brew and preheat cycles.

### 2.2 Brew Lab Immersive Brewing Phases
- Integrated dynamic brewing phases:
  - **Phase 1 (0-15%)**: *Boiler Preheating* (Saturating pressure block and pre-heating boiler elements).
  - **Phase 2 (15-35%)**: *Pre-Infusion Flow* (Injecting low pressure water).
  - **Phase 3 (35-85%)**: *Peak Extraction* (Ramping up to optimal 9.2 Bar with hot thermo-waves).
  - **Phase 4 (85-100%)**: *Final Pressure Release* (Lowering pressure locks to prevent over-extraction).
- Renders an active, glowing concentric outer progress dial and dynamic telemetry pulse overlays.

### 2.3 Monotone reference Graph polish
- Optimized **[LiveTelemetryChart.tsx](file:///e:/folex/Elenza/client/src/components/dashboard/LiveTelemetryChart.tsx)** with monotone interpolation splines for high-accuracy pathings.
- Placed target reference baselines:
  - **9.2 Bar** reference line for extraction pressure.
  - **92.4°C** reference line for thermo-boiler temperature.
- Added cartesian grids (`stroke="rgba(255,255,255,0.03)"`) and smooth `ease-in-out` path transitions.

### 2.4 Mapped Telemetry & Caching Loop (0.0 bar Bug Fix)
- Refactored **[useTuyaSync.ts](file:///e:/folex/Elenza/client/src/hooks/useTuyaSync.ts)**'s `machine_status` listener to cache client-side brewing curves. 
- If a client-side extraction session is triggered, incoming idle backend telemetry values (`pressure: 0.0`) are ignored until the brew sequence completes, completely resolving the 0.0 bar override bug.

---

## 3. Core Architecture Snapshot

### Frontend (`/client`)
- **Framework**: Next.js (React 18)
- **Styling**: TailwindCSS v4. Deep dark background (`#040406`) and `#e0b47b` (Gold) / `#38bdf8` (Cyan) highlights.

### Backend (`/server`)
- **Framework**: Node.js + Express + TypeScript

## Recovery Instructions
If the system crashes or fails:
1. Validate backend environment credentials in `server/.env`.
2. Run `npm install` in both `/client` and `/server`.
3. Boot the local server stack: `npm run dev` in `/server` and `npm run dev` in `/client`.
