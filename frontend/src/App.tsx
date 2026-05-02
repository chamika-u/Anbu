import { useState, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import RepositoryInput from './components/RepositoryInput';
import LoadingSpinner from './components/LoadingSpinner';
import DocumentationViewer from './components/DocumentationViewer';
import Toast from './components/Toast';
import RecentAnalyses from './components/RecentAnalyses';
import AuthPage from './components/AuthPage';
import GitHubTokenManager from './components/GitHubTokenManager';
import { analyzeRepository, saveAnalysis, type AnalyzeResponse, type RepoMetadata, type HistoryAnalysis } from './services/api';
import { useAuth } from './context/AuthContext';
// @ts-ignore
import html2pdf from 'html2pdf.js';
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
  const { user, isLoading: authLoading, updateUser } = useAuth();

  const showToast = useCallback((message: string, type: ToastState['type'] = 'info') => {
    setToast({ message, type });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const handleAnalyze = async (repoUrl: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setLoadingMessage('Initializing...');

    try {
      const response = await analyzeRepository(repoUrl, (msg) => {
        setLoadingMessage(msg);
      });
      setResult(response);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setIsLoading(false);
      setLoadingMessage(LOADING_MESSAGES[0]);
    }
  };

  const handleSelectHistory = (historyItem: HistoryAnalysis) => {
    setResult({
      success: true,
      documentation: historyItem.documentation,
      metadata: {
        ...historyItem.metadata,
        id: historyItem.id,
        progress: historyItem.progress
      },
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
    showToast('Documentation downloaded as Markdown!', 'success');
  };

  const handleDownloadPdf = () => {
    if (!result?.documentation) return;
    showToast('Generating PDF... this may take a moment.', 'info');
    const repoName = (result.metadata as RepoMetadata | undefined)?.repo_name ?? 'documentation';
    const element = document.getElementById('documentation-pdf-content');
    if (!element) return;
    
    const opt = {
      margin:       10,
      filename:     `${repoName}-onboarding.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };
    
    html2pdf().from(element).set(opt).save().then(() => {
      showToast('Documentation downloaded as PDF!', 'success');
    }).catch((err: any) => {
      showToast('Failed to generate PDF.', 'error');
      console.error(err);
    });
  };

  const handleProgressChange = (progress: Record<string, boolean>) => {
    if (!result || !result.metadata) return;
    setResult({
      ...result,
      metadata: {
        ...result.metadata,
        progress
      }
    });
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

  const [isSaving, setIsSaving] = useState(false);
  const handleSaveToDashboard = async () => {
    if (!result || !user || !result.documentation || !result.metadata) return;
    setIsSaving(true);
    try {
      const owner = result.metadata.owner || 'unknown';
      const repoName = result.metadata.repo_name || 'unknown';
      
      // Get current progress from localStorage before saving
      let currentProgress = {};
      const saved = localStorage.getItem(`anbu_tasks_${repoName}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const progressObj: Record<string, boolean> = {};
            result.metadata.checklist?.forEach(t => progressObj[t.id] = parsed.includes(t.id));
            currentProgress = progressObj;
          }
        } catch (e) {
          console.error('Failed to parse progress before save', e);
        }
      }

      const res = await saveAnalysis(result.share_url || '', owner, repoName, result.documentation, result.metadata, currentProgress);
      
      setResult({
        ...result,
        metadata: {
          ...result.metadata,
          id: res.id,
          progress: currentProgress
        }
      });
      showToast('Saved to your Dashboard!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save', 'error');
    } finally {
      setIsSaving(false);
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
                  {/* ── Dashboard Hero ── */}
                  <div className="fade-in">
                    <div className="max-w-6xl mx-auto mb-8">
                      {/* Welcome bar */}
                      <div className="relative rounded-2xl overflow-hidden mb-6 bg-gradient-to-r from-ibm-gray via-slate-800 to-slate-900 px-8 py-7">
                        {/* decorative blobs */}
                        <div className="absolute -top-10 -right-10 w-56 h-56 bg-ibm-blue rounded-full opacity-10 blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 right-1/3 w-40 h-40 bg-ibm-purple rounded-full opacity-10 blur-3xl pointer-events-none" />
                        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold text-blue-300 uppercase tracking-widest mb-1">Welcome back</p>
                            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                              {user.email.split('@')[0]}
                              <span className="text-ibm-blue">.</span>
                            </h1>
                            <p className="text-sm text-slate-400 mt-1">Ready to onboard a new repository?</p>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 backdrop-blur-sm">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                              <span className="text-xs font-medium text-slate-300">AI Engine Active</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Token manager + Repo input */}
                      <GitHubTokenManager
                        hasToken={user.has_github_token ?? false}
                        onTokenChange={(hasToken) => updateUser({ ...user, has_github_token: hasToken })}
                      />
                      <RepositoryInput onSubmit={handleAnalyze} isLoading={isLoading} hasGitHubToken={user.has_github_token ?? false} />
                    </div>
                    <RecentAnalyses onSelect={handleSelectHistory} />
                  </div>
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
              <div className="flex gap-3">
                {user && !(result.metadata as any).id && (
                  <button
                    onClick={handleSaveToDashboard}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-ibm-teal text-white rounded-lg font-medium hover:bg-teal-600 transition-colors shadow-sm disabled:opacity-70"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    {isSaving ? 'Saving...' : 'Save to Dashboard'}
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 text-ibm-blue hover:bg-blue-50 border border-ibm-blue rounded-lg font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {user ? 'Back to Dashboard' : 'Analyse Another Repository'}
                </button>
              </div>
            </div>
            <DocumentationViewer
              documentation={result.documentation}
              metadata={result.metadata}
              shareUrl={result.share_url}
              onDownload={handleDownload}
              onDownloadPdf={handleDownloadPdf}
              onCopyShareUrl={handleCopyShareUrl}
              onProgressChange={handleProgressChange}
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
