import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Building,
  User,
  Calendar,
  Lock,
  Upload,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { store } from '../services/store';
import { calculateFileHash } from '../services/crypto';
import { VeriDocDocument } from '../types';

export const PublicVerifyPage: React.FC = () => {
  const { verificationId } = useParams<{ verificationId: string }>();
  const navigate = useNavigate();

  const [document, setDocument] = useState<VeriDocDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedHash, setCopiedHash] = useState(false);

  // Live File Matcher on Public Page
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadHash, setUploadHash] = useState<string | null>(null);
  const [fileCheckResult, setFileCheckResult] = useState<'match' | 'mismatch' | null>(null);

  useEffect(() => {
    if (verificationId) {
      const doc = store.getDocumentByVerificationId(verificationId);
      setDocument(doc || null);
      setLoading(false);
    }
  }, [verificationId]);

  const handleTestFileUpload = async (file: File) => {
    setUploadedFile(file);
    const hash = await calculateFileHash(file);
    setUploadHash(hash);
    if (document) {
      if (hash.toLowerCase() === document.fileHash.toLowerCase()) {
        setFileCheckResult('match');
      } else {
        setFileCheckResult('mismatch');
      }
    }
  };

  const copyHash = () => {
    if (!document) return;
    navigator.clipboard.writeText(document.fileHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center p-4">
        <p className="text-xs text-slate-500 font-semibold animate-pulse">Loading verification record...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#19243A]">
      {/* Public Header */}
      <header className="bg-white border-b border-[#E4E9F2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#356AE6] to-[#36C5F0] flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-[#101B33]">VeriDox</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#356AE6] border border-blue-100 hidden sm:inline-block">
              Public Trust Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/app/verify"
              className="text-xs font-bold text-slate-700 hover:text-[#356AE6] transition-colors"
            >
              Verify Another Document
            </Link>
            <Link
              to="/login"
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#356AE6] text-white hover:bg-[#2857C7] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {!document ? (
          /* Not Found State */
          <div className="bg-white border border-[#E4E9F2] rounded-2xl p-8 text-center shadow-xs">
            <XCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h1 className="text-xl font-extrabold text-slate-900">
              No Registered Trust Record Found
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Identifier "{verificationId}" does not correspond to any registered record in the VeriDox Trust Registry.
            </p>
            <p className="text-[11px] text-slate-400 mt-3">
              Notice: The document may not have been registered through an accredited issuing authority, or the verification ID may contain a typo.
            </p>
            <button
              onClick={() => navigate('/app/verify')}
              className="mt-6 px-4 py-2 bg-[#356AE6] text-white text-xs font-bold rounded-lg"
            >
              Run Hash Search in Core Engine
            </button>
          </div>
        ) : (
          /* Found Document State */
          <div className="space-y-6">
            {/* Status Banner */}
            {document.status === 'valid' && (
              <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-6 text-emerald-950 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold tracking-wider uppercase text-emerald-700">
                      Official Trust Verification
                    </span>
                    <h2 className="text-xl font-extrabold text-emerald-950">
                      Valid & Authenticated Credential
                    </h2>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      This record is cryptographically anchored by an accredited issuing authority.
                    </p>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-white/70 px-2.5 py-1 rounded-md border border-emerald-300">
                    {document.verificationId}
                  </span>
                </div>
              </div>
            )}

            {document.status === 'revoked' && (
              <div className="bg-rose-50 border-2 border-rose-500 rounded-2xl p-6 text-rose-950 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold tracking-wider uppercase text-rose-700">
                      Revocation Notice
                    </span>
                    <h2 className="text-xl font-extrabold text-rose-950">
                      OFFICIALLY REVOKED DOCUMENT
                    </h2>
                    <p className="text-xs text-rose-800 mt-1 font-semibold">
                      Reason: {document.revocationReason || 'This document has been rescinded or superseded by the issuing authority.'}
                    </p>
                    <p className="text-[11px] text-rose-700 mt-1">
                      Revoked on: {document.revokedAt ? new Date(document.revokedAt).toLocaleString() : 'Official ledger entry'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {document.status === 'under_review' && (
              <div className="bg-amber-50 border-2 border-amber-500 rounded-2xl p-6 text-amber-950 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold tracking-wider uppercase text-amber-700">
                      Evaluation In Progress
                    </span>
                    <h2 className="text-xl font-extrabold text-amber-950">
                      Pending Forensic Audit
                    </h2>
                    <p className="text-xs text-amber-800 mt-1">
                      This credential has been registered and is currently undergoing accredited registrar review.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Approved Public Metadata Card */}
            <div className="bg-white border border-[#E4E9F2] rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Approved Public Metadata
                </span>
                <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
                  {document.title}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Category: <span className="font-semibold text-slate-700 capitalize">{document.type.replace('_', ' ')}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-500" /> Issuing Institution
                  </p>
                  <p className="font-bold text-slate-900 text-sm mt-1">{document.issuerName}</p>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Accredited Authority</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" /> Credential Holder
                  </p>
                  <p className="font-bold text-slate-900 text-sm mt-1">{document.ownerName}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Selective disclosure consented</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" /> Conferral Date
                  </p>
                  <p className="font-bold text-slate-900 text-sm mt-1">
                    {new Date(document.issueDate).toLocaleDateString()}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {document.expiryDate ? `Expires: ${new Date(document.expiryDate).toLocaleDateString()}` : 'Permanent validity'}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-500" /> Public Privacy Status
                  </p>
                  <p className="font-bold text-slate-900 text-sm mt-1">Zero-Knowledge Storage</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Private PDF protected</p>
                </div>
              </div>

              {/* Immutable Hash Anchor */}
              <div className="p-4 bg-slate-900 rounded-xl text-white space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#36C5F0] uppercase text-[11px]">
                    Registered Reference SHA-256 Fingerprint
                  </span>
                  <button
                    onClick={copyHash}
                    className="text-slate-300 hover:text-white flex items-center gap-1 text-[11px]"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="font-mono text-xs text-slate-200 break-all select-all">
                  {document.fileHash}
                </p>
              </div>
            </div>

            {/* Interactive Live File Matcher for External Employers */}
            <div className="bg-white border border-[#E4E9F2] rounded-2xl p-6 shadow-xs space-y-4">
              <div>
                <h3 className="font-bold text-sm text-[#19243A]">
                  Verify Your Own Copy Against This Reference
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Have a copy of this candidate's PDF? Drop it here to check if its SHA-256 hash matches this registered record exactly.
                </p>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center bg-slate-50">
                <input
                  type="file"
                  id="public-check-file"
                  onChange={(e) => e.target.files?.[0] && handleTestFileUpload(e.target.files[0])}
                  className="hidden"
                />
                <label htmlFor="public-check-file" className="cursor-pointer">
                  <Upload className="w-6 h-6 text-[#356AE6] mx-auto mb-1" />
                  <p className="text-xs font-bold text-slate-800">
                    {uploadedFile ? uploadedFile.name : 'Select or drop your document file'}
                  </p>
                  <p className="text-[10px] text-slate-400">File is processed locally in your browser</p>
                </label>
              </div>

              {fileCheckResult && (
                <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
                  fileCheckResult === 'match'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {fileCheckResult === 'match' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-bold">100% BITSTREAM MATCH</p>
                        <p className="text-[11px] font-normal">Your file is bit-for-bit identical to the official record registered by {document.issuerName}.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                      <div>
                        <p className="font-bold">INTEGRITY MISMATCH DETECTED</p>
                        <p className="text-[11px] font-normal">Your file hash differs from the registered reference. The document has been modified or is a different file.</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Security Explanation */}
            <div className="p-4 bg-slate-100 rounded-xl text-[11px] text-slate-600 leading-relaxed">
              <p className="font-bold text-slate-800 mb-1">What this verification means:</p>
              <p>
                This verification proves that an issuing authority deposited the reference SHA-256 fingerprint into the VeriDox Trust Registry. Matching your copy against this hash ensures that the contents have not been altered, tampered with, or modified since conferral.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
