import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser, registerUser } from '../services/api';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let res;
      if (isLogin) {
        res = await loginUser(email, password);
      } else {
        res = await registerUser(email, password);
      }

      if (res.user) {
        login(res.user);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 fade-in">
      <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 w-full max-w-md border border-slate-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-900 rounded-[1.25rem] mb-6 shadow-xl shadow-slate-900/10">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {isLogin ? 'Access your intelligence suite' : 'Join the future of onboarding'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-[11px] font-bold uppercase tracking-widest rounded-2xl border border-red-100 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-slate-200 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-900"
              placeholder="name@company.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Security Code</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-slate-200 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-900"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-xl shadow-slate-900/10 disabled:opacity-30 uppercase tracking-[0.2em] text-xs"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Authenticating
              </span>
            ) : (isLogin ? 'Sign In' : 'Register')}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
            {isLogin ? "New to the platform?" : "Already a member?"}
          </p>
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-ibm-blue font-bold text-xs uppercase tracking-widest hover:text-blue-700 transition-colors"
          >
            {isLogin ? 'Create Account' : 'Sign In instead'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

