import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Database,
  Table,
  Plus,
  Trash2,
  Edit2,
  ShieldCheck,
  Download,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { store } from '../services/store';
import { VeriDocDocument, DocumentType, DocumentStatus } from '../types';
import { StatusBadge } from '../components/common/CommonComponents';

export const DatasetsPage: React.FC = () => {
  const navigate = useNavigate();

  // Active collection tab
  const [activeTab, setActiveTab] = useState<'documents' | 'records' | 'organizations' | 'audit'>('documents');
  const [search, setSearch] = useState('');

  // Documents state for CRUD
  const [documents, setDocuments] = useState<VeriDocDocument[]>(() => store.getDocuments());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<VeriDocDocument | null>(null);

  // New Document form
  const [newTitle, setNewTitle] = useState('');
  const [newHolder, setNewHolder] = useState('Alex Morgan');
  const [newType, setNewType] = useState<DocumentType>('degree_certificate');
  const [newStatus, setNewStatus] = useState<DocumentStatus>('valid');
  const [newIssuer, setNewIssuer] = useState('Stanford University Registrar');

  const records = store.getVerificationRecords();
  const orgs = store.getOrganizations();
  const audit = store.getAuditEvents();

  const filteredDocs = documents.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.verificationId.toLowerCase().includes(search.toLowerCase()) ||
    d.ownerName.toLowerCase().includes(search.toLowerCase())
  );

  // CRUD Operations
  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const verificationId = `VDX-${year}-${rand}-DB`;

    const newDoc: VeriDocDocument = {
      id: `doc_${Date.now()}`,
      verificationId,
      title: newTitle.trim(),
      type: newType,
      fileHash: `db_${Math.random().toString(16).slice(2)}${Date.now()}`.padEnd(64, '0'),
      fileSize: 320000,
      fileName: `${newTitle.replace(/\s+/g, '_')}.pdf`,
      fileMimeType: 'application/pdf',
      ownerId: 'usr_individual_1',
      ownerName: newHolder.trim(),
      ownerEmail: 'alex.morgan@stanford.alumni.edu',
      issuerId: 'usr_issuer_1',
      issuerName: newIssuer,
      issuerOrgId: 'org_stanford',
      issueDate: new Date().toISOString(),
      status: newStatus,
      publicMetadata: {
        discloseRecipientName: true,
        discloseIssueDate: true,
        discloseDocumentType: true,
        discloseIssuerName: true,
        description: 'Dataset document record'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      verifiedCount: 0
    };

    store.saveDocument(newDoc);
    setDocuments(store.getDocuments());
    setShowAddModal(false);
    setNewTitle('');
  };

  const handleDeleteDocument = (id: string) => {
    if (confirm('Delete document from MongoDB registry collection?')) {
      store.deleteDocument(id);
      setDocuments(store.getDocuments());
    }
  };

  const handleUpdateStatus = (doc: VeriDocDocument, nextStatus: DocumentStatus) => {
    const updated = { ...doc, status: nextStatus, updatedAt: new Date().toISOString() };
    store.saveDocument(updated);
    setDocuments(store.getDocuments());
  };

  const handleTestVerify = (doc: VeriDocDocument) => {
    navigate(`/app/verify?id=${doc.verificationId}`);
  };

  const handleResetDb = () => {
    if (confirm('Reset entire MongoDB dataset and audit trail to pristine initial seed?')) {
      store.resetToDemo();
      setDocuments(store.getDocuments());
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-mono font-bold uppercase mb-2 border border-emerald-200">
            <Database className="w-3.5 h-3.5" />
            <span>MongoDB Data Layer & Collections</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#19243A] tracking-tight">
            Datasets & Registry Database Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Perform full CRUD operations on documents, inspect MongoDB schema collections, and test verify any record.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetDb}
            className="px-3 py-1.5 bg-white border border-[#E4E9F2] hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Dataset Seed</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#356AE6] hover:bg-[#2857C7] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Document Record</span>
          </button>
        </div>
      </div>

      {/* Database Collection Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E4E9F2] rounded-xl p-4 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">db.documents</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{documents.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Anchored Records</p>
        </div>
        <div className="bg-white border border-[#E4E9F2] rounded-xl p-4 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">db.verificationRecords</p>
          <p className="text-2xl font-black text-[#356AE6] mt-1">{records.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Audit Queries</p>
        </div>
        <div className="bg-white border border-[#E4E9F2] rounded-xl p-4 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">db.organizations</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{orgs.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Issuing Authorities</p>
        </div>
        <div className="bg-white border border-[#E4E9F2] rounded-xl p-4 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">db.auditLedger</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{audit.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Tamper-Proof Events</p>
        </div>
      </div>

      {/* Collection Navigation Tabs */}
      <div className="flex border-b border-[#E4E9F2] gap-4 text-xs font-semibold text-slate-500">
        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'documents'
              ? 'border-[#356AE6] text-[#356AE6] font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Documents Collection ({documents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('records')}
          className={`pb-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'records'
              ? 'border-[#356AE6] text-[#356AE6] font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Verification Queries ({records.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('organizations')}
          className={`pb-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'organizations'
              ? 'border-[#356AE6] text-[#356AE6] font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Organizations ({orgs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'audit'
              ? 'border-[#356AE6] text-[#356AE6] font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Audit Ledger ({audit.length})</span>
        </button>
      </div>

      {/* Tab 1: Documents Collection with full CRUD */}
      {activeTab === 'documents' && (
        <div className="bg-white border border-[#E4E9F2] rounded-2xl shadow-xs overflow-hidden space-y-4">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by title, ID, or holder..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#356AE6]"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">
              MongoDB Schema: {`{ id, verificationId, title, holder, issuer, issueDate, status, fileHash }`}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7FB] border-b border-[#E4E9F2] text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Verification ID</th>
                  <th className="py-3 px-4">Document Title</th>
                  <th className="py-3 px-4">Holder</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Verification Status</th>
                  <th className="py-3 px-4">SHA-256 Hash</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#356AE6]">
                      {doc.verificationId}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="truncate max-w-xs">{doc.title}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{doc.issuerName}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {doc.ownerName}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(doc.issueDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={doc.status} />
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      {doc.fileHash.slice(0, 8)}...{doc.fileHash.slice(-6)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleTestVerify(doc)}
                          className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-[#356AE6] font-bold text-[11px] flex items-center gap-1 transition-colors"
                          title="Run Verification Pipeline on this record"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Verify</span>
                        </button>
                        <select
                          value={doc.status}
                          onChange={(e) => handleUpdateStatus(doc, e.target.value as any)}
                          className="text-[10px] border border-slate-200 rounded px-1.5 py-1 bg-white font-medium"
                          title="Update Status"
                        >
                          <option value="valid">Valid</option>
                          <option value="under_review">Review</option>
                          <option value="revoked">Revoked</option>
                        </select>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Verification Records */}
      {activeTab === 'records' && (
        <div className="bg-white border border-[#E4E9F2] rounded-2xl shadow-xs divide-y divide-slate-100 overflow-hidden">
          {records.map(r => (
            <div key={r.id} className="p-4 flex items-center justify-between text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={r.result} />
                  <span className="font-bold text-slate-900">{r.fileName}</span>
                  {r.verificationId && <span className="font-mono text-[#356AE6]">[{r.verificationId}]</span>}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{r.notes}</p>
              </div>
              <div className="text-right text-[11px] text-slate-400 font-mono">
                {new Date(r.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Organizations */}
      {activeTab === 'organizations' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {orgs.map(o => (
            <div key={o.id} className="bg-white border border-[#E4E9F2] rounded-xl p-5 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900">{o.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{o.description}</p>
              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{o.issuedCount} Credentials Issued</span>
                <span className="font-semibold text-emerald-700 uppercase">{o.verificationStatus}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Audit Ledger */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-[#E4E9F2] rounded-2xl shadow-xs divide-y divide-slate-100 overflow-hidden">
          {audit.map(a => (
            <div key={a.id} className="p-4 flex items-center justify-between text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 capitalize">{a.action.replace(/_/g, ' ')}</span>
                  <span className="text-slate-400 font-mono text-[10px]">({a.id})</span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">Target: {a.targetResource}</p>
              </div>
              <div className="text-right">
                <StatusBadge status={a.result} />
                <div className="text-[10px] text-slate-400 font-mono mt-1">{new Date(a.timestamp).toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add Document to MongoDB Collection</h3>
            <p className="text-xs text-slate-500 mb-4">Inserts document record into database with unique verification ID.</p>

            <form onSubmit={handleCreateDocument} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  placeholder="e.g. Master of Science in Data Engineering"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Credential Holder Name *</label>
                <input
                  type="text"
                  value={newHolder}
                  onChange={(e) => setNewHolder(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="degree_certificate">Degree Certificate</option>
                  <option value="transcript">Academic Transcript</option>
                  <option value="experience_letter">Experience Letter</option>
                  <option value="training_credential">Certification</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Verification Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="valid">Valid & Verified</option>
                  <option value="under_review">Under Review</option>
                  <option value="revoked">Revoked</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Issuing Authority</label>
                <input
                  type="text"
                  value={newIssuer}
                  onChange={(e) => setNewIssuer(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#356AE6] hover:bg-[#2857C7] text-white font-bold rounded-lg"
                >
                  Insert Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
