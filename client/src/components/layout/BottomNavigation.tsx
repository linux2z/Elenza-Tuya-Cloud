'use client';

import { useState } from 'react';
import { Home, FileText, Coffee, BarChart2, User } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'recipes', label: 'Recipes', icon: FileText },
  { id: 'live', label: 'Live Coffee', icon: Coffee },
  { id: 'stats', label: 'Stats', icon: BarChart2 },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function BottomNavigation() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="fixed bottom-0 left-0 w-full bg-card/90 backdrop-blur-md border-t border-secondary pb-safe pt-2 px-6 z-50 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center h-16 max-w-md mx-auto relative">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isCenter = item.id === 'live';

          if (isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="relative flex flex-col items-center justify-center -mt-8"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-b from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                  <Icon className="w-6 h-6 text-black" strokeWidth={2.5} />
                </div>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center justify-center w-14 h-full"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-2 w-1 h-1 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon 
                className={`w-6 h-6 mb-1 transition-colors duration-300 ${isActive ? 'text-primary' : 'text-zinc-500'}`} 
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span className={`text-[10px] font-medium transition-colors duration-300 ${isActive ? 'text-primary' : 'text-zinc-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
