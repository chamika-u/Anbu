import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Mermaid from './Mermaid';
import OnboardingChecklist from './OnboardingChecklist';
import type { RepoMetadata } from '../services/api';

interface DocumentationViewerProps {
  documentation: string;
  metadata?: RepoMetadata;
  shareUrl?: string;
  onDownload: () => void;
  onDownloadPdf?: () => void;
  onCopyShareUrl: () => void;
  onProgressChange?: (progress: Record<string, boolean>) => void;
}

const DocumentationViewer: React.FC<DocumentationViewerProps> = ({
  documentation,
  metadata,
  shareUrl,
  onDownload,
  onDownloadPdf,
  onCopyShareUrl,
  onProgressChange,
}) => {
  const [activeTab, setActiveTab] = useState<'rendered' | 'raw'>('rendered');

  return (
    <div className="w-full max-w-6xl mx-auto fade-in space-y-10 pb-20">

      {/* ── Header / Metadata ─────────────────────────────────────────── */}
      {metadata && (
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-slate-200">
          <div className="space-y-6 flex-1">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-100 px-2 py-1 rounded-md">
                  Repository Analysis
                </span>
                {metadata.is_private && (
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] bg-amber-50 px-2 py-1 rounded-md border border-amber-100 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                    Private
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                {metadata.repo_name}
              </h1>
              <p className="text-slate-400 font-medium tracking-tight">
                Owned by <span className="text-slate-900">{metadata.owner}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              {/* Tech-stack badges */}
              <div className="flex flex-wrap gap-2">
                {metadata.tech_stack.slice(0, 5).map((tech, index) => (
                  <span key={index} className="px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg shadow-sm">
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-l border-slate-200 pl-6">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  {metadata.dependencies_count} Files
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {new Date(metadata.generated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 no-print">
            <div className="flex bg-slate-100 rounded-xl p-1 mr-4">
              <button
                onClick={() => setActiveTab('rendered')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'rendered' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Docs
              </button>
              <button
                onClick={() => setActiveTab('raw')}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'raw' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Code
              </button>
            </div>
            
            <button
              onClick={onDownload}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
            >
              Markdown
            </button>
            {onDownloadPdf && (
              <button
                onClick={onDownloadPdf}
                className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
              >
                Download PDF
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* ── Main Content ─────────────────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-10">
          {metadata?.checklist && metadata.checklist.length > 0 && (
            <OnboardingChecklist 
              repoName={metadata.repo_name} 
              tasks={metadata.checklist} 
              analysisId={(metadata as any).id}
              initialProgress={(metadata as any).progress}
              onProgressChange={onProgressChange}
            />
          )}

          <div id="documentation-pdf-content" className="bg-white rounded-3xl shadow-2xl shadow-slate-200/40 overflow-hidden border border-slate-100">
            {activeTab === 'rendered' ? (
              <div className="p-10 md:p-16 markdown-content">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ inline, className, children, ...props }: React.ComponentPropsWithoutRef<'code'> & { inline?: boolean }) {
                      const match = /language-(\w+)/.exec(className || '');
                      if (!inline && match && match[1] === 'mermaid') {
                        return <Mermaid chart={String(children).replace(/\n$/, '')} />;
                      }
                      return <code className={className} {...props}>{children}</code>;
                    }
                  }}
                >
                  {documentation}
                </ReactMarkdown>
              </div>
            ) : (
              <pre className="p-10 text-sm text-slate-700 overflow-x-auto whitespace-pre-wrap break-words font-mono leading-relaxed bg-slate-50">
                {documentation}
              </pre>
            )}
          </div>
        </div>

        {/* ── Sidebar / Share ──────────────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-6 no-print">
          {shareUrl && (
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl shadow-slate-900/20 sticky top-28">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2 tracking-tight">Share Access</h3>
              <p className="text-white/60 text-xs font-medium leading-relaxed mb-6 uppercase tracking-widest">Provide this link to your team for collaborative onboarding.</p>
              
              <div className="space-y-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <code className="text-[10px] text-white/80 break-all font-mono opacity-80">{shareUrl}</code>
                </div>
                <button
                  onClick={onCopyShareUrl}
                  className="w-full py-4 bg-white text-slate-900 rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-100 transition-all active:scale-[0.98]"
                >
                  Copy share link
                </button>
              </div>
            </div>
          )}

          <div className="p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100/50">
            <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-4">Onboarding Tip</h4>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Use the interactive checklist to track your progress. Completing these steps ensures you have all dependencies installed and understand the core architecture before your first commit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationViewer;

