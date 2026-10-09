import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Binary,
  QrCode,
  FileCheck2,
  Lock,
  ArrowRight,
  CheckCircle2,
  Building,
  GraduationCap,
  Briefcase,
  HelpCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#19243A]">
      {/* Top Public Navigation */}
      <header className="border-b border-[#E4E9F2] bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#356AE6] to-[#36C5F0] flex items-center justify-center text-white shadow-md shadow-[#356AE6]/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#101B33]">VeriDox</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#356AE6] border border-blue-100">
                Enterprise Trust
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-[#356AE6] transition-colors">How It Works</a>
            <a href="#security" className="hover:text-[#356AE6] transition-colors">Cryptographic Core</a>
            <a href="#benefits" className="hover:text-[#356AE6] transition-colors">Solutions</a>
            <a href="#faq" className="hover:text-[#356AE6] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 hover:text-[#356AE6] px-3.5 py-2 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <button
              onClick={() => navigate('/app/verify')}
              className="bg-[#356AE6] hover:bg-[#2A56C4] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5"
            >
              <span>Verify Document</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#356AE6] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Document Verification & Integrity Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#101B33] tracking-tight leading-[1.15]">
            Trust Every Document. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#356AE6] to-[#36C5F0]">
              Verify Every Detail.
            </span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            VeriDox enables institutions, employers, and candidates to cryptographically verify credentials, detect file tampering in milliseconds, and establish tamper-evident audit trails.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              onClick={() => navigate('/app/verify')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#356AE6] hover:bg-[#2857C7] text-white font-semibold text-base shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Verify a Document Now</span>
            </button>
            <button
              onClick={() => navigate('/app/overview')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-[#E4E9F2] hover:bg-slate-50 text-slate-800 font-semibold text-base shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>Open Platform Demo</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="pt-2 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> SHA-256 Bitstream Matching
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Instant QR Anchors
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero False-Authenticity Claims
            </span>
          </div>
        </div>

        {/* Interface Preview Visual */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-[#E4E9F2] bg-white p-3 shadow-2xl">
          <div className="rounded-xl bg-[#101B33] p-4 sm:p-6 text-white overflow-hidden relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#22355C]">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <span className="text-xs font-mono text-slate-400">VeriDox Trust Console • Verification Pipeline v2.6</span>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ACTIVE ENGINE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <div className="bg-[#16233F] border border-[#22355C] rounded-lg p-4">
                <p className="text-xs font-semibold text-[#36C5F0] uppercase tracking-wider mb-1">Cryptographic Fingerprint</p>
                <p className="text-xs font-mono text-slate-300 break-all bg-[#0B1426] p-2.5 rounded border border-[#1A2A4A]">
                  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Algorithm: SHA-256</span>
                  <span className="text-emerald-400 font-semibold">MATCH 100%</span>
                </div>
              </div>

              <div className="bg-[#16233F] border border-[#22355C] rounded-lg p-4">
                <p className="text-xs font-semibold text-[#36C5F0] uppercase tracking-wider mb-1">Anchor Source</p>
                <p className="text-base font-bold text-white mt-1">Stanford University</p>
                <p className="text-xs text-slate-400">Academic Registrar Trust Anchor</p>
                <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Status: Authorized Issuer</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-900 text-emerald-300 text-[10px]">VERIFIED</span>
                </div>
              </div>

              <div className="bg-[#16233F] border border-[#22355C] rounded-lg p-4 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#36C5F0] uppercase tracking-wider mb-1">Verification Record</p>
                  <p className="text-sm font-mono font-bold text-white mt-1">VDX-2026-9041-K8</p>
                  <p className="text-xs text-slate-400 mt-1">BS in Computer Science (Summa Cum Laude)</p>
                </div>
                <button
                  onClick={() => navigate('/verify/VDX-2026-9041-K8')}
                  className="mt-3 w-full py-1.5 rounded bg-[#356AE6] hover:bg-[#2956C4] text-xs font-semibold text-white transition-colors"
                >
                  View Public Verification →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Critical Security Distinction Notice */}
      <section className="bg-white border-y border-[#E4E9F2] py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#356AE6] text-white flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#101B33]">Important Cryptographic Integrity Principle</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                VeriDox clearly distinguishes mathematical file integrity from real-world issuer legitimacy. A cryptographic SHA-256 match confirms that a file bitstream matches a registered reference without a single modified byte; authenticity is established through authorized and vetted issuing organizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs font-bold text-[#356AE6] uppercase tracking-wider">Verification Pipeline</h2>
          <p className="text-3xl font-extrabold text-[#101B33] mt-2 tracking-tight">How VeriDox Operates in 3 Steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-[#E4E9F2] rounded-xl p-6 shadow-xs hover:border-[#356AE6]/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#356AE6] flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h3 className="font-bold text-base text-[#101B33] mb-2">Issue & Fingerprint</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Authorized institutions issue digital credentials. VeriDox computes client-side & server-side SHA-256 cryptographic fingerprints, anchoring the reference record to the institution's verified key.
            </p>
          </div>

          <div className="bg-white border border-[#E4E9F2] rounded-xl p-6 shadow-xs hover:border-[#356AE6]/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-cyan-50 text-[#36C5F0] flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h3 className="font-bold text-base text-[#101B33] mb-2">Tamper-Evident Matching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When an employer or auditor checks a document or scans a QR code, the system generates the bitstream hash and compares it against the trusted reference anchor. If even 1 pixel or character changed, it flags an integrity mismatch.
            </p>
          </div>

          <div className="bg-white border border-[#E4E9F2] rounded-xl p-6 shadow-xs hover:border-[#356AE6]/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h3 className="font-bold text-base text-[#101B33] mb-2">Audit Trail & Public Proof</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every verification attempt logs an immutable audit event without disclosing private student details. Public QR pages expose only explicitly consented metadata.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions for Multi-Stakeholders */}
      <section id="benefits" className="py-16 bg-white border-t border-[#E4E9F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-[#356AE6] uppercase tracking-wider">Multi-Stakeholder Architecture</h2>
            <p className="text-3xl font-extrabold text-[#101B33] mt-2">Built for the Complete Trust Ecosystem</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-[#E4E9F2] rounded-xl p-6 bg-[#F5F7FB]">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#356AE6] flex items-center justify-center mb-4">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-[#101B33]">Educational Institutions</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Issue degrees, diplomas, and transcripts with zero paper delays. Revoke superseded certifications with real-time propagation to prevent forged resumes.
              </p>
            </div>

            <div className="border border-[#E4E9F2] rounded-xl p-6 bg-[#F5F7FB]">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-[#101B33]">Employers & Background Checkers</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Cut background check wait times from 3 weeks to 3 seconds. Detect PDF edits, modified GPA scores, or forged dates with cryptographic certainty.
              </p>
            </div>

            <div className="border border-[#E4E9F2] rounded-xl p-6 bg-[#F5F7FB]">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <Building className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-[#101B33]">Candidates & Professionals</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Maintain a portable, cryptographically verified credential passport. Generate secure QR codes for resumes and professional portfolios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold text-[#356AE6] uppercase tracking-wider">Knowledge Base</h2>
          <p className="text-3xl font-extrabold text-[#101B33] mt-2">Frequently Asked Questions</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-[#E4E9F2] rounded-xl p-5">
            <h4 className="font-bold text-sm text-[#101B33]">Does a SHA-256 match mean the document is legally authentic?</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              No. A SHA-256 match proves that the uploaded document has identical bitstream content to a previously registered record. Authenticity requires that the record was registered by a verified, authorized issuing entity (such as an accredited university or government authority).
            </p>
          </div>

          <div className="bg-white border border-[#E4E9F2] rounded-xl p-5">
            <h4 className="font-bold text-sm text-[#101B33]">Are private files exposed to the public via QR codes?</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Never. VeriDox enforces strict selective disclosure. Public verification pages only show approved metadata (such as validity status, issuer name, and issue year). Private document PDFs are never publicly readable.
            </p>
          </div>

          <div className="bg-white border border-[#E4E9F2] rounded-xl p-5">
            <h4 className="font-bold text-sm text-[#101B33]">What causes an "Integrity Mismatch" outcome?</h4>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              An integrity mismatch occurs when the computed SHA-256 hash differs from the trusted reference hash. This can happen due to fraudulent modification, PDF software re-saving with metadata alterations, or an incorrect reference file.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#101B33] text-slate-400 py-12 border-t border-[#1E2D4C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#356AE6] to-[#36C5F0] flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">VeriDox</p>
              <p className="text-xs text-slate-400">Trust Every Document. Verify Every Detail.</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <Link to="/app/overview" className="hover:text-white transition-colors">Overview</Link>
            <Link to="/app/verify" className="hover:text-white transition-colors">Verify</Link>
            <Link to="/app/integrity" className="hover:text-white transition-colors">Integrity Checker</Link>
            <Link to="/app/help" className="hover:text-white transition-colors">Help Center</Link>
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
          </div>

          <p className="text-xs text-slate-500">
            © 2026 VeriDox Platform. Hackathon Edition.
          </p>
        </div>
      </footer>
    </div>
  );
};
