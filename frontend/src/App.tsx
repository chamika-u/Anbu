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
  'Establishing connection…',
  'Syncing source tree…',
  'Analyzing architecture…',
  'Generating intelligence…',
  'Finalizing documentation…',
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
    setLoadingMessage('Initializing analysis engine...');

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
    showToast('Markdown downloaded successfully.', 'success');
  };

  const handleDownloadPdf = () => {
    if (!result?.documentation) return;
    showToast('Preparing document export...', 'info');
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
      showToast('PDF exported successfully.', 'success');
    }).catch((err: any) => {
      showToast('Export failed.', 'error');
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
    if (!shareUrl) return showToast('No URL available.', 'error');
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Share link copied.', 'success');
    } catch {
      showToast(`Link: ${shareUrl}`, 'info');
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const handleSaveToDashboard = async () => {
    if (!result || !user || !result.documentation || !result.metadata) return;
    setIsSaving(true);
    try {
      const owner = result.metadata.owner || 'unknown';
      const repoName = result.metadata.repo_name || 'unknown';
      
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
          console.error('Failed to parse progress', e);
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
      showToast('Saved to your dashboard.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save.', 'error');
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
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-slate-900 selection:text-white">
      <Header />

      <main className="flex-grow container mx-auto px-6 py-12 md:py-20">
        {error && (
          <div className="max-w-4xl mx-auto mb-12 fade-in" role="alert">
            <div className="bg-white border-l-4 border-red-500 rounded-2xl p-6 shadow-xl shadow-red-500/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{error}</p>
                </div>
                <button onClick={dismissError} className="text-slate-300 hover:text-slate-900 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={
            !result && !isLoading ? (
              <div className="space-y-32">
                <div className="text-center space-y-8 fade-in">
                  <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    AI Intelligence Suite
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none">
                    Engineering <br/><span className="text-slate-400">Onboarding.</span>
                  </h1>
                  <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
                    Transform complex repositories into actionable intelligence. <br className="hidden md:block"/>
                    Powered by <span className="text-slate-900 font-bold">IBM watsonx AI</span> for unparalleled precision.
                  </p>
                  <div className="pt-8">
                    <RepositoryInput onSubmit={handleAnalyze} isLoading={isLoading} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                  <div className="space-y-4">
                    <div className="w-14 h-14 bg-white border border-slate-100 rounded-[1.25rem] flex items-center justify-center shadow-sm">
                      <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Instant Clarity</h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                      Zero delay in knowledge transfer. We map dependencies and architecture in real-time.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="w-14 h-14 bg-white border border-slate-100 rounded-[1.25rem] flex items-center justify-center shadow-sm">
                      <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Checklist Engine</h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                      Dynamic onboarding paths tailored to your specific tech stack and project needs.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="w-14 h-14 bg-white border border-slate-100 rounded-[1.25rem] flex items-center justify-center shadow-sm">
                      <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Collaborative</h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed">
                      Share insights with the whole team via secure links and PDF exports.
                    </p>
                  </div>
                </div>
              </div>
            ) : null
          } />

          <Route path="/login" element={
            user ? <Navigate to="/dashboard" /> : <AuthPage />
          } />

          <Route path="/dashboard" element={
            !user ? <Navigate to="/login" /> : (
              !result && !isLoading ? (
                <div className="fade-in space-y-12">
                  <div className="space-y-2">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Intelligence Dashboard</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Managing {user.email}</p>
                  </div>
                  <GitHubTokenManager
                    hasToken={user.has_github_token ?? false}
                    onTokenChange={(hasToken) => updateUser({ ...user, has_github_token: hasToken })}
                  />
                  <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 pl-1">Gather New Intelligence</h3>
                    <RepositoryInput onSubmit={handleAnalyze} isLoading={isLoading} hasGitHubToken={user.has_github_token ?? false} />
                  </div>
                  <RecentAnalyses onSelect={handleSelectHistory} />
                </div>
              ) : null
            )
          } />
        </Routes>

        {isLoading && (
          <div className="max-w-2xl mx-auto fade-in mt-12">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-16 border border-slate-100">
              <LoadingSpinner message={loadingMessage} size="large" />
            </div>
          </div>
        )}

        {result?.documentation && (
          <div className="fade-in space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-100 px-2 py-1 rounded-md">
                  Analysis Result
                </span>
              </div>
              <div className="flex gap-4">
                {user && !(result.metadata as any).id && (
                  <button
                    onClick={handleSaveToDashboard}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-30"
                  >
                    {isSaving ? 'Preserving Intelligence...' : 'Save to Intelligence Suite'}
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  {user ? 'Return to Dashboard' : 'New Analysis'}
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

