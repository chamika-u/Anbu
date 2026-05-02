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
  onCopyShareUrl: () => void;
}

const DocumentationViewer: React.FC<DocumentationViewerProps> = ({
  documentation,
  metadata,
  shareUrl,
  onDownload,
  onCopyShareUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'rendered' | 'raw'>('rendered');

  return (
    <div className="w-full max-w-6xl mx-auto fade-in">

      {/* ── Metadata card ───────────────────────────────────────────────── */}
      {metadata && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

            {/* Repo info */}
            <div className="min-w-0">
              <h2 className="text-2xl font-bold text-ibm-gray mb-2 truncate">
                {metadata.owner}/{metadata.repo_name}
              </h2>

              {/* Tech-stack badges */}
              {metadata.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {metadata.tech_stack.slice(0, 6).map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-ibm-blue text-white text-xs font-medium rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                  {metadata.tech_stack.length > 6 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      +{metadata.tech_stack.length - 6} more
                    </span>
                  )}
                </div>
              )}

              <p className="text-sm text-gray-500">
                {metadata.dependencies_count} file{metadata.dependencies_count !== 1 ? 's' : ''} analysed
                {' · '}
                Generated{' '}
                {new Date(metadata.generated_at).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <button
                id="download-btn"
                onClick={onDownload}
                className="flex items-center gap-2 px-4 py-2 bg-ibm-teal text-white text-sm font-medium rounded-xl hover:bg-teal-600 active:scale-95 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download .md
              </button>

              {shareUrl && (
                <button
                  id="copy-share-btn"
                  onClick={onCopyShareUrl}
                  className="flex items-center gap-2 px-4 py-2 bg-ibm-purple text-white text-sm font-medium rounded-xl hover:bg-purple-700 active:scale-95 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Link
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
        />
      )}

      {/* ── View tabs ────────────────────────────────────────────────────── */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('rendered')}
          className={[
            'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
            activeTab === 'rendered'
              ? 'bg-white text-ibm-gray shadow-sm'
              : 'text-gray-500 hover:text-gray-700',
          ].join(' ')}
        >
          Preview
        </button>
        <button
          onClick={() => setActiveTab('raw')}
          className={[
            'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
            activeTab === 'raw'
              ? 'bg-white text-ibm-gray shadow-sm'
              : 'text-gray-500 hover:text-gray-700',
          ].join(' ')}
        >
          Raw Markdown
        </button>
      </div>

      {/* ── Documentation content ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {activeTab === 'rendered' ? (
          <div className="p-8 md:p-10 markdown-content prose prose-lg max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                code({ inline, className, children, ...props }: React.ComponentPropsWithoutRef<'code'> & { inline?: boolean }) {
                  const match = /language-(\w+)/.exec(className || '');
                  if (!inline && match && match[1] === 'mermaid') {
                    return <Mermaid chart={String(children).replace(/\n$/, '')} />;
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
          <pre className="p-8 text-sm text-gray-700 overflow-x-auto whitespace-pre-wrap break-words font-mono leading-relaxed">
            {documentation}
          </pre>
        )}
      </div>

      {/* ── Share URL display ────────────────────────────────────────────── */}
      {shareUrl && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className="text-sm font-medium text-blue-800">Repository URL</span>
            <button
              onClick={onCopyShareUrl}
              className="text-sm text-ibm-blue hover:text-blue-800 font-medium transition-colors"
            >
              Copy
            </button>
          </div>
          <div className="p-2 bg-white rounded-lg border border-blue-200">
            <code className="text-sm text-gray-700 break-all">{shareUrl}</code>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentationViewer;
