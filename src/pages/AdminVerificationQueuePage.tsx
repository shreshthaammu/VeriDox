import React, { useState } from 'react';
import {
  CheckSquare,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Binary,
  MessageSquare
} from 'lucide-react';
import { store } from '../services/store';
import { VerificationRecord } from '../types';

export const AdminVerificationQueuePage: React.FC = () => {
  const [records, setRecords] = useState<VerificationRecord[]>(() =>
    store.getVerificationRecords().filter(r => r.result === 'integrity_mismatch' || r.result === 'pending_manual_review' || r.result === 'unable_to_verify')
  );

  const [decisionNotes, setDecisionNotes] = useState<Record<string, string>>({});

  const handleResolve = (recordId: string, action: 'confirmed' | 'rejected') => {
    alert(`Case #${recordId} resolved as: ${action.toUpperCase()}`);
    setRecords(records.filter(r => r.id !== recordId));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-[#19243A] tracking-tight flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-amber-600" />
          <span>Forensic Review & Anomaly Queue</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Operational triage workspace: evaluate integrity mismatches, unregistered documents, and pending manual verification requests.
        </p>
      </div>

      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed">
        <p className="font-bold mb-0.5">Auditor Guidance Notice:</p>
        <p>
          "Do not automatically equate a mismatch with intentional fraud. A mismatch may also result from re-saving a PDF with altered compression, OCR layer injection, or comparing against an incorrect reference file."
        </p>
      </div>

      {records.length === 0 ? (
        <div className="bg-white border border-[#E4E9F2] rounded-2xl p-12 text-center text-xs text-slate-400">
          All forensic items in queue have been reviewed and cleared.
        </div>
      ) : (
        <div className="space-y-4">
          {records.map(r => (
            <div
              key={r.id}
              className="bg-white border border-[#E4E9F2] rounded-2xl p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2.5">
                  {r.result === 'integrity_mismatch' ? (
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{r.fileName}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">Queue Case #{r.id}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  r.result === 'integrity_mismatch' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {r.result.replace('_', ' ')}
                </span>
              </div>

              {/* Forensic Details */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Submitted Bitstream Digest:</span>
                  <span className="text-slate-800 break-all">{r.submittedFileHash}</span>
                </div>
                {r.trustedReferenceHash && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Official Anchor Digest:</span>
                    <span className="text-[#356AE6] break-all">{r.trustedReferenceHash}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500 pt-1">
                  <span>Timestamp: {new Date(r.timestamp).toLocaleString()}</span>
                  <span>Method: {r.verificationMethod}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600">
                <span className="font-bold text-slate-800">Initial System Finding:</span> {r.notes}
              </p>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
                <button
                  onClick={() => handleResolve(r.id, 'rejected')}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold"
                >
                  Confirm Mismatch / Tamper
                </button>
                <button
                  onClick={() => handleResolve(r.id, 'confirmed')}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Approve Exception / Re-Anchor
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
