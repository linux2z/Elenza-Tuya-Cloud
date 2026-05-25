# AGENT.MD — PREMIUM SMART COFFEE MACHINE WEB APPLICATION

## PROJECT TYPE

This is NOT a simple webpage.

This project must be developed as a complete enterprise-grade WEB APPLICATION platform for smart coffee machines and IoT ecosystem management.

The application should feel like:

* Tesla-style dashboard ecosystem
* Premium IoT operating platform
* Luxury smart appliance management system
* Commercial coffee machine cloud platform

The UI/UX must closely match the provided design references:

* Dark luxury interface
* Premium modern dashboard
* Elegant animations
* Matte black + bronze/gold color system
* High-end mobile-first experience

---

# PRIMARY OBJECTIVE

Develop a modular, scalable, maintainable, and enterprise-grade smart coffee machine web application platform with:

* Real-time telemetry
* Coffee machine monitoring
* Recipe management
* Live brewing analytics
* Device management
* User management
* Notifications
* Statistics
* Cloud synchronization
* Future OTA architecture
* Future MQTT/WebSocket expansion

This system must be production-ready and future-proof.

---

# IMPORTANT DEVELOPMENT RULES

## CRITICAL

DO NOT build this as:

* Simple HTML page
* Vanilla JS dashboard
* Monolithic application
* Single-file frontend
* Hardcoded architecture

The system MUST be:

* Modular
* Component-based
* Enterprise scalable
* AI maintainable
* Easy to extend
* Easy to debug
* Easy to refactor
* Easy to add future modules

---

# REQUIRED FRONTEND STACK

Frontend MUST use:

* Next.js (latest stable)
* React
* TypeScript
* TailwindCSS
* Framer Motion
* Zustand or Redux Toolkit
* TanStack Query

Frontend architecture must support:

* Dynamic routing
* Shared layouts
* Theme system
* Reusable widgets
* Responsive mobile design
* Modular component system
* Future plugin architecture

---

# REQUIRED BACKEND STACK

Backend MUST use:

* Node.js
* TypeScript
* Modular Express OR NestJS

Preferred architecture:

```bash
/backend
  /controllers
  /services
  /routes
  /middleware
  /utils
  /modules
  /config
  /database
  /websocket
```

Backend must be:

* Layered
* Clean
* Typed
* Reusable
* Secure
* Enterprise-ready

---

# DATABASE REQUIREMENTS

Use:

* PostgreSQL
* Prisma ORM

Database should support:

* Users
* Coffee machines
* Telemetry
* Recipes
* Notifications
* Analytics
* Logs
* Maintenance history
* User preferences

Database structure must be scalable for:

* Multiple users
* Multiple machines
* Multiple locations/cafes

---

# REALTIME REQUIREMENTS

Architecture MUST support:

* WebSockets
* Live telemetry
* Live brewing updates
* Realtime machine status
* Future MQTT support
* Future OTA updates

The UI should update in realtime without manual refresh.

---

# UI/UX REQUIREMENTS

The UI quality must be extremely premium.

The design should feel:

* Elegant
* Luxurious
* Minimal
* Professional
* Technologically advanced

Use:

* Matte dark backgrounds
* Bronze/gold accent colors
* Soft glow effects
* Premium cards
* Smooth transitions
* Fluid animations
* Professional typography
* Beautiful telemetry graphs

Typography:

* Inter
* Manrope
* SF Pro
* Poppins

---

# MOBILE EXPERIENCE

The mobile experience is extremely important.

The app should feel like:

* Native premium mobile app
* High-end smart appliance controller

Use:

* Bottom navigation
* Smooth gestures
* Elegant spacing
* Responsive layouts
* Touch-friendly controls

---

# REQUIRED APPLICATION MODULES

```bash
/modules
  /auth
  /machines
  /recipes
  /analytics
  /telemetry
  /notifications
  /users
  /settings
  /ota
```

Each module must:

* Be isolated
* Reusable
* Maintainable
* Independently expandable

---

# DASHBOARD FEATURES

Dashboard should support:

* Machine overview
* Live telemetry
* Pressure graphs
* Temperature graphs
* Flow rate monitoring
* Brewing progress
* Water usage
* Bean consumption
* Statistics
* Maintenance alerts
* Notifications

---

# MACHINE CONTROL FEATURES

Support:

* Brew control
* Temperature adjustment
* Pressure control
* Steam controls
* Cleaning cycles
* Calibration settings
* Recipe presets

Architecture must support adding new machine types later.

---

# PERFORMANCE REQUIREMENTS

The application must:

* Load very fast
* Use lazy loading
* Use code splitting
* Optimize rendering
* Optimize API requests
* Use proper caching
* Minimize rerenders

---

# SECURITY REQUIREMENTS

Must include:

* JWT authentication
* Role-based access
* Protected APIs
* Input validation
* Rate limiting
* Secure headers
* Secure environment handling
* API sanitization

---

# DEPLOYMENT REQUIREMENTS

The application must support:

* Ubuntu VPS
* PM2 Process Manager
* Nginx reverse proxy
* SSL
* Production environment configs

The user will provide:

* SSH access
* VPS access
* Cloud API credentials

Use `.env` architecture properly.

Never hardcode secrets.

---

# AI MAINTAINABILITY REQUIREMENTS

This is EXTREMELY IMPORTANT.

Future AI agents must easily:

* Understand architecture
* Add modules
* Add APIs
* Extend telemetry
* Add machine support
* Modify UI safely

WITHOUT rewriting the whole platform.

The codebase must remain:

* Predictable
* Structured
* Typed
* Modular
* Enterprise-grade

---

# DEVELOPMENT PHASES

## PHASE 1

* Project architecture
* Design system
* Authentication
* Core layouts
* Dashboard foundation

## PHASE 2

* Machine telemetry
* Realtime systems
* Recipe management
* Analytics system

## PHASE 3

* Notifications
* Admin system
* OTA architecture
* Cloud synchronization

## PHASE 4

* Optimization
* Testing
* Production deployment
* Documentation

---

# FINAL DEVELOPMENT RULE

DO NOT think like a simple webpage developer.

Think like:

* Enterprise SaaS architect
* IoT systems engineer
* Production software engineer
* Premium product designer

The final result must feel like a world-class premium smart coffee machine ecosystem platform.
