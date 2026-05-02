import React, { useEffect, useState } from 'react';
import { getHistory, deleteAnalysis, type HistoryAnalysis } from '../services/api';

interface RecentAnalysesProps {
  onSelect: (analysis: HistoryAnalysis) => void;
}

const ProgressRing: React.FC<{ percent: number; size?: number; stroke?: number }> = ({
  percent,
  size = 52,
  stroke = 5,
}) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} className="transform -rotate-90" aria-hidden="true">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="#0f62fe"
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
};


const RecentAnalyses: React.FC<RecentAnalysesProps> = ({ onSelect }) => {
  const [history, setHistory] = useState<HistoryAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isShowingAll, setIsShowingAll] = useState(false);
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

  const totalTasks = history.reduce((a, c) => a + (c.metadata.checklist?.length || 0), 0);
  const completedTasks = history.reduce(
    (a, c) => a + Object.values(c.progress || {}).filter(Boolean).length, 0
  );
  const overallPct = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const aiCount = history.filter(h => h.metadata.ai_generated).length;

  if (isLoading) {
    return (
      <div className="mt-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/2 mb-3" />
              <div className="h-8 bg-gray-100 rounded w-1/4" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse h-44" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 max-w-6xl mx-auto fade-in">

      {/* ── Analytics Strip ───────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">

        {/* Stat 1 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-ibm-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Projects</p>
            <p className="text-2xl font-bold text-ibm-gray">{history.length}</p>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-ibm-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Tasks Done</p>
            <p className="text-2xl font-bold text-ibm-gray">{completedTasks}</p>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-ibm-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">AI-Generated</p>
            <p className="text-2xl font-bold text-ibm-gray">{aiCount}</p>
          </div>
        </div>

        {/* Stat 4: progress ring */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="relative flex-shrink-0">
            <ProgressRing percent={overallPct} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-ibm-gray">{overallPct}%</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Overall Progress</p>
            <p className="text-sm font-semibold text-ibm-gray">Across all projects</p>
          </div>
        </div>
      </div>

      {/* ── Repository Section Header ──────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-ibm-gray flex items-center gap-2">
          <svg className="w-5 h-5 text-ibm-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          Saved Repositories
          {history.length > 0 && (
            <span className="bg-blue-100 text-ibm-blue text-xs font-bold px-2 py-0.5 rounded-full">{history.length}</span>
          )}
        </h3>
        {history.length > 3 && (
          <button
            onClick={() => setIsShowingAll(!isShowingAll)}
            className="text-sm font-semibold text-ibm-blue hover:text-blue-700 transition-colors flex items-center gap-1"
          >
            {isShowingAll ? 'Card View' : `See all ${history.length}`}
            <svg className={`w-4 h-4 transition-transform ${isShowingAll ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* ── Empty State ────────────────────────────────────────── */}
      {history.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-14 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-ibm-blue opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-ibm-gray mb-2">No repositories yet</h4>
          <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
            Analyze a GitHub repository above and click <strong>"Save to Dashboard"</strong> to see it here.
          </p>
        </div>
      )}

      {/* ── Table View ────────────────────────────────────────── */}
      {history.length > 0 && isShowingAll && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Repository</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Stack</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {history.map((item) => {
                  const total = item.metadata.checklist?.length || 0;
                  const done = Object.values(item.progress || {}).filter(Boolean).length;
                  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
                  return (
                    <tr key={item.id} className="hover:bg-blue-50/40 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ibm-blue to-ibm-purple flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {item.repo_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-ibm-gray text-sm">{item.repo_name}</div>
                            <div className="text-xs text-gray-400">{item.owner}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {item.metadata.tech_stack?.slice(0, 3).map((t, i) => (
                            <span key={i} className="text-xs bg-blue-50 text-ibm-blue font-medium px-2 py-0.5 rounded-md">{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-1.5 bg-ibm-blue rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-gray-500">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onSelect(item)}
                            className="text-xs font-semibold text-ibm-blue bg-blue-50 hover:bg-ibm-blue hover:text-white px-3 py-1.5 rounded-lg transition-all"
                          >
                            Open
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, item.id)}
                            disabled={deletingId === item.id}
                            className="text-gray-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all disabled:opacity-40"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Card Grid ─────────────────────────────────────────── */}
      {history.length > 0 && !isShowingAll && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {history.slice(0, 6).map((item, idx) => {
            const total = item.metadata.checklist?.length || 0;
            const done = Object.values(item.progress || {}).filter(Boolean).length;
            const pct = total === 0 ? 0 : Math.round((done / total) * 100);
            const isDeleting = deletingId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-ibm-blue/30 transition-all duration-200 cursor-pointer overflow-hidden"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {/* Top accent strip */}
                <div className="h-1 bg-gradient-to-r from-ibm-blue via-ibm-purple to-ibm-teal opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="p-5">
                  {/* Card header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ibm-blue to-ibm-purple flex items-center justify-center text-white font-bold text-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                        {item.repo_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-ibm-gray text-sm truncate group-hover:text-ibm-blue transition-colors">
                          {item.repo_name}
                        </h4>
                        <p className="text-xs text-gray-400 truncate">{item.owner}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      disabled={isDeleting}
                      className="opacity-0 group-hover:opacity-100 ml-2 flex-shrink-0 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40"
                      title="Delete"
                    >
                      {isDeleting ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Progress bar */}
                  {total > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-gray-400 font-medium">Setup Progress</span>
                        <span className="text-xs font-bold text-ibm-blue">{done}/{total} tasks</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-1.5 rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${pct}%`,
                            background: pct === 100
                              ? 'linear-gradient(90deg, #00bfa5, #0f62fe)'
                              : '#0f62fe'
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Tech stack tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.metadata.tech_stack?.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 border border-gray-100"
                      >
                        {tech}
                      </span>
                    ))}
                    {item.metadata.tech_stack && item.metadata.tech_stack.length > 4 && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 border border-gray-100">
                        +{item.metadata.tech_stack.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Card footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-1.5">
                      {item.metadata.ai_generated && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-ibm-purple bg-purple-50 px-2 py-0.5 rounded-full">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.001z" /></svg>
                          AI
                        </span>
                      )}
                      {item.metadata.is_private && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                          Private
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-300">
                      {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
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
