import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocumentationViewerProps {
  documentation: string;
  metadata?: {
    repo_name: string;
    owner: string;
    tech_stack: string[];
    dependencies_count: number;
    generated_at: string;
  };
  shareUrl?: string;
  onDownload: () => void;
  onShare: () => void;
}

const DocumentationViewer: React.FC<DocumentationViewerProps> = ({
  documentation,
  metadata,
  shareUrl,
  onDownload,
  onShare,
}) => {
  const copyShareUrl = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      alert('Share URL copied to clipboard!');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto fade-in">
      {/* Metadata Card */}
      {metadata && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-ibm-gray mb-2">
                {metadata.owner}/{metadata.repo_name}
              </h2>
              <div className="flex flex-wrap gap-2 mb-2">
                {metadata.tech_stack.slice(0, 5).map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-ibm-blue text-white text-sm rounded-full"
                  >
                    {tech}
                  </span>
                ))}
                {metadata.tech_stack.length > 5 && (
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                    +{metadata.tech_stack.length - 5} more
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {metadata.dependencies_count} dependencies • Generated{' '}
                {new Date(metadata.generated_at).toLocaleDateString()}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onDownload}
                className="flex items-center gap-2 px-4 py-2 bg-ibm-teal text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
              <button
                onClick={shareUrl ? copyShareUrl : onShare}
                className="flex items-center gap-2 px-4 py-2 bg-ibm-purple text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                {shareUrl ? 'Copy Link' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Documentation Content */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="markdown-content prose prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {documentation}
          </ReactMarkdown>
        </div>
      </div>

      {/* Share URL Display */}
      {shareUrl && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-green-800">
                Documentation saved! Share this URL:
              </span>
            </div>
            <button
              onClick={copyShareUrl}
              className="text-sm text-green-700 hover:text-green-900 font-medium"
            >
              Copy URL
            </button>
          </div>
          <div className="mt-2 p-2 bg-white rounded border border-green-300">
            <code className="text-sm text-gray-700 break-all">{shareUrl}</code>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentationViewer;

// Made with Bob
