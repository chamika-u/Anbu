import React, { useState, useCallback } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import RepositoryInput from './components/RepositoryInput';
import LoadingSpinner from './components/LoadingSpinner';
import DocumentationViewer from './components/DocumentationViewer';
import Toast from './components/Toast';
import RecentAnalyses from './components/RecentAnalyses';
import AuthPage from './components/AuthPage';
import { analyzeRepository, type AnalyzeResponse, type RepoMetadata, type HistoryAnalysis } from './services/api';
import { useAuth } from './context/AuthContext';
import './App.css';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
}

const LOADING_MESSAGES = [
  'Connecting to GitHub…',
  'Fetching repository data…',
  'Analysing project structure…',
  'Detecting tech stack…',
  'Processing dependencies…',
  'Generating documentation with IBM watsonx AI…',
  'Finalising documentation…',
];

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [toast, setToast] = useState<ToastState | null>(null);
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const showToast = useCallback((message: string, type: ToastState['type'] = 'info') => {
    setToast({ message, type });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const handleAnalyze = async (repoUrl: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

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

  const handleSelectHistory = (historyItem: HistoryAnalysis) => {
    setResult({
      success: true,
      documentation: historyItem.documentation,
      metadata: historyItem.metadata,
      share_url: `https://github.com/${historyItem.owner}/${historyItem.repo_name}`,
      using_watsonx: historyItem.metadata.ai_generated,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if (!shareUrl) return showToast('No share URL available.', 'error');
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Share URL copied to clipboard!', 'success');
    } catch {
      showToast(`Share URL: ${shareUrl}`, 'info');
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  const dismissError = () => setError(null);

  if (authLoading) return null;

  return (
    <div className="min-h-screen flex flex-col bg-ibm-light">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {error && (
          <div className="max-w-4xl mx-auto mb-8 fade-in" role="alert" aria-live="assertive">
            <div className="bg-red-50 border border-red-300 rounded-xl p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-red-800 font-semibold text-sm mb-0.5">Something went wrong</h3>
                  <p className="text-red-700 text-sm break-words">{error}</p>
                </div>
                <button onClick={dismissError} className="flex-shrink-0 text-red-500 hover:text-red-700 p-1">✕</button>
              </div>
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={
            !result && !isLoading ? (
              <>
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
                <div className="fade-in">
                  <RepositoryInput onSubmit={handleAnalyze} isLoading={isLoading} />
                </div>
                
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
              </>
            ) : null
          } />

          <Route path="/login" element={
            user ? <Navigate to="/dashboard" /> : <AuthPage />
          } />

          <Route path="/dashboard" element={
            !user ? <Navigate to="/login" /> : (
              !result && !isLoading ? (
                <>
                  <div className="fade-in mb-12">
                    <h2 className="text-3xl font-bold text-ibm-gray mb-4">Your Dashboard</h2>
                    <RepositoryInput onSubmit={handleAnalyze} isLoading={isLoading} />
                  </div>
                  <RecentAnalyses onSelect={handleSelectHistory} />
                </>
              ) : null
            )
          } />
        </Routes>

        {isLoading && (
          <div className="max-w-2xl mx-auto fade-in mt-8">
            <div className="bg-white rounded-2xl shadow-lg p-10">
              <LoadingSpinner message={loadingMessage} size="large" />
            </div>
          </div>
        )}

        {result?.documentation && (
          <div className="fade-in">
            <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
              <h2 className="text-2xl font-bold text-ibm-gray">Generated Documentation</h2>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-ibm-blue hover:bg-blue-50 border border-ibm-blue rounded-lg font-medium"
              >
                Analyse Another Repository
              </button>
            </div>
            <DocumentationViewer
              documentation={result.documentation}
              metadata={result.metadata}
              shareUrl={result.share_url}
              onDownload={handleDownload}
              onCopyShareUrl={handleCopyShareUrl}
            />
          </div>
        )}

      </main>

      <Footer />

      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
      )}
    </div>
  );
}

export default App;
