import React, { useState, useEffect } from 'react';
import { updateProgress, type ChecklistTask } from '../services/api';

interface OnboardingChecklistProps {
  repoName: string;
  tasks: ChecklistTask[];
  analysisId?: number;
  initialProgress?: Record<string, boolean>;
  onProgressChange?: (progress: Record<string, boolean>) => void;
}

const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({ repoName, tasks, analysisId, initialProgress, onProgressChange }) => {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [isClient, setIsClient] = useState(false);

  // Load saved progress
  useEffect(() => {
    setIsClient(true);
    
    // If backend progress is provided, use it
    if (initialProgress && Object.keys(initialProgress).length > 0) {
      const activeTaskIds = Object.entries(initialProgress)
        .filter(([_, isActive]) => isActive)
        .map(([id]) => id);
      setCompletedTasks(new Set(activeTaskIds));
      return;
    }

    // Fallback to localStorage
    const storageKey = `anbu_tasks_${repoName}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCompletedTasks(new Set(parsed));
      } catch (e) {
        console.error('Failed to parse saved checklist', e);
      }
    }
  }, [repoName, initialProgress]);

  // Handle toggling a task
  const toggleTask = (taskId: string) => {
    const next = new Set(completedTasks);
    if (next.has(taskId)) {
      next.delete(taskId);
    } else {
      next.add(taskId);
    }
    
    setCompletedTasks(next);
    
    // Save to localStorage
    const nextArr = Array.from(next);
    const storageKey = `anbu_tasks_${repoName}`;
    localStorage.setItem(storageKey, JSON.stringify(nextArr));

    // Save to backend if analysisId is available
    const progressObj: Record<string, boolean> = {};
    tasks.forEach(t => progressObj[t.id] = next.has(t.id));
    
    if (analysisId) {
      updateProgress(analysisId, progressObj);
    }

    if (onProgressChange) {
      onProgressChange(progressObj);
    }
  };

  const progressPercentage = tasks.length > 0 
    ? Math.round((completedTasks.size / tasks.length) * 100) 
    : 0;

  if (tasks.length === 0 || !isClient) return null;

  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 p-8 md:p-10 border border-slate-100 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Onboarding Path</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Follow these steps to initialize the workspace
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-slate-200"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 - (125.6 * progressPercentage) / 100}
                strokeLinecap="round"
                className="text-ibm-blue transition-all duration-700 ease-out"
              />
            </svg>
            <span className="absolute text-[10px] font-black text-slate-900">{progressPercentage}%</span>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Overall Progress</p>
            <p className="text-sm font-bold text-slate-900 leading-none">
              {completedTasks.size} <span className="text-slate-400">/</span> {tasks.length} <span className="text-slate-400">Tasks</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task) => {
          const isCompleted = completedTasks.has(task.id);
          return (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`group flex items-start gap-4 p-5 rounded-[1.25rem] text-left transition-all duration-300 border ${
                isCompleted 
                  ? 'bg-emerald-50/50 border-emerald-100' 
                  : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/20'
              }`}
            >
              <div className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                isCompleted 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
              }`}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                )}
              </div>
              <div className="space-y-1">
                <span className={`text-sm font-bold block transition-all tracking-tight leading-tight ${
                  isCompleted ? 'text-emerald-700 opacity-60 line-through' : 'text-slate-900'
                }`}>
                  {task.title}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-widest block ${
                  isCompleted ? 'text-emerald-500' : 'text-slate-400'
                }`}>
                  {isCompleted ? 'Completed' : 'Pending'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingChecklist;

