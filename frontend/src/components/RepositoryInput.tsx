import React, { useState } from 'react';

interface RepositoryInputProps {
  onSubmit: (repoUrl: string) => void;
  isLoading: boolean;
  hasGitHubToken?: boolean;
}

const EXAMPLE_REPOS = [
  'https://github.com/facebook/react',
  'https://github.com/microsoft/vscode',
  'https://github.com/django/django',
];

const GITHUB_URL_PATTERN = /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+(\.git)?\/?$/;

const RepositoryInput: React.FC<RepositoryInputProps> = ({ onSubmit, isLoading, hasGitHubToken = false }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [validationError, setValidationError] = useState('');

  const validate = (url: string): string => {
    if (!url.trim()) return 'Please enter a GitHub repository URL.';
    if (!GITHUB_URL_PATTERN.test(url.trim())) {
      return 'Please enter a valid GitHub repository URL.';
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = validate(repoUrl);
    if (msg) {
      setValidationError(msg);
      return;
    }
    setValidationError('');
    onSubmit(repoUrl.trim());
  };

  return (
    <div className="w-full max-w-3xl mx-auto fade-in">
      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="repo-url" className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                Repository Analysis
              </label>
              {hasGitHubToken ? (
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Private Enabled
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md">
                  Public Only
                </span>
              )}
            </div>

            <div className="relative group">
              <input
                id="repo-url"
                type="url"
                value={repoUrl}
                onChange={(e) => { setRepoUrl(e.target.value); setValidationError(''); }}
                placeholder="https://github.com/owner/repository"
                className={`w-full px-6 py-5 bg-slate-50 border-2 rounded-2xl text-lg font-medium transition-all placeholder:text-slate-300 outline-none ${
                  validationError 
                    ? 'border-red-100 focus:border-red-200 focus:bg-red-50 text-red-900' 
                    : 'border-transparent focus:border-ibm-blue/20 focus:bg-white text-slate-900 focus:shadow-inner'
                } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className={`absolute right-3 top-1/2 -translate-y-1/2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 active:scale-95 disabled:bg-slate-300 disabled:shadow-none ${
                  isLoading ? 'pr-12' : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Analyzing</span>
                  </div>
                ) : 'Analyze'}
              </button>
            </div>

            {validationError && (
              <p className="text-xs font-bold text-red-500 uppercase tracking-widest pl-2">
                {validationError}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quick Start</span>
              {EXAMPLE_REPOS.map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => { setRepoUrl(url); setValidationError(''); }}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-[11px] font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 active:scale-95 transition-all"
                >
                  {url.split('/').pop()}
                </button>
              ))}
            </div>
            
            {!hasGitHubToken && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-300 rounded-full" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Private repos require login
                </span>
              </div>
            )}
          </div>
        </form>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white/50 rounded-2xl border border-white/50 backdrop-blur-sm">
          <div className="w-8 h-8 bg-blue-50 text-ibm-blue rounded-lg flex items-center justify-center mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">Architecture</h4>
          <p className="text-xs text-slate-500 leading-relaxed">AI-powered system design visualization using Mermaid diagrams.</p>
        </div>
        <div className="p-6 bg-white/50 rounded-2xl border border-white/50 backdrop-blur-sm">
          <div className="w-8 h-8 bg-emerald-50 text-ibm-teal rounded-lg flex items-center justify-center mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">Real-time</h4>
          <p className="text-xs text-slate-500 leading-relaxed">Live analysis progress tracking via Server-Sent Events (SSE).</p>
        </div>
        <div className="p-6 bg-white/50 rounded-2xl border border-white/50 backdrop-blur-sm">
          <div className="w-8 h-8 bg-purple-50 text-ibm-purple rounded-lg flex items-center justify-center mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">Exportable</h4>
          <p className="text-xs text-slate-500 leading-relaxed">Save to your dashboard or export as high-quality PDF/Markdown.</p>
        </div>
      </div>
    </div>
  );
};

export default RepositoryInput;

