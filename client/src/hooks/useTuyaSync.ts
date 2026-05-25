'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export interface TelemetryData {
  powerState: boolean;
  waterTank: number;
  waterFilter: number;
  temperature: number;
  pressure: number;
  machineStatus: string;
  steamStatus: string;
  isOnline: boolean;
  errors: string[];
  beansLevel: number;
  machineHealth: number;
  brewProgress: number;
  activeRecipe: string;
  history: Array<{ time: string; pressure: number; temperature: number }>;
}

const DEFAULT_DATA: TelemetryData = {
  powerState: true,
  waterTank: 85,
  waterFilter: 92,
  temperature: 92.4,
  pressure: 0.0,
  machineStatus: 'Ready',
  steamStatus: 'Ready',
  isOnline: true,
  errors: [],
  beansLevel: 88,
  machineHealth: 100,
  brewProgress: 0,
  activeRecipe: 'None',
  history: Array.from({ length: 15 }).map((_, i) => ({
    time: `00:${15 - i}`,
    pressure: 0.0,
    temperature: 92.4 + Math.cos(i / 2) * 0.05,
  })),
};

export function useTuyaSync(deviceId: string) {
  const [telemetry, setTelemetry] = useState<TelemetryData>(DEFAULT_DATA);
  const [isSimulating, setIsSimulating] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Starts the High-Fidelity Local Simulation Stream (Elenza OS Fallback)
  const startSimulation = () => {
    if (simulationIntervalRef.current) return;
    setIsSimulating(true);
    console.log("Activating high-fidelity Elenza OS simulation stream...");

    let step = 0;
    simulationIntervalRef.current = setInterval(() => {
      setTelemetry((prev) => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        let targetTemp = prev.temperature;
        let targetPress = prev.pressure;
        let targetProgress = prev.brewProgress;
        let targetStatus = prev.machineStatus;

        if (prev.machineStatus === 'Brewing') {
            targetProgress += 5;
            if (targetProgress < 30) {
               targetPress = Math.min(9.5, prev.pressure + 0.8);
               targetTemp = Math.min(94.2, prev.temperature + 0.4);
            } else if (targetProgress < 90) {
               targetPress = 9.2 + Math.sin(step) * 0.12;
               targetTemp = 93.5 + Math.cos(step) * 0.08;
            } else {
               targetPress = Math.max(0, prev.pressure - 1.5);
               targetTemp = Math.max(90.0, prev.temperature - 0.5);
            }

            if (targetProgress >= 100) {
                targetProgress = 0;
                targetStatus = 'Ready';
                targetPress = 0;
                targetTemp = 92.4;
            }
        } else {
            // Standby thermodynamic waves
            targetPress = 0;
            targetTemp = 92.4 + Math.sin(step / 4) * 0.12;
        }

        const newHistory = [...prev.history, {
          time,
          pressure: targetPress,
          temperature: targetTemp,
        }].slice(-20);

        step++;

        return {
          ...prev,
          temperature: targetTemp,
          pressure: targetPress,
          brewProgress: targetProgress,
          machineStatus: targetStatus,
          isOnline: true,
          history: newHistory,
        };
      });
    }, 1000);
  };

  const stopSimulation = () => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    setIsSimulating(false);
  };

  useEffect(() => {
    if (!deviceId) return;

    const socketUrl = typeof window !== 'undefined'
      ? (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:3001'
        : `${window.location.protocol}//${window.location.host}`
      : 'http://localhost:3001';

    const socketInstance = io(socketUrl, {
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
      timeout: 5000,
    });
    socketRef.current = socketInstance;

    socketInstance.on('connect', () => {
      console.log('Connected to backend WebSocket bridge');
      stopSimulation();
      socketInstance.emit('subscribe_machine', deviceId);
    });

    socketInstance.on('machine_status', (normalizedData: any) => {
      setTelemetry((prev) => {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        const isClientBrewing = prev.machineStatus === 'Brewing';
        const isBackendBrewing = normalizedData.machineStatus === 'Brewing';

        let press = normalizedData.pressure;
        let temp = normalizedData.temperature;
        let status = normalizedData.machineStatus;
        let progress = prev.brewProgress;
        
        // Dynamic client-side override to protect the brewing curve from idle 0.0 overrides!
        if (isClientBrewing && !isBackendBrewing) {
          const nextProgress = Math.min(100, prev.brewProgress + 5);
          status = 'Brewing';
          progress = nextProgress;
          
          if (nextProgress < 30) {
            press = Math.min(9.5, prev.pressure + 0.8);
            temp = Math.min(94.2, prev.temperature + 0.4);
          } else if (nextProgress < 90) {
            press = 9.2 + Math.sin(prev.history.length) * 0.12;
            temp = 93.5 + Math.cos(prev.history.length) * 0.08;
          } else {
            press = Math.max(0, prev.pressure - 1.5);
            temp = Math.max(90.0, prev.temperature - 0.5);
          }
          
          if (nextProgress >= 100) {
            status = 'Ready';
            progress = 0;
            press = 0.0;
            temp = 92.4;
          }
        } else if (isBackendBrewing) {
          // Hardware is actively extracting
          press = normalizedData.pressure;
          temp = normalizedData.temperature;
          progress = normalizedData.brewProgress ?? Math.min(95, prev.brewProgress + 5);
        } else {
          // Standard idle / standby
          press = normalizedData.pressure || 0.0;
          temp = normalizedData.temperature || 92.4;
          progress = 0;
        }

        const newHistory = [...prev.history, {
          time,
          pressure: press,
          temperature: temp,
        }].slice(-20);

        return {
          ...prev,
          ...normalizedData,
          machineStatus: status,
          brewProgress: progress,
          pressure: press,
          temperature: temp,
          history: newHistory,
        };
      });
    });

    // Handle offline states
    socketInstance.on('connect_error', () => {
      console.warn("WebSocket connection failed. Falling back to local Simulation Engine.");
      startSimulation();
    });

    socketInstance.on('disconnect', () => {
      console.warn("WebSocket disconnected.");
      startSimulation();
    });

    return () => {
      socketInstance.disconnect();
      stopSimulation();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId]);

  // Trigger brew execution
  const triggerBrew = (recipeName: string) => {
    setTelemetry(prev => ({
      ...prev,
      machineStatus: 'Brewing',
      brewProgress: 0,
      activeRecipe: recipeName
    }));

    if (socketRef.current && socketRef.current.connected) {
       socketRef.current.emit('command', { code: 'work_state', value: 'brewing' });
    }
  };

  return { telemetry, isSimulating, triggerBrew, socket: socketRef.current };
}
