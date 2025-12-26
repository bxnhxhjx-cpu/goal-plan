import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Goal, TimeSession, CATEGORY_COLORS } from '../types.ts';

interface ChartsProps {
  goals: Goal[];
  sessions: TimeSession[];
}

const Charts: React.FC<ChartsProps> = ({ goals, sessions }) => {
  
  // Prepare data for "Hours per Goal"
  const goalData = goals.map(g => ({
    name: g.title,
    hours: parseFloat(g.accumulatedHours.toFixed(1)),
    category: g.category
  })).sort((a, b) => b.hours - a.hours); // Sort by most time invested

  // Prepare data for "Category Distribution"
  const categoryMap = new Map<string, number>();
  goals.forEach(g => {
    const current = categoryMap.get(g.category) || 0;
    categoryMap.set(g.category, current + g.accumulatedHours);
  });
  
  const pieData = Array.from(categoryMap.entries()).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(1))
  }));

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Bar Chart */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <i className="fa-solid fa-chart-column text-yellow-500"></i> Investment by Goal
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={goalData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="name" type="category" width={100} stroke="#cbd5e1" fontSize={12} tickFormatter={(val) => val.length > 10 ? val.substring(0, 10) + '...' : val} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                    itemStyle={{ color: '#fbbf24' }}
                    cursor={{fill: '#334155', opacity: 0.2}}
                />
                <Bar dataKey="hours" radius={[0, 4, 4, 0]}>
                  {goalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <i className="fa-solid fa-chart-pie text-blue-500"></i> Category Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    >
                    {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                    />
                </PieChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-slate-500">No data available yet</p>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
              {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-slate-400">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      {entry.name}
                  </div>
              ))}
          </div>
        </div>

      </div>

        {/* Recent History Table (Simplified) */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
             <h3 className="text-white font-bold mb-4">Recent Deposits (Sessions)</h3>
             <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm text-slate-400">
                     <thead className="text-xs uppercase bg-slate-700/50 text-slate-300">
                         <tr>
                             <th className="px-4 py-3">Date</th>
                             <th className="px-4 py-3">Goal</th>
                             <th className="px-4 py-3 text-right">Duration</th>
                             <th className="px-4 py-3 text-right">Points</th>
                         </tr>
                     </thead>
                     <tbody>
                        {sessions.slice(0, 5).map(session => {
                            const goal = goals.find(g => g.id === session.goalId);
                            const minutes = (session.durationSeconds / 60).toFixed(0);
                            return (
                                <tr key={session.id} className="border-b border-slate-700 hover:bg-slate-700/20">
                                    <td className="px-4 py-3">{new Date(session.startTime).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 font-medium text-white">{goal?.title || 'Deleted Goal'}</td>
                                    <td className="px-4 py-3 text-right">{minutes} min</td>
                                    <td className="px-4 py-3 text-right text-yellow-500 font-bold">
                                        +{(session.durationSeconds / 3600).toFixed(2)}
                                    </td>
                                </tr>
                            )
                        })}
                        {sessions.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">No sessions recorded yet. Start investing time!</td>
                            </tr>
                        )}
                     </tbody>
                 </table>
             </div>
        </div>
    </div>
  );
};

export default Charts;