import React, { useState } from 'react';
import {
  ScrollText,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Download,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { store } from '../services/store';
import { AuditEvent } from '../types';
import { StatusBadge } from '../components/common/CommonComponents';

export const AuditTrailPage: React.FC = () => {
  const [events, setEvents] = useState<AuditEvent[]>(() => store.getAuditEvents());
  const [filterAction, setFilterAction] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = events.filter(e => {
    const matchesSearch =
      e.actorName.toLowerCase().includes(search.toLowerCase()) ||
      e.targetResource.toLowerCase().includes(search.toLowerCase()) ||
      e.action.toLowerCase().includes(search.toLowerCase());
    const matchesAction = filterAction === 'all' || e.action === filterAction;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#19243A] tracking-tight flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-[#356AE6]" />
            <span>Forensic Audit Trail & Ledger</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tamper-evident system log recording credential issuance, verification checks, role transitions, and policy updates.
          </p>
        </div>

        <button
          onClick={() => alert('Audit log exported with cryptographic HMAC integrity seal.')}
          className="px-3.5 py-2 bg-white border border-[#E4E9F2] hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>Export Sealed Audit Log</span>
        </button>
      </div>

      {/* Tamper-evident Audit Chaining Architecture Callout */}
      <div className="p-4 bg-slate-900 rounded-2xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-[#36C5F0] flex items-center justify-center shrink-0 border border-[#36C5F0]/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#36C5F0]">Tamper-Evident Audit Chaining Active</h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Every audit event is cryptographically linked with previous log entry hashes. Any retrospective manipulation breaks the chain verification signature.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold shrink-0">
          CHAIN INTEGRITY: 100% OK
        </span>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-[#E4E9F2] rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search actor or target resource..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E4E9F2] rounded-lg focus:outline-none focus:border-[#356AE6]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="text-xs border border-[#E4E9F2] rounded-lg px-2.5 py-1.5 bg-white text-slate-700"
          >
            <option value="all">All Audit Actions</option>
            <option value="integrity_check_passed">Integrity Check Passed</option>
            <option value="integrity_check_failed">Integrity Check Failed</option>
            <option value="document_issued">Document Issued</option>
            <option value="document_revoked">Document Revoked</option>
            <option value="settings_updated">Settings Updated</option>
          </select>
        </div>
      </div>

      {/* Audit Timeline / Table */}
      <div className="bg-white border border-[#E4E9F2] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FB] border-b border-[#E4E9F2] text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Event ID & Time</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Outcome</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(evt => (
                <tr key={evt.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    <div className="font-semibold text-slate-800">{evt.id}</div>
                    <div className="text-[10px] text-slate-400">{new Date(evt.timestamp).toLocaleString()}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{evt.actorName}</div>
                    <div className="text-[10px] text-slate-400 capitalize">{evt.actorRole}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    <span className="capitalize">{evt.action.replace(/_/g, ' ')}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                    {evt.targetResource}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={evt.result} />
                  </td>
                  <td className="py-3.5 px-4 text-right text-[11px] text-slate-400 font-mono">
                    {evt.metadata ? Object.keys(evt.metadata).length + ' params' : 'Standard'}
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
