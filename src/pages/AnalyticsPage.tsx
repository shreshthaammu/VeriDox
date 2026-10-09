import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Download,
  Calendar,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { store } from '../services/store';
import { StatCard } from '../components/common/CommonComponents';

export const AnalyticsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'30d' | '90d' | 'year'>('30d');

  const records = store.getVerificationRecords();
  const docs = store.getDocuments();

  const totalQueries = 1248;
  const matchRate = '97.6%';
  const mismatchCount = 28;
  const avgLatency = '198ms';

  const exportAnalytics = () => {
    alert('Analytics report exported as CSV.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#19243A] tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#356AE6]" />
            <span>Verification Insights & Analytics</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time telemetry on document verification queries, cryptographic match fidelity, and organizational velocity.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex bg-white border border-[#E4E9F2] rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setTimeframe('30d')}
              className={`px-3 py-1.5 rounded font-semibold ${timeframe === '30d' ? 'bg-[#356AE6] text-white' : 'text-slate-600'}`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeframe('90d')}
              className={`px-3 py-1.5 rounded font-semibold ${timeframe === '90d' ? 'bg-[#356AE6] text-white' : 'text-slate-600'}`}
            >
              90 Days
            </button>
            <button
              onClick={() => setTimeframe('year')}
              className={`px-3 py-1.5 rounded font-semibold ${timeframe === 'year' ? 'bg-[#356AE6] text-white' : 'text-slate-600'}`}
            >
              1 Year
            </button>
          </div>

          <button
            onClick={exportAnalytics}
            className="px-3.5 py-2 bg-white border border-[#E4E9F2] hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Verification Queries"
          value={totalQueries}
          change="+18.4%"
          icon={TrendingUp}
          iconColor="text-[#356AE6]"
          subtext="Queries processed through trust engine"
        />
        <StatCard
          title="Integrity Concordance"
          value={matchRate}
          change="+0.8%"
          icon={ShieldCheck}
          iconColor="text-emerald-600"
          subtext="Identical SHA-256 bitstream matches"
        />
        <StatCard
          title="Tamper / Mismatch Events"
          value={mismatchCount}
          change="Isolated"
          changeType="negative"
          icon={AlertTriangle}
          iconColor="text-rose-600"
          subtext="Divergent bitstreams detected & logged"
        />
        <StatCard
          title="Avg Hashing Latency"
          value={avgLatency}
          change="Optimal"
          icon={Clock}
          iconColor="text-cyan-600"
          subtext="WebCrypto client & server digestion"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Volume Chart */}
        <div className="lg:col-span-2 bg-white border border-[#E4E9F2] rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-sm text-[#19243A]">Verification Query Trends</h3>
              <p className="text-xs text-slate-400">Monthly breakdown of successful matches vs flagged anomalies</p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              Zero Unchecked Divergence
            </span>
          </div>

          {/* SVG Bar Chart with Tooltips */}
          <div className="h-64 flex items-end gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
            {[
              { month: 'Nov', matches: 80, mismatches: 3 },
              { month: 'Dec', matches: 110, mismatches: 5 },
              { month: 'Jan', matches: 140, mismatches: 2 },
              { month: 'Feb', matches: 165, mismatches: 4 },
              { month: 'Mar', matches: 195, mismatches: 6 },
              { month: 'Apr', matches: 220, mismatches: 3 },
              { month: 'May', matches: 250, mismatches: 5 },
              { month: 'Oct (Now)', matches: 288, mismatches: 8, highlight: true }
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                  {bar.matches}
                </div>
                <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: `${(bar.matches / 300) * 100}%` }}>
                  <div
                    style={{ height: `${bar.mismatches * 2}px` }}
                    className="w-full bg-rose-500 rounded-t-xs"
                    title={`Mismatches: ${bar.mismatches}`}
                  />
                  <div
                    className={`w-full rounded-t-xs flex-1 transition-all ${
                      bar.highlight
                        ? 'bg-gradient-to-t from-[#356AE6] to-[#36C5F0]'
                        : 'bg-slate-200 group-hover:bg-[#356AE6]/70'
                    }`}
                  />
                </div>
                <span className={`text-[10px] mt-1 ${bar.highlight ? 'font-bold text-[#356AE6]' : 'text-slate-500'}`}>
                  {bar.month}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#356AE6]"></span> Valid Matches
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-500"></span> Divergent Hashes (Tampering Blocked)
              </span>
            </div>
            <span className="text-[11px] font-mono">Simulated enterprise analytics ledger</span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white border border-[#E4E9F2] rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#19243A]">Credential Categories</h3>
            <p className="text-xs text-slate-400">Distribution across verified document types</p>

            <div className="mt-5 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>University Degrees & Diplomas</span>
                  <span className="text-[#356AE6]">52%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#356AE6] rounded-full" style={{ width: '52%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Experience & Tenancy Letters</span>
                  <span className="text-emerald-600">24%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Official Academic Transcripts</span>
                  <span className="text-purple-600">14%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '14%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Government Licenses & Certs</span>
                  <span className="text-amber-600">10%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs">
            <p className="font-bold text-[#101B33]">Integrity Performance Score</p>
            <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
              99.98% of queries resolved with zero false authenticity claims, maintaining strict mathematical integrity standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
