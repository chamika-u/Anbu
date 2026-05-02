import React from 'react';

const LoadingSpinner: React.FC<{
  message?: string;
  size?: 'small' | 'medium' | 'large';
}> = ({ message = 'Gathering intelligence…', size = 'medium' }) => {
  const sizeClass = {
    small:  'w-8 h-8',
    medium: 'w-16 h-16',
    large:  'w-24 h-24',
  }[size];

  return (
    <div className="flex flex-col items-center justify-center py-12" role="status">
      <div className={`${sizeClass} relative`}>
        {/* Outer Ring */}
        <div className="absolute inset-0 border-[3px] border-slate-100 rounded-[30%] animate-[spin_3s_linear_infinite]" />
        {/* Middle Ring */}
        <div className="absolute inset-2 border-[3px] border-slate-200 rounded-[35%] animate-[spin_2s_linear_infinite_reverse]" />
        {/* Core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-slate-900 rounded-full animate-ping" />
        </div>
      </div>

      {message && (
        <div className="mt-8 space-y-1 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
            Neural Processing
          </p>
          <p className="text-sm font-bold text-slate-900 tracking-tight">
            {message}
          </p>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;

