import React, { useState } from 'react';
import {
  Clock,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Download,
  Calendar,
  FileText
} from 'lucide-react';
import { store } from '../services/store';
import { VerificationRecord } from '../types';
import { StatusBadge } from '../components/common/CommonComponents';

export const VerificationHistoryPage: React.FC = () => {
  const [records, setRecords] = useState<VerificationRecord[]>(() => store.getVerificationRecords());
  const [search, setSearch] = useState('');
  const [filterResult, setFilterResult] = useState('all');

  const filtered = records.filter(r => {
    const matchesSearch =
      r.fileName.toLowerCase().includes(search.toLowerCase()) ||
      (r.verificationId && r.verificationId.toLowerCase().includes(search.toLowerCase())) ||
      r.submittedFileHash.toLowerCase().includes(search.toLowerCase());
    const matchesOutcome = filterResult === 'all' || r.result === filterResult;
    return matchesSearch && matchesOutcome;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#19243A] tracking-tight">
            Verification Query History
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Chronological audit trail of all cryptographic checks, hash comparisons, and tamper tests.
          </p>
        </div>

        <button
          onClick={() => alert('Verification query history exported as JSON summary.')}
          className="px-3.5 py-2 bg-white border border-[#E4E9F2] hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>Export Query History</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-[#E4E9F2] rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search filename, ID, or hash..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E4E9F2] rounded-lg focus:outline-none focus:border-[#356AE6]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterResult}
            onChange={(e) => setFilterResult(e.target.value)}
            className="text-xs border border-[#E4E9F2] rounded-lg px-2.5 py-1.5 bg-white text-slate-700"
          >
            <option value="all">All Verification Outcomes</option>
            <option value="integrity_match">Integrity Match (Concordant)</option>
            <option value="integrity_mismatch">Integrity Mismatch (Tampered)</option>
            <option value="pending_manual_review">Under Review</option>
            <option value="unable_to_verify">Unable to Verify</option>
          </select>
        </div>
      </div>

      {/* History Stream */}
      <div className="bg-white border border-[#E4E9F2] rounded-xl shadow-xs divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No verification queries found matching criteria.
          </div>
        ) : (
          filtered.map((record) => (
            <div key={record.id} className="p-5 hover:bg-slate-50/60 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <StatusBadge status={record.result} />
                  <span className="font-bold text-sm text-slate-900">{record.fileName}</span>
                  {record.verificationId && (
                    <span className="font-mono text-xs text-[#356AE6] font-semibold">
                      [{record.verificationId}]
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(record.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                {record.notes}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="truncate max-w-xs">
                  Submitted Hash: {record.submittedFileHash.slice(0, 12)}...{record.submittedFileHash.slice(-8)}
                </span>
                {record.trustedReferenceHash && (
                  <span className="truncate max-w-xs text-emerald-700 font-semibold">
                    Anchor: {record.trustedReferenceHash.slice(0, 12)}...{record.trustedReferenceHash.slice(-8)}
                  </span>
                )}
                <span>Method: {record.verificationMethod.replace('_', ' ')}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
