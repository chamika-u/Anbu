import React, { useState } from 'react';
import { updateGitHubToken, deleteGitHubToken } from '../services/api';

interface GitHubTokenManagerProps {
  hasToken: boolean;
  onTokenChange: (hasToken: boolean) => void;
}

const GitHubTokenManager: React.FC<GitHubTokenManagerProps> = ({ hasToken, onTokenChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!tokenInput.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      await updateGitHubToken(tokenInput.trim());
      onTokenChange(true);
      setIsEditing(false);
      setTokenInput('');
    } catch (err: any) {
      setError(err.message || 'Failed to save token.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Remove GitHub token?')) return;
    setIsLoading(true);
    try {
      await deleteGitHubToken();
      onTokenChange(false);
    } catch (err: any) {
      setError(err.message || 'Failed to remove.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mb-8 relative">
      <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${hasToken ? 'bg-ibm-blue/10 text-ibm-blue shadow-inner' : 'bg-gray-100 text-gray-400'}`}>
            <svg className={`w-6 h-6 ${hasToken ? 'animate-pulse' : ''}`} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-ibm-gray">Private Repository Access</h4>
              {hasToken && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              {hasToken ? 'Connected via GitHub PAT' : 'Add a PAT to analyze private codebases'}
              <span className="text-gray-300">|</span>
              <a 
                href="https://github.com/chamika-u/Anbu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-ibm-blue hover:underline font-medium"
              >
                Anbu Source
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Paste token (ghp_...)"
                className="px-3 py-1.5 text-xs bg-transparent border-none focus:ring-0 outline-none w-48 font-mono text-ibm-gray"
                autoFocus
              />
              <button 
                onClick={handleSave} 
                disabled={isLoading} 
                className="px-3 py-1.5 bg-ibm-blue text-white text-[10px] font-bold rounded-lg hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50"
              >
                {isLoading ? '...' : 'SAVE'}
              </button>
              <button 
                onClick={() => setIsEditing(false)} 
                className="p-1.5 text-gray-400 hover:text-gray-600"
                aria-label="Cancel"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {hasToken ? (
                <>
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Active Status</span>
                    <span className="text-[9px] text-gray-400">Encrypted Storage</span>
                  </div>
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="px-4 py-2 text-xs text-ibm-gray hover:bg-gray-100 border border-gray-200 font-bold rounded-xl transition-all"
                  >
                    Update
                  </button>
                  <button 
                    onClick={handleDelete} 
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Remove Token"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="px-6 py-2.5 bg-ibm-gray text-white text-xs font-bold rounded-xl hover:bg-black transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Connect GitHub
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {error && <div className="absolute -bottom-6 left-5 text-[10px] text-red-500 animate-bounce">{error}</div>}
    </div>
  );
};

export default GitHubTokenManager;
