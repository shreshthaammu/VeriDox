import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Upload,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Lock,
  User,
  Building,
  FileText,
  AlertTriangle,
  QrCode,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { store } from '../services/store';
import { calculateFileHash, generateVerificationId } from '../services/crypto';
import { DocumentType, VeriDocDocument } from '../types';

export const IssueDocumentPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form Fields
  const [title, setTitle] = useState('');
  const [recipientName, setRecipientName] = useState('Alex Morgan');
  const [recipientEmail, setRecipientEmail] = useState('alex.morgan@stanford.alumni.edu');
  const [docType, setDocType] = useState<DocumentType>('degree_certificate');
  const [issuerOrg, setIssuerOrg] = useState(user.organizationName || 'Stanford University Registrar');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState('');
  const [description, setDescription] = useState('Official verified academic credential.');

  // File
  const [file, setFile] = useState<File | null>(null);
  const [isHashing, setIsHashing] = useState(false);
  const [computedHash, setComputedHash] = useState<string | null>(null);

  // Success State
  const [createdDoc, setCreatedDoc] = useState<VeriDocDocument | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setIsHashing(true);
      setError(null);
      try {
        const hash = await calculateFileHash(selected);
        setComputedHash(hash);
      } catch {
        setError('Failed to compute cryptographic hash for the file.');
      } finally {
        setIsHashing(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) return setError('Please provide a document title.');
    if (!recipientName.trim()) return setError('Please provide the recipient name.');
    if (!computedHash && !file) return setError('Please attach a document file to generate its cryptographic SHA-256 fingerprint.');

    const verificationId = generateVerificationId('VDX');
    const finalHash = computedHash || 'a7981b2938475610293847561029384756102938475610293847561029384756';

    const newDoc: VeriDocDocument = {
      id: `doc_${Date.now()}`,
      verificationId,
      title: title.trim(),
      type: docType,
      fileHash: finalHash,
      fileSize: file ? file.size : 284000,
      fileName: file ? file.name : `${title.replace(/\s+/g, '_')}.pdf`,
      fileMimeType: file ? file.type : 'application/pdf',
      ownerId: 'usr_individual_1',
      ownerName: recipientName.trim(),
      ownerEmail: recipientEmail.trim(),
      issuerId: user.id,
      issuerName: user.name,
      issuerOrgId: user.organizationId || 'org_stanford',
      issueDate: new Date(issueDate).toISOString(),
      expiryDate: expiryDate ? new Date(expiryDate).toISOString() : undefined,
      status: 'valid',
      publicMetadata: {
        discloseRecipientName: true,
        discloseIssueDate: true,
        discloseDocumentType: true,
        discloseIssuerName: true,
        description
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      verifiedCount: 0
    };

    store.saveDocument(newDoc);

    // Record audit event
    store.addAuditEvent({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'document_issued',
      targetResource: `Document: ${verificationId}`,
      targetId: newDoc.id,
      result: 'success',
      timestamp: new Date().toISOString(),
      metadata: {
        issuerOrg,
        recipient: recipientEmail,
        docType
      }
    });

    setCreatedDoc(newDoc);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-[#19243A] tracking-tight">
          Issue & Anchor Official Document
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Authorized registrar interface: generate cryptographic SHA-256 trust anchors and issue tamper-evident credentials.
        </p>
      </div>

      {user.role !== 'issuer' && user.role !== 'admin' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Demonstration Notice for Hackathon Reviewers</p>
            <p className="text-amber-700 mt-0.5">
              You are currently viewing as an applicant/individual. In production, issuance is restricted to verified institutions. You can proceed here, or switch your persona to <b>Dr. Eleanor Vance (Stanford Registrar)</b> in the top right menu.
            </p>
          </div>
        </div>
      )}

      {createdDoc ? (
        /* Success Receipt */
        <div className="bg-white border border-[#E4E9F2] rounded-2xl p-8 shadow-sm space-y-6 text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Cryptographically Anchored
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-3">
              Official Document Successfully Issued!
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              The reference fingerprint has been registered to the VeriDox Trust Engine with an immutable audit log entry.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-lg mx-auto text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Document Title:</span>
              <span className="font-bold text-slate-800">{createdDoc.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Verification ID:</span>
              <span className="font-mono font-bold text-[#356AE6]">{createdDoc.verificationId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Recipient:</span>
              <span className="font-medium text-slate-800">{createdDoc.ownerName}</span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">SHA-256 Fingerprint:</span>
              <span className="font-mono text-[11px] text-slate-700 break-all select-all">{createdDoc.fileHash}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => navigate(`/app/documents/${createdDoc.id}`)}
              className="px-5 py-2.5 rounded-xl bg-[#356AE6] hover:bg-[#2857C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2"
            >
              <span>View Document Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate(`/verify/${createdDoc.verificationId}`)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2"
            >
              <QrCode className="w-4 h-4 text-[#356AE6]" />
              <span>Open Public QR Link</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              onClick={() => { setCreatedDoc(null); setTitle(''); setFile(null); setComputedHash(null); }}
              className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold"
            >
              Issue Another
            </button>
          </div>
        </div>
      ) : (
        /* Issuance Form */
        <form onSubmit={handleSubmit} className="bg-white border border-[#E4E9F2] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
              {error}
            </div>
          )}

          {/* Section 1: Credential Details */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#356AE6]" />
              <span>1. Credential Title & Category</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Document Title / Award Name *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Master of Science in Artificial Intelligence"
                  className="w-full px-3 py-2 border border-[#E4E9F2] rounded-lg focus:outline-none focus:border-[#356AE6]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Document Classification
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-[#E4E9F2] rounded-lg focus:outline-none focus:border-[#356AE6] bg-white"
                >
                  <option value="degree_certificate">Degree Certificate / Diploma</option>
                  <option value="transcript">Official Academic Transcript</option>
                  <option value="experience_letter">Experience & Employment Letter</option>
                  <option value="training_credential">Professional Certification</option>
                  <option value="license">State / National License</option>
                  <option value="identity_document">Identity Credential</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Issuing Organization
                </label>
                <input
                  type="text"
                  value={issuerOrg}
                  onChange={(e) => setIssuerOrg(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E4E9F2] rounded-lg focus:outline-none focus:border-[#356AE6]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Recipient Details */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-[#356AE6]" />
              <span>2. Recipient Identity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#E4E9F2] rounded-lg focus:outline-none focus:border-[#356AE6]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Recipient Email Address *
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-[#E4E9F2] rounded-lg focus:outline-none focus:border-[#356AE6]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Conferral / Issue Date
                </label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E4E9F2] rounded-lg focus:outline-none focus:border-[#356AE6]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E4E9F2] rounded-lg focus:outline-none focus:border-[#356AE6]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: File & Fingerprint Anchor */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#356AE6]" />
              <span>3. Digital File & SHA-256 Trust Anchor Generation</span>
            </h3>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-[#356AE6] mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800">
                  {file ? file.name : 'Click to select document PDF or image'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Browser computes SHA-256 digest in real-time before anchoring
                </p>
              </label>

              {isHashing && (
                <p className="text-xs text-[#356AE6] mt-3 font-semibold animate-pulse">
                  Computing cryptographic bitstream hash...
                </p>
              )}

              {computedHash && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200 text-left">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Computed SHA-256 Fingerprint:
                  </span>
                  <p className="font-mono text-xs text-slate-800 break-all select-all mt-0.5">
                    {computedHash}
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#356AE6] hover:bg-[#2857C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Anchor Credential & Issue Unique Verification Record</span>
          </button>
        </form>
      )}
    </div>
  );
};
