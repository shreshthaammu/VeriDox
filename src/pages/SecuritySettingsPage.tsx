import React, { useState } from 'react';
import {
  Shield,
  Key,
  Lock,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Laptop
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { store } from '../services/store';

export const SecuritySettingsPage: React.FC = () => {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user.preferences?.twoFactorEnabled || false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setStatusMsg({ type: 'error', text: 'Please enter your current password' });
      return;
    }
    if (newPassword.length < 8) {
      setStatusMsg({ type: 'error', text: 'New password must be at least 8 characters long' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatusMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    // Success
    setStatusMsg({ type: 'success', text: 'Password successfully updated across encrypted keystore.' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    store.addAuditEvent({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'user_status_changed',
      targetResource: `Security: ${user.email}`,
      result: 'success',
      timestamp: new Date().toISOString(),
      metadata: { action: 'password_rotated' }
    });
  };

  const toggle2FA = () => {
    const nextState = !twoFactorEnabled;
    setTwoFactorEnabled(nextState);
    setStatusMsg({
      type: 'success',
      text: nextState ? 'Two-Factor Authentication (TOTP) enabled.' : 'Two-Factor Authentication disabled.'
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-[#19243A] tracking-tight flex items-center gap-2">
          <Shield className="w-6 h-6 text-[#356AE6]" />
          <span>Security & Cryptographic Keys</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage workstation credentials, password rotation policies, and active trust sessions.
        </p>
      </div>

      {statusMsg && (
        <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
          statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Change Password Card */}
      <div className="bg-white border border-[#E4E9F2] rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-[#19243A] pb-2 border-b border-slate-100 flex items-center gap-2">
          <Key className="w-4 h-4 text-[#356AE6]" />
          <span>Change Account Password</span>
        </h3>

        <form onSubmit={handlePasswordChange} className="space-y-3 max-w-md text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full p-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">New Password (Min 8 chars)</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full p-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full p-2 border border-slate-300 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-[#356AE6] hover:bg-[#2857C7] text-white font-bold rounded-lg shadow-xs"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white border border-[#E4E9F2] rounded-2xl p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#356AE6] flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Two-Factor Authentication (2FA)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Require time-based one-time password (TOTP) authenticator app codes for cryptographic actions.
            </p>
          </div>
        </div>

        <button
          onClick={toggle2FA}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
            twoFactorEnabled
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {twoFactorEnabled ? '2FA Active (Enabled)' : 'Enable 2FA'}
        </button>
      </div>

      {/* Active Workstation Sessions */}
      <div className="bg-white border border-[#E4E9F2] rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-[#19243A] pb-2 border-b border-slate-100 flex items-center gap-2">
          <Laptop className="w-4 h-4 text-[#356AE6]" />
          <span>Active Device Sessions</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Laptop className="w-5 h-5 text-slate-500" />
              <div>
                <p className="font-bold text-slate-800">Current Workstation (Chrome on macOS)</p>
                <p className="text-[11px] text-slate-400">San Francisco, CA • IP: 198.51.100.44</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
              ACTIVE NOW
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
