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

  useEffect(() => {
    setIsClient(true);
    if (initialProgress && Object.keys(initialProgress).length > 0) {
      const activeTaskIds = Object.entries(initialProgress)
        .filter(([_, isActive]) => isActive)
        .map(([id]) => id);
      setCompletedTasks(new Set(activeTaskIds));
      return;
    }

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

  const toggleTask = (taskId: string) => {
    const next = new Set(completedTasks);
    if (next.has(taskId)) {
      next.delete(taskId);
    } else {
      next.add(taskId);
    }
    
    setCompletedTasks(next);
    
    const nextArr = Array.from(next);
    const storageKey = `anbu_tasks_${repoName}`;
    localStorage.setItem(storageKey, JSON.stringify(nextArr));

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
    <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-100/20 p-8 mb-8 fade-in border border-gray-100 overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[80px] -mr-32 -mt-32 opacity-60 pointer-events-none" />
      
      <div className="relative flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-black text-ibm-gray tracking-tight mb-1.5 uppercase">Setup Checklist</h3>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Repository intelligence-driven tasks</p>
        </div>
        <div className="flex items-center gap-5">
          <div className="text-right">
            <span className="text-3xl font-black text-ibm-blue block leading-none">{progressPercentage}%</span>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Progress</span>
          </div>
          <div className="w-px h-10 bg-gray-100" />
          <div className="text-left">
            <span className="text-xl font-black text-ibm-gray block leading-none">{completedTasks.size}/{tasks.length}</span>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Tasks Done</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-50 rounded-full h-3 mb-8 overflow-hidden border border-gray-100 p-0.5">
        <div 
          className="bg-gradient-to-r from-ibm-blue to-blue-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(15,98,254,0.3)]" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 gap-3">
        {tasks.map((task) => {
          const isCompleted = completedTasks.has(task.id);
          return (
            <label 
              key={task.id} 
              className={`flex items-center gap-4 p-5 rounded-2xl cursor-pointer border transition-all duration-300 ${
                isCompleted 
                  ? 'bg-blue-50/30 border-blue-100/50' 
                  : 'bg-white border-gray-100 hover:border-ibm-blue hover:shadow-lg hover:shadow-blue-100/30 hover:-translate-y-0.5'
              }`}
            >
              <div className="relative flex items-center flex-shrink-0">
                <input
                  type="checkbox"
                  className="peer appearance-none w-6 h-6 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 checked:bg-ibm-blue checked:border-ibm-blue transition-all cursor-pointer"
                  checked={isCompleted}
                  onChange={() => toggleTask(task.id)}
                />
                <svg
                  className="absolute inset-0 w-6 h-6 text-white p-1 pointer-events-none opacity-0 peer-checked:opacity-100 transition-all scale-50 peer-checked:scale-100"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className={`text-sm md:text-base font-bold transition-all ${
                isCompleted ? 'text-gray-300 line-through' : 'text-ibm-gray'
              }`}>
                {task.title}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingChecklist;
