import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Building,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, allDemoUsers } = useAuth();

  const [email, setEmail] = useState('alex.morgan@stanford.alumni.edu');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError('Please provide a valid email address');
      return;
    }
    if (!password) {
      setError('Please enter your account password');
      return;
    }

    setLoading(true);
    try {
      await login(email);
      navigate('/app/overview');
    } catch {
      setError('Invalid credentials or session error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: UserRole, userEmail: string) => {
    setEmail(userEmail);
    setLoading(true);
    await login(userEmail, role);
    navigate('/app/overview');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#356AE6] to-[#36C5F0] flex items-center justify-center text-white shadow-md shadow-[#356AE6]/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-[#101B33]">VeriDox</span>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-[#101B33] tracking-tight">
          Sign In to Trust Console
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter your organization credentials or choose a pre-configured hackathon demo account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-[#E4E9F2] rounded-2xl sm:px-10">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@organization.com"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#E4E9F2] rounded-lg focus:outline-none focus:border-[#356AE6] focus:ring-1 focus:ring-[#356AE6]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo password reset: all demo accounts use "password123"'); }} className="text-[11px] font-semibold text-[#356AE6] hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2 text-xs border border-[#E4E9F2] rounded-lg focus:outline-none focus:border-[#356AE6] focus:ring-1 focus:ring-[#356AE6]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#356AE6] focus:ring-[#356AE6]"
                />
                <span>Remember this workstation</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-[#356AE6] hover:bg-[#2857C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#356AE6]" />
              <span>One-Click Hackathon Personas:</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('individual', 'alex.morgan@stanford.alumni.edu')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-[#356AE6] hover:bg-blue-50/50 text-left transition-all"
              >
                <p className="font-bold text-slate-800 text-[11px]">Alex Morgan</p>
                <p className="text-[10px] text-slate-500">Applicant / Owner</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('issuer', 'e.vance@stanford.edu')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-[#356AE6] hover:bg-blue-50/50 text-left transition-all"
              >
                <p className="font-bold text-slate-800 text-[11px]">Dr. Eleanor Vance</p>
                <p className="text-[10px] text-slate-500">Stanford Registrar</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('reviewer', 'm.sterling@certreview.org')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-[#356AE6] hover:bg-blue-50/50 text-left transition-all"
              >
                <p className="font-bold text-slate-800 text-[11px]">Marcus Sterling</p>
                <p className="text-[10px] text-slate-500">Forensic Auditor</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'sarah.chen@veridox.security')}
                className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/30 hover:border-amber-400 text-left transition-all"
              >
                <p className="font-bold text-slate-800 text-[11px]">Sarah Chen</p>
                <p className="text-[10px] text-amber-700 font-semibold">Chief Admin</p>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#356AE6] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
