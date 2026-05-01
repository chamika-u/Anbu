import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import RepositoryInput from './components/RepositoryInput';
import LoadingSpinner from './components/LoadingSpinner';
import DocumentationViewer from './components/DocumentationViewer';
import { analyzeRepository, type AnalyzeResponse } from './services/api';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');

  const handleAnalyze = async (repoUrl: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    // Simulate progress messages
    const messages = [
      'Connecting to GitHub...',
      'Fetching repository data...',
      'Analyzing project structure...',
      'Detecting tech stack...',
      'Processing dependencies...',
      'Generating documentation with IBM watsonx AI...',
      'Finalizing documentation...',
    ];

    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      if (messageIndex < messages.length) {
        setLoadingMessage(messages[messageIndex]);
        messageIndex++;
      }
    }, 3000);

    try {
      const response = await analyzeRepository(repoUrl);
      
      clearInterval(messageInterval);
      
      if (response.success && response.documentation) {
        setResult(response);
      } else {
        setError(response.error || 'Failed to generate documentation');
      }
    } catch (err: any) {
      clearInterval(messageInterval);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
      setLoadingMessage('Initializing...');
    }
  };

  const handleDownload = () => {
    if (!result?.documentation) return;

    const blob = new Blob([result.documentation], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.metadata?.repo_name || 'documentation'}-onboarding.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (result?.share_url) {
      navigator.clipboard.writeText(result.share_url);
      alert('Share URL copied to clipboard!');
    } else {
      alert('Share URL not available. Please try again.');
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-ibm-light">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        {!result && !isLoading && (
          <div className="text-center mb-12 fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-ibm-gray mb-4">
              AI-Powered Developer Onboarding
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Generate comprehensive documentation for any GitHub repository
            </p>
            <p className="text-lg text-ibm-blue font-semibold">
              Powered by IBM watsonx AI
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8 fade-in">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-red-800 font-semibold mb-1">Error</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800 ml-4"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input Form */}
        {!result && !isLoading && (
          <div className="fade-in">
            <RepositoryInput onSubmit={handleAnalyze} isLoading={isLoading} />
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-2xl mx-auto fade-in">
            <div className="bg-white rounded-lg shadow-md p-8">
              <LoadingSpinner message={loadingMessage} size="large" />
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  This may take 1-2 minutes depending on repository size
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Documentation Result */}
        {result && result.documentation && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-ibm-gray">Generated Documentation</h2>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-ibm-blue hover:text-blue-700 font-medium transition-colors"
              >
                ← Analyze Another Repository
              </button>
            </div>
            <DocumentationViewer
              documentation={result.documentation}
              metadata={result.metadata}
              shareUrl={result.share_url}
              onDownload={handleDownload}
              onShare={handleShare}
            />
          </div>
        )}

        {/* Features Section */}
        {!result && !isLoading && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto fade-in">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-ibm-blue rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-ibm-gray mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Generate comprehensive documentation in minutes, not hours. Powered by IBM watsonx AI.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-ibm-teal rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-ibm-gray mb-2">Beginner Friendly</h3>
              <p className="text-gray-600">
                Documentation written specifically for junior developers joining your team.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-ibm-purple rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-ibm-gray mb-2">Easy Sharing</h3>
              <p className="text-gray-600">
                Download as Markdown or share via unique URL with your entire team.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;

// Made with Bob
