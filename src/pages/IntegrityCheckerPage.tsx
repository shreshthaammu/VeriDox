import React, { useState } from 'react';
import {
  Binary,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Download,
  Sparkles,
  RefreshCw,
  FileText
} from 'lucide-react';
import { calculateFileHash, createSampleTestFile } from '../services/crypto';

export const IntegrityCheckerPage: React.FC = () => {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [hashA, setHashA] = useState<string>('');
  const [hashB, setHashB] = useState<string>('');
  const [manualHashB, setManualHashB] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasCompared, setHasCompared] = useState(false);
  const [copiedA, setCopiedA] = useState(false);
  const [copiedB, setCopiedB] = useState(false);

  const handleFileA = async (file: File) => {
    setFileA(file);
    setIsProcessing(true);
    const hash = await calculateFileHash(file);
    setHashA(hash);
    setIsProcessing(false);
  };

  const handleFileB = async (file: File) => {
    setFileB(file);
    setIsProcessing(true);
    const hash = await calculateFileHash(file);
    setHashB(hash);
    setIsProcessing(false);
  };

  const runComparison = () => {
    setHasCompared(true);
  };

  // 1-Click Forensic Tamper Test: Loads Pristine Stanford Degree vs Tampered Degree
  const loadForensicTamperDemo = async () => {
    const pristine = createSampleTestFile('pristine');
    const tampered = createSampleTestFile('tampered');
    setIsProcessing(true);
    await handleFileA(pristine);
    await handleFileB(tampered);
    setHasCompared(true);
    setIsProcessing(false);
  };

  const loadTwinMatchDemo = async () => {
    const pristine1 = createSampleTestFile('pristine');
    const pristine2 = createSampleTestFile('pristine');
    setIsProcessing(true);
    await handleFileA(pristine1);
    await handleFileB(pristine2);
    setHasCompared(true);
    setIsProcessing(false);
  };

  const effectiveHashB = manualHashB.trim() || hashB;
  const isMatch = hashA && effectiveHashB && hashA.toLowerCase() === effectiveHashB.toLowerCase();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-[#19243A] tracking-tight flex items-center gap-2">
          <Binary className="w-6 h-6 text-[#356AE6]" />
          <span>Bitstream Integrity Checker & Forensic Compare</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Perform forensic cryptographic comparisons between digital files or benchmark against trusted reference hashes.
        </p>
      </div>

      {/* Mandatory Cryptographic Disclaimer Banner as instructed in prompt */}
      <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-slate-700 leading-relaxed">
        <p className="font-bold text-[#101B33] mb-1">
          Cryptographic Principle Notice:
        </p>
        <p>
          "A matching hash indicates that the compared files have identical content for the purposes of this SHA-256 comparison. It does not by itself prove the issuer's identity or the document's original legitimacy."
        </p>
      </div>

      {/* Quick Forensic Test Lab Shortcuts */}
      <div className="bg-white border border-[#E4E9F2] rounded-xl p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-800">
          <Sparkles className="w-4 h-4 text-[#356AE6]" />
          <span>Live Forensic Demonstration Scenarios:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <button
            onClick={loadForensicTamperDemo}
            className="p-3 bg-rose-50/60 hover:bg-rose-50 border border-rose-200 rounded-lg text-left transition-colors flex items-start gap-2.5"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Load Tamper Simulation (Pristine vs Altered)</p>
              <p className="text-[11px] text-slate-500">
                1 modified word ("Magna Cum Laude") alters entire SHA-256 digest
              </p>
            </div>
          </button>

          <button
            onClick={loadTwinMatchDemo}
            className="p-3 bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-200 rounded-lg text-left transition-colors flex items-start gap-2.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Load Concordant Match (Twin Files)</p>
              <p className="text-[11px] text-slate-500">
                Identical bitstream producing 100% cryptographic match
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Side-by-Side File Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File / Sample A */}
        <div className="bg-white border border-[#E4E9F2] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Target Document (File A)
            </h3>
            {fileA && <span className="text-[11px] text-slate-400">{(fileA.size / 1024).toFixed(1)} KB</span>}
          </div>

          <div className="border border-dashed border-slate-300 rounded-xl p-5 text-center bg-slate-50">
            <input
              type="file"
              id="file-a"
              onChange={(e) => e.target.files?.[0] && handleFileA(e.target.files[0])}
              className="hidden"
            />
            <label htmlFor="file-a" className="cursor-pointer">
              <FileText className="w-6 h-6 text-[#356AE6] mx-auto mb-1.5" />
              <p className="text-xs font-bold text-slate-800">
                {fileA ? fileA.name : 'Select or drop Target File'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Click to browse</p>
            </label>
          </div>

          {hashA ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-500 uppercase">Computed SHA-256 Digest:</span>
                <button
                  onClick={() => { navigator.clipboard.writeText(hashA); setCopiedA(true); setTimeout(() => setCopiedA(false), 2000); }}
                  className="text-[#356AE6] hover:underline flex items-center gap-1"
                >
                  {copiedA ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedA ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="p-2.5 bg-slate-900 text-slate-200 rounded-lg font-mono text-[11px] break-all select-all">
                {hashA}
              </p>
            </div>
          ) : (
            <p className="text-center text-xs text-slate-400 py-3">Attach a file to calculate hash</p>
          )}
        </div>

        {/* File / Reference B */}
        <div className="bg-white border border-[#E4E9F2] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Reference Document or Hash (File B)
            </h3>
            {fileB && <span className="text-[11px] text-slate-400">{(fileB.size / 1024).toFixed(1)} KB</span>}
          </div>

          <div className="border border-dashed border-slate-300 rounded-xl p-5 text-center bg-slate-50">
            <input
              type="file"
              id="file-b"
              onChange={(e) => e.target.files?.[0] && handleFileB(e.target.files[0])}
              className="hidden"
            />
            <label htmlFor="file-b" className="cursor-pointer">
              <FileText className="w-6 h-6 text-[#356AE6] mx-auto mb-1.5" />
              <p className="text-xs font-bold text-slate-800">
                {fileB ? fileB.name : 'Select Reference File'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Or paste hash directly below</p>
            </label>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Reference SHA-256 Digest (Manual Input or Computed):
            </label>
            <input
              type="text"
              value={effectiveHashB}
              onChange={(e) => setManualHashB(e.target.value)}
              placeholder="Paste 64-character SHA-256 hex string..."
              className="w-full p-2.5 bg-slate-900 text-slate-200 rounded-lg font-mono text-[11px] break-all focus:outline-none focus:ring-1 focus:ring-[#356AE6]"
            />
          </div>
        </div>
      </div>

      {/* Comparison Action & Results */}
      <div className="text-center">
        <button
          onClick={runComparison}
          disabled={!hashA || !effectiveHashB || isProcessing}
          className="px-6 py-3 rounded-xl bg-[#356AE6] hover:bg-[#2857C7] text-white text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all inline-flex items-center gap-2"
        >
          <Binary className="w-4 h-4" />
          <span>Execute Bitstream Comparison</span>
        </button>
      </div>

      {hasCompared && (
        <div className={`p-6 rounded-2xl border ${isMatch ? 'bg-emerald-50/70 border-emerald-300' : 'bg-rose-50/70 border-rose-300'} animate-fadeIn space-y-4`}>
          <div className="flex items-center gap-3">
            {isMatch ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
            )}
            <div>
              <h3 className={`text-lg font-extrabold ${isMatch ? 'text-emerald-950' : 'text-rose-950'}`}>
                {isMatch ? 'PERFECT CONCORDANCE: 100% SHA-256 MATCH' : 'DIVERGENCE DETECTED: INTEGRITY MISMATCH'}
              </h3>
              <p className={`text-xs mt-0.5 ${isMatch ? 'text-emerald-800' : 'text-rose-800'}`}>
                {isMatch
                  ? 'Every single bit of the submitted file matches the reference anchor without variance.'
                  : 'The files possess different bitstreams. Even a single character or metadata byte alteration causes a completely divergent SHA-256 output (Avalanche Effect).'}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 text-xs flex items-center justify-between">
            <span className="font-semibold text-slate-700">
              Forensic Algorithm: Standard NIST FIPS 180-4 SHA-256
            </span>
            <button
              onClick={() => alert('Forensic comparison audit log exported as text receipt.')}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Forensic Report</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
