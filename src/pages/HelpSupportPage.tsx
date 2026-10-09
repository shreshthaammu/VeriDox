import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  BookOpen,
  Binary,
  QrCode,
  AlertTriangle,
  Mail,
  Send,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

export const HelpSupportPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [supportSent, setSupportSent] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');

  const faqs = [
    {
      q: 'How does SHA-256 cryptographic hashing guarantee document integrity?',
      a: 'SHA-256 takes the exact binary data (bitstream) of any uploaded file and generates a unique 64-character hexadecimal fingerprint. Because of the cryptographic avalanche effect, changing even a single comma or pixel completely alters the output hash. A matching hash proves mathematical identity.'
    },
    {
      q: 'Why does VeriDox distinguish between integrity and authenticity?',
      a: 'A matching hash proves that two files are byte-for-byte identical. However, it does not prove who authored the document unless that hash is anchored to a verified, accredited issuing authority. VeriDox validates both the mathematical bitstream and the institutional trust anchor.'
    },
    {
      q: 'What causes an "Integrity Mismatch" outcome?',
      a: 'An integrity mismatch occurs when the file hash differs from the registered reference. This can happen if someone edited text in a PDF editor, printed/scanned with compression artifacts, re-saved with new metadata, or uploaded a different document version.'
    },
    {
      q: 'Does scanning a QR code expose my private PDF file to the public?',
      a: 'No. VeriDox enforces strict selective disclosure. Public verification pages display only consented non-sensitive metadata (such as validity status, issuer name, and issue year). The raw document remains securely stored in a private zero-knowledge sandbox.'
    },
    {
      q: 'Can a document status be revoked after issuance?',
      a: 'Yes. Authorized issuing institutions can revoke superseded credentials or corrected transcripts. Revocation updates the registry immediately and causes all subsequent QR scans and hash queries to display an official REVOKED warning.'
    }
  ];

  const filteredFaqs = faqs.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  );

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setSupportSent(true);
    setSupportMessage('');
    setTimeout(() => setSupportSent(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-[#19243A] tracking-tight flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-[#356AE6]" />
          <span>Trust Knowledge Base & Support</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Technical documentation, cryptographic principles, and support inquiry channel.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search technical documentation, hashing questions, verification procedures..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-[#E4E9F2] rounded-xl text-xs focus:outline-none focus:border-[#356AE6] shadow-2xs"
        />
      </div>

      {/* Core Concept Guide Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E4E9F2] rounded-xl p-4 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#356AE6] flex items-center justify-center mb-3">
            <Binary className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-xs text-slate-900 mb-1">Cryptographic Hashing</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Deterministic SHA-256 bitstream validation for tamper-proof detection.
          </p>
        </div>

        <div className="bg-white border border-[#E4E9F2] rounded-xl p-4 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <QrCode className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-xs text-slate-900 mb-1">QR Trust Links</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Instant smartphone verification with zero-knowledge selective disclosure.
          </p>
        </div>

        <div className="bg-white border border-[#E4E9F2] rounded-xl p-4 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <BookOpen className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-xs text-slate-900 mb-1">Forensic Audit Chains</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Tamper-evident logs of every verification query and issuance action.
          </p>
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="bg-white border border-[#E4E9F2] rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-[#19243A] pb-2 border-b border-slate-100">
          Frequently Asked Questions ({filteredFaqs.length})
        </h3>

        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <h4 className="font-bold text-xs text-slate-900 mb-1.5 flex items-center justify-between">
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support Form */}
      <div className="bg-white border border-[#E4E9F2] rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-[#19243A] pb-2 border-b border-slate-100 flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#356AE6]" />
          <span>Contact Trust Support Team</span>
        </h3>

        {supportSent && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Support inquiry dispatched. A compliance engineer will respond promptly.</span>
          </div>
        )}

        <form onSubmit={handleSupportSubmit} className="space-y-3 text-xs max-w-xl">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Inquiry / Issue Description</label>
            <textarea
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              required
              rows={3}
              placeholder="Describe your technical inquiry, institutional accreditation question, or hash anomaly report..."
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#356AE6]"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-[#356AE6] hover:bg-[#2857C7] text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Support Inquiry</span>
          </button>
        </form>
      </div>
    </div>
  );
};
