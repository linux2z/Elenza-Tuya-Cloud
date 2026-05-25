# Elenza Platform - Development Steps

## Architecture
- Client: Next.js (React 18), TailwindCSS, Framer Motion, Recharts, Socket.io-client
- Server: Node.js, Express, TypeScript, Socket.io, Tuya Cloud SDK
- Infrastructure: PM2, Nginx, Ubuntu VPS, Elenza IoT Cloud

## Folder Structure
Currently initializing monorepo structure:
- `/client`: Next.js frontend (Tesla-grade UI)
- `/server`: Node.js backend (Real-time Tuya polling bridge)

## Environment Setup
- Local: Windows
- Server: 54.162.197.40 (Ubuntu 26.04 LTS)

## Current Progress
- [x] Analyzed requirements and server environment
- [x] Setup Elenza/Tuya real-time websocket bridge
- [x] Implemented telemetry normalization engine & dynamic parser
- [x] Generated photorealistic machine assets (matte black & gold accents)
- [x] Rebuilt Tesla-grade dashboard with Recharts basis glow curves & Framer Motion
- [x] Configured backend Tuya SDK with dynamic device-mapping protocol (PID: zt36shl6ah0sffsj)
- [x] Scaffolded Express Server and socket handlers
- [x] Implemented high-fidelity Auto-Simulation Fallback Engine to handle offline machine states
- [x] Designed luxury Operating System HUD status cards, circular brew dial, recipe carousel, and activity log stream
- [x] Refactored Recipe Carousel with smooth snap-scrolling, chevron controls, and horizontal momentum fade indicators
- [x] Restored premium cinematic single-column dashboard under max-width 540px, optimizing card proportions, larger recipe cards, visual breathing rhythm, and cinematic centerpiece hero machine depth
- [x] Upgraded to v8.0: brand-pure machine asset (zero text), dynamic concentric brew ring animations, trailing snapping padding spacers, polished charts with neon glows, HSL activity logging, and intelligent active-brewing thermodynamic fallback streams
- [x] Upgraded to v9.0: Centralized Machine Asset Architecture, created `/public/assets/machines` asset registry directories, decoupled visual resources, and implemented dynamic model loader metadata in `machineAssets.ts`
- [x] Upgraded to v10.0: Transitioned to a true multi-screen mobile app routing system. Implemented dedicated `/home` cinematic showcases, `/brewing` laboratories with rotating timers, `/recipes` customized fine-tuners, `/statistics` bar charts, and `/profile` maintenance triggers
- [x] Upgraded to v11.0: Resolved bottom navigation visual clipping and alignment issues. Integrated `overflow-visible`, safe-area dynamic heights (`h-[84px]`), and designed an elevated floating golden disk `CenterNavItem` for the Brew Lab button
- [x] Upgraded to v12.0: Architected a three-layered BottomNavWrapper (MainBottomNav Backdrop < FloatingCenterButton < FloatingQuickActions Overlay) with strict z-index hierarchies, completely separating the interactive elements from the background plate to permanently eliminate clipping bugs and visual overlap collisions across all resolutions
- [x] Upgraded to v13.0: Eliminated the obsolete duplicate `BottomNavigation` from `MainLayout.tsx` which was causing bottom-row icon overlaps, and configured a dynamic bottom padding (`style={{ paddingBottom: 'calc(160px + env(safe-area-inset-bottom))' }}`) on `page.tsx` to reserve clear safe-area space and completely avoid any content overlaps
- [x] Upgraded to v14.0: Mapped advanced cinematic glow overlays and skewed linear glossy reflection animations to the machine hero section; enriched lower Home Screen density (Recipe Previews, Weekly stats widget, Barista AI Recommendations, Timeline logs); integrated four immersive brewing phases in the Brew Lab; polished graphs with monotone splines and reference lines; solved the 0.0 bar override bug by implementing client-side sync caching in `useTuyaSync.ts`
- [x] Upgraded to v14.1: Cleaned up Home Screen aesthetics by removing the floating Elenza Cinematic Home OS text badge from the hero machine card
- [x] Upgraded to v15.0: Deployed the entire Elenza platform to the Ubuntu 26.04 VPS server (54.162.197.40); built Next.js for production after activating 2GB virtual swap memory; configured Nginx reverse proxy routing for port 3000 (Next.js) and port 3001 (Express API and WebSocket upgrader); daemonized both processes in PM2 with process lists saved for automated reboots.
- [x] Upgraded to v15.1: Configured dual HTTP (Port 80) and HTTPS (Port 443) reverse proxying with a self-signed SSL certificate in Nginx on the VPS to support browsers that automatically force-upgrade IP connections to `https://`.

## Known Issues
- External client access to http://54.162.197.40 and https://54.162.197.40 requires opening Port 80 and Port 443 in the AWS Security Group.

## Pending Work
- None (Deployment successfully finalized).
