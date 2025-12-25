import React, { useState } from 'react';
import { Goal, TimeSession, AIAdvice } from '../types';
import { getSmartAdvice } from '../services/geminiService';

interface AICoachProps {
  goals: Goal[];
  sessions: TimeSession[];
}

const AICoach: React.FC<AICoachProps> = ({ goals, sessions }) => {
  const [advice, setAdvice] = useState<AIAdvice | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateAdvice = async () => {
    setLoading(true);
    const result = await getSmartAdvice(goals, sessions);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">AI Strategist</h2>
                <p className="text-slate-400">Get brutal honesty and golden advice on your time allocation.</p>
            </div>
            <button
                onClick={handleGenerateAdvice}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
            >
                {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-sparkles"></i>}
                {loading ? 'Analyzing...' : 'Generate Strategy'}
            </button>
        </div>

        {advice && (
          <div className="space-y-6 animate-fade-in">
            {/* Efficiency Score */}
            <div className="flex items-center gap-6 p-6 bg-slate-900/50 rounded-xl border border-slate-700">
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                            className="text-slate-800"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        />
                        <path
                            className={`${advice.efficiencyScore > 70 ? 'text-green-500' : advice.efficiencyScore > 40 ? 'text-yellow-500' : 'text-red-500'}`}
                            strokeDasharray={`${advice.efficiencyScore}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-white">
                        {advice.efficiencyScore}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">Efficiency Score</h3>
                    <p className="text-slate-400 text-sm mt-1">{advice.summary}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Actionable Tips */}
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-yellow-400 font-bold mb-4 flex items-center gap-2">
                        <i className="fa-solid fa-lightbulb"></i> Golden Opportunities
                    </h3>
                    <ul className="space-y-3">
                        {advice.actionableTips.map((tip, idx) => (
                            <li key={idx} className="flex gap-3 text-slate-300 text-sm">
                                <span className="text-yellow-500 font-bold">{idx + 1}.</span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Neglected Goals */}
                <div className="bg-slate-900/50 p-6 rounded-xl border border-red-900/30">
                    <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                        <i className="fa-solid fa-triangle-exclamation"></i> Falling Behind
                    </h3>
                    {advice.neglectedGoals.length > 0 ? (
                         <ul className="space-y-2">
                            {advice.neglectedGoals.map((goal, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-slate-300">
                                    <i className="fa-solid fa-circle-xmark text-red-500 text-xs"></i>
                                    {goal}
                                </li>
                            ))}
                         </ul>
                    ) : (
                        <p className="text-green-500 text-sm">Great job! You are maintaining momentum on all fronts.</p>
                    )}
                </div>
            </div>
          </div>
        )}
        
        {!advice && !loading && (
            <div className="text-center py-12 text-slate-500">
                <i className="fa-solid fa-brain text-4xl mb-4 opacity-50"></i>
                <p>Tap "Generate Strategy" to let Gemini analyze your time portfolio.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AICoach;