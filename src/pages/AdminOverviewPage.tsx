import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  Building,
  CheckSquare,
  FileCheck2,
  Settings,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Activity,
  Lock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { store } from '../services/store';
import { StatCard, StatusBadge } from '../components/common/CommonComponents';

export const AdminOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const users = store.getUsers();
  const docs = store.getDocuments();
  const orgs = store.getOrganizations();
  const records = store.getVerificationRecords();
  const pendingOrgs = orgs.filter(o => o.verificationStatus === 'pending');
  const flaggedAttempts = records.filter(r => r.result === 'integrity_mismatch');

  return (
    <div className="space-y-6">
      {/* Admin Banner */}
      <div className="bg-[#101B33] border border-[#22355C] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-mono font-bold uppercase mb-2 border border-amber-500/30">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Platform Governance Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Administrative Control Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Operating as Platform Security Lead. Oversee institutional accreditation, inspect flagged bitstream anomalies, and manage cryptographic trust parameters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/verifications')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Open Review Queue</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Platform Users"
          value={users.length}
          change="+4 this week"
          icon={Users}
          iconColor="text-[#356AE6]"
          subtext="Vetted credential holders & registrars"
        />
        <StatCard
          title="Registered Documents"
          value={docs.length}
          change="+100% active"
          icon={Activity}
          iconColor="text-emerald-600"
          subtext="Anchored SHA-256 fingerprints"
        />
        <StatCard
          title="Pending Org Reviews"
          value={pendingOrgs.length}
          change="Action required"
          changeType="neutral"
          icon={Building}
          iconColor="text-amber-600"
          subtext="Institutional accreditation queue"
        />
        <StatCard
          title="Flagged Mismatches"
          value={flaggedAttempts.length}
          change="Tampering blocked"
          changeType="negative"
          icon={AlertTriangle}
          iconColor="text-rose-600"
          subtext="Audit log locked against tampering"
        />
      </div>

      {/* Admin Quick Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => navigate('/admin/users')}
          className="bg-white border border-[#E4E9F2] rounded-xl p-5 shadow-xs hover:border-[#356AE6]/50 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#356AE6] flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">User Governance</h3>
            <p className="text-xs text-slate-500 mt-1">
              Inspect user roles, suspend anomalous accounts, and manage institutional affiliations.
            </p>
          </div>
          <span className="text-[#356AE6] text-xs font-bold mt-4 flex items-center gap-1">
            Manage Users <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div
          onClick={() => navigate('/admin/organizations')}
          className="bg-white border border-[#E4E9F2] rounded-xl p-5 shadow-xs hover:border-amber-400 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Organization Vetting</h3>
            <p className="text-xs text-slate-500 mt-1">
              Review accreditation applications from universities, hospitals, and corporate issuers.
            </p>
          </div>
          <span className="text-amber-700 text-xs font-bold mt-4 flex items-center gap-1">
            Review Applications ({pendingOrgs.length} pending) <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div
          onClick={() => navigate('/admin/settings')}
          className="bg-white border border-[#E4E9F2] rounded-xl p-5 shadow-xs hover:border-[#356AE6]/50 cursor-pointer transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
              <Settings className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">System Parameters</h3>
            <p className="text-xs text-slate-500 mt-1">
              Configure upload file limits, allowed extensions, and public selective disclosure rules.
            </p>
          </div>
          <span className="text-slate-800 text-xs font-bold mt-4 flex items-center gap-1">
            Configure Parameters <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Flagged Anomalies & Recent Administrative Events */}
      <div className="bg-white border border-[#E4E9F2] rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-[#19243A]">Recent Forensic Anomalies & Security Events</h3>
            <p className="text-xs text-slate-400">Ledger entries requiring administrator attention</p>
          </div>
          <button
            onClick={() => navigate('/admin/audit-logs')}
            className="text-xs font-bold text-[#356AE6] hover:underline"
          >
            All Audit Logs →
          </button>
        </div>

        <div className="divide-y divide-slate-100 mt-2">
          {records.slice(0, 4).map(r => (
            <div key={r.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={r.result} />
                  <span className="font-semibold text-slate-900">{r.fileName}</span>
                  {r.verificationId && <span className="font-mono text-[#356AE6] text-[11px]">({r.verificationId})</span>}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{r.notes}</p>
              </div>

              <div className="text-right text-[11px] text-slate-400 font-mono">
                {new Date(r.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
