import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  User,
  Mail,
  Lock,
  Building2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('individual');
  const [orgName, setOrgName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError('Please enter your full name');
    if (!email.trim()) return setError('Please enter your email address');
    if (password.length < 8) return setError('Password must be at least 8 characters long');
    if (password !== confirmPassword) return setError('Passwords do not match');
    if (!termsAccepted) return setError('You must agree to the cryptographic verification terms');

    setLoading(true);
    try {
      await register(name, email, role, role !== 'individual' ? orgName : undefined);
      navigate('/app/overview');
    } catch {
      setError('Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#356AE6] to-[#36C5F0] flex items-center justify-center text-white shadow-md shadow-[#356AE6]/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-[#101B33]">VeriDox</span>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-[#101B33]">
          Create Trust Platform Account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Join institutions and individuals establishing cryptographic document integrity.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 shadow-xl border border-[#E4E9F2] rounded-2xl sm:px-10">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Account Type Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Account Type
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setRole('individual')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    role === 'individual'
                      ? 'border-[#356AE6] bg-blue-50/60 ring-1 ring-[#356AE6]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-slate-900 text-xs">Individual</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Student / Holder</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('issuer')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    role === 'issuer'
                      ? 'border-[#356AE6] bg-blue-50/60 ring-1 ring-[#356AE6]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-slate-900 text-xs">Issuer</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">School / Company</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('reviewer')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    role === 'reviewer'
                      ? 'border-[#356AE6] bg-blue-50/60 ring-1 ring-[#356AE6]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-slate-900 text-xs">Reviewer</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Forensic Auditor</p>
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 italic">
                *Administrative privileges cannot be self-assigned and require system governance approval.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Jordan Hayes"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#E4E9F2] rounded-lg focus:outline-none focus:border-[#356AE6]"
                />
              </div>
            </div>

            {role !== 'individual' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Organization / Institution Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    required
                    placeholder="e.g. Cambridge Certification Institute"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-[#E4E9F2] rounded-lg focus:outline-none focus:border-[#356AE6]"
                  />
                </div>
              </div>
            )}

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
                  placeholder="jordan@institution.edu"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#E4E9F2] rounded-lg focus:outline-none focus:border-[#356AE6]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min 8 chars"
                  className="w-full px-3 py-2 text-xs border border-[#E4E9F2] rounded-lg focus:outline-none focus:border-[#356AE6]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Repeat password"
                  className="w-full px-3 py-2 text-xs border border-[#E4E9F2] rounded-lg focus:outline-none focus:border-[#356AE6]"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-[#356AE6] focus:ring-[#356AE6]"
                />
                <span>
                  I understand that SHA-256 integrity proves bitstream concordance with registered hashes and that issuer legitimacy requires accredited governance.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-[#356AE6] hover:bg-[#2857C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Registering Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-[#356AE6] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
