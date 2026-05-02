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
  const [showToken, setShowToken] = useState(false);

  const handleSave = async () => {
    if (!tokenInput.trim()) {
      setError('Please enter a GitHub token.');
      return;
    }
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
    if (!window.confirm('Remove your saved GitHub token?')) return;
    setIsLoading(true);
    setError(null);
    try {
      await deleteGitHubToken();
      onTokenChange(false);
    } catch (err: any) {
      setError(err.message || 'Failed to remove token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 p-8 border border-slate-100 fade-in mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-slate-900/10">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">GitHub Authentication</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Secure access for private repository analysis</p>
          </div>
        </div>
        
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${hasToken ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
          {hasToken ? 'Connection Active' : 'Disconnected'}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Personal Access Token (PAT)</label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-slate-200 focus:bg-white rounded-2xl outline-none transition-all font-mono text-sm"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
              >
                {showToken ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
            {error && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest pl-1">{error}</p>}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isLoading || !tokenInput.trim()}
              className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-[0.98] disabled:bg-slate-200"
            >
              {isLoading ? 'Verifying...' : 'Connect Account'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-widest transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900">
              {hasToken ? 'Security Token Active' : 'No Token Provided'}
            </p>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {hasToken 
                ? 'Your account is authorized to analyze private repositories.' 
                : 'Analysing private codebases requires a Personal Access Token.'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {hasToken && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-slate-400 hover:text-red-500 font-bold text-[10px] uppercase tracking-widest transition-all"
              >
                Revoke Access
              </button>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
            >
              {hasToken ? 'Rotate Token' : 'Add Security Token'}
            </button>
          </div>
        </div>
      )}

      {!hasToken && !isEditing && (
        <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
          <svg className="w-4 h-4 text-ibm-blue mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Generate a token at <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="text-ibm-blue hover:underline">GitHub Settings</a> with <code className="bg-blue-100/50 px-1 rounded text-ibm-blue font-bold">repo</code> scope enabled.
          </p>
        </div>
      )}
    </div>
  );
};

export default GitHubTokenManager;

