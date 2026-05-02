import React, { useState } from 'react';

interface RepositoryInputProps {
  onSubmit: (repoUrl: string) => void;
  isLoading: boolean;
}

const EXAMPLE_REPOS = [
  'https://github.com/facebook/react',
  'https://github.com/microsoft/vscode',
  'https://github.com/django/django',
];

/** Pattern: https://github.com/owner/repo or http variant, optional trailing slash */
const GITHUB_URL_PATTERN = /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+(\.git)?\/?$/;

const RepositoryInput: React.FC<RepositoryInputProps> = ({ onSubmit, isLoading }) => {
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

  const hasError = Boolean(validationError);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="repo-url"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            GitHub Repository URL
          </label>

          <div className="flex gap-2">
            <input
              id="repo-url"
              type="url"
              value={repoUrl}
              onChange={handleChange}
              placeholder="https://github.com/username/repository"
              aria-invalid={hasError}
              aria-describedby={hasError ? 'repo-url-error' : undefined}
              className={[
                'flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-shadow text-sm',
                hasError
                  ? 'border-red-400 focus:ring-red-400 bg-red-50'
                  : 'border-gray-300 focus:ring-ibm-blue focus:border-ibm-blue bg-white',
                isLoading ? 'opacity-60 cursor-not-allowed' : '',
              ].join(' ')}
              disabled={isLoading}
              autoComplete="url"
            />

            <button
              type="submit"
              id="analyze-btn"
              disabled={isLoading}
              className={[
                'px-7 py-3 rounded-xl font-semibold text-white text-sm transition-all whitespace-nowrap',
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-ibm-blue hover:bg-blue-700 active:scale-95 hover:shadow-lg',
              ].join(' ')}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Analysing…
                </span>
              ) : (
                'Generate Docs'
              )}
            </button>
          </div>

          {/* Inline validation error */}
          {hasError && (
            <p
              id="repo-url-error"
              className="mt-2 text-sm text-red-600 flex items-center gap-1"
              role="alert"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {validationError}
            </p>
          )}
        </div>

        {/* Example repositories */}
        <div className="pt-1">
          <p className="text-sm text-gray-500 mb-2">Try an example:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_REPOS.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => handleExampleClick(url)}
                disabled={isLoading}
                className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {url.split('/').slice(-2).join('/')}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Info panel */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-ibm-blue mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-1">How it works</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Paste any public GitHub repository URL above</li>
              <li>Our AI analyses the codebase structure and dependencies</li>
              <li>Get comprehensive onboarding documentation in minutes</li>
              <li>Download as Markdown or share with your team</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryInput;
