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

/** Pattern: https://github.com/owner/repo or http variant, optional trailing slash */
const GITHUB_URL_PATTERN = /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+(\.git)?\/?$/;

const RepositoryInput: React.FC<RepositoryInputProps> = ({ onSubmit, isLoading, hasGitHubToken = false }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [validationError, setValidationError] = useState('');

  const validate = (url: string): string => {
    if (!url.trim()) return 'Please enter a GitHub repository URL.';
    if (!GITHUB_URL_PATTERN.test(url.trim())) {
      return 'Please enter a valid GitHub repository URL (e.g. https://github.com/username/repo).';
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepoUrl(e.target.value);
    if (validationError) setValidationError('');
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

  const handleExampleClick = (url: string) => {
    setRepoUrl(url);
    setValidationError('');
  };

  const handleClear = () => {
    setRepoUrl('');
    setValidationError('');
  };

  const hasError = Boolean(validationError);

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <label
            htmlFor="repo-url"
            className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3"
          >
            Enter Repository URL
          </label>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1 group">
              <div className={`absolute inset-y-0 left-4 flex items-center pointer-events-none transition-colors ${hasError ? 'text-red-400' : 'text-gray-400 group-focus-within:text-ibm-blue'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <input
                id="repo-url"
                type="url"
                value={repoUrl}
                onChange={handleChange}
                placeholder="https://github.com/username/repository"
                aria-invalid={hasError}
                aria-describedby={hasError ? 'repo-url-error' : undefined}
                className={`w-full pl-12 pr-12 py-3.5 border rounded-xl focus:outline-none focus:ring-2 transition-all text-sm font-medium ${
                  hasError
                    ? 'border-red-200 focus:ring-red-100 bg-red-50 text-red-900 placeholder-red-300'
                    : 'border-gray-200 focus:ring-blue-50 focus:border-ibm-blue bg-gray-50/50 hover:bg-gray-50'
                } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={isLoading}
                autoComplete="url"
              />
              {repoUrl && !isLoading && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-300 hover:text-gray-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <button
              type="submit"
              id="analyze-btn"
              disabled={isLoading || !repoUrl.trim()}
              className={`px-8 py-3.5 rounded-xl font-bold text-white text-sm transition-all whitespace-nowrap shadow-sm active:scale-[0.98] ${
                isLoading || !repoUrl.trim()
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-ibm-blue hover:bg-blue-700 hover:shadow-blue-200 hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  Analyzing...
                </span>
              ) : (
                'Generate Documentation'
              )}
            </button>
          </div>

          {/* Inline validation error */}
          {hasError && (
            <p id="repo-url-error" className="mt-3 text-xs font-bold text-red-500 flex items-center gap-1.5 animate-pulse" role="alert">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {validationError}
            </p>
          )}

          {/* Private repo access indicator */}
          {!hasError && (
            hasGitHubToken ? (
              <p className="mt-3 text-[11px] text-green-600 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Private Access Active
              </p>
            ) : (
              <p className="mt-3 text-[11px] text-gray-400 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
                Public Only (Add token for private)
              </p>
            )
          )}
        </div>

        {/* Examples section */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 px-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex-shrink-0">Quick Start:</span>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_REPOS.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => handleExampleClick(url)}
                disabled={isLoading}
                className="px-3.5 py-1.5 text-xs font-bold bg-white border border-gray-100 hover:border-ibm-blue hover:text-ibm-blue text-gray-500 rounded-full transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                {url.split('/').slice(-1)[0]}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Info panel */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/40 border border-gray-100 rounded-2xl p-5 hover:bg-white hover:shadow-sm transition-all group">
          <div className="w-10 h-10 bg-blue-50 text-ibm-blue rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
          </div>
          <h4 className="text-sm font-bold text-ibm-gray mb-1.5">Deep Analysis</h4>
          <p className="text-xs text-gray-500 leading-relaxed">Our AI scans code structure, logic, and dependencies to build context.</p>
        </div>

        <div className="bg-white/40 border border-gray-100 rounded-2xl p-5 hover:bg-white hover:shadow-sm transition-all group">
          <div className="w-10 h-10 bg-purple-50 text-ibm-purple rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <h4 className="text-sm font-bold text-ibm-gray mb-1.5">Auto Documentation</h4>
          <p className="text-xs text-gray-500 leading-relaxed">Generates comprehensive guides, tech stack maps, and setup checklists.</p>
        </div>

        <div className="bg-white/40 border border-gray-100 rounded-2xl p-5 hover:bg-white hover:shadow-sm transition-all group">
          <div className="w-10 h-10 bg-teal-50 text-ibm-teal rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <h4 className="text-sm font-bold text-ibm-gray mb-1.5">Interactive Checklist</h4>
          <p className="text-xs text-gray-500 leading-relaxed">Keep track of your setup progress with persistent, per-repo checklists.</p>
        </div>
      </div>
    </div>
  );
};

export default RepositoryInput;
