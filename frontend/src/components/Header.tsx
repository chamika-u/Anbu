import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isDashboard ? 'bg-white/80 backdrop-blur-lg border-b border-gray-100' : 'bg-white border-b border-gray-100'}`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="w-10 h-10 bg-gradient-to-br from-ibm-blue via-blue-600 to-ibm-purple rounded-xl flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-all shadow-blue-100 shadow-lg"
              aria-hidden="true"
            >
              <span className="text-white font-black text-xl select-none">A</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-black text-ibm-gray leading-none block group-hover:text-ibm-blue transition-colors tracking-tight">ANBU</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Intelligence</span>
            </div>
          </Link>

          {/* Navigation & Profile */}
          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center gap-2 pr-6 border-r border-gray-100">
              <div className="w-2 h-2 bg-ibm-blue rounded-full opacity-40" />
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                Powered by <span className="text-ibm-blue">Watsonx AI</span>
              </span>
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    isDashboard
                      ? 'bg-ibm-blue text-white shadow-lg shadow-blue-100'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-ibm-blue'
                  }`}
                >
                  Dashboard
                </Link>
                <div className="h-4 w-px bg-gray-100 mx-1" />
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 text-xs font-black bg-ibm-blue text-white rounded-xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-100 transition-all active:scale-95"
              >
                SIGN IN
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
