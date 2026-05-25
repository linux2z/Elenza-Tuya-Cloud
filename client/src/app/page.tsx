'use client';

import React, { useState, useRef } from 'react';
import { 
  Menu, Bell, Droplet, Activity, Power, Settings as SettingsIcon, 
  ChevronLeft, ChevronRight, Coffee, Heart, Calendar, Award, Zap, ShieldCheck,
  RefreshCw, CheckCircle2, Info, AlertTriangle, User, Sliders, BarChart3, Wrench,
  ChevronDown, Flame, Timer, Sparkles
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTuyaSync } from '@/hooks/useTuyaSync';
import LiveTelemetryChart from '@/components/dashboard/LiveTelemetryChart';
import { activeMachine } from '@/config/machineAssets';

interface Recipe {
  name: string;
  beans: string;
  volume: string;
  temp: string;
  time: string;
  intensity: number;
  grindSize?: number; // customized parameter
  yieldVolume?: number; // customized parameter
  targetTemp?: number; // customized parameter
}

const INITIAL_RECIPES: Recipe[] = [
  { name: 'Double Espresso', beans: '18g', volume: '36ml', temp: '93°C', time: '28s', intensity: 5, grindSize: 18, yieldVolume: 36, targetTemp: 93 },
  { name: 'Flat White', beans: '18g', volume: '150ml', temp: '91°C', time: '25s', intensity: 3, grindSize: 18, yieldVolume: 150, targetTemp: 91 },
  { name: 'Americano', beans: '16g', volume: '200ml', temp: '94°C', time: '30s', intensity: 4, grindSize: 16, yieldVolume: 200, targetTemp: 94 },
  { name: 'Macchiato', beans: '18g', volume: '60ml', temp: '92°C', time: '24s', intensity: 4, grindSize: 18, yieldVolume: 60, targetTemp: 92 }
];

