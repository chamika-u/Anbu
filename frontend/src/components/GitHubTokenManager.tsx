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
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-ibm-gray rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
        </div>
        <div>
          <h4 className="text-sm font-bold text-ibm-gray">Private Repository Access</h4>
          <p className="text-xs text-gray-500">
            {hasToken ? 'Your GitHub token is connected.' : 'Add a PAT to analyze your private codebases.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ghp_..."
              className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-ibm-blue outline-none w-48 font-mono"
              autoFocus
            />
            <button onClick={handleSave} disabled={isLoading} className="text-xs font-bold text-ibm-blue hover:underline">
              {isLoading ? '...' : 'Save'}
            </button>
            <button onClick={() => setIsEditing(false)} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {hasToken ? (
              <>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-tight">Active</span>
                <button onClick={() => setIsEditing(true)} className="text-xs text-ibm-gray hover:text-ibm-blue font-medium transition-colors underline decoration-dotted underline-offset-4">Change</button>
                <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors">Remove</button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-ibm-gray text-white text-xs font-bold rounded-lg hover:bg-black transition-all">
                Connect Token
              </button>
            )}
          </div>
        )}
      </div>
      {error && <div className="absolute top-full left-0 mt-1 text-[10px] text-red-500">{error}</div>}
    </div>
  );
};

export default GitHubTokenManager;
