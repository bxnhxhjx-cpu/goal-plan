import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import TimerDisplay from './components/TimerDisplay';
import GoalCard from './components/GoalCard';
import AICoach from './components/AICoach';
import Charts from './components/Charts';
import { Goal, TimeSession, ViewState } from './types';

// Native ID generator to avoid external dependencies
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const App: React.FC = () => {
  // State
  const [goals, setGoals] = useState<Goal[]>([]);
  const [sessions, setSessions] = useState<TimeSession[]>([]);
  const [activeSession, setActiveSession] = useState<TimeSession | null>(null);
  const [view, setView] = useState<ViewState>('dashboard');
  
  // Goal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formTarget, setFormTarget] = useState(100);
  const [formCategory, setFormCategory] = useState<Goal['category']>('Career');

  // Persistence
  useEffect(() => {
    try {
      const savedGoals = localStorage.getItem('gh_goals');
      const savedSessions = localStorage.getItem('gh_sessions');
      const savedActive = localStorage.getItem('gh_active');
      
      if (savedGoals) setGoals(JSON.parse(savedGoals));
      if (savedSessions) setSessions(JSON.parse(savedSessions));
      if (savedActive) {
          const session = JSON.parse(savedActive);
          // basic validation to ensure session data is correct
          if (session && session.goalId && session.startTime) {
            setActiveSession(session);
          }
      }
    } catch (e) {
      console.error("Failed to load data", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('gh_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('gh_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (activeSession) {
        localStorage.setItem('gh_active', JSON.stringify(activeSession));
    } else {
        localStorage.removeItem('gh_active');
    }
  }, [activeSession]);

  // Handlers
  const handleStartSession = (goalId: string) => {
    if (activeSession) return; // Only one at a time
    const newSession: TimeSession = {
      id: generateId(),
      goalId,
      startTime: new Date().toISOString(),
      durationSeconds: 0
    };
    setActiveSession(newSession);
  };

  const handleStopSession = useCallback(() => {
    if (!activeSession) return;
    
    const endTime = new Date();
    const startTime = new Date(activeSession.startTime);
    const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    // Filter out accidental clicks (< 1 minute) - Optional logic, keeping it simple for now
    if (durationSeconds > 0) {
        const completedSession: TimeSession = {
            ...activeSession,
            endTime: endTime.toISOString(),
            durationSeconds
        };

        setSessions(prev => [completedSession, ...prev]);

        // Update Goal Accumulation
        setGoals(prev => prev.map(g => {
            if (g.id === activeSession.goalId) {
                return {
                    ...g,
                    accumulatedHours: g.accumulatedHours + (durationSeconds / 3600)
                };
            }
            return g;
        }));
    }

    setActiveSession(null);
  }, [activeSession]);

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGoal) {
        setGoals(prev => prev.map(g => g.id === editingGoal.id ? {
            ...g,
            title: formTitle,
            description: formDesc,
            targetHours: formTarget,
            category: formCategory
        } : g));
    } else {
        const newGoal: Goal = {
            id: generateId(),
            title: formTitle,
            description: formDesc,
            targetHours: formTarget,
            accumulatedHours: 0,
            category: formCategory,
            color: 'bg-yellow-500', // Default
            createdAt: new Date().toISOString()
        };
        setGoals(prev => [...prev, newGoal]);
    }
    closeModal();
  };

  const handleDeleteGoal = (id: string) => {
    if(confirm("Are you sure? All historical data for this goal will be preserved in analytics, but the goal will be removed.")) {
        setGoals(prev => prev.filter(g => g.id !== id));
    }
  };

  const openModal = (goal?: Goal) => {
      if (goal) {
          setEditingGoal(goal);
          setFormTitle(goal.title);
          setFormDesc(goal.description);
          setFormTarget(goal.targetHours);
          setFormCategory(goal.category);
      } else {
          setEditingGoal(null);
          setFormTitle('');
          setFormDesc('');
          setFormTarget(100);
          setFormCategory('Career');
      }
      setIsModalOpen(true);
  };

  const closeModal = () => {
      setIsModalOpen(false);
      setEditingGoal(null);
  };

  // Render Content based on View
  const renderContent = () => {
      switch (view) {
        case 'dashboard':
          return (
            <div className="space-y-8 animate-fade-in">
                 <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
                        <p className="text-slate-400">Your daily wealth accumulation.</p>
                    </div>
                    <button 
                        onClick={() => openModal()}
                        className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-lg shadow-lg shadow-yellow-500/20 transition-all flex items-center gap-2"
                    >
                        <i className="fa-solid fa-plus"></i> New Goal
                    </button>
                 </div>

                 {/* Key Metrics */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <p className="text-slate-400 text-xs uppercase tracking-wider">Total Goals</p>
                        <p className="text-2xl font-bold text-white mt-1">{goals.length}</p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <p className="text-slate-400 text-xs uppercase tracking-wider">Total Hours</p>
                        <p className="text-2xl font-bold text-yellow-400 mt-1">
                            {goals.reduce((acc, curr) => acc + curr.accumulatedHours, 0).toFixed(1)}
                        </p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <p className="text-slate-400 text-xs uppercase tracking-wider">Sessions</p>
                        <p className="text-2xl font-bold text-blue-400 mt-1">{sessions.length}</p>
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <p className="text-slate-400 text-xs uppercase tracking-wider">Focus Today</p>
                        <p className="text-2xl font-bold text-green-400 mt-1">
                            {/* Calculate hours today */}
                            {(sessions.filter(s => {
                                const d = new Date(s.startTime);
                                const today = new Date();
                                return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
                            }).reduce((acc, curr) => acc + curr.durationSeconds, 0) / 3600).toFixed(1)}h
                        </p>
                    </div>
                 </div>

                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-slate-500 bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
                            <i className="fa-solid fa-seedling text-4xl mb-4"></i>
                            <p>No goals defined yet. Plant a seed to harvest gold later.</p>
                            <button onClick={() => openModal()} className="mt-4 text-yellow-500 font-bold hover:underline">Create First Goal</button>
                        </div>
                    ) : (
                        goals.map(goal => (
                            <GoalCard 
                                key={goal.id} 
                                goal={goal} 
                                onStart={handleStartSession} 
                                isTracking={!!activeSession}
                                onEdit={openModal}
                                onDelete={handleDeleteGoal}
                            />
                        ))
                    )}
                 </div>
            </div>
          );
        
        case 'goals':
            return (
                <div className="space-y-6 animate-fade-in">
                     <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold text-white">All Golden Goals</h2>
                        <button 
                            onClick={() => openModal()}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-6 rounded-lg transition-all"
                        >
                            Add Goal
                        </button>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {goals.map(goal => (
                            <GoalCard 
                                key={goal.id} 
                                goal={goal} 
                                onStart={handleStartSession} 
                                isTracking={!!activeSession}
                                onEdit={openModal}
                                onDelete={handleDeleteGoal}
                            />
                        ))}
                    </div>
                </div>
            );

        case 'analytics':
            return <div className="animate-fade-in"><Charts goals={goals} sessions={sessions} /></div>;

        case 'coach':
            return <div className="animate-fade-in"><AICoach goals={goals} sessions={sessions} /></div>;
          
        default:
          return <div>View not found</div>;
      }
  }

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-yellow-500/30">
      <Sidebar currentView={view} setView={setView} />
      
      <main className="flex-1 p-6 md:p-10 pb-24 max-w-7xl mx-auto w-full">
        {renderContent()}
      </main>

      <TimerDisplay 
        activeSession={activeSession} 
        goals={goals} 
        onStop={handleStopSession} 
      />

      {/* Goal Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <div className="bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-md shadow-2xl p-6 relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-t-2xl"></div>
                  <h3 className="text-xl font-bold text-white mb-4">{editingGoal ? 'Edit Goal' : 'New Golden Goal'}</h3>
                  <form onSubmit={handleSaveGoal} className="space-y-4">
                      <div>
                          <label className="block text-sm text-slate-400 mb-1">Title</label>
                          <input 
                            required
                            type="text" 
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                            placeholder="e.g. Master React Native"
                            value={formTitle}
                            onChange={e => setFormTitle(e.target.value)}
                          />
                      </div>
                      <div>
                          <label className="block text-sm text-slate-400 mb-1">Category</label>
                          <select 
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                            value={formCategory}
                            onChange={e => setFormCategory(e.target.value as any)}
                          >
                              <option value="Career">Career</option>
                              <option value="Health">Health</option>
                              <option value="Skill">Skill</option>
                              <option value="Project">Project</option>
                              <option value="Other">Other</option>
                          </select>
                      </div>
                      <div className="flex gap-4">
                         <div className="flex-1">
                            <label className="block text-sm text-slate-400 mb-1">Target (Hours)</label>
                            <input 
                                required
                                type="number" 
                                min="1"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                                value={formTarget}
                                onChange={e => setFormTarget(parseInt(e.target.value))}
                            />
                         </div>
                      </div>
                      <div>
                          <label className="block text-sm text-slate-400 mb-1">Why is this important?</label>
                          <textarea 
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500 h-24 resize-none"
                            placeholder="Describe the long term benefit..."
                            value={formDesc}
                            onChange={e => setFormDesc(e.target.value)}
                          />
                      </div>
                      <div className="flex gap-3 mt-6">
                          <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-lg font-semibold text-slate-400 hover:bg-slate-800 transition-colors">Cancel</button>
                          <button type="submit" className="flex-1 py-3 rounded-lg font-bold bg-yellow-500 text-black hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20">Save Goal</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default App;