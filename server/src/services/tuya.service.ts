import { TuyaContext } from '@tuya/tuya-connector-nodejs';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Tuya Context
const tuya = new TuyaContext({
  baseUrl: process.env.TUYA_ENDPOINT || 'https://openapi.tuyaeu.com',
  accessKey: process.env.TUYA_ACCESS_ID || '',
  secretKey: process.env.TUYA_ACCESS_SECRET || '',
});

export const TuyaService = {
  /**
   * Fetch all devices associated with the Tuya project/user
   */
  async getDevices() {
    try {
      // Typically requires a project code or user ID. Assuming we query by project if applicable
      // Alternatively, we return a known device from ENV for this specific machine platform.
      // Since it's a dedicated Elenza platform, returning the primary device ID from env:
      if (!process.env.TUYA_DEVICE_ID) throw new Error("TUYA_DEVICE_ID env variable is missing");
      
      const response = await tuya.request({
        method: 'GET',
        path: `/v1.0/iot-03/devices/${process.env.TUYA_DEVICE_ID}`,
      });
      return response.result;
    } catch (error) {
      console.error('Tuya API Error (getDevices):', error);
      throw error;
    }
  },

  /**
   * Fetch current DP (Data Point) status for a device
   * @param deviceId The Tuya Device ID
   */
  async getDeviceStatus(deviceId: string) {
    if (!deviceId) throw new Error("Device ID is required");
    try {
      const response = await tuya.request({
        method: 'GET',
        path: `/v1.0/iot-03/devices/${deviceId}/status`,
      });
      return response.result;
    } catch (error) {
      console.error(`Tuya API Error (getDeviceStatus ${deviceId}):`, error);
      throw error;
    }
  },

  /**
   * Fetch device specifications and Data Point mappings
   */
  async getDeviceSchema(deviceId: string) {
    if (!deviceId) throw new Error("Device ID is required");
    try {
      const response = await tuya.request({
        method: 'GET',
        path: `/v1.0/iot-03/devices/${deviceId}/specifications`,
      });
      return response.result;
    } catch (error) {
      console.error(`Tuya API Error (getDeviceSchema ${deviceId}):`, error);
      throw error;
    }
  },

  /**
   * Send a command to a specific device Data Point (DP)
   * @param deviceId The Tuya Device ID
   * @param commands Array of commands { code: string, value: any }
   */
  async sendCommand(deviceId: string, commands: { code: string; value: any }[]) {
    if (!deviceId) throw new Error("Device ID is required");
    try {
      const response = await tuya.request({
        method: 'POST',
        path: `/v1.0/iot-03/devices/${deviceId}/commands`,
        body: {
          commands,
        },
      });
      return response.result;
    } catch (error) {
      console.error('Tuya API Error (sendCommand):', error);
      throw error;
    }
  }
};
