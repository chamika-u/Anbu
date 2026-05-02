import React, { useState, useEffect } from 'react';
import { updateProgress, type ChecklistTask } from '../services/api';

interface OnboardingChecklistProps {
  repoName: string;
  tasks: ChecklistTask[];
  analysisId?: number;
  initialProgress?: Record<string, boolean>;
}

const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({ repoName, tasks, analysisId, initialProgress }) => {
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
    if (analysisId) {
      const progressObj: Record<string, boolean> = {};
      tasks.forEach(t => progressObj[t.id] = next.has(t.id));
      updateProgress(analysisId, progressObj);
    }
  };

  const progressPercentage = tasks.length > 0 
    ? Math.round((completedTasks.size / tasks.length) * 100) 
    : 0;

  if (tasks.length === 0 || !isClient) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6 fade-in border border-blue-50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-ibm-gray">Project Startup Checklist</h3>
          <p className="text-sm text-gray-500 mt-1">Dynamically generated setup tasks based on the repository structure.</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-ibm-blue">{progressPercentage}%</span>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Completed</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6 overflow-hidden">
        <div 
          className="bg-ibm-blue h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => {
          const isCompleted = completedTasks.has(task.id);
          return (
            <label 
              key={task.id} 
              className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer border transition-all duration-200 ${
                isCompleted 
                  ? 'bg-blue-50 border-blue-100 opacity-75' 
                  : 'bg-white border-gray-100 hover:border-ibm-blue hover:shadow-sm'
              }`}
            >
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-ibm-blue focus:ring-offset-2 checked:bg-ibm-blue checked:border-ibm-blue transition-colors cursor-pointer"
                  checked={isCompleted}
                  onChange={() => toggleTask(task.id)}
                />
                <svg
                  className="absolute inset-0 w-5 h-5 text-white p-0.5 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className={`text-sm md:text-base font-medium select-none transition-colors ${
                isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'
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
