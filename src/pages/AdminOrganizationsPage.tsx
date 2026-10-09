import React, { useState } from 'react';
import {
  Building,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Search
} from 'lucide-react';
import { store } from '../services/store';
import { Organization } from '../types';

export const AdminOrganizationsPage: React.FC = () => {
  const [orgs, setOrgs] = useState<Organization[]>(() => store.getOrganizations());
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');

  const filtered = orgs.filter(o => filter === 'all' || o.verificationStatus === filter);

  const handleUpdateStatus = (id: string, newStatus: 'verified' | 'pending' | 'rejected') => {
    store.updateOrganizationStatus(id, newStatus);
    setOrgs(store.getOrganizations());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#19243A] tracking-tight flex items-center gap-2">
            <Building className="w-6 h-6 text-amber-600" />
            <span>Institutional Accreditation Admin Queue</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Vetting pipeline for educational institutions and organizations applying to issue cryptographically anchored credentials.
          </p>
        </div>

        <div className="flex gap-1.5 bg-white border border-[#E4E9F2] p-1 rounded-lg text-xs">
          {(['all', 'pending', 'verified', 'rejected'] as const).map(st => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1 rounded capitalize font-semibold transition-colors ${
                filter === st ? 'bg-[#356AE6] text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(org => (
          <div
            key={org.id}
            className="bg-white border border-[#E4E9F2] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <img
                src={org.logo}
                alt={org.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900">{org.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase ${
                    org.verificationStatus === 'verified' ? 'bg-emerald-50 text-emerald-700' :
                    org.verificationStatus === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {org.verificationStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{org.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-mono">
                  <span>Type: {org.type}</span>
                  <span>•</span>
                  <span>Contact: {org.contactEmail}</span>
                  <span>•</span>
                  <span>Location: {org.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center">
              {org.verificationStatus !== 'verified' && (
                <button
                  onClick={() => handleUpdateStatus(org.id, 'verified')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                >
                  Approve Accreditation
                </button>
              )}
              {org.verificationStatus !== 'rejected' && (
                <button
                  onClick={() => handleUpdateStatus(org.id, 'rejected')}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors"
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
