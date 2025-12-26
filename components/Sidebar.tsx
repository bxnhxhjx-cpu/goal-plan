import React from 'react';
import { ViewState } from '../types.ts';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems: { id: ViewState; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-stopwatch' },
    { id: 'goals', label: 'Golden Goals', icon: 'fa-bullseye' },
    { id: 'analytics', label: 'Analytics', icon: 'fa-chart-line' },
    { id: 'coach', label: 'AI Strategist', icon: 'fa-robot' },
  ];

  return (
    <div className="w-20 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col items-center md:items-stretch py-6 sticky top-0 h-screen">
      <div className="mb-10 px-4 flex items-center justify-center md:justify-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-900/20">
            <i className="fa-solid fa-hourglass-half text-white text-lg"></i>
        </div>
        <h1 className="hidden md:block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-amber-500">
          GoldenHour
        </h1>
      </div>

      <nav className="flex-1 w-full space-y-2 px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
              ${currentView === item.id 
                ? 'bg-slate-800/80 text-yellow-400 border border-slate-700 shadow-sm' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
          >
            <i className={`fa-solid ${item.icon} text-xl w-6 text-center ${currentView === item.id ? 'text-yellow-400' : 'text-slate-500 group-hover:text-slate-300'}`}></i>
            <span className="hidden md:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto px-4 pb-4">
        <div className="hidden md:block p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
          <p className="text-xs text-slate-400 mb-1">Current Focus</p>
          <div className="text-sm font-semibold text-white">Long Term Growth</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;