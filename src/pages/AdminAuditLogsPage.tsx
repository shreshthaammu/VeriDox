import React, { useState } from 'react';
import {
  FileCheck2,
  Search,
  Filter,
  Download,
  Calendar,
  Lock,
  Layers
} from 'lucide-react';
import { store } from '../services/store';
import { AuditEvent } from '../types';
import { StatusBadge } from '../components/common/CommonComponents';

export const AdminAuditLogsPage: React.FC = () => {
  const events = store.getAuditEvents();
  const [search, setSearch] = useState('');

  const filtered = events.filter(e =>
    e.actorName.toLowerCase().includes(search.toLowerCase()) ||
    e.action.toLowerCase().includes(search.toLowerCase()) ||
    e.targetResource.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#19243A] tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-amber-600" />
            <span>Platform Governance Audit Trail</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            System administrator immutable activity ledger: captures sensitive key actions, role modifications, and policy changes.
          </p>
        </div>

        <button
          onClick={() => alert('Administrative audit logs exported as sealed JSON.')}
          className="px-3.5 py-2 bg-white border border-[#E4E9F2] hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>Export Compliance Audit</span>
        </button>
      </div>

      <div className="bg-white border border-[#E4E9F2] rounded-xl p-4 shadow-xs">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit ledger by actor or resource..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E4E9F2] rounded-lg focus:outline-none focus:border-[#356AE6]"
          />
        </div>
      </div>

      <div className="bg-white border border-[#E4E9F2] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FB] border-b border-[#E4E9F2] text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Log ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(e => (
                <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 font-semibold">
                    {e.id}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {new Date(e.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    <div>{e.actorName}</div>
                    <div className="text-[10px] text-slate-400 capitalize">{e.actorRole}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 capitalize font-medium">
                    {e.action.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 text-xs">
                    {e.targetResource}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={e.result} />
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
