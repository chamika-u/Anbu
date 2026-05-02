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
    e.stopPropagation(); // Prevent card click
    if (!window.confirm('Are you sure you want to delete this analysis? This action cannot be undone.')) return;
    
    const success = await deleteAnalysis(id);
    if (success) {
      setHistory(history.filter(item => item.id !== id));
    } else {
      alert('Failed to delete analysis. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="text-center text-gray-500 mt-12 fade-in">Loading dashboard...</div>;
  }

  return (
    <div className="mt-8 max-w-6xl mx-auto fade-in">
      
      {/* ── Analytics Overview ─────────────────────────────────────────── */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-ibm-gray mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-ibm-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Analytics Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total Projects */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Projects</p>
              <h4 className="text-3xl font-bold text-ibm-gray">{history.length}</h4>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-ibm-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>

          {/* Card 2: Total Tasks */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Tasks Completed</p>
              <h4 className="text-3xl font-bold text-ibm-gray">
                {history.reduce((acc, curr) => acc + Object.values(curr.progress || {}).filter(Boolean).length, 0)}
              </h4>
            </div>
            <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-ibm-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Card 3: Overall Progress Ring */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-6">
            <div className="relative w-16 h-16">
              {(() => {
                const totalTasks = history.reduce((acc, curr) => acc + (curr.metadata.checklist?.length || 0), 0);
                const completedTasks = history.reduce((acc, curr) => acc + Object.values(curr.progress || {}).filter(Boolean).length, 0);
                const percent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
                const circumference = 2 * Math.PI * 24;
                const strokeDashoffset = circumference - (percent / 100) * circumference;

                return (
                  <>
                    {/* Background Circle */}
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-100" />
                      {/* Progress Circle */}
                      <circle 
                        cx="32" cy="32" r="24" 
                        stroke="currentColor" 
                        strokeWidth="6" 
                        fill="transparent" 
                        className="text-ibm-blue transition-all duration-1000 ease-out"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-sm font-bold text-ibm-gray">{percent}%</span>
                    </div>
                  </>
                );
              })()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Overall Progress</p>
              <p className="text-xs text-gray-400">Across all projects</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Projects Grid ───────────────────────────────────────── */}
      <h3 className="text-xl font-bold text-ibm-gray mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-ibm-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Your Repositories
      </h3>
      
      {history.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-ibm-gray mb-1">No repositories yet</h4>
          <p className="text-gray-500 max-w-md mx-auto">
            You haven't analyzed any repositories on this account. Use the search bar above to generate your first onboarding documentation!
          </p>
        </div>
      ) : isShowingAll ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Repository</th>
                  <th className="px-6 py-4 font-medium">Tech Stack</th>
                  <th className="px-6 py-4 font-medium">Progress</th>
                  <th className="px-6 py-4 font-medium">Analyzed On</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((item) => {
                  const totalTasks = item.metadata.checklist?.length || 0;
                  const completedTasks = Object.values(item.progress || {}).filter(Boolean).length;
                  const percent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-ibm-gray text-base">{item.repo_name}</div>
                        <div className="text-sm text-gray-500">{item.owner}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {item.metadata.tech_stack?.slice(0, 3).map((tech, i) => (
                            <span key={i} className="text-xs font-medium bg-blue-50 text-ibm-blue px-2 py-1 rounded-md">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-ibm-blue h-1.5 rounded-full" style={{ width: `${percent}%` }}></div>
                          </div>
                          <span className="text-sm font-medium text-gray-600">{percent}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => onSelect(item)}
                            className="text-ibm-blue font-medium hover:text-blue-700 hover:underline text-sm"
                          >
                            View Docs
                          </button>
                          <button 
                            onClick={(e) => handleDelete(e, item.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors"
                            title="Delete analysis"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button 
              onClick={() => setIsShowingAll(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-ibm-gray bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              Back to Grid
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.slice(0, 3).map((item) => (
              <div 
                key={item.id}
                onClick={() => onSelect(item)}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-ibm-blue transition-all cursor-pointer group relative"
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-ibm-gray text-lg truncate group-hover:text-ibm-blue transition-colors pr-6">
                    {item.repo_name}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full whitespace-nowrap uppercase tracking-tighter">
                      {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <button 
                      onClick={(e) => handleDelete(e, item.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-all -mr-1"
                      title="Delete analysis"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <p className="text-xs text-gray-400 mb-4 truncate">
                  {item.owner}/{item.repo_name}
                </p>

                {/* Mini Progress Bar */}
                {item.metadata.checklist && item.metadata.checklist.length > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-gray-500">Tasks Completed</span>
                      <span className="text-xs font-bold text-ibm-blue">
                        {Object.values(item.progress || {}).filter(Boolean).length} / {item.metadata.checklist.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-ibm-blue h-1.5 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.round((Object.values(item.progress || {}).filter(Boolean).length / item.metadata.checklist.length) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {item.metadata.tech_stack?.slice(0, 3).map((tech, i) => (
                    <span key={i} className="text-xs font-medium bg-blue-50 text-ibm-blue px-2 py-1 rounded-md">
                      {tech}
                    </span>
                  ))}
                  {item.metadata.tech_stack && item.metadata.tech_stack.length > 3 && (
                    <span className="text-xs font-medium bg-gray-50 text-gray-400 px-2 py-1 rounded-md">
                      +{item.metadata.tech_stack.length - 3}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {history.length > 3 && (
            <div className="mt-8 text-center">
              <button 
                onClick={() => setIsShowingAll(true)}
                className="px-6 py-2.5 bg-white border border-gray-200 shadow-sm text-ibm-gray font-medium rounded-xl hover:border-ibm-blue hover:text-ibm-blue transition-colors inline-flex items-center gap-2"
              >
                See all repositories
                <span className="bg-gray-100 text-gray-600 text-xs py-0.5 px-2 rounded-full font-bold">
                  {history.length}
                </span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecentAnalyses;
