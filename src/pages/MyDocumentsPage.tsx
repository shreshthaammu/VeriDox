import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  Grid,
  List,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  QrCode,
  Download,
  AlertTriangle,
  MoreVertical,
  Calendar,
  Lock,
  GitPullRequest
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { store } from '../services/store';
import { VeriDocDocument, DocumentStatus, DocumentType } from '../types';
import { StatusBadge } from '../components/common/CommonComponents';

export const MyDocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const allDocuments = store.getDocuments();

  // Filter documents
  const filteredDocs = allDocuments.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.verificationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.issuerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileHash.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#19243A] tracking-tight">
            My Documents & Credentials
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your registered digital credentials, cryptographic SHA-256 anchors, and verification links.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/app/verify')}
            className="px-3.5 py-2 rounded-lg bg-white border border-[#E4E9F2] hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-[#356AE6]" />
            <span>Verify Document</span>
          </button>

          {(user.role === 'issuer' || user.role === 'admin') && (
            <button
              onClick={() => navigate('/app/issue')}
              className="px-3.5 py-2 rounded-lg bg-[#356AE6] hover:bg-[#2857C7] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Issue Document</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-[#E4E9F2] rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, ID, or issuer..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E4E9F2] rounded-lg focus:outline-none focus:border-[#356AE6]"
          />
        </div>

        {/* Filters & View Toggles */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-[#E4E9F2] rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-[#356AE6]"
          >
            <option value="all">All Statuses</option>
            <option value="valid">Valid & Verified</option>
            <option value="under_review">Under Review</option>
            <option value="revoked">Revoked</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs border border-[#E4E9F2] rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-[#356AE6]"
          >
            <option value="all">All Categories</option>
            <option value="degree_certificate">Degree Certificate</option>
            <option value="experience_letter">Experience Letter</option>
            <option value="transcript">Official Transcript</option>
            <option value="training_credential">Certification</option>
          </select>

          <div className="flex items-center border border-[#E4E9F2] rounded-lg p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-white shadow-xs text-[#356AE6]' : 'text-slate-400 hover:text-slate-700'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-xs text-[#356AE6]' : 'text-slate-400 hover:text-slate-700'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Documents Render (Table vs Grid) */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white border border-[#E4E9F2] rounded-2xl p-12 text-center max-w-md mx-auto">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No documents found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or status filter to see registered documents.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white border border-[#E4E9F2] rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7FB] border-b border-[#E4E9F2] text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Document Title</th>
                  <th className="py-3 px-4">Verification ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Issuer</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Audits</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => navigate(`/app/documents/${doc.id}`)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[#356AE6] shrink-0" />
                        <div>
                          <div className="truncate max-w-xs">{doc.title}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {doc.fileHash.slice(0, 8)}...{doc.fileHash.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#356AE6]">
                      {doc.verificationId}
                    </td>
                    <td className="py-3.5 px-4 capitalize text-slate-600">
                      {doc.type.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 truncate max-w-[160px]">
                      {doc.issuerName}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-semibold">
                      {doc.verifiedCount}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/app/documents/${doc.id}`)}
                          title="Open Details"
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/verify/${doc.verificationId}`)}
                          title="Public QR Link"
                          className="p-1.5 rounded hover:bg-slate-100 text-[#356AE6]"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => navigate(`/app/documents/${doc.id}`)}
              className="bg-white border border-[#E4E9F2] rounded-xl p-5 shadow-xs hover:shadow-sm hover:border-[#356AE6]/50 cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold text-[#356AE6] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {doc.verificationId}
                  </span>
                  <StatusBadge status={doc.status} />
                </div>

                <h3 className="font-bold text-sm text-[#19243A] line-clamp-2 mb-2">
                  {doc.title}
                </h3>

                <p className="text-xs text-slate-500 mb-1">
                  <span className="text-slate-400 font-medium">Issuer:</span> {doc.issuerName}
                </p>

                <p className="text-xs text-slate-500 mb-3">
                  <span className="text-slate-400 font-medium">Issued:</span> {new Date(doc.issueDate).toLocaleDateString()}
                </p>

                <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 font-mono text-[10px] text-slate-600 truncate">
                  SHA-256: {doc.fileHash.slice(0, 16)}...
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">{doc.verifiedCount} audits</span>
                <span className="text-[#356AE6] font-bold flex items-center gap-1 hover:underline">
                  View Record <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
