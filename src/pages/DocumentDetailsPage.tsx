import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  Download,
  Copy,
  Check,
  Building,
  User,
  Calendar,
  Lock,
  ExternalLink,
  ChevronLeft,
  XCircle,
  Eye,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { store } from '../services/store';
import { VeriDocDocument, VerificationRecord } from '../types';
import { StatusBadge } from '../components/common/CommonComponents';

export const DocumentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [document, setDocument] = useState<VeriDocDocument | null>(null);
  const [docRecords, setDocRecords] = useState<VerificationRecord[]>([]);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [revokeReason, setRevokeReason] = useState('');

  useEffect(() => {
    if (!id) return;
    const doc = store.getDocumentById(id) || store.getDocumentByVerificationId(id);
    if (doc) {
      setDocument(doc);
      const records = store.getVerificationRecords().filter(r => r.documentId === doc.id || r.verificationId === doc.verificationId);
      setDocRecords(records);

      // Generate public verification QR code URL
      const publicUrl = `${window.location.origin}/verify/${doc.verificationId}`;
      QRCode.toDataURL(publicUrl, { width: 220, margin: 2 }, (err, url) => {
        if (!err && url) setQrDataUrl(url);
      });
    }
  }, [id]);

  if (!document) {
    return (
      <div className="text-center py-16 bg-white border border-[#E4E9F2] rounded-2xl p-8 max-w-lg mx-auto">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Document Record Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">
          No registered document matches the provided identifier "{id}".
        </p>
        <button
          onClick={() => navigate('/app/documents')}
          className="mt-4 px-4 py-2 bg-[#356AE6] text-white text-xs font-semibold rounded-lg"
        >
          Back to Documents
        </button>
      </div>
    );
  }

  const copyHash = () => {
    navigator.clipboard.writeText(document.fileHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleRevoke = () => {
    if (!revokeReason.trim()) return;
    const updated = store.revokeDocument(document.id, revokeReason.trim());
    setDocument(updated);
    setShowRevokeModal(false);
  };

  const publicVerifyUrl = `/verify/${document.verificationId}`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/app/documents')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Documents</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(publicVerifyUrl)}
            className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#356AE6] text-xs font-semibold flex items-center gap-1.5 transition-colors border border-blue-200"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Trust Page</span>
          </button>

          {(user.role === 'issuer' || user.role === 'admin') && document.status !== 'revoked' && (
            <button
              onClick={() => setShowRevokeModal(true)}
              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-rose-200"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Revoke Document</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Document Details Header Card */}
      <div className="bg-white border border-[#E4E9F2] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#356AE6] to-[#36C5F0] flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {document.type.replace('_', ' ')}
                </span>
                <span className="text-slate-300">•</span>
                <span className="font-mono text-xs font-bold text-[#356AE6]">
                  {document.verificationId}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#19243A] mt-1">
                {document.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={document.status} />
          </div>
        </div>

        {/* Revocation Banner if Revoked */}
        {document.status === 'revoked' && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs">
            <p className="font-bold flex items-center gap-1.5 text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> OFFICIAL NOTICE: THIS DOCUMENT HAS BEEN REVOKED
            </p>
            <p className="mt-1 text-slate-700">
              <span className="font-semibold">Reason for revocation:</span> {document.revocationReason || 'Revoked by governing authority.'}
            </p>
            <p className="mt-0.5 text-slate-500 text-[11px]">
              Revoked at: {document.revokedAt ? new Date(document.revokedAt).toLocaleString() : 'N/A'}
            </p>
          </div>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" /> Document Owner
            </p>
            <p className="text-xs font-bold text-slate-900 mt-1">{document.ownerName}</p>
            <p className="text-[11px] text-slate-500">{document.ownerEmail}</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-500" /> Issuing Authority
            </p>
            <p className="text-xs font-bold text-slate-900 mt-1">{document.issuerName}</p>
            <p className="text-[11px] text-emerald-600 font-medium">Accredited Registrar</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Issuance Date
            </p>
            <p className="text-xs font-bold text-slate-900 mt-1">
              {new Date(document.issueDate).toLocaleDateString()}
            </p>
            <p className="text-[11px] text-slate-500">
              {document.expiryDate ? `Expires: ${new Date(document.expiryDate).toLocaleDateString()}` : 'Indefinite Validity'}
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" /> Verification Velocity
            </p>
            <p className="text-xs font-bold text-slate-900 mt-1">{document.verifiedCount} Times Audited</p>
            <p className="text-[11px] text-slate-500">
              Last: {document.lastVerifiedAt ? new Date(document.lastVerifiedAt).toLocaleDateString() : 'Recently'}
            </p>
          </div>
        </div>

        {/* SHA-256 Fingerprint Box */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900 text-white space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#36C5F0] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Lock className="w-3.5 h-3.5" /> Immutable SHA-256 Fingerprint Anchor
            </span>
            <button
              onClick={copyHash}
              className="text-slate-300 hover:text-white flex items-center gap-1 text-[11px] bg-slate-800 px-2 py-0.5 rounded transition-colors"
            >
              {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
            </button>
          </div>
          <p className="font-mono text-xs text-slate-200 break-all select-all leading-relaxed">
            {document.fileHash}
          </p>
        </div>
      </div>

      {/* Two Column Layout: Safe Document Preview & QR Code Trust Anchor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Safe Digital Preview Card */}
        <div className="lg:col-span-2 bg-white border border-[#E4E9F2] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-sm text-[#19243A] flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#356AE6]" />
                <span>Protected Digital Document Rendering</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {document.fileName} ({(document.fileSize / 1024).toFixed(1)} KB)
              </span>
            </div>

            {/* Visual Certificate Container */}
            <div className="border border-slate-200 rounded-xl p-6 bg-linear-to-b from-slate-50 to-white text-center relative overflow-hidden shadow-2xs">
              <div className="absolute top-2 right-2 opacity-10 pointer-events-none">
                <ShieldCheck className="w-40 h-40 text-[#356AE6]" />
              </div>

              <div className="max-w-md mx-auto space-y-3">
                <p className="text-[10px] tracking-widest uppercase font-bold text-slate-400">
                  OFFICIAL ISSUED CREDENTIAL
                </p>
                <h4 className="text-lg font-extrabold text-slate-900">{document.title}</h4>
                <p className="text-xs text-slate-600">
                  Conferred upon <span className="font-bold text-slate-900">{document.ownerName}</span>
                </p>
                <div className="py-2 my-2 border-y border-dashed border-slate-200 text-xs text-slate-500 font-mono">
                  <div>Verification Reference: {document.verificationId}</div>
                  <div>Issued by: {document.issuerName}</div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  <Check className="w-3 h-3" /> CRYPTOGRAPHICALLY SECURED WITH SHA-256
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Access Mode: Private File Sandbox (Protected from public scraping)</span>
            <button
              onClick={() => alert(`Simulated download of official receipt for ${document.verificationId}`)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Verification Receipt</span>
            </button>
          </div>
        </div>

        {/* QR Code Trust Anchor Card */}
        <div className="bg-white border border-[#E4E9F2] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#19243A] flex items-center gap-2 pb-3 border-b border-slate-100">
              <QrCode className="w-4 h-4 text-[#356AE6]" />
              <span>Instant QR Verification Link</span>
            </h3>

            <div className="text-center py-4">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Document QR Code"
                  className="w-44 h-44 mx-auto rounded-xl border border-slate-200 p-2 shadow-xs"
                />
              ) : (
                <div className="w-44 h-44 mx-auto bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-400">
                  Generating QR...
                </div>
              )}
              <p className="text-[11px] text-slate-400 mt-2 font-mono">{document.verificationId}</p>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs space-y-1">
              <p className="font-bold text-[#101B33]">Public Verification Protocol</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Scan this QR code with any smartphone or camera to load the read-only public trust receipt. Only approved metadata is disclosed.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
            <button
              onClick={() => navigate(publicVerifyUrl)}
              className="w-full py-2 bg-[#356AE6] hover:bg-[#2857C7] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <span>Test Public QR Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Verification History Table for this Document */}
      <div className="bg-white border border-[#E4E9F2] rounded-2xl p-6 shadow-xs">
        <h3 className="font-bold text-sm text-[#19243A] mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#356AE6]" />
          <span>Audit Log History for this Document</span>
        </h3>

        {docRecords.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            No external verification queries recorded yet for this document.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {docRecords.map((r) => (
              <div key={r.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={r.result} />
                    <span className="font-semibold text-slate-800">{r.fileName}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{r.notes}</p>
                </div>
                <div className="text-right text-[11px] text-slate-400 font-mono">
                  {new Date(r.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revocation Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold">Confirm Document Revocation</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Revoking a document permanently marks its status in the public registry. All future QR scans and verification attempts will flag the document as REVOKED.
            </p>

            <label className="block text-xs font-bold text-slate-700 mb-1">
              Official Reason for Revocation:
            </label>
            <textarea
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
              placeholder="e.g. Superseded by updated degree version, diploma rescinded, or disciplinary correction."
              rows={3}
              className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-rose-500"
            />

            <div className="flex items-center justify-end gap-2.5 mt-5">
              <button
                onClick={() => setShowRevokeModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleRevoke}
                disabled={!revokeReason.trim()}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50"
              >
                Confirm Revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
