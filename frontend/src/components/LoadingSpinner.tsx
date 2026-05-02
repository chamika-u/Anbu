import React from 'react';

const LoadingSpinner: React.FC<{
  message?: string;
  size?: 'small' | 'medium' | 'large';
}> = ({ message = 'Loading…', size = 'medium' }) => {
  const sizeClass = {
    small:  'w-8 h-8',
    medium: 'w-12 h-12',
    large:  'w-16 h-16',
  }[size];

  return (
    <div className="flex flex-col items-center justify-center py-8" role="status" aria-live="polite">
      <div className={`${sizeClass} relative`} aria-hidden="true">
        {/* Track */}
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
        {/* Spinner */}
        <div className="absolute inset-0 border-4 border-ibm-blue border-t-transparent rounded-full animate-spin" />
      </div>

      {message && (
        <p className="mt-4 text-gray-600 text-center text-sm animate-pulse">
          {message}
        </p>
      )}

      <span className="sr-only">{message || 'Loading'}</span>
    </div>
  );
};

export default LoadingSpinner;
