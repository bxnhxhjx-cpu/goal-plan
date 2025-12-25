import React, { useEffect, useState } from 'react';
import { Goal, TimeSession } from '../types';

interface TimerDisplayProps {
  activeSession: TimeSession | null;
  goals: Goal[];
  onStop: () => void;
  onTogglePause?: () => void;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ activeSession, goals, onStop }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!activeSession) return;
    
    // Calculate initial elapsed time
    const start = new Date(activeSession.startTime).getTime();
    const now = new Date().getTime();
    setElapsed(Math.floor((now - start) / 1000));

    const interval = setInterval(() => {
      const currentNow = new Date().getTime();
      setElapsed(Math.floor((currentNow - start) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession]);

  if (!activeSession) return null;

  const activeGoal = goals.find(g => g.id === activeSession.goalId);
  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed % 3600) / 60);
  const seconds = elapsed % 60;

  const formatTime = (val: number) => val.toString().padStart(2, '0');

  return (
    <div className="fixed bottom-0 left-0 w-full md:pl-64 z-50">
      <div className="bg-slate-900/90 backdrop-blur-md border-t border-slate-700 p-4 shadow-2xl shadow-black flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full animate-pulse ${activeGoal ? 'bg-green-500' : 'bg-gray-500'}`}></div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Current Session</p>
            <h3 className="text-white font-medium">{activeGoal?.title || 'Unknown Goal'}</h3>
          </div>
        </div>

        <div className="text-3xl font-mono font-bold text-yellow-400 tabular-nums">
          {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
        </div>

        <button 
          onClick={onStop}
          className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <i className="fa-solid fa-stop"></i>
          <span className="hidden sm:inline">Finish</span>
        </button>
      </div>
    </div>
  );
};

export default TimerDisplay;