import React, { useEffect, useState } from 'react';
import { getHistory, deleteAnalysis, type HistoryAnalysis } from '../services/api';

interface RecentAnalysesProps {
  onSelect: (analysis: HistoryAnalysis) => void;
}

const RecentAnalyses: React.FC<RecentAnalysesProps> = ({ onSelect }) => {
  const [history, setHistory] = useState<HistoryAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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
    if (!window.confirm('Delete this analysis? This cannot be undone.')) return;
    setDeletingId(id);
    const success = await deleteAnalysis(id);
    if (success) {
      setHistory(prev => prev.filter(item => item.id !== id));
    } else {
      alert('Failed to delete. Please try again.');
    }
    setDeletingId(null);
  };

  if (isLoading) {
    return (
      <div className="mt-12 max-w-5xl mx-auto opacity-50">
        <div className="h-8 bg-gray-100 rounded w-48 mb-6 animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-50 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (history.length === 0) return null;

  return (
    <div className="mt-20 max-w-5xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-6 px-2">
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
          Recent Analyses
          <span className="w-1 h-1 bg-gray-300 rounded-full" />
          <span className="text-ibm-blue">{history.length}</span>
        </h3>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-blue-100/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Repository</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest hidden md:table-cell">Stack</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {history.map((item) => {
                const total = item.metadata.checklist?.length || 0;
                const done = Object.values(item.progress || {}).filter(Boolean).length;
                const pct = total === 0 ? 0 : Math.round((done / total) * 100);
                return (
                  <tr 
                    key={item.id} 
                    onClick={() => onSelect(item)}
                    className="hover:bg-blue-50/30 transition-all cursor-pointer group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ibm-blue to-blue-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                          {item.repo_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-ibm-gray text-sm truncate">{item.repo_name}</div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.owner}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1.5">
                        {item.metadata.tech_stack?.slice(0, 2).map((t, i) => (
                          <span key={i} className="text-[10px] font-black bg-gray-50 text-gray-400 px-2 py-1 rounded-md border border-gray-100 uppercase tracking-tighter">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 w-24 h-1.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${pct === 100 ? 'bg-ibm-teal' : 'bg-ibm-blue'}`} 
                            style={{ width: `${pct}%` }} 
                          />
                        </div>
                        <span className="text-[10px] font-black text-ibm-gray w-8">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => handleDelete(e, item.id)}
                          disabled={deletingId === item.id}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-40"
                          title="Delete"
                        >
                          {deletingId === item.id ? (
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          )}
                        </button>
                        <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 group-hover:border-ibm-blue group-hover:text-ibm-blue transition-all">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentAnalyses;
