import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Search,
  Plus,
  Download,
  AlertTriangle,
  QrCode,
  ArrowUpRight,
  ShieldCheck,
  Building,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { store } from '../services/store';
import { VeriDocDocument } from '../types';
import { StatusBadge } from '../components/common/CommonComponents';

export const IssuedDocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const documents = store.getDocuments();

  const filtered = documents.filter(d => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.verificationId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportRegistryCSV = () => {
    const headers = ['VerificationID', 'Title', 'Type', 'Recipient', 'Issuer', 'Status', 'SHA-256', 'IssueDate'];
    const rows = filtered.map(d => [
      d.verificationId,
      `"${d.title.replace(/"/g, '""')}"`,
      d.type,
      `"${d.ownerName}"`,
      `"${d.issuerName}"`,
      d.status,
      d.fileHash,
      d.issueDate
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VeriDox_Issued_Register_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#19243A] tracking-tight">
            Institutional Issuance Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official repository of credentials issued and anchored by authorized institutions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportRegistryCSV}
            className="px-3.5 py-2 bg-white border border-[#E4E9F2] hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export Registry CSV</span>
          </button>

          <button
            onClick={() => navigate('/app/issue')}
            className="px-4 py-2 bg-[#356AE6] hover:bg-[#2857C7] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Issue New Credential</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-[#E4E9F2] rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipient or ID..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E4E9F2] rounded-lg focus:outline-none focus:border-[#356AE6]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-[#E4E9F2] rounded-lg px-2.5 py-1.5 bg-white text-slate-700"
          >
            <option value="all">All Registry Statuses</option>
            <option value="valid">Valid & Active</option>
            <option value="under_review">Under Review</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white border border-[#E4E9F2] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FB] border-b border-[#E4E9F2] text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Verification ID</th>
                <th className="py-3 px-4">Credential Title</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Conferral Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(doc => (
                <tr
                  key={doc.id}
                  onClick={() => navigate(`/app/documents/${doc.id}`)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#356AE6]">
                    {doc.verificationId}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    <div className="truncate max-w-xs">{doc.title}</div>
                    <div className="text-[10px] text-slate-400 capitalize">{doc.type.replace('_', ' ')}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <div>{doc.ownerName}</div>
                    <div className="text-[10px] text-slate-400">{doc.ownerEmail}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {new Date(doc.issueDate).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => navigate(`/verify/${doc.verificationId}`)}
                        title="Open Public Trust View"
                        className="p-1.5 rounded hover:bg-slate-100 text-[#356AE6]"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/app/documents/${doc.id}`)}
                        title="View Record"
                        className="p-1.5 rounded hover:bg-slate-100 text-slate-600"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
