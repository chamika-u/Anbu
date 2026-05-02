import React, { useState } from 'react';
import { updateGitHubToken, deleteGitHubToken } from '../services/api';

interface GitHubTokenManagerProps {
  hasToken: boolean;
  onTokenChange: (hasToken: boolean) => void;
}

const GitHubTokenManager: React.FC<GitHubTokenManagerProps> = ({ hasToken, onTokenChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const handleSave = async () => {
    if (!tokenInput.trim()) { setError('Please enter a GitHub token.'); return; }
    setIsLoading(true);
    setError(null);
    try {
      await updateGitHubToken(tokenInput.trim());
      onTokenChange(true);
      setJustSaved(true);
      setIsExpanded(false);
      setTokenInput('');
      setTimeout(() => setJustSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save token.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Remove your GitHub token? Private repos will no longer be accessible.')) return;
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
    <div className={`rounded-2xl border transition-all duration-300 mb-5 overflow-hidden ${
      hasToken
        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
        : 'bg-white border-gray-200 shadow-sm'
    }`}>
      {/* ── Collapsed bar ─── */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          {/* GitHub mark */}
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${hasToken ? 'bg-green-600' : 'bg-gray-900'}`}>
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-ibm-gray">Private Repository Access</p>
              {/* Status pill */}
              {hasToken ? (
                <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  {justSaved ? 'Just connected!' : 'Connected'}
                </span>
              ) : (
                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Not connected</span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {hasToken
                ? 'Your private repos can now be analyzed'
                : 'Add a GitHub PAT to unlock private repositories'}
            </p>
          </div>
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {hasToken && !isExpanded && (
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="text-xs text-red-400 hover:text-red-600 font-medium px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Removing…' : 'Remove'}
            </button>
          )}
          <button
            id="add-github-token-btn"
            onClick={() => { setIsExpanded(!isExpanded); setError(null); }}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              isExpanded
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : hasToken
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-ibm-blue text-white hover:bg-blue-700 shadow-sm'
            }`}
          >
            {isExpanded ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                Cancel
              </>
            ) : hasToken ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                Update
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add Token
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Expanded form ─── */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-gray-100">
          <div className="pt-4">
            {/* Info tip */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 flex items-start gap-2.5">
              <svg className="w-4 h-4 text-ibm-blue flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-blue-700 leading-relaxed">
                Generate a token at{' '}
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline hover:text-ibm-blue"
                >
                  GitHub → Settings → Developer Settings → PATs
                </a>{' '}
                with the <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">repo</code> scope.
              </p>
            </div>

            {/* Input */}
            <label htmlFor="github-token-input" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Personal Access Token
            </label>
            <div className="relative mb-3">
              <input
                id="github-token-input"
                type={showToken ? 'text' : 'password'}
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                placeholder="ghp_xxxxxxxxxxxxxxxx"
                className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-xl text-sm font-mono bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ibm-blue focus:border-transparent transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                aria-label={showToken ? 'Hide token' : 'Show token'}
              >
                {showToken ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-500 mb-3 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {error}
              </p>
            )}

            <button
              id="save-github-token-btn"
              onClick={handleSave}
              disabled={isLoading || !tokenInput.trim()}
              className="flex items-center gap-2 px-4 py-2.5 bg-ibm-blue text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Token
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GitHubTokenManager;
