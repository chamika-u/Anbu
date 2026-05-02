import React, { useEffect, useState } from 'react';
import { getHistory, type HistoryAnalysis } from '../services/api';

interface RecentAnalysesProps {
  onSelect: (analysis: HistoryAnalysis) => void;
}

const RecentAnalyses: React.FC<RecentAnalysesProps> = ({ onSelect }) => {
  const [history, setHistory] = useState<HistoryAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return <div className="text-center text-gray-500 mt-12 fade-in">Loading history...</div>;
  }

  if (history.length === 0) {
    return null; // Don't show anything if there's no history yet
  }

  return (
    <div className="mt-16 max-w-6xl mx-auto fade-in">
      <h3 className="text-xl font-bold text-ibm-gray mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-ibm-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Recent Analyses
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelect(item)}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-ibm-blue transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-ibm-gray text-lg truncate group-hover:text-ibm-blue transition-colors">
                {item.repo_name}
              </h4>
              <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-1 rounded-full whitespace-nowrap">
                {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
            
            <p className="text-sm text-gray-500 mb-4 truncate">
              {item.owner}/{item.repo_name}
            </p>

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
    </div>
  );
};

export default RecentAnalyses;
