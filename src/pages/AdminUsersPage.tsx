import React, { useState } from 'react';
import {
  Users,
  Search,
  Shield,
  UserCheck,
  UserX,
  Building,
  Mail,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { store } from '../services/store';
import { User, UserRole } from '../types';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(() => store.getUsers());
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.organizationName && u.organizationName.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const updated = store.updateUser(userId, { role: newRole });
    setUsers(store.getUsers());
  };

  const handleStatusToggle = (user: User) => {
    const newStatus = user.verifiedStatus === 'verified' ? 'unverified' : 'verified';
    store.updateUser(user.id, { verifiedStatus: newStatus });
    setUsers(store.getUsers());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#19243A] tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#356AE6]" />
            <span>User Governance & Access Control</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit registered personas, assign administrative & registrar roles, and manage verification badges.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-[#E4E9F2] rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search user name, email, or org..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#E4E9F2] rounded-lg focus:outline-none focus:border-[#356AE6]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs border border-[#E4E9F2] rounded-lg px-2.5 py-1.5 bg-white text-slate-700"
          >
            <option value="all">All Roles</option>
            <option value="individual">Individual</option>
            <option value="issuer">Issuer (Registrar)</option>
            <option value="reviewer">Reviewer (Auditor)</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#E4E9F2] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5F7FB] border-b border-[#E4E9F2] text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role Assignment</th>
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div>{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                      className="text-xs border border-slate-200 rounded px-2 py-1 bg-white font-medium capitalize"
                    >
                      <option value="individual">Individual</option>
                      <option value="issuer">Issuer</option>
                      <option value="reviewer">Reviewer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {u.organizationName || 'Independent'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      u.verifiedStatus === 'verified' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {u.verifiedStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleStatusToggle(u)}
                      className="px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      {u.verifiedStatus === 'verified' ? 'Unverify' : 'Verify'}
                    </button>
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
