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
    if (!window.confirm('Remove your saved GitHub token? You will no longer be able to access private repositories.')) return;
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
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* GitHub icon */}
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-ibm-gray">Private Repository Access</h3>
            <p className="text-sm text-gray-500">Connect your GitHub account to analyze private repositories</p>
          </div>
        </div>
        {/* Status badge */}
        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${hasToken ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          <span className={`w-2 h-2 rounded-full ${hasToken ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          {hasToken ? 'Token Connected' : 'No Token'}
        </span>
      </div>

      {/* Info callout */}
      {!hasToken && !isEditing && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-ibm-blue flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-blue-800 font-medium">How to generate a GitHub PAT</p>
            <p className="text-sm text-blue-700 mt-0.5">
              Go to{' '}
              <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-ibm-blue">
                GitHub → Settings → Developer Settings → Personal Access Tokens
              </a>{' '}
              and create a token with the <code className="bg-blue-100 px-1 rounded">repo</code> scope.
            </p>
          </div>
        </div>
      )}

      {/* Token saved state */}
      {hasToken && !isEditing && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl mb-4">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-800">GitHub token is saved and active</p>
            <p className="text-xs text-green-600 mt-0.5">Private repositories in your GitHub account can now be analyzed.</p>
          </div>
        </div>
      )}

      {/* Token input form */}
      {isEditing && (
        <div className="mb-4">
          <label htmlFor="github-token-input" className="block text-sm font-medium text-gray-700 mb-2">
            GitHub Personal Access Token
          </label>
          <div className="relative">
            <input
              id="github-token-input"
              type={showToken ? 'text' : 'password'}
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ibm-blue focus:border-transparent transition-all"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showToken ? 'Hide token' : 'Show token'}
            >
              {showToken ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>
          </div>
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {!isEditing ? (
          <>
            <button
              id="add-github-token-btn"
              onClick={() => { setIsEditing(true); setError(null); }}
              className="flex items-center gap-2 px-4 py-2 bg-ibm-blue text-white text-sm font-medium rounded-xl hover:bg-blue-700 active:scale-95 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={hasToken ? 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' : 'M12 4v16m8-8H4'} />
              </svg>
              {hasToken ? 'Update Token' : 'Add GitHub Token'}
            </button>
            {hasToken && (
              <button
                id="delete-github-token-btn"
                onClick={handleDelete}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 text-red-500 border border-red-200 text-sm font-medium rounded-xl hover:bg-red-50 active:scale-95 transition-all disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {isLoading ? 'Removing...' : 'Remove Token'}
              </button>
            )}
          </>
        ) : (
          <>
            <button
              id="save-github-token-btn"
              onClick={handleSave}
              disabled={isLoading || !tokenInput.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-ibm-blue text-white text-sm font-medium rounded-xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Token
                </>
              )}
            </button>
            <button
              onClick={() => { setIsEditing(false); setTokenInput(''); setError(null); }}
              className="px-4 py-2 text-gray-500 text-sm font-medium rounded-xl hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GitHubTokenManager;
