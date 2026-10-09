import React, { useState } from 'react';
import {
  GitPullRequest,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Building,
  User,
  FileText,
  Filter,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { store } from '../services/store';
import { VerificationRequest, RequestStatus } from '../types';
import { StatusBadge } from '../components/common/CommonComponents';

export const VerificationRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<VerificationRequest[]>(() => store.getVerificationRequests());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showNewModal, setShowNewModal] = useState(false);

  // New Request Form
  const [selectedDocId, setSelectedDocId] = useState(store.getDocuments()[0]?.id || '');
  const [targetOrgId, setTargetOrgId] = useState('org_gov_auth');
  const [purpose, setPurpose] = useState('');

  // Reviewer Note Modal
  const [activeRequest, setActiveRequest] = useState<VerificationRequest | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  const documents = store.getDocuments();
  const organizations = store.getOrganizations();

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) return;

    const doc = documents.find(d => d.id === selectedDocId) || documents[0];
    const org = organizations.find(o => o.id === targetOrgId) || organizations[0];

    const newReq: VerificationRequest = {
      id: `req_${Date.now()}`,
      documentId: doc.id,
      documentTitle: doc.title,
      requesterId: user.id,
      requesterName: user.name,
      requesterEmail: user.email,
      targetOrgId: org.id,
      targetOrgName: org.name,
      purpose: purpose.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          actor: user.name,
          note: 'Verification request lodged'
        }
      ]
    };

    store.addVerificationRequest(newReq);
    setRequests(store.getVerificationRequests());
    setShowNewModal(false);
    setPurpose('');
  };

  const handleStatusChange = (reqId: string, newStatus: RequestStatus) => {
    const updated = store.updateVerificationRequest(reqId, {
      status: newStatus,
      reviewerNotes: reviewNote.trim() || undefined
    });
    setRequests(store.getVerificationRequests());
    setActiveRequest(null);
    setReviewNote('');
  };

  const filteredRequests = requests.filter(r => statusFilter === 'all' || r.status === statusFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#19243A] tracking-tight">
            Verification Requests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track multi-stakeholder credential checks, background verification requests, and reviewer endorsements.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2 bg-[#356AE6] hover:bg-[#2857C7] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Verification Request</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#E4E9F2] rounded-xl p-3 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-slate-400 ml-1" />
          <span className="font-semibold text-slate-600">Status:</span>
          {['all', 'pending', 'in_review', 'approved', 'rejected'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded capitalize font-medium ${
                statusFilter === st ? 'bg-[#356AE6] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white border border-[#E4E9F2] rounded-2xl p-12 text-center text-xs text-slate-400">
            No verification requests found matching current filter.
          </div>
        ) : (
          filteredRequests.map(req => (
            <div
              key={req.id}
              className="bg-white border border-[#E4E9F2] rounded-xl p-5 shadow-xs hover:border-[#356AE6]/40 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#356AE6] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{req.documentTitle}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">Request ID: {req.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge status={req.status} />
                </div>
              </div>

              {/* Purpose & Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Requester:</span>
                  <span className="font-semibold text-slate-800">{req.requesterName}</span>
                  <span className="text-[11px] text-slate-500 block">{req.requesterEmail}</span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Assigned Organization:</span>
                  <span className="font-semibold text-slate-800">{req.targetOrgName}</span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Submission Date:</span>
                  <span className="font-medium text-slate-700">{new Date(req.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-600">
                  <span className="font-bold text-slate-700">Purpose / Justification:</span> {req.purpose}
                </p>
                {req.reviewerNotes && (
                  <p className="text-xs text-[#356AE6] mt-1 bg-blue-50/60 p-2 rounded border border-blue-100">
                    <span className="font-bold">Reviewer Note:</span> {req.reviewerNotes}
                  </p>
                )}
              </div>

              {/* Action Buttons for Reviewer / Admin */}
              {(user.role === 'reviewer' || user.role === 'admin' || user.role === 'issuer') && req.status !== 'approved' && req.status !== 'rejected' && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
                  <button
                    onClick={() => { setActiveRequest(req); }}
                    className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                  >
                    Add Auditor Note
                  </button>
                  <button
                    onClick={() => handleStatusChange(req.id, 'in_review')}
                    className="px-3 py-1.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold border border-amber-200"
                  >
                    Move to In Review
                  </button>
                  <button
                    onClick={() => handleStatusChange(req.id, 'approved')}
                    className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    Approve Verification
                  </button>
                  <button
                    onClick={() => handleStatusChange(req.id, 'rejected')}
                    className="px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* New Request Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Submit Formal Verification Request
            </h3>

            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Document *</label>
                <select
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  {documents.map(d => (
                    <option key={d.id} value={d.id}>{d.title} ({d.verificationId})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Verification Authority *</label>
                <select
                  value={targetOrgId}
                  onChange={(e) => setTargetOrgId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  {organizations.map(o => (
                    <option key={o.id} value={o.id}>{o.name} ({o.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Purpose / Context *</label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  required
                  rows={3}
                  placeholder="e.g. Visa compliance check, employer background screening, or licensing validation."
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#356AE6] text-white font-bold rounded-lg hover:bg-[#2857C7]"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reviewer Note Modal */}
      {activeRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">Auditor Endorsement Note</h3>
            <p className="text-xs text-slate-500 mb-4">
              Attach forensic findings or instructions for request #{activeRequest.id}
            </p>
            <textarea
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              rows={3}
              placeholder="Enter auditor comments..."
              className="w-full p-2.5 text-xs border border-slate-300 rounded-lg mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setActiveRequest(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => handleStatusChange(activeRequest.id, activeRequest.status)}
                className="px-4 py-1.5 text-xs bg-[#356AE6] text-white font-bold rounded-lg"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
