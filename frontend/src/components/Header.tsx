import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">

          {/* Logo + wordmark */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div
              className="w-10 h-10 bg-gradient-to-br from-ibm-blue to-ibm-purple rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform"
              aria-hidden="true"
            >
              <span className="text-white font-bold text-xl select-none">A</span>
            </div>
            <div>
              <span className="text-xl font-bold text-ibm-gray leading-none block group-hover:text-ibm-blue transition-colors">Anbu</span>
              <span className="text-xs text-gray-500 leading-none">AI Developer Onboarding</span>
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-6">
            <span className="hidden md:block text-sm text-gray-500">
              Powered by{' '}
              <span className="text-ibm-blue font-semibold">IBM watsonx AI</span>
            </span>

            {user ? (
              <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
                <Link to="/dashboard" className="text-sm font-semibold text-ibm-gray hover:text-ibm-blue transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
                <Link to="/login" className="text-sm font-semibold text-ibm-blue bg-blue-50 px-4 py-2 rounded-lg hover:bg-ibm-blue hover:text-white transition-all">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
