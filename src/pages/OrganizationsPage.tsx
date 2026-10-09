import React, { useState } from 'react';
import {
  Building2,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  MapPin,
  Mail,
  Award,
  Plus
} from 'lucide-react';
import { store } from '../services/store';
import { Organization } from '../types';

export const OrganizationsPage: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>(() => store.getOrganizations());
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Application Modal state
  const [applicantName, setApplicantName] = useState('');
  const [applicantType, setApplicantType] = useState('university');
  const [applicantEmail, setApplicantEmail] = useState('');

  const filtered = organizations.filter(org => {
    const matchesSearch =
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.description.toLowerCase().includes(search.toLowerCase()) ||
      org.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || org.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim()) return;
    const newOrg: Organization = {
      id: `org_${Date.now()}`,
      name: applicantName.trim(),
      type: applicantType as any,
      description: 'Newly registered issuing authority pending accreditation audit.',
      website: 'https://example.org',
      contactEmail: applicantEmail.trim() || 'contact@example.org',
      verificationStatus: 'pending',
      supportedCategories: ['degree_certificate', 'transcript'],
      logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80',
      location: 'Global',
      registeredDate: new Date().toISOString(),
      issuedCount: 0
    };
    const updated = [...organizations, newOrg];
    localStorage.setItem('veridox_organizations', JSON.stringify(updated));
    setOrganizations(updated);
    setShowApplyModal(false);
    setApplicantName('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#19243A] tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#356AE6]" />
            <span>Accredited Issuing Organizations</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Directory of educational institutions, enterprise HR departments, and government licensing authorities.
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="px-4 py-2 bg-[#356AE6] hover:bg-[#2857C7] text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Organization Accreditation</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-[#E4E9F2] rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organization, location..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E4E9F2] rounded-lg focus:outline-none focus:border-[#356AE6]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs border border-[#E4E9F2] rounded-lg px-2.5 py-1.5 bg-white text-slate-700"
          >
            <option value="all">All Organization Types</option>
            <option value="university">Universities & Colleges</option>
            <option value="enterprise">Enterprise Employers</option>
            <option value="government">Government Accreditation</option>
            <option value="cert_authority">Certification Bodies</option>
          </select>
        </div>
      </div>

      {/* Organization Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(org => (
          <div
            key={org.id}
            className="bg-white border border-[#E4E9F2] rounded-2xl p-6 shadow-xs hover:border-[#356AE6]/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={org.logo}
                    alt={org.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="font-bold text-base text-slate-900 leading-tight">{org.name}</h3>
                    <p className="text-[11px] text-slate-500 capitalize flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{org.location}</span>
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                  org.verificationStatus === 'verified'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {org.verificationStatus}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {org.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {org.supportedCategories.map(cat => (
                  <span
                    key={cat}
                    className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 capitalize"
                  >
                    {cat.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">
                {org.issuedCount.toLocaleString()} Issued Credentials
              </span>
              <a
                href={org.website}
                target="_blank"
                rel="noreferrer"
                className="text-[#356AE6] font-bold flex items-center gap-1 hover:underline text-[11px]"
              >
                <span>Portal Details</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Accreditation Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">Apply for Institutional Accreditation</h3>
            <p className="text-xs text-slate-500 mb-4">
              Submit your organization credentials to become an authorized VeriDox trust anchor.
            </p>

            <form onSubmit={handleApply} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Organization Name *</label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  required
                  placeholder="e.g. Oxford Academic Credential Registry"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Organization Type</label>
                <select
                  value={applicantType}
                  onChange={(e) => setApplicantType(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="university">University / Higher Education</option>
                  <option value="enterprise">Enterprise Employer</option>
                  <option value="government">Government Licensing Body</option>
                  <option value="cert_authority">Accreditation Board</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Contact Email *</label>
                <input
                  type="email"
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                  required
                  placeholder="registrar@oxford.ac.uk"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#356AE6] text-white font-bold rounded-lg hover:bg-[#2857C7]"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
