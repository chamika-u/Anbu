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
  onBack?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
}

const DocumentationViewer: React.FC<DocumentationViewerProps> = ({
  documentation,
  metadata,
  shareUrl,
  onDownload,
  onDownloadPdf,
  onCopyShareUrl,
  onProgressChange,
  onBack,
  onSave,
  isSaving = false,
}) => {
  const [activeTab, setActiveTab] = useState<'rendered' | 'raw'>('rendered');

  return (
    <div className="w-full max-w-6xl mx-auto fade-in pb-20">
      
      {/* ── Top Navigation ── */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-ibm-blue uppercase tracking-[0.2em] transition-all group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          Back to Dashboard
        </button>
        
        <div className="flex gap-1 bg-gray-100/50 p-1 rounded-xl border border-gray-100">
          <button
            onClick={() => setActiveTab('rendered')}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'rendered' ? 'bg-white text-ibm-blue shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'raw' ? 'bg-white text-ibm-blue shadow-sm' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Source
          </button>
        </div>
      </div>

      {/* ── Metadata Hero Card ─────────────────────────────────────────── */}
      {metadata && (
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/20 border border-gray-100 overflow-hidden mb-8 group">
          {/* Header Strip */}
          <div className="h-2 bg-gradient-to-r from-ibm-blue via-ibm-purple to-ibm-teal" />
          
          <div className="p-8 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-ibm-blue to-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-100">
                  {metadata.repo_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-ibm-gray tracking-tight truncate leading-tight">
                    {metadata.repo_name}
                  </h2>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{metadata.owner}</p>
                </div>
              </div>

              {/* Tech-stack badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {metadata.tech_stack.slice(0, 8).map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-ibm-blue text-[10px] font-black uppercase tracking-wider rounded-lg border border-blue-100/50"
                  >
                    {tech}
                  </span>
                ))}
                {metadata.is_private && (
                  <span className="px-3 py-1 bg-gray-900 text-white text-[10px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Private
                  </span>
                )}
              </div>

              <div className="flex items-center gap-5 text-gray-400">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <span className="text-xs font-bold">{metadata.dependencies_count} Files Analysed</span>
                </div>
                <div className="w-1 h-1 bg-gray-200 rounded-full" />
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-xs font-bold">{new Date(metadata.generated_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 lg:flex-col lg:w-48">
              <button
                onClick={onDownload}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-50 text-ibm-gray hover:bg-gray-100 text-xs font-black uppercase tracking-widest rounded-2xl transition-all border border-gray-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download .MD
              </button>

              {onSave && (
                <button
                  onClick={onSave}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-ibm-teal text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-teal-600 hover:shadow-lg hover:shadow-teal-100 transition-all active:scale-95 disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                  {isSaving ? 'Saving...' : 'Save to Dashboard'}
                </button>
              )}

              {onDownloadPdf && (
                <button
                  onClick={onDownloadPdf}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-ibm-teal text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-teal-600 hover:shadow-lg hover:shadow-teal-100 transition-all active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Export PDF
                </button>
              )}

              {shareUrl && (
                <button
                  onClick={onCopyShareUrl}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-ibm-purple text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-100 transition-all active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  Copy URL
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Interactive Checklist ───────────────────────────────────────── */}
      {metadata?.checklist && metadata.checklist.length > 0 && (
        <OnboardingChecklist 
          repoName={metadata.repo_name} 
          tasks={metadata.checklist} 
          analysisId={(metadata as any).id}
          initialProgress={(metadata as any).progress}
          onProgressChange={onProgressChange}
        />
      )}

      {/* ── Documentation Content ────────────────────────────────────────── */}
      <div id="documentation-pdf-content" className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/10 border border-gray-100 overflow-hidden">
        {activeTab === 'rendered' ? (
          <div className="p-8 md:p-14 markdown-content prose prose-lg max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                code({ inline, className, children, ...props }: React.ComponentPropsWithoutRef<'code'> & { inline?: boolean }) {
                  const match = /language-(\w+)/.exec(className || '');
                  if (!inline && match && match[1] === 'mermaid') {
                    return (
                      <div className="my-10 bg-gray-50/50 rounded-3xl p-8 border border-gray-100 shadow-inner">
                        <div className="flex items-center justify-center mb-4">
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Architecture Diagram</span>
                        </div>
                        <Mermaid chart={String(children).replace(/\n$/, '')} />
                      </div>
                    );
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {documentation}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="p-10 bg-gray-900 overflow-hidden">
            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-xs font-bold text-gray-500 ml-4 font-mono uppercase tracking-widest">DOCUMENTATION_SOURCE.MD</span>
            </div>
            <pre className="text-sm text-blue-100/80 overflow-x-auto whitespace-pre-wrap break-words font-mono leading-relaxed">
              {documentation}
            </pre>
          </div>
        )}
      </div>

      {/* ── Share URL display footer ── */}
      {shareUrl && (
        <div className="mt-8 flex flex-col items-center">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Share this documentation</p>
          <div className="flex items-center gap-2 bg-white rounded-full pl-6 pr-2 py-2 border border-gray-100 shadow-sm w-full max-w-md">
            <code className="text-xs text-gray-500 truncate flex-1 font-mono tracking-tight">{shareUrl}</code>
            <button
              onClick={onCopyShareUrl}
              className="bg-ibm-blue text-white text-[10px] font-black px-5 py-2 rounded-full hover:bg-blue-700 transition-all uppercase tracking-widest"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentationViewer;
