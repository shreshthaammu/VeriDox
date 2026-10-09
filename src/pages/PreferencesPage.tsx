import React, { useState } from 'react';
import {
  Sliders,
  Bell,
  Eye,
  Check,
  Globe,
  Database
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { store } from '../services/store';

export const PreferencesPage: React.FC = () => {
  const { user } = useAuth();

  const [emailAlerts, setEmailAlerts] = useState(user.preferences?.emailAlerts ?? true);
  const [digestFreq, setDigestFreq] = useState<'instant' | 'daily' | 'weekly'>(user.preferences?.auditLogDigest ?? 'instant');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all mock platform data to original hackathon seed?')) {
      store.resetToDemo();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#19243A] tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-[#356AE6]" />
            <span>Workspace Preferences</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure notification delivery, digest frequency, and local registry state.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#356AE6] hover:bg-[#2857C7] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <Check className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg">
          Workspace preferences saved successfully.
        </div>
      )}

      {/* Notification Delivery Options */}
      <div className="bg-white border border-[#E4E9F2] rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-[#19243A] pb-2 border-b border-slate-100 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#356AE6]" />
          <span>Notification & Alert Preferences</span>
        </h3>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer">
            <div>
              <p className="font-bold text-slate-800">Email Alerts on Integrity Mismatch</p>
              <p className="text-slate-500 text-[11px]">Receive immediate security alerts when any divergent bitstream is flagged</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-[#356AE6] rounded"
            />
          </label>

          <div className="p-3 bg-slate-50 rounded-xl">
            <p className="font-bold text-slate-800 mb-1">Audit Trail Digest Frequency</p>
            <p className="text-slate-500 text-[11px] mb-2">Schedule frequency for automated cryptographic audit reports</p>
            <div className="flex gap-2">
              {(['instant', 'daily', 'weekly'] as const).map(freq => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setDigestFreq(freq)}
                  className={`px-3 py-1.5 rounded-lg text-xs capitalize font-semibold transition-colors ${
                    digestFreq === freq ? 'bg-[#356AE6] text-white' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Demo Reset Control */}
      <div className="bg-white border border-[#E4E9F2] rounded-2xl p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Reset Demo Database to Initial Seed</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Reset all local documents, audit events, and user accounts back to pristine hackathon initial demo state.
            </p>
          </div>
        </div>

        <button
          onClick={handleResetData}
          className="px-3.5 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-bold rounded-lg transition-colors"
        >
          Reset Demo Data
        </button>
      </div>
    </div>
  );
};
