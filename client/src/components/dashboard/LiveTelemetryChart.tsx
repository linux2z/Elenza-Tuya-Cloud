'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

interface ChartProps {
  data: Array<{ time: string; pressure: number; temperature: number }>;
  type: 'pressure' | 'temperature';
}

export default function LiveTelemetryChart({ data, type }: ChartProps) {
  const isPressure = type === 'pressure';
  const color = isPressure ? '#38bdf8' : '#e0b47b'; // Cyan for pressure, Gold for Temp
  const dataKey = isPressure ? 'pressure' : 'temperature';
  
  // Clean fallback data that pulses slightly to keep charts dynamic when loading
  const chartData = data.length > 0 ? data : Array.from({ length: 15 }).map((_, i) => ({
    time: `00:${15 - i}`,
    pressure: 9.1 + Math.sin(i / 1.5) * 0.15,
    temperature: 92.4 + Math.cos(i / 1.5) * 0.1,
  }));

  // Custom glassmorphic tooltip with high contrast HSL colors
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0b0b0d]/95 backdrop-blur-2xl border border-white/[0.08] p-3.5 rounded-[20px] shadow-[0_12px_32px_rgba(0,0,0,0.6)]">
          <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-1.5">{payload[0].payload.time}</p>
          <div className="flex items-center space-x-2">
             <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
             <span className="text-xs font-black text-zinc-200 tracking-tight">
               {payload[0].value.toFixed(1)} {isPressure ? 'bar' : '°C'}
             </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-36 relative">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 12, right: 6, left: -26, bottom: 0 }}>
          <defs>
             {/* Dynamic neon linear gradients */}
             <linearGradient id={`color-${type}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={color} stopOpacity={0.15}/>
                <stop offset="50%" stopColor={color} stopOpacity={0.95}/>
                <stop offset="100%" stopColor={color} stopOpacity={0.15}/>
             </linearGradient>
             {/* High fidelity glow drops */}
             <filter id={`glow-${type}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
             </filter>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
          
          {/* Target Extraction Baseline references for Tesla-grade telemetry feel */}
          {isPressure ? (
            <ReferenceLine y={9.2} stroke="rgba(56,189,248,0.15)" strokeDasharray="5 5" label={{ value: 'Target 9.2 Bar', fill: 'rgba(56,189,248,0.4)', fontSize: 7, position: 'insideRight', fontWeight: 'bold' }} />
          ) : (
            <ReferenceLine y={92.4} stroke="rgba(224,180,123,0.15)" strokeDasharray="5 5" label={{ value: 'Target 92.4°C', fill: 'rgba(224,180,123,0.4)', fontSize: 7, position: 'insideRight', fontWeight: 'bold' }} />
          )}

          <XAxis 
            dataKey="time" 
            stroke="transparent" 
            fontSize={9} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: '#ffffff25', fontWeight: 'semibold', fontFamily: 'monospace' }}
          />
          <YAxis 
            stroke="transparent" 
            fontSize={9} 
            tickLine={false} 
            axisLine={false} 
            domain={isPressure ? [0, 12] : [85, 98]} 
            tick={{ fill: '#ffffff25', fontWeight: 'semibold', fontFamily: 'monospace' }}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Layer 1: Ambient Backdrop Shadow Line */}
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color}
            strokeWidth={1.5}
            opacity={0.35}
            dot={false}
            filter={`url(#glow-${type})`}
            animationDuration={600}
            animationEasing="ease-in-out"
          />

          {/* Layer 2: Main Radiant Telemetry Curve */}
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={`url(#color-${type})`}
            strokeWidth={3} 
            dot={false}
            activeDot={{ r: 5, fill: color, stroke: '#040406', strokeWidth: 3 }}
            animationDuration={600}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
