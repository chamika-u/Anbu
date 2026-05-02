import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="glass sticky top-0 z-50 border-b border-slate-200/60 no-print">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo + wordmark */}
          <Link to="/" className="flex items-center gap-3 group transition-opacity hover:opacity-90">
            <div
              className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-slate-900/10 group-hover:scale-[1.02] transition-transform"
              aria-hidden="true"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 leading-tight block tracking-tight">Anbu</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analytics</span>
            </div>
          </Link>

          {/* Right side navigation */}
          <nav className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-6 pr-8 border-r border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Technology</span>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
                <div className="w-1.5 h-1.5 bg-ibm-blue rounded-full animate-pulse" />
                <span className="text-[11px] font-bold text-ibm-blue uppercase tracking-wider">IBM watsonx AI</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`text-sm font-semibold transition-colors px-4 py-2 rounded-xl ${
                      location.pathname === '/dashboard' 
                        ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="text-sm font-semibold text-slate-400 hover:text-red-500 transition-colors px-3 py-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="text-sm font-bold text-white bg-slate-900 px-6 py-2.5 rounded-xl hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-slate-900/10"
                >
                  Get Started
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

