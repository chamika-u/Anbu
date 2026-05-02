import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import RepositoryInput from './components/RepositoryInput';
import LoadingSpinner from './components/LoadingSpinner';
import DocumentationViewer from './components/DocumentationViewer';
import Toast from './components/Toast';
import { analyzeRepository, type AnalyzeResponse, type RepoMetadata } from './services/api';
import './App.css';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
}

// ── Loading messages cycling during AI generation ─────────────────────────────

const LOADING_MESSAGES = [
  'Connecting to GitHub…',
  'Fetching repository data…',
  'Analysing project structure…',
  'Detecting tech stack…',
  'Processing dependencies…',
  'Generating documentation with IBM watsonx AI…',
  'Finalising documentation…',
];

// ── App ───────────────────────────────────────────────────────────────────────

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [toast, setToast] = useState<ToastState | null>(null);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const showToast = useCallback((message: string, type: ToastState['type'] = 'info') => {
    setToast({ message, type });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleAnalyze = async (repoUrl: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    // Cycle through progress messages while the request is in flight
    let messageIndex = 0;
    setLoadingMessage(LOADING_MESSAGES[0]);
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[messageIndex]);
    }, 3500);

    try {
      const response = await analyzeRepository(repoUrl);
      setResult(response);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      clearInterval(messageInterval);
      setIsLoading(false);
      setLoadingMessage(LOADING_MESSAGES[0]);
    }
  };

  const handleDownload = () => {
    if (!result?.documentation) return;

    const repoName = (result.metadata as RepoMetadata | undefined)?.repo_name ?? 'documentation';
    const blob = new Blob([result.documentation], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${repoName}-onboarding.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Documentation downloaded!', 'success');
  };

  const handleCopyShareUrl = async () => {
    const shareUrl = result?.share_url;
    if (!shareUrl) {
      showToast('No share URL available.', 'error');
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Share URL copied to clipboard!', 'success');
    } catch {
      // Fallback for browsers that block clipboard access
      showToast(`Share URL: ${shareUrl}`, 'info');
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  const dismissError = () => setError(null);

  // ── Render ───────────────────────────────────────────────────────────────────

  const showHero = !result && !isLoading;

  return (
    <div className="min-h-screen flex flex-col bg-ibm-light">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">

        {/* ── Hero Section ──────────────────────────────────────────────── */}
        {showHero && (
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

        {/* ── Error Banner ──────────────────────────────────────────────── */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8 fade-in" role="alert" aria-live="assertive">
            <div className="bg-red-50 border border-red-300 rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                {/* Icon */}
                <span className="flex-shrink-0 mt-0.5">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>

                {/* Message */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-red-800 font-semibold text-sm mb-0.5">
                    Something went wrong
                  </h3>
                  <p className="text-red-700 text-sm break-words">{error}</p>
                </div>

                {/* Dismiss */}
                <button
                  onClick={dismissError}
                  className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors p-1 rounded focus-visible:outline-2 focus-visible:outline-red-500"
                  aria-label="Dismiss error"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {/* Retry button */}
              <div className="mt-3 pl-8">
                <button
                  onClick={dismissError}
                  className="text-sm text-red-700 hover:text-red-900 font-medium underline underline-offset-2"
                >
                  Dismiss and try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Repository Input Form ─────────────────────────────────────── */}
        {showHero && (
          <div className="fade-in">
            <RepositoryInput onSubmit={handleAnalyze} isLoading={isLoading} />
          </div>
        )}

        {/* ── Loading State ─────────────────────────────────────────────── */}
        {isLoading && (
          <div className="max-w-2xl mx-auto fade-in">
            <div className="bg-white rounded-2xl shadow-lg p-10">
              <LoadingSpinner message={loadingMessage} size="large" />
              <p className="mt-6 text-center text-gray-500 text-sm">
                This may take 1–3 minutes depending on repository size and AI load.
              </p>
            </div>
          </div>
        )}

        {/* ── Documentation Result ──────────────────────────────────────── */}
        {result?.documentation && (
          <div className="fade-in">
            {/* Sub-header bar */}
            <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
              <h2 className="text-2xl font-bold text-ibm-gray">Generated Documentation</h2>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-ibm-blue hover:text-white hover:bg-ibm-blue border border-ibm-blue rounded-lg font-medium transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Analyse Another Repository
              </button>
            </div>

            {/* WatsonX badge */}
            {result.using_watsonx && (
              <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-800 font-medium text-sm">
                  ✨ AI-Generated Documentation — IBM watsonx AI
                </span>
              </div>
            )}

            {!result.using_watsonx && (
              <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-amber-800 font-medium text-sm">
                  Template documentation — IBM watsonx AI credentials are not configured.
                </span>
              </div>
            )}

            <DocumentationViewer
              documentation={result.documentation}
              metadata={result.metadata}
              shareUrl={result.share_url}
              onDownload={handleDownload}
              onCopyShareUrl={handleCopyShareUrl}
            />
          </div>
        )}

        {/* ── Feature Cards ─────────────────────────────────────────────── */}
        {showHero && (
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto fade-in">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-ibm-blue rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-ibm-gray mb-2">Lightning Fast</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Generate comprehensive documentation in minutes, not hours. Powered by IBM watsonx AI.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-ibm-teal rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-ibm-gray mb-2">Beginner Friendly</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Documentation written specifically for junior developers joining your team.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-ibm-purple rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-ibm-gray mb-2">Easy Sharing</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Download as Markdown or copy a share link to distribute with your entire team.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* ── Toast Notifications ───────────────────────────────────────────── */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={dismissToast}
        />
      )}
    </div>
  );
}

export default App;
