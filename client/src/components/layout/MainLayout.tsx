import React from 'react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#040406] text-white flex justify-center">
      <div className="w-full max-w-[540px] bg-[#040406] relative min-h-screen flex flex-col">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
