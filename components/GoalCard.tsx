import React from 'react';
import { Goal } from '../types.ts';

interface GoalCardProps {
  goal: Goal;
  onStart: (goalId: string) => void;
  isTracking: boolean;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onStart, isTracking, onEdit, onDelete }) => {
  const percentage = Math.min(100, (goal.accumulatedHours / goal.targetHours) * 100);
  
  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all shadow-lg group relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl group-hover:bg-yellow-500/10 transition-colors"></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold mb-2 bg-slate-700 text-slate-300`}>
            {goal.category}
          </span>
          <h3 className="text-xl font-bold text-white mb-1">{goal.title}</h3>
          <p className="text-sm text-slate-400 line-clamp-2 h-10">{goal.description}</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => onEdit(goal)} className="text-slate-500 hover:text-blue-400 transition-colors">
              <i className="fa-solid fa-pen-to-square"></i>
           </button>
           <button onClick={() => onDelete(goal.id)} className="text-slate-500 hover:text-red-400 transition-colors">
              <i className="fa-solid fa-trash"></i>
           </button>
        </div>
      </div>

      <div className="space-y-2 mb-6 relative z-10">
        <div className="flex justify-between text-sm">
          <span className="text-yellow-500 font-mono">{goal.accumulatedHours.toFixed(1)} hrs</span>
          <span className="text-slate-500 font-mono">/ {goal.targetHours} hrs</span>
        </div>
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      <button
        onClick={() => onStart(goal.id)}
        disabled={isTracking}
        className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all relative z-10
          ${isTracking 
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50' 
            : 'bg-white text-slate-900 hover:bg-yellow-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.4)]'
          }`}
      >
        {isTracking ? (
          <>
            <i className="fa-solid fa-ban"></i> Timer Active
          </>
        ) : (
          <>
            <i className="fa-solid fa-play"></i> Invest Time
          </>
        )}
      </button>
    </div>
  );
};

export default GoalCard;