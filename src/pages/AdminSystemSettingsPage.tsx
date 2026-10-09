import React, { useState } from 'react';
import {
  Settings,
  Save,
  Check,
  Shield,
  Layers,
  FileText,
  Lock,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { store } from '../services/store';
import { SystemSettings } from '../types';

export const AdminSystemSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SystemSettings>(() => store.getSystemSettings());
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSystemSettings(settings);

    store.addAuditEvent({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'settings_updated',
      targetResource: 'System Configuration',
      result: 'success',
      timestamp: new Date().toISOString(),
      metadata: { ...settings }
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#19243A] tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-amber-600" />
            <span>Platform Security & Governance Rules</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global operational parameters, cryptographic hashing thresholds, and disclosure defaults.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#356AE6] hover:bg-[#2857C7] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>System governance parameters saved and anchored to audit ledger.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Upload & Cryptographic Settings */}
        <div className="bg-white border border-[#E4E9F2] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#19243A] pb-2 border-b border-slate-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#356AE6]" />
            <span>File Limits & Ingestion Pipeline</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Maximum File Ingestion Size (MB)
              </label>
              <input
                type="number"
                value={settings.maxUploadSizeMB}
                onChange={(e) => setSettings({ ...settings, maxUploadSizeMB: Number(e.target.value) })}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">Enforced client-side and server-side.</p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Audit Retention Ledger Period (Days)
              </label>
              <input
                type="number"
                value={settings.retentionDays}
                onChange={(e) => setSettings({ ...settings, retentionDays: Number(e.target.value) })}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">Duration before historical verification records archive.</p>
            </div>
          </div>
        </div>

        {/* Governance & Accreditation Toggles */}
        <div className="bg-white border border-[#E4E9F2] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#19243A] pb-2 border-b border-slate-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#356AE6]" />
            <span>Accreditation & Trust Anchor Controls</span>
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl cursor-pointer">
              <div>
                <p className="font-bold text-slate-900">Mandatory Institutional Accreditation Review</p>
                <p className="text-[11px] text-slate-500">Require platform compliance team review before any organization can anchor credentials</p>
              </div>
              <input
                type="checkbox"
                checked={settings.requireAdminOrgApproval}
                onChange={(e) => setSettings({ ...settings, requireAdminOrgApproval: e.target.checked })}
                className="w-4 h-4 text-[#356AE6] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl cursor-pointer">
              <div>
                <p className="font-bold text-slate-900">Tamper-Proof Audit Chaining (HMAC Hash-Linked)</p>
                <p className="text-[11px] text-slate-500">Cryptographically link every audit log entry with previous event hashes</p>
              </div>
              <input
                type="checkbox"
                checked={settings.tamperProofAuditChaining}
                onChange={(e) => setSettings({ ...settings, tamperProofAuditChaining: e.target.checked })}
                className="w-4 h-4 text-[#356AE6] rounded"
              />
            </label>
          </div>
        </div>

        {/* Public Selective Disclosure Rules */}
        <div className="bg-white border border-[#E4E9F2] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#19243A] pb-2 border-b border-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#356AE6]" />
            <span>Default Public Verification Disclosure</span>
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl cursor-pointer">
              <div>
                <p className="font-bold text-slate-900">Disclose Recipient Full Name on Public QR Pages</p>
                <p className="text-[11px] text-slate-500">When enabled, verified credential holder name is publicly visible on valid scan</p>
              </div>
              <input
                type="checkbox"
                checked={settings.publicVerificationDisclosures.showRecipientName}
                onChange={(e) => setSettings({
                  ...settings,
                  publicVerificationDisclosures: {
                    ...settings.publicVerificationDisclosures,
                    showRecipientName: e.target.checked
                  }
                })}
                className="w-4 h-4 text-[#356AE6] rounded"
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};
