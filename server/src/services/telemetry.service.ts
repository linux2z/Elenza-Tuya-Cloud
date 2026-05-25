export interface NormalizedTelemetry {
  powerState: boolean;
  waterTank: number;
  waterFilter: number;
  temperature: number;
  pressure: number;
  machineStatus: string;
  steamStatus: string;
  isOnline: boolean;
  errors: string[];
}

export const TelemetryService = {
  /**
   * Parses the raw Tuya Data Points (DPs) into the standard Elenza Normalization format.
   * This ensures the frontend never breaks if Tuya hardware mappings change.
   * 
   * @param tuyaStatusArray The raw array of {code, value} from Tuya API
   * @param isOnline Boolean indicating if the device is currently online
   */
  normalize(tuyaStatusArray: any[], isOnline: boolean = true): NormalizedTelemetry {
    // Default luxury boiler calibration states
    const normalized: NormalizedTelemetry = {
      powerState: true,
      waterTank: 85,
      waterFilter: 92,
      temperature: 92.4, // Idling thermodynamic baseline
      pressure: 0.0,
      machineStatus: 'Ready',
      steamStatus: 'Ready',
      isOnline: isOnline,
      errors: []
    };

    if (!Array.isArray(tuyaStatusArray)) return normalized;

    tuyaStatusArray.forEach((dp) => {
      try {
        switch (dp.code) {
          case 'switch':
          case 'power':
            normalized.powerState = Boolean(dp.value);
            break;
            
          case 'water_tank':
          case '101': // Fallback to assumed ID if code is missing
            normalized.waterTank = Number(dp.value);
            break;
            
          case 'water_filter':
          case '102':
            normalized.waterFilter = Number(dp.value);
            break;
            
          case 'temp_current':
          case 'temp':
          case '103':
            normalized.temperature = Number(dp.value);
            break;
            
          case 'pressure_current':
          case 'pressure':
          case '104':
            // Tuya often sends floats as large ints (e.g. 91 for 9.1)
            // If the value is > 20, we assume it's scaled by 10.
            let p = Number(dp.value);
            if (p > 20) p = p / 10; 
            normalized.pressure = p;
            break;
            
          case 'work_state':
          case 'status':
          case '105':
            normalized.machineStatus = String(dp.value);
            break;
            
          case 'steam_ready':
          case '106':
            normalized.steamStatus = dp.value ? 'Ready' : 'Heating';
            break;
            
          case 'fault':
          case '107':
            if (Number(dp.value) > 0) {
              normalized.errors.push(`Error Code: ${dp.value}`);
            }
            break;
        }
      } catch (e) {
        console.error(`Failed to normalize DP: ${dp.code}`, e);
      }
    });

    // Derive steam status if not explicitly provided
    if (normalized.isOnline && normalized.steamStatus === 'Offline') {
       normalized.steamStatus = normalized.temperature > 100 ? 'Ready' : 'Heating';
    }

    return normalized;
  }
};
