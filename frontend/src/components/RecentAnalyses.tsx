import React, { useEffect, useState } from 'react';
import { getHistory, deleteAnalysis, type HistoryAnalysis } from '../services/api';

interface RecentAnalysesProps {
  onSelect: (analysis: HistoryAnalysis) => void;
}

const RecentAnalyses: React.FC<RecentAnalysesProps> = ({ onSelect }) => {
  const [history, setHistory] = useState<HistoryAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isShowingAll, setIsShowingAll] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (err) {
        console.error('Failed to load history', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!window.confirm('Delete this analysis?')) return;
    
    const success = await deleteAnalysis(id);
    if (success) {
      setHistory(history.filter(item => item.id !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="w-12 h-12 bg-slate-200 rounded-2xl mb-4" />
        <div className="h-4 w-32 bg-slate-200 rounded-full" />
      </div>
    );
  }

  return (
    <div className="mt-16 max-w-6xl mx-auto fade-in">
      
      {/* ── Analytics Overview ─────────────────────────────────────────── */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-100 px-2 py-1 rounded-md">
            Intelligence Overview
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-8 hover-lift shadow-sm">
            <div className="w-10 h-10 bg-blue-50 text-ibm-blue rounded-xl flex items-center justify-center mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Projects</p>
            <h4 className="text-4xl font-black text-slate-900 tracking-tight">{history.length}</h4>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-8 hover-lift shadow-sm">
            <div className="w-10 h-10 bg-emerald-50 text-ibm-teal rounded-xl flex items-center justify-center mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tasks Completed</p>
            <h4 className="text-4xl font-black text-slate-900 tracking-tight">
              {history.reduce((acc, curr) => acc + Object.values(curr.progress || {}).filter(Boolean).length, 0)}
            </h4>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 hover-lift shadow-xl shadow-slate-900/20 text-white">
            <div className="flex items-center gap-6">
              <div className="relative w-16 h-16 flex-shrink-0">
                {(() => {
                  const totalTasks = history.reduce((acc, curr) => acc + (curr.metadata.checklist?.length || 0), 0);
                  const completedTasks = history.reduce((acc, curr) => acc + Object.values(curr.progress || {}).filter(Boolean).length, 0);
                  const percent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
                  const circumference = 2 * Math.PI * 24;
                  const strokeDashoffset = circumference - (percent / 100) * circumference;

                  return (
                    <div className="relative">
                      <svg className="w-16 h-16 -rotate-90">
                        <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/10" />
                        <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-black">{percent}%</span>
                    </div>
                  );
                })()}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Global Progress</p>
                <p className="text-sm font-bold text-white/90 leading-tight">Mastery across all connected repositories</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Repositories Grid ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-100 px-2 py-1 rounded-md">
            Recent Intelligence
          </span>
        </div>
        {history.length > 3 && !isShowingAll && (
          <button onClick={() => setIsShowingAll(true)} className="text-[10px] font-bold text-ibm-blue uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
            View All Projects
          </button>
        )}
      </div>
      
      {history.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-slate-100 p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <h4 className="text-xl font-black text-slate-900 tracking-tight mb-2">No intelligence gathered</h4>
          <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
            Start by analyzing a repository. Your gathered insights and onboarding paths will appear here.
          </p>
        </div>
      ) : isShowingAll ? (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-[0.15em]">
                  <th className="px-8 py-5">Repository</th>
                  <th className="px-8 py-5">Intelligence</th>
                  <th className="px-8 py-5">Completion</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item) => {
                  const totalTasks = item.metadata.checklist?.length || 0;
                  const completedTasks = Object.values(item.progress || {}).filter(Boolean).length;
                  const percent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
                  
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-900 tracking-tight">{item.repo_name}</div>
                        <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{item.owner}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-1">
                          {item.metadata.tech_stack?.slice(0, 2).map((tech, i) => (
                            <span key={i} className="text-[9px] font-bold bg-slate-900 text-white px-2 py-1 rounded-md uppercase tracking-wider">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-ibm-blue h-1.5 rounded-full" style={{ width: `${percent}%` }}></div>
                          </div>
                          <span className="text-xs font-bold text-slate-900">{percent}%</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => onSelect(item)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>
                          <button onClick={(e) => handleDelete(e, item.id)} className="p-2 text-slate-200 hover:text-red-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
            <button onClick={() => setIsShowingAll(false)} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all">
              Return to selection
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.slice(0, 3).map((item) => {
            const totalTasks = item.metadata.checklist?.length || 0;
            const completedTasks = Object.values(item.progress || {}).filter(Boolean).length;
            const percent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
            
            return (
              <div 
                key={item.id}
                onClick={() => onSelect(item)}
                className="bg-white rounded-[2rem] border border-slate-100 p-8 hover-lift shadow-sm cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 no-print">
                   <button 
                    onClick={(e) => handleDelete(e, item.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-200 hover:text-red-500 transition-all active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      {item.owner}
                    </span>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-ibm-blue transition-colors truncate pr-10">
                      {item.repo_name}
                    </h4>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mastery</span>
                      <span className="text-xs font-black text-slate-900">{percent}%</span>
                    </div>
                    <div className="w-full bg-slate-50 rounded-full h-2 overflow-hidden border border-slate-100">
                      <div className="bg-ibm-blue h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${percent}%` }} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {item.metadata.tech_stack?.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-[9px] font-bold bg-slate-50 text-slate-500 px-2.5 py-1 rounded-md uppercase tracking-wider group-hover:bg-slate-100 transition-colors">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentAnalyses;