export default function Home() {
  const { telemetry, isSimulating, triggerBrew } = useTuyaSync(activeMachine.pid);
  const [activeScreen, setActiveScreen] = useState<'home' | 'recipes' | 'brewing' | 'statistics' | 'profile' | 'recipe-details'>('home');
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>(recipes[0]);
  const recipeCarouselRef = useRef<HTMLDivElement>(null);

  // Customized recipe parameter sliders
  const [tempRecipe, setTempRecipe] = useState<Recipe>(recipes[0]);

  // Notifications drawer state
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(true);
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 1,
      type: 'success',
      title: 'System Diagnostic Optimal',
      message: 'Water filtration status is 94% optimal. No action required.',
      time: '2 mins ago'
    },
    {
      id: 2,
      type: 'info',
      title: 'Flat White Brew Logged',
      message: 'Double shot Flat White brewed successfully. Temperature stability: 93.5°C.',
      time: '20 mins ago'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Maintenance Alert',
      message: 'Descaling scheduled in 14 days. Clean kit available.',
      time: '1 hour ago'
    },
    {
      id: 4,
      type: 'info',
      title: 'IoT Cloud Bridge Active',
      message: 'Elenza connected securely to Tuya Smart Cloud endpoint.',
      time: '3 hours ago'
    }
  ]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (recipeCarouselRef.current) {
      const scrollAmount = direction === 'left' ? -290 : 290;
      recipeCarouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const isBrewing = telemetry.machineStatus === 'Brewing';

  // Navigate to customized Recipe Details screen
  const openRecipeDetails = (recipe: Recipe) => {
    setTempRecipe({ ...recipe });
    setActiveScreen('recipe-details');
  };

  // Save recipe configurations
  const saveRecipeConfig = () => {
    setRecipes(prev => prev.map(r => r.name === tempRecipe.name ? { 
      ...tempRecipe, 
      beans: `${tempRecipe.grindSize}g`, 
      volume: `${tempRecipe.yieldVolume}ml`, 
      temp: `${tempRecipe.targetTemp}°C` 
    } : r));
    setSelectedRecipe({ 
      ...tempRecipe, 
      beans: `${tempRecipe.grindSize}g`, 
      volume: `${tempRecipe.yieldVolume}ml`, 
      temp: `${tempRecipe.targetTemp}°C` 
    });
    setActiveScreen('recipes');
  };

  const handleTriggerBrewFromRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    triggerBrew(recipe.name);
    setActiveScreen('brewing');
  };

  // Switcher variants for premium slide transitions
  const screenVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  // Calculate brewing phase based on progress
  const getBrewingPhase = (progress: number) => {
    if (progress < 15) return { name: 'Boiler Preheating', desc: 'Saturating pressure block and pre-heating boiler elements...', color: 'text-amber-400' };
    if (progress < 35) return { name: 'Pre-Infusion Flow', desc: 'Injecting low pressure water to saturate espresso bed...', color: 'text-[#e0b47b]' };
    if (progress < 85) return { name: 'Peak Extraction', desc: 'Ramping up pump to optimal 9.2 Bar with hot thermo-waves...', color: 'text-[#38bdf8]' };
    return { name: 'Final Pressure Release', desc: 'Lowering pressure locks to prevent over-extraction...', color: 'text-emerald-400' };
  };

  const brewingPhase = getBrewingPhase(telemetry.brewProgress);

  return (
    <div 
      style={{ paddingBottom: 'calc(160px + env(safe-area-inset-bottom))' }}
      className="flex flex-col min-h-screen bg-[#040406] text-white font-sans selection:bg-[#e0b47b]/30"
    >
      
      {/* Top Premium Logo Header */}
      <header className="sticky top-0 bg-[#040406]/92 backdrop-blur-3xl z-50 border-b border-white/[0.02]">
        <div className="max-w-[540px] mx-auto w-full flex justify-between items-center px-6 py-6">
          <motion.button whileTap={{ scale: 0.9 }} className="text-zinc-500 hover:text-white p-1 cursor-pointer">
            <Menu className="w-5 h-5" />
          </motion.button>
          
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-bold text-[#e0b47b]/80 tracking-[0.4em] uppercase mb-0.5">
               IoT Smart Ecosystem
            </span>
            <h1 className="text-xl font-light tracking-[0.35em] text-white">
               E L E N Z A
            </h1>
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-[#e0b47b]/50 to-transparent mt-1" />
          </div>

          <div className="flex items-center space-x-3">
            {isSimulating && (
              <span className="text-[9px] font-extrabold text-[#e0b47b] border border-[#e0b47b]/20 bg-[#e0b47b]/5 px-2 py-0.5 rounded-full tracking-wider animate-pulse">
                 DEMO MODE
              </span>
            )}
            <motion.button 
              whileTap={{ scale: 0.9 }} 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setUnreadNotifications(false);
              }}
              className={`relative p-1 cursor-pointer transition-colors ${showNotifications ? 'text-[#e0b47b]' : 'text-zinc-500 hover:text-white'}`}
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#e0b47b] rounded-full border border-[#040406] shadow-[0_0_8px_#e0b47b]"></span>
              )}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Notifications Slide-down Drawer */}
      <AnimatePresence>
        {showNotifications && (
          <>
            {/* Backdrop Overlay */}
            <div 
              className="fixed inset-0 bg-[#040406]/60 backdrop-blur-sm z-40" 
              onClick={() => setShowNotifications(false)}
            />
            
            {/* Drawer Body */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="absolute top-20 right-6 left-6 max-w-[492px] mx-auto bg-[#0b0c10]/95 border border-white/[0.04] rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.03)] backdrop-blur-2xl z-50"
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/[0.04]">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-[#e0b47b]" />
                  <h3 className="text-sm font-semibold tracking-wider uppercase text-white">System Alerts</h3>
                </div>
                <button 
                  onClick={() => {
                    setNotificationsList([]);
                    setUnreadNotifications(false);
                  }}
                  className="text-[10px] uppercase tracking-wider text-[#e0b47b]/80 hover:text-white transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                {notificationsList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle2 className="w-8 h-8 text-zinc-600 mb-2 opacity-50" />
                    <p className="text-xs text-zinc-500 font-light">All systems optimal. No alerts.</p>
                  </div>
                ) : (
                  notificationsList.map((notif) => (
                    <div 
                      key={notif.id}
                      className="group flex items-start space-x-3 bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.02] hover:border-white/[0.06] rounded-xl p-3 transition-all duration-200"
                    >
                      <div className="mt-0.5">
                        {notif.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {notif.type === 'info' && <Info className="w-4 h-4 text-sky-500" />}
                        {notif.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-baseline">
                          <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">{notif.title}</h4>
                          <span className="text-[9px] text-zinc-500 font-light">{notif.time}</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 font-light mt-1 leading-relaxed">{notif.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Multi-Screen Core Layout */}
      <main className="grow max-w-[540px] mx-auto w-full px-6 py-8">
        
        <AnimatePresence mode="wait">
          
          {/* ==================== HOME SCREEN (Design1 Showcase) ==================== */}
          {activeScreen === 'home' && (
            <motion.div 
              key="home"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* Cinematic Centerpiece Hero machine with advanced ambient glows */}
              <section className="relative">
                <div className="relative w-full bg-gradient-to-b from-[#0e0e12] to-[#070709] rounded-[44px] border border-white/[0.04] p-8 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_35px_70px_rgba(0,0,0,0.92)]">
                  {/* Dynamic background pulsing glow */}
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-32 -left-32 w-96 h-96 bg-[#e0b47b] rounded-full blur-[110px] pointer-events-none" 
                  />
                  <motion.div 
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.08, 0.2, 0.08] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#38bdf8] rounded-full blur-[110px] pointer-events-none" 
                  />

                  <div className="flex justify-between items-start mb-6 relative z-20">
                    <div>
                      <span className="text-[10px] text-[#e0b47b] font-bold uppercase tracking-widest block mb-0.5">
                        {activeMachine.name} Platform
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">
                        PID: {activeMachine.pid}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                       <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Online</span>
                    </div>
                  </div>

                  {/* Cinematic reflection glow and linear overlay */}
                  <div className="relative w-full h-80 flex items-center justify-center z-10 my-4 group cursor-pointer">
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="relative w-full h-full"
                    >
                      <Image 
                        src={activeMachine.assets.hero} 
                        alt={`${activeMachine.name} Machine`} 
                        fill 
                        className="object-contain drop-shadow-[0_35px_55px_rgba(0,0,0,0.98)] transition-transform duration-700 group-hover:scale-105"
                        priority
                      />
                    </motion.div>
                    
                    {/* Glossy reflection overlay swipe effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent transform -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-[1200ms] pointer-events-none" />
                  </div>
                </div>
              </section>

              {/* Symmetrical status HUD */}
              <section className="grid grid-cols-3 gap-4">
                <div className="bg-[#0e0e12]/60 rounded-3xl p-5 border border-white/[0.02] text-center relative overflow-hidden group">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 mx-auto mb-2" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1 block">Health</span>
                  <span className="text-base font-extrabold text-zinc-300">{telemetry.machineHealth}%</span>
                </div>
                <div className="bg-[#0e0e12]/60 rounded-3xl p-5 border border-white/[0.02] text-center relative overflow-hidden group">
                  <Zap className="w-4 h-4 text-[#e0b47b] mx-auto mb-2" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1 block">Beans</span>
                  <span className="text-base font-extrabold text-zinc-300">{telemetry.beansLevel}%</span>
                </div>
                <div className="bg-[#0e0e12]/60 rounded-3xl p-5 border border-white/[0.02] text-center relative overflow-hidden group">
                  <Activity className="w-4 h-4 text-cyan-500 mx-auto mb-2" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1 block">Status</span>
                  <span className="text-base font-extrabold text-zinc-300 capitalize truncate block">{telemetry.machineStatus}</span>
                </div>
              </section>

              {/* Intelligent Symmetrical water and filter dual grid */}
              <section className="grid grid-cols-2 gap-6">
                <div className="bg-[#0e0e12]/60 p-6 rounded-[32px] border border-white/[0.02] shadow-xl relative overflow-hidden">
                  <div className="flex items-center space-x-2 mb-5 text-zinc-400 relative z-10">
                    <Droplet className="w-4 h-4 text-[#38bdf8]" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Water Tank</span>
                  </div>
                  <div className="flex items-end justify-between items-center relative z-10">
                    <span className="text-3xl font-extrabold text-zinc-200 tracking-tighter">{telemetry.waterTank || 80}<span className="text-sm text-zinc-600 ml-1 font-medium">%</span></span>
                    <div className="w-2 h-12 bg-[#17171c] rounded-full overflow-hidden flex flex-col justify-end border border-black/40">
                      <div className="w-full bg-gradient-to-t from-[#0284c7] to-[#38bdf8] rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]" style={{ height: `${telemetry.waterTank}%` }} />
                    </div>
                  </div>
                </div>

                <div className="bg-[#0e0e12]/60 p-6 rounded-[32px] border border-white/[0.02] shadow-xl relative overflow-hidden">
                  <div className="flex items-center space-x-2 mb-5 text-zinc-400 relative z-10">
                    <Wrench className="w-4 h-4 text-[#2dd4bf]" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Filter life</span>
                  </div>
                  <div className="flex items-end justify-between items-center relative z-10">
                    <span className="text-3xl font-extrabold text-zinc-200 tracking-tighter">{telemetry.waterFilter || 92}<span className="text-sm text-zinc-600 ml-1 font-medium">%</span></span>
                    <div className="w-2 h-12 bg-[#17171c] rounded-full overflow-hidden flex flex-col justify-end border border-black/40">
                      <div className="w-full bg-gradient-to-t from-[#0d9488] to-[#2dd4bf] rounded-full shadow-[0_0_8px_rgba(45,212,191,0.8)]" style={{ height: `${telemetry.waterFilter}%` }} />
                    </div>
                  </div>
                </div>
              </section>

              {/* Maintenance & Smart Recommendation Capsule */}
              <section className="bg-gradient-to-b from-[#0e0e12] to-[#070709] border border-[#e0b47b]/15 p-6 rounded-[32px] shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-[#e0b47b]/5 rounded-full blur-xl pointer-events-none" />
                 <div className="flex items-center space-x-3 mb-3">
                    <div className="w-7 h-7 rounded-full bg-[#e0b47b]/10 flex items-center justify-center border border-[#e0b47b]/20">
                       <Award className="w-4 h-4 text-[#e0b47b]" />
                    </div>
                    <span className="text-[9px] font-bold text-[#e0b47b] uppercase tracking-widest">Barista Intelligence Recommendation</span>
                 </div>
                 <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    Your brewing timeline indicates an 8:00 AM coffee routine. We recommend pre-heating the group head at 7:55 AM for a calibrated <span className="text-[#e0b47b] font-semibold">Double Espresso</span> shot today.
                 </p>
              </section>

              {/* Home Screen Recipe Previews (Luxury Density) */}
              <section className="space-y-4">
                 <div className="flex justify-between items-center px-1">
                    <h3 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase">Elenza Blends / Previews</h3>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveScreen('recipes')}
                      className="text-[9px] font-bold text-[#e0b47b] uppercase tracking-widest"
                    >
                      View All
                    </motion.button>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    {recipes.slice(0, 2).map((recipe) => (
                      <div key={recipe.name} className="bg-[#0b0b0e] border border-white/[0.02] p-5 rounded-[28px] relative overflow-hidden group">
                         <div className="flex justify-between items-center mb-3">
                            <Coffee className="w-4 h-4 text-[#e0b47b]" />
                            <span className="text-[8px] font-mono text-zinc-600">{recipe.time}</span>
                         </div>
                         <h4 className="text-xs font-bold text-zinc-200 mb-2 truncate">{recipe.name}</h4>
                         <div className="flex justify-between text-[9px] text-zinc-500 font-mono">
                            <span>{recipe.beans} Beans</span>
                            <span>{recipe.volume}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </section>

              {/* Statistics Summary Preview widget */}
              <section className="bg-[#0e0e12]/60 p-6 rounded-[32px] border border-white/[0.02] flex items-center justify-between">
                 <div className="flex items-center space-x-4">
                    <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                       <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                       <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Weekly Index</span>
                       <span className="text-sm font-extrabold text-zinc-200">28 Cups Mapped</span>
                    </div>
                 </div>
                 <motion.button 
                   whileTap={{ scale: 0.95 }}
                   onClick={() => setActiveScreen('statistics')}
                   className="p-2.5 rounded-xl bg-zinc-900 border border-white/[0.04] text-xs font-bold text-zinc-400 uppercase tracking-wider hover:text-white"
                 >
                    Full Stats
                 </motion.button>
              </section>

              {/* Home Screen Activity Timeline preview */}
              <section className="bg-[#0e0e12]/60 rounded-[32px] p-6 border border-white/[0.02]">
                 <h3 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase mb-4">Latest brewing logs</h3>
                 <div className="space-y-4">
                    <ActivityLogItem time="9:41 AM" event="Double Espresso extraction complete" status="success" />
                    <ActivityLogItem time="8:15 AM" event="Calibrated boiler thermodynamic wave init" status="info" />
                 </div>
              </section>

              {/* Bottom Quick-trigger brew lab button panel */}
              <section className="bg-gradient-to-b from-[#0e0e12] to-[#070709] rounded-[36px] p-6 border border-white/[0.03] shadow-xl flex justify-between items-center">
                 <div>
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block mb-0.5">Quick Brew</span>
                    <h4 className="text-sm font-semibold text-zinc-200">Espresso Lab is Ready</h4>
                 </div>
                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => setActiveScreen('brewing')}
                   className="px-5 py-3 rounded-2xl bg-[#e0b47b] text-black text-xs font-bold uppercase tracking-wider shadow-lg cursor-pointer"
                 >
                    Open Brew Lab
                 </motion.button>
              </section>
            </motion.div>
          )}

          {/* ==================== IMMERSIVE BREWING SCREEN (Design2 Brewing UI) ==================== */}
          {activeScreen === 'brewing' && (
            <motion.div 
              key="brewing"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                 <h3 className="text-base font-bold text-zinc-200 tracking-wide uppercase">Extraction Laboratory</h3>
                 <span className="text-[10px] text-[#e0b47b] font-bold uppercase tracking-widest bg-[#e0b47b]/10 border border-[#e0b47b]/20 px-3 py-1 rounded-full">
                    Thermoblock Active
                 </span>
              </div>

              {/* Concentric rotating loaders and dynamic progress gauge */}
              <section className="bg-gradient-to-b from-[#0e0e12] to-[#070709] rounded-[36px] p-8 border border-white/[0.03] shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col items-center relative overflow-hidden">
                 <AnimatePresence>
                   {isBrewing && (
                     <motion.div 
                       initial={{ scale: 0.8, opacity: 0 }}
                       animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.15, 0.35, 0.15] }}
                       exit={{ opacity: 0 }}
                       transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                       className="absolute w-44 h-44 bg-[#e0b47b]/20 rounded-full blur-xl pointer-events-none"
                     />
                   )}
                 </AnimatePresence>

                 {/* Animated Brew Ring with inner telemetry pulse */}
                 <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                    <motion.div 
                      animate={isBrewing ? { rotate: 360 } : { rotate: 0 }}
                      transition={isBrewing ? { duration: 3, repeat: Infinity, ease: "linear" } : { duration: 0.5 }}
                      className={`absolute inset-0 border border-dashed rounded-full transition-colors duration-500 ${
                        isBrewing ? 'border-[#e0b47b]/40 scale-105' : 'border-zinc-800/40'
                      }`}
                    />
                    
                    <svg className="w-full h-full transform -rotate-90">
                       <circle cx="96" cy="96" r="82" stroke="#17171c" strokeWidth="6" fill="transparent" />
                       <motion.circle 
                         cx="96" 
                         cy="96" 
                         r="82" 
                         stroke="#e0b47b" 
                         strokeWidth="8" 
                         fill="transparent" 
                         strokeDasharray={2 * Math.PI * 82}
                         strokeDashoffset={2 * Math.PI * 82 * (1 - (telemetry.brewProgress || 0) / 100)}
                         strokeLinecap="round"
                         transition={{ duration: 0.4, ease: "easeOut" }}
                       />
                    </svg>

                    <div className="absolute flex flex-col items-center justify-center text-center">
                       {isBrewing ? (
                         <>
                           <motion.span 
                             animate={{ scale: [0.98, 1.04, 0.98] }}
                             transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                             className="text-5xl font-black text-[#e0b47b] tracking-tighter"
                           >
                             {telemetry.brewProgress}%
                           </motion.span>
                           <span className="text-[9px] text-[#e0b47b] font-bold uppercase tracking-widest mt-1">Extracting Shot</span>
                         </>
                       ) : (
                         <>
                           <Coffee className="w-10 h-10 text-zinc-500 mb-1" />
                           <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Ready to Brew</span>
                         </>
                       )}
                    </div>
                 </div>

                 {/* Immersive Extraction Phase Visualizer */}
                 {isBrewing ? (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="w-full text-center space-y-2 mt-2 pt-4 border-t border-white/[0.03]"
                   >
                      <div className="flex justify-center items-center space-x-2">
                         <Flame className="w-4 h-4 text-[#e0b47b] animate-pulse" />
                         <span className={`text-xs font-extrabold uppercase tracking-wider ${brewingPhase.color}`}>
                            {brewingPhase.name}
                         </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 max-w-xs mx-auto leading-relaxed">
                         {brewingPhase.desc}
                      </p>
                   </motion.div>
                 ) : (
                   <div className="text-[11px] text-zinc-500 font-mono text-center pt-2">
                      Select a recipe in the Recipes tab to trigger real-time dynamic extraction.
                   </div>
                 )}
              </section>

              {/* Immersive Thermodynamic charts */}
              <section className="space-y-6">
                {/* Extraction Pressure Graph */}
                <div className="bg-[#0e0e12]/60 rounded-[36px] p-6 border border-white/[0.02] relative overflow-hidden group">
                   <div className="absolute top-1/2 right-1/2 w-full h-full bg-[#38bdf8]/5 rounded-full blur-[100px] pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
                   <div className="flex justify-between items-end mb-4 relative z-10">
                      <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 flex items-center"><Activity className="w-4 h-4 mr-2 text-[#38bdf8]" /> Extraction pressure</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-zinc-200 tracking-tight">{telemetry.pressure.toFixed(1)}</span>
                        <span className="text-xs text-zinc-600 font-bold ml-1">bar</span>
                      </div>
                   </div>
                   <LiveTelemetryChart data={telemetry.history} type="pressure" />
                </div>

                {/* Boiler Temperature Graph */}
                <div className="bg-[#0e0e12]/60 rounded-[36px] p-6 border border-white/[0.02] relative overflow-hidden group">
                   <div className="absolute top-1/2 right-1/2 w-full h-full bg-[#e0b47b]/5 rounded-full blur-[100px] pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
                   <div className="flex justify-between items-end mb-4 relative z-10">
                      <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 flex items-center"><Power className="w-4 h-4 mr-2 text-[#e0b47b]" /> Boiler temperature</span>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-zinc-200 tracking-tight">{telemetry.temperature.toFixed(1)}</span>
                        <span className="text-xs text-zinc-600 font-bold ml-1">°C</span>
                      </div>
                   </div>
                   <LiveTelemetryChart data={telemetry.history} type="temperature" />
                </div>
              </section>
            </motion.div>
          )}

          {/* ==================== RECIPES BROWSER SCREEN (Design2 Recipe system) ==================== */}
          {activeScreen === 'recipes' && (
            <motion.div 
              key="recipes"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center">
                 <h3 className="text-base font-bold text-zinc-200 tracking-wide uppercase">Elenza Blends / Recipes</h3>
                 <div className="flex space-x-2">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => scrollCarousel('left')}
                      className="w-8 h-8 rounded-full border border-white/[0.04] bg-[#0e0e12]/80 flex items-center justify-center text-zinc-400 hover:text-[#e0b47b] cursor-pointer"
                    >
                      <ChevronLeft className="w-4.5 h-4.5" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => scrollCarousel('right')}
                      className="w-8 h-8 rounded-full border border-white/[0.04] bg-[#0e0e12]/80 flex items-center justify-center text-zinc-400 hover:text-[#e0b47b] cursor-pointer"
                    >
                      <ChevronRight className="w-4.5 h-4.5" />
                    </motion.button>
                 </div>
              </div>

              {/* Recipe horizontal slider with snapping */}
              <div className="relative">
                <div 
                   ref={recipeCarouselRef}
                   className="flex space-x-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory scroll-smooth touch-pan-x px-8 -mx-8"
                >
                   {recipes.map((recipe) => (
                     <motion.div 
                       whileHover={{ scale: 1.02 }}
                       whileTap={{ scale: 0.97 }}
                       key={recipe.name}
                       onClick={() => setSelectedRecipe(recipe)}
                       className={`flex-none w-[275px] p-6 rounded-[32px] border transition-all duration-300 cursor-pointer snap-start relative overflow-hidden ${
                         selectedRecipe.name === recipe.name 
                           ? 'bg-[#121217] border-[#e0b47b]/40 shadow-[0_12px_30px_rgba(224,180,123,0.07)]' 
                           : 'bg-[#0b0b0e] border-white/[0.02]'
                       }`}
                     >
                        <div className="flex justify-between items-start mb-4">
                           <Coffee className={`w-7 h-7 ${selectedRecipe.name === recipe.name ? 'text-[#e0b47b]' : 'text-zinc-600'}`} />
                           <div className="flex space-x-0.5">
                             {Array.from({ length: 5 }).map((_, i) => (
                               <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < recipe.intensity ? 'bg-[#e0b47b]' : 'bg-zinc-800'}`} />
                             ))}
                           </div>
                        </div>
                        <h4 className="text-base font-bold mb-1 text-zinc-200">{recipe.name}</h4>
                        <div className="grid grid-cols-2 gap-y-3 mt-5 text-[11px] text-zinc-500 font-mono">
                           <div>Beans: <span className="text-zinc-300 font-semibold">{recipe.beans}</span></div>
                           <div>Yield: <span className="text-zinc-300 font-semibold">{recipe.volume}</span></div>
                           <div>Temp: <span className="text-zinc-300 font-semibold">{recipe.temp}</span></div>
                           <div>Time: <span className="text-zinc-300 font-semibold">{recipe.time}</span></div>
                        </div>
                     </motion.div>
                   ))}
                   <div className="flex-none w-10 h-10 pointer-events-none" />
                </div>
                <div className="absolute right-0 top-0 bottom-6 w-16 bg-gradient-to-l from-[#040406] to-transparent pointer-events-none -mr-8" />
                <div className="absolute left-0 top-0 bottom-6 w-16 bg-gradient-to-r from-[#040406] to-transparent pointer-events-none -ml-8" />
              </div>

              {/* Recipe custom options & triggers */}
              <section className="bg-gradient-to-b from-[#0e0e12] to-[#070709] rounded-[36px] p-6 border border-white/[0.02] space-y-6">
                 <div className="flex justify-between items-center pb-4 border-b border-white/[0.04]">
                    <div>
                       <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Selected blend</span>
                       <h4 className="text-lg font-bold text-zinc-100">{selectedRecipe.name}</h4>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openRecipeDetails(selectedRecipe)}
                      className="p-3 rounded-2xl bg-zinc-800/60 border border-white/[0.04] text-[#e0b47b] hover:bg-zinc-800 flex items-center space-x-2 cursor-pointer"
                    >
                      <Sliders className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Customize</span>
                    </motion.button>
                 </div>

                 <div className="flex justify-between text-xs text-zinc-500 font-mono">
                    <span>Intelligent Profiling Active</span>
                    <span className="text-emerald-400 font-semibold flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-1" /> Calibrated</span>
                 </div>

                 <motion.button 
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => handleTriggerBrewFromRecipe(selectedRecipe)}
                   className="w-full py-4 rounded-2xl bg-[#e0b47b] text-black text-xs font-bold tracking-widest uppercase shadow-xl hover:scale-[1.01] cursor-pointer"
                 >
                    Trigger Brew Session
                 </motion.button>
              </section>
            </motion.div>
          )}

          {/* ==================== RECIPE DETAILS SCREEN (Design2 Parameter Tuner) ==================== */}
          {activeScreen === 'recipe-details' && (
            <motion.div 
              key="recipe-details"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="flex items-center space-x-3">
                 <motion.button 
                   whileTap={{ scale: 0.9 }}
                   onClick={() => setActiveScreen('recipes')}
                   className="p-2 rounded-xl bg-zinc-800/40 border border-white/[0.04] text-zinc-400 hover:text-white cursor-pointer"
                 >
                    <ChevronLeft className="w-5 h-5" />
                 </motion.button>
                 <div>
                    <span className="text-[9px] text-[#e0b47b] font-bold uppercase tracking-widest block">Parameter Tuner</span>
                    <h3 className="text-base font-bold text-zinc-200 tracking-wide">Configure {tempRecipe.name}</h3>
                 </div>
              </div>

              {/* Slider parameters configurator */}
              <section className="bg-gradient-to-b from-[#0e0e12] to-[#070709] rounded-[36px] p-6 border border-white/[0.02] space-y-8">
                 
                 {/* Parameter 1: Grind size */}
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-mono">
                       <span className="text-zinc-500 font-bold uppercase tracking-wider">Coffee Beans Dose</span>
                       <span className="text-zinc-200 font-bold">{tempRecipe.grindSize}g</span>
                    </div>
                    <input 
                      type="range" 
                      min="14" 
                      max="22" 
                      step="0.5"
                      value={tempRecipe.grindSize || 18}
                      onChange={(e) => setTempRecipe(prev => ({ ...prev, grindSize: parseFloat(e.target.value) }))}
                      className="w-full accent-[#e0b47b] bg-zinc-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-zinc-600 font-mono uppercase">
                       <span>Light (14g)</span>
                       <span>Calibrated Standard (18g)</span>
                       <span>Dense (22g)</span>
                    </div>
                 </div>

                 {/* Parameter 2: Water Volume */}
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-mono">
                       <span className="text-zinc-500 font-bold uppercase tracking-wider">Water Yield Volume</span>
                       <span className="text-zinc-200 font-bold">{tempRecipe.yieldVolume}ml</span>
                    </div>
                    <input 
                      type="range" 
                      min="20" 
                      max="300" 
                      step="5"
                      value={tempRecipe.yieldVolume || 60}
                      onChange={(e) => setTempRecipe(prev => ({ ...prev, yieldVolume: parseInt(e.target.value) }))}
                      className="w-full accent-[#e0b47b] bg-zinc-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-zinc-600 font-mono uppercase">
                       <span>Ristretto (20ml)</span>
                       <span>Espresso (40ml)</span>
                       <span>Lungo / Cup (300ml)</span>
                    </div>
                 </div>

                 {/* Parameter 3: Temperature */}
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-mono">
                       <span className="text-zinc-500 font-bold uppercase tracking-wider">Boiler Target Temp</span>
                       <span className="text-zinc-200 font-bold">{tempRecipe.targetTemp}°C</span>
                    </div>
                    <input 
                      type="range" 
                      min="88" 
                      max="96" 
                      step="1"
                      value={tempRecipe.targetTemp || 92}
                      onChange={(e) => setTempRecipe(prev => ({ ...prev, targetTemp: parseInt(e.target.value) }))}
                      className="w-full accent-[#e0b47b] bg-zinc-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-zinc-600 font-mono uppercase">
                       <span>Mild (88°C)</span>
                       <span>Optimal (92.4°C)</span>
                       <span>Intense (96°C)</span>
                    </div>
                 </div>

                 {/* Custom Actions */}
                 <div className="grid grid-cols-2 gap-4 pt-4">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveScreen('recipes')}
                      className="py-3.5 rounded-2xl bg-zinc-900 border border-white/[0.04] text-zinc-400 text-xs font-bold tracking-wider uppercase cursor-pointer"
                    >
                       Cancel
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={saveRecipeConfig}
                      className="py-3.5 rounded-2xl bg-[#e0b47b] text-black text-xs font-bold tracking-wider uppercase shadow-lg cursor-pointer"
                    >
                       Save Recipe
                    </motion.button>
                 </div>

              </section>
            </motion.div>
          )}

          {/* ==================== STATISTICS SCREEN (Design2 Analytics) ==================== */}
          {activeScreen === 'statistics' && (
            <motion.div 
              key="statistics"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <h3 className="text-base font-bold text-zinc-200 tracking-wide uppercase">System Analytics</h3>

              {/* Elegant Weekly Metrics Overview */}
              <section className="bg-gradient-to-b from-[#0e0e12] to-[#070709] rounded-[36px] p-6 border border-white/[0.02] shadow-xl space-y-6">
                 <div className="flex justify-between items-center">
                    <div>
                       <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Weekly Index</span>
                       <h4 className="text-2xl font-black text-zinc-200">28 Shots Extracted</h4>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                       +15% vs. Last Week
                    </span>
                 </div>

                 {/* Symmetrical bar chart */}
                 <div className="h-32 flex items-end justify-between px-2 pt-4">
                    <BarItem day="Mo" val="40%" />
                    <BarItem day="Tu" val="60%" />
                    <BarItem day="We" val="75%" />
                    <BarItem day="Th" val="50%" />
                    <BarItem day="Fr" val="90%" active />
                    <BarItem day="Sa" val="45%" />
                    <BarItem day="Su" val="30%" />
                 </div>
              </section>

              {/* Symmetrical Statistics grid cards */}
              <section className="grid grid-cols-2 gap-4">
                 <div className="bg-[#0e0e12]/60 p-5 rounded-2xl border border-white/[0.02] flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#e0b47b]/10 border border-[#e0b47b]/20 flex items-center justify-center text-[#e0b47b]">
                       <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                       <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Water Index</span>
                       <span className="text-sm font-extrabold text-zinc-200">8.4 Liters</span>
                    </div>
                 </div>
                 <div className="bg-[#0e0e12]/60 p-5 rounded-2xl border border-white/[0.02] flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                       <Award className="w-5 h-5" />
                    </div>
                    <div>
                       <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block">Energy Rating</span>
                       <span className="text-sm font-extrabold text-zinc-200">A+++ Grade</span>
                    </div>
                 </div>
              </section>

              {/* Maintenance Logs */}
              <section className="bg-[#0e0e12]/60 rounded-[36px] p-6 border border-white/[0.02]">
                 <h3 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase mb-5">Elenza Activity log</h3>
                 <div className="space-y-4">
                    <ActivityLogItem time="9:41 AM" event="Double Espresso extraction complete" status="success" />
                    <ActivityLogItem time="8:15 AM" event="Boiler pre-heating sequence triggered" status="info" />
                    <ActivityLogItem time="Yesterday" event="Automatic group head cleaning cycle completed" status="success" />
                 </div>
              </section>
            </motion.div>
          )}

          {/* ==================== PROFILE / SETTINGS SCREEN (Design2 Profile) ==================== */}
          {activeScreen === 'profile' && (
            <motion.div 
              key="profile"
              variants={screenVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <h3 className="text-base font-bold text-zinc-200 tracking-wide uppercase">System Settings</h3>

              {/* Connection & active profile */}
              <section className="bg-[#0e0e12]/60 p-6 rounded-[36px] border border-white/[0.02] flex items-center space-x-4">
                 <div className="w-14 h-14 rounded-full bg-zinc-950 border border-white/[0.04] flex items-center justify-center text-[#e0b47b]">
                    <User className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="text-base font-bold text-zinc-200">Barista Profile</h4>
                    <span className="text-xs text-zinc-500 font-mono">Elenza Pro Controller Hub</span>
                 </div>
              </section>

              {/* Writable Commands & Actions Panel */}
              <section className="bg-gradient-to-b from-[#0e0e12] to-[#070709] rounded-[36px] p-6 border border-white/[0.02] space-y-4">
                 <h4 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase mb-2">Maintenance Actions</h4>
                 
                 <div className="flex justify-between items-center py-3 border-b border-white/[0.02]">
                    <div>
                       <span className="text-xs font-semibold text-zinc-200 block">Start Cleaning Cycle</span>
                       <span className="text-[9px] text-zinc-500 font-mono">Flushes group head thermoblock</span>
                    </div>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white cursor-pointer"
                    >
                       Start
                    </motion.button>
                 </div>

                 <div className="flex justify-between items-center py-3 border-b border-white/[0.02]">
                    <div>
                       <span className="text-xs font-semibold text-zinc-200 block">Start Descaling</span>
                       <span className="text-[9px] text-zinc-500 font-mono">Removes boiler calcification</span>
                    </div>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white cursor-pointer"
                    >
                       Start
                    </motion.button>
                 </div>

                 <div className="flex justify-between items-center py-3">
                    <div>
                       <span className="text-xs font-semibold text-zinc-200 block">Factory Reset</span>
                       <span className="text-[9px] text-zinc-500 font-mono">Restores factory default profiles</span>
                    </div>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-xl bg-red-950/20 border border-red-500/20 text-xs font-semibold text-red-400 hover:bg-red-950/40 cursor-pointer"
                    >
                       Reset
                    </motion.button>
                 </div>
              </section>

              {/* Hardware specifications */}
              <section className="bg-[#0e0e12]/60 p-6 rounded-[36px] border border-white/[0.02] space-y-4 text-xs">
                 <h4 className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase mb-2">Hardware Details</h4>
                 <div className="flex justify-between py-1.5 border-b border-white/[0.015]">
                    <span className="text-zinc-500">Active Machine:</span>
                    <span className="text-zinc-300 font-semibold">{activeMachine.name}</span>
                 </div>
                 <div className="flex justify-between py-1.5 border-b border-white/[0.015]">
                    <span className="text-zinc-500">Boiler Type:</span>
                    <span className="text-zinc-300 font-semibold">{activeMachine.metadata.boilerType}</span>
                 </div>
                 <div className="flex justify-between py-1.5 border-b border-white/[0.015]">
                    <span className="text-zinc-500">Machine Finish:</span>
                    <span className="text-zinc-300 font-semibold">{activeMachine.metadata.finish}</span>
                 </div>
                 <div className="flex justify-between py-1.5">
                    <span className="text-zinc-500">Hardware Accents:</span>
                    <span className="text-zinc-300 font-semibold">{activeMachine.metadata.accents}</span>
                 </div>
              </section>
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Layered Infotainment bottom navigation wrapper ensuring absolute overflow visibility */}
      <div 
         style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
         className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[92%] max-w-[440px] h-[84px] z-50 overflow-visible select-none"
      >
         {/* Layer 1: MainBottomNav (Glassmorphic Backplate Backdrop) */}
         <div className="absolute inset-0 bg-[#0c0c10]/85 backdrop-blur-3xl border border-white/[0.08] rounded-[32px] shadow-[0_25px_50px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.16)] z-10 pointer-events-none" />

         {/* Layer 2: Floating Center Button (z-index: 40) */}
         <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-5 z-40 overflow-visible">
            <CenterNavItem active={activeScreen === 'brewing'} onClick={() => setActiveScreen('brewing')} />
         </div>

         {/* Layer 3: Floating Quick Actions Overlay (z-index: 30) */}
         <div className="absolute inset-0 z-30 flex items-center justify-between px-6 overflow-visible">
            {/* Left Action Buttons */}
            <div className="flex items-center space-x-8 overflow-visible">
               <NavItem icon={<Coffee className="w-5 h-5" />} label="Elenza" active={activeScreen === 'home'} onClick={() => setActiveScreen('home')} />
               <NavItem icon={<Heart className="w-5 h-5" />} label="Recipes" active={activeScreen === 'recipes' || activeScreen === 'recipe-details'} onClick={() => setActiveScreen('recipes')} />
            </div>

            {/* Symmetrical middle spacer for the Center Button alignment */}
            <div className="w-16 h-16 shrink-0 pointer-events-none" />

            {/* Right Action Buttons */}
            <div className="flex items-center space-x-8 overflow-visible">
               <NavItem icon={<BarChart3 className="w-5 h-5" />} label="Stats" active={activeScreen === 'statistics'} onClick={() => setActiveScreen('statistics')} />
               <NavItem icon={<SettingsIcon className="w-5 h-5" />} label="System" active={activeScreen === 'profile'} onClick={() => setActiveScreen('profile')} />
            </div>
         </div>
      </div>

    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick} 
      className="flex flex-col items-center justify-center w-14 h-20 relative focus:outline-none select-none group pt-1 overflow-visible cursor-pointer"
    >
       {active && (
         <motion.div 
           layoutId="activeNavIndicator"
           className="absolute top-2 w-8 h-[2.5px] bg-[#e0b47b] rounded-full shadow-[0_0_15px_#e0b47b,0_0_5px_#e0b47b] z-40"
           transition={{ type: "spring", stiffness: 350, damping: 25 }}
         />
       )}
       <div className={`transition-all duration-300 transform mt-2 ${active ? 'text-[#e0b47b] filter drop-shadow-[0_0_8px_rgba(224,180,123,0.4)]' : 'text-zinc-500 hover:text-zinc-300'}`}>
          {icon}
       </div>
       <span className={`text-[8px] font-extrabold mt-1.5 tracking-wider uppercase transition-colors ${active ? 'text-zinc-200' : 'text-zinc-600'}`}>
          {label}
       </span>
    </motion.button>
  );
}

function CenterNavItem({ active, onClick }: { active: boolean, onClick: () => void }) {
  return (
    <div className="relative z-20 flex flex-col items-center select-none shrink-0 overflow-visible">
       <motion.button 
         whileHover={{ scale: 1.08 }}
         whileTap={{ scale: 0.92 }}
         onClick={onClick}
         className={`w-15 h-15 rounded-full flex items-center justify-center border transition-all duration-300 cursor-pointer ${
           active 
             ? 'bg-[#e0b47b] border-[#e0b47b] text-black shadow-[0_8px_24px_rgba(224,180,123,0.45)]' 
             : 'bg-[#121217] border-white/[0.08] text-zinc-400 hover:text-white shadow-[0_8px_20px_rgba(0,0,0,0.6)]'
         }`}
       >
          <Activity className="w-6 h-6 animate-pulse" />
       </motion.button>
       <span className={`text-[8px] font-extrabold mt-1.5 tracking-wider uppercase transition-colors ${
         active ? 'text-[#e0b47b]' : 'text-zinc-500'
       }`}>
          Brew Lab
       </span>
    </div>
  );
}

function ActivityLogItem({ time, event, status }: { time: string, event: string, status: 'success' | 'info' | 'warning' }) {
  const Icon = status === 'success' ? CheckCircle2 : status === 'warning' ? AlertTriangle : Info;
  const color = status === 'success' ? 'text-emerald-400' : status === 'warning' ? 'text-amber-500' : 'text-cyan-400';
  const bg = status === 'success' ? 'bg-emerald-500/10' : status === 'warning' ? 'bg-amber-500/10' : 'bg-cyan-500/10';
  
  return (
    <div className="flex items-center space-x-4 text-zinc-400 border-b border-white/[0.02] pb-4 last:border-0 last:pb-0">
       <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-4 h-4 ${color}`} />
       </div>
       <div className="grow">
          <p className="text-zinc-200 font-medium tracking-wide text-xs">{event}</p>
          <span className="text-[9px] text-zinc-500 font-mono mt-0.5 block">{time}</span>
       </div>
    </div>
  );
}

function BarItem({ day, val, active }: { day: string, val: string, active?: boolean }) {
  return (
    <div className="flex flex-col items-center space-y-2 h-full justify-end w-8">
       <div className="w-2.5 bg-zinc-900 rounded-full h-full flex flex-col justify-end overflow-hidden border border-white/[0.01]">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: val }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`w-full rounded-full transition-all duration-500 ${
              active 
                ? 'bg-gradient-to-t from-[#9a6f3b] to-[#e0b47b] shadow-[0_0_12px_rgba(224,180,123,0.7)]' 
                : 'bg-zinc-800'
            }`}
          />
       </div>
       <span className={`text-[9px] font-mono font-bold ${active ? 'text-[#e0b47b]' : 'text-zinc-600'}`}>{day}</span>
    </div>
  );
}
