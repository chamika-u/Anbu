import React, { useState } from 'react';

interface RepositoryInputProps {
  onSubmit: (repoUrl: string) => void;
  isLoading: boolean;
}

const RepositoryInput: React.FC<RepositoryInputProps> = ({ onSubmit, isLoading }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [error, setError] = useState('');

  const validateGitHubUrl = (url: string): boolean => {
    const githubPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
    return githubPattern.test(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }

    if (!validateGitHubUrl(repoUrl.trim())) {
      setError('Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)');
      return;
    }

    onSubmit(repoUrl.trim());
  };

  const exampleRepos = [
    'https://github.com/facebook/react',
    'https://github.com/microsoft/vscode',
    'https://github.com/django/django',
  ];

  const handleExampleClick = (url: string) => {
    setRepoUrl(url);
    setError('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="repo-url" className="block text-sm font-medium text-gray-700 mb-2">
            GitHub Repository URL
          </label>
          <div className="flex gap-2">
            <input
              id="repo-url"
              type="text"
              value={repoUrl}
              onChange={(e) => {
                setRepoUrl(e.target.value);
                setError('');
              }}
              placeholder="https://github.com/username/repository"
              className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                error
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-ibm-blue focus:border-ibm-blue'
              }`}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`px-8 py-3 rounded-lg font-semibold text-white transition-all ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-ibm-blue hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Generate Docs'
              )}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
        </div>

        {/* Example Repositories */}
        <div className="pt-2">
          <p className="text-sm text-gray-600 mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {exampleRepos.map((url) => (
              <button
                key={url}
                type="button"
                onClick={() => handleExampleClick(url)}
                disabled={isLoading}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {url.split('/').slice(-2).join('/')}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-ibm-blue mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-1">How it works:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Paste any public GitHub repository URL</li>
              <li>Our AI analyzes the codebase structure and dependencies</li>
              <li>Get comprehensive onboarding documentation in minutes</li>
              <li>Download or share the documentation with your team</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryInput;

// Made with Bob
