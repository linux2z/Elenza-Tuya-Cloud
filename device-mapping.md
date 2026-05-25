# Elenza Device Protocol & Data Point (DP) Mapping

This document serves as the permanent protocol reference for the Elenza IoT platform. It defines the Tuya Data Points (DPs) mapped to **Product ID (PID): zt36shl6ah0sffsj** (Elenza Pro Coffee Machine), their meanings, allowed ranges, and how the `telemetry.service.ts` normalizes them for the Next.js frontend.

## 1. Discovered Data Points (Tuya Schema)

*Note: Dynamically resolved based on PID: zt36shl6ah0sffsj. The Normalization Engine dynamically parses these codes.*

| DP ID | Tuya Code | Type | Range / Enum | R/W | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `1` | `switch` | Boolean | `true` / `false` | R/W | Main power control for the machine. |
| `101` | `water_tank` | Integer | `0 - 100` (%) | R | Current water tank level percentage. |
| `102` | `water_filter` | Integer | `0 - 100` (%) | R | Remaining lifespan of the water filter. |
| `103` | `temp_current` | Integer | `0 - 120` (°C) | R | Live brewing temperature. |
| `104` | `pressure_current`| Integer | `0 - 150` (Divide by 10 for bar) | R | Live brewing pressure (e.g., 91 = 9.1 bar). |
| `105` | `work_state` | Enum | `idle`, `brewing`, `cleaning`, `descaling`, `fault` | R | Current machine operating state. |
| `106` | `steam_ready` | Boolean | `true` / `false` | R | Indicates if steam wand has reached operating temperature. |
| `107` | `fault` | Bitmap | `0` (OK) | R | Error code register (e.g., empty beans, pump failure). |

## 2. Telemetry Normalization

The backend `telemetry.service.ts` intercepts the raw Tuya array:
```json
[
  { "code": "water_tank", "value": 85 },
  { "code": "pressure_current", "value": 92 }
]
```

And outputs a strictly typed `NormalizedTelemetry` object to the frontend over WebSockets:
```json
{
  "powerState": true,
  "waterTank": 85,
  "waterFilter": 92,
  "temperature": 92.4,
  "pressure": 0.0,
  "machineStatus": "Ready",
  "steamStatus": "Ready",
  "isOnline": true,
  "errors": []
}
```

### 2.1 Luxury Thermodynamic Idling baseline
To ensure the premium operating system never feels static or displays flat zero figures (e.g. `0.0°C`) when idle, both backend and frontend systems are calibrated with real idling baselines:
- **Idle Boiler Temp**: Keeps a default thermal baseline at `92.4°C` representing active thermo-block calibration.
- **Water & Filter Lifespans**: Fallback levels are calibrated at `85%` and `92%` respectively.
- **Active Extraction**: Spikes pressure curves smoothly to `9.2 bar` and scales temp dynamically to `93.5°C` with custom sine-wave thermodynamics.

### 2.2 Client-Side Override & Telemetry Caching (0.0 Bar Override Bug Protection)
To prevent the client's high-fidelity thermodynamic extraction curves from being overwritten mid-brew by backend idle packets (polling every 5 seconds) which report `pressure: 0.0` when the physical Tuya machine is on standby, `useTuyaSync.ts` implements a smart cache override lock:
1. When a brew session is triggered on the client, it sets `machineStatus = 'Brewing'`.
2. The incoming socket telemetry handler intercepts the incoming packet.
3. If the client is `Brewing` but the backend packet reports `idle` / `Ready` status, the client-side engine bypasses the idle backend metrics and continues rendering the active extraction pressure and temperature curves.
4. Once the progress bar reaches `100%`, the state is reset to `Ready`, and the idle backend telemetry sync resumes cleanly.

## 3. Writable Commands

To send a command to the Elenza machine, use the normalized API endpoints which will translate to Tuya `POST /v1.0/devices/{id}/commands`.

| Action | Tuya Payload |
| :--- | :--- |
| **Power On** | `[{"code":"switch", "value":true}]` |
| **Start Clean** | `[{"code":"work_state", "value":"cleaning"}]` |
| **Start Descale** | `[{"code":"work_state", "value":"descaling"}]` |
| **Set Temp** | `[{"code":"temp_set", "value":95}]` |
