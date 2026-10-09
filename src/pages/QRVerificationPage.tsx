import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import {
  QrCode,
  Search,
  ExternalLink,
  Download,
  Copy,
  Check,
  ShieldCheck,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { store } from '../services/store';
import { VeriDocDocument } from '../types';

export const QRVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const documents = store.getDocuments();

  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [manualInputId, setManualInputId] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  const selectedDoc: VeriDocDocument | undefined = documents.find(d => d.id === selectedDocId) || documents[0];

  useEffect(() => {
    if (selectedDoc) {
      const publicUrl = `${window.location.origin}/verify/${selectedDoc.verificationId}`;
      QRCode.toDataURL(publicUrl, { width: 280, margin: 2 }, (err, url) => {
        if (!err && url) setQrDataUrl(url);
      });
    }
  }, [selectedDoc]);

  const handleManualLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInputId.trim()) return;
    navigate(`/verify/${manualInputId.trim().toUpperCase()}`);
  };

  const copyPublicLink = () => {
    if (!selectedDoc) return;
    const url = `${window.location.origin}/verify/${selectedDoc.verificationId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const downloadQrImage = () => {
    if (!qrDataUrl || !selectedDoc) return;
    const link = document.createElement('a');
    link.download = `VeriDox_QR_${selectedDoc.verificationId}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-[#19243A] tracking-tight flex items-center gap-2">
          <QrCode className="w-6 h-6 text-[#356AE6]" />
          <span>QR Trust Anchors & Public Verification</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Generate tamper-evident verification QR codes for resumes, credentials, and official transcripts.
        </p>
      </div>

      {/* Manual Verification ID Lookup Bar */}
      <div className="bg-white border border-[#E4E9F2] rounded-2xl p-5 shadow-xs">
        <form onSubmit={handleManualLookup} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={manualInputId}
              onChange={(e) => setManualInputId(e.target.value)}
              placeholder="Enter or scan Verification ID (e.g. VDX-2026-9041-K8)..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-[#E4E9F2] rounded-lg font-mono focus:outline-none focus:border-[#356AE6]"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2 bg-[#356AE6] hover:bg-[#2857C7] text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <span>Lookup Public Verification</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Main Generator Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document Selector Card */}
        <div className="bg-white border border-[#E4E9F2] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#19243A] pb-2 border-b border-slate-100">
            Select Registered Document
          </h3>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedDoc?.id === doc.id
                    ? 'border-[#356AE6] bg-blue-50/60 shadow-xs ring-1 ring-[#356AE6]'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-[#356AE6]">{doc.verificationId}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase ${
                    doc.status === 'valid' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {doc.status}
                  </span>
                </div>
                <p className="font-bold text-slate-800 line-clamp-1">{doc.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{doc.issuerName}</p>
              </div>
            ))}
          </div>
        </div>

        {/* QR Code Presentation Card */}
        {selectedDoc && (
          <div className="bg-white border border-[#E4E9F2] rounded-2xl p-6 shadow-xs flex flex-col justify-between text-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Official Trust QR Code
              </span>
              <h3 className="text-base font-extrabold text-[#19243A] mt-1">
                {selectedDoc.title}
              </h3>
              <p className="font-mono text-xs font-semibold text-[#356AE6] mt-0.5">
                {selectedDoc.verificationId}
              </p>

              <div className="my-6">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Document QR Code"
                    className="w-56 h-56 mx-auto p-3 rounded-2xl border-2 border-slate-200 shadow-md bg-white"
                  />
                ) : (
                  <div className="w-56 h-56 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center text-xs text-slate-400">
                    Generating...
                  </div>
                )}
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-slate-600 text-left">
                <p className="font-bold text-[#101B33]">Selective Disclosure Enforced</p>
                <p className="text-[11px] mt-0.5 leading-relaxed">
                  Only public metadata approved by the document owner is revealed. The raw document file remains completely private.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-3">
              <button
                onClick={copyPublicLink}
                className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied' : 'Copy Verification Link'}</span>
              </button>

              <button
                onClick={downloadQrImage}
                className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save QR Image</span>
              </button>

              <button
                onClick={() => navigate(`/verify/${selectedDoc.verificationId}`)}
                className="px-3.5 py-2 rounded-lg bg-[#356AE6] hover:bg-[#2857C7] text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <span>Open Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
