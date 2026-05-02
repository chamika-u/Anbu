import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import RepositoryInput from './components/RepositoryInput';
import LoadingSpinner from './components/LoadingSpinner';
import DocumentationViewer from './components/DocumentationViewer';
import Toast from './components/Toast';
import RecentAnalyses from './components/RecentAnalyses';
import { analyzeRepository, type AnalyzeResponse, type RepoMetadata, type HistoryAnalysis } from './services/api';
import { useAuth } from './context/AuthContext';
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

const LandingView = ({ handleAnalyze, isLoading, loadingMessage }: any) => {
  return (
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

      {isLoading && (
        <div className="max-w-2xl mx-auto fade-in mt-8">
          <div className="bg-white rounded-2xl shadow-lg p-10">
            <LoadingSpinner message={loadingMessage} size="large" />
            <p className="mt-6 text-center text-gray-500 text-sm">
              This may take 1–3 minutes depending on repository size and AI load.
            </p>
          </div>
        </div>
      )}

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto fade-in">
        {/* Feature Cards */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-ibm-blue rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-ibm-gray mb-2">Lightning Fast</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Generate comprehensive documentation in minutes, not hours. Powered by IBM watsonx AI.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-ibm-teal rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-ibm-gray mb-2">Beginner Friendly</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Documentation written specifically for junior developers joining your team.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-ibm-purple rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  );
};

export const AppLayout = ({ children, toast, dismissToast }: any) => {
  return (
    <div className="min-h-screen flex flex-col bg-ibm-light">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {children}
      </main>
      <Footer />
      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
      )}
    </div>
  );
};
