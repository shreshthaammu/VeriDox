import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Plus,
  Binary,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award,
  Filter
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { store } from '../services/store';
import { StatCard, StatusBadge } from '../components/common/CommonComponents';

export const OverviewPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

  const documents = store.getDocuments();
  const records = store.getVerificationRecords();
  const requests = store.getVerificationRequests();

  const totalDocs = documents.length;
  const validDocs = documents.filter(d => d.status === 'valid').length;
  const underReviewDocs = documents.filter(d => d.status === 'under_review').length;
  const mismatches = records.filter(r => r.result === 'integrity_mismatch').length;

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#101B33] via-[#16254A] to-[#1E3466] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#36C5F0]/20 via-transparent to-transparent pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#356AE6]/30 border border-[#356AE6]/50 text-[#36C5F0] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Persona: {user.name} ({user.role.toUpperCase()})</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Digital Document Trust Console
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Welcome back, {user.name}. You are operating in {user.role === 'issuer' ? 'Institution Issuance' : user.role === 'admin' ? 'System Governance' : 'Credential Management'} mode. SHA-256 trust anchor validation is running across all registered documents.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/app/verify')}
              className="bg-[#356AE6] hover:bg-[#2857C7] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify Document</span>
            </button>

            {user.role === 'issuer' || user.role === 'admin' ? (
              <button
                onClick={() => navigate('/app/issue')}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Issue New Document</span>
              </button>
            ) : null}

            <button
              onClick={() => navigate('/app/integrity')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all"
            >
              <Binary className="w-4 h-4 text-[#36C5F0]" />
              <span>Bitstream Tamper Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Date Filter & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#19243A]">System Verification Pulse</h2>
          <p className="text-xs text-slate-500">Live operational ledger status</p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-[#E4E9F2] rounded-lg p-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-2.5 py-1 rounded font-medium ${timeRange === '7d' ? 'bg-[#356AE6] text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-2.5 py-1 rounded font-medium ${timeRange === '30d' ? 'bg-[#356AE6] text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setTimeRange('all')}
            className={`px-2.5 py-1 rounded font-medium ${timeRange === 'all' ? 'bg-[#356AE6] text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Registered Documents"
          value={totalDocs}
          change="+12% this month"
          icon={FileText}
          iconColor="text-[#356AE6]"
          subtext="Cryptographically anchored"
        />
        <StatCard
          title="Integrity Matches"
          value={validDocs}
          change="98.4% rate"
          changeType="positive"
          icon={ShieldCheck}
          iconColor="text-emerald-600"
          subtext="Concordant SHA-256 bitstreams"
        />
        <StatCard
          title="Under Forensic Review"
          value={underReviewDocs}
          change="2 awaiting audit"
          changeType="neutral"
          icon={Clock}
          iconColor="text-amber-600"
          subtext="Requires manual registrar seal"
        />
        <StatCard
          title="Integrity Mismatches"
          value={mismatches}
          change="Tampering blocked"
          changeType="negative"
          icon={AlertTriangle}
          iconColor="text-rose-600"
          subtext="Divergent bitstream detected"
        />
      </div>

      {/* Analytics Visuals & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Trend Chart */}
        <div className="lg:col-span-2 bg-white border border-[#E4E9F2] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-[#19243A]">Verification Velocity</h3>
              <p className="text-xs text-slate-400">Daily cryptographic audit queries</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Avg latency: 240ms
            </span>
          </div>

          {/* Clean SVG Trend Chart */}
          <div className="h-48 w-full flex items-end gap-2 pt-6 pb-2 px-2 border-b border-slate-100">
            {[
              { day: 'Mon', h: 45, count: 18 },
              { day: 'Tue', h: 65, count: 26 },
              { day: 'Wed', h: 55, count: 22 },
              { day: 'Thu', h: 80, count: 32 },
              { day: 'Fri', h: 95, count: 38 },
              { day: 'Sat', h: 40, count: 16 },
              { day: 'Sun', h: 50, count: 20 },
              { day: 'Today', h: 85, count: 34, highlight: true }
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                  {col.count}
                </div>
                <div
                  style={{ height: `${col.h}%` }}
                  className={`w-full rounded-t-sm transition-all duration-300 ${
                    col.highlight
                      ? 'bg-gradient-to-t from-[#356AE6] to-[#36C5F0]'
                      : 'bg-[#E2E8F0] group-hover:bg-[#356AE6]/70'
                  }`}
                />
                <span className={`text-[10px] mt-1 ${col.highlight ? 'font-bold text-[#356AE6]' : 'text-slate-400'}`}>
                  {col.day}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#356AE6]"></span> Standard Checks
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Divergent Hashes
              </span>
            </div>
            <button
              onClick={() => navigate('/app/analytics')}
              className="text-[#356AE6] font-semibold hover:underline flex items-center gap-1 text-xs"
            >
              Full Analytics Report <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Document Status Distribution */}
        <div className="bg-white border border-[#E4E9F2] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#19243A]">Status Distribution</h3>
            <p className="text-xs text-slate-400">Total document corpus state</p>

            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-700">Valid & Verified</span>
                  <span>75%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-700">Under Review / Pending</span>
                  <span>15%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-rose-700">Revoked / Superseded</span>
                  <span>10%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 bg-blue-50/60 rounded-lg border border-blue-100 text-xs">
            <p className="font-bold text-[#101B33] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#356AE6]" /> Trust Anchor Active
            </p>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              All documents are anchored with standard SHA-256 hashes. Tamper attempts immediately flag mismatches in both public and private verification.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Registered Documents & Activity Table */}
      <div className="bg-white border border-[#E4E9F2] rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#E4E9F2] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#19243A]">Recent Registered Documents</h3>
            <p className="text-xs text-slate-400">Latest cryptographic records in the trust registry</p>
          </div>
          <button
            onClick={() => navigate('/app/documents')}
            className="text-xs font-bold text-[#356AE6] hover:underline flex items-center gap-1"
          >
            <span>View All Documents</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FB] border-b border-[#E4E9F2] text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Document Title</th>
                <th className="py-3 px-4">Verification ID</th>
                <th className="py-3 px-4">SHA-256 Fingerprint</th>
                <th className="py-3 px-4">Owner / Issuer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.slice(0, 4).map((doc) => (
                <tr
                  key={doc.id}
                  onClick={() => navigate(`/app/documents/${doc.id}`)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#356AE6] shrink-0" />
                      <span className="truncate max-w-xs">{doc.title}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-[#356AE6]">
                    {doc.verificationId}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {doc.fileHash.slice(0, 8)}...{doc.fileHash.slice(-8)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div>{doc.ownerName}</div>
                    <div className="text-[10px] text-slate-400">{doc.issuerName}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/app/documents/${doc.id}`);
                      }}
                      className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
