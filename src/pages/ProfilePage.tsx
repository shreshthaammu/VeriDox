import React, { useState } from 'react';
import {
  User,
  Mail,
  Building,
  Calendar,
  ShieldCheck,
  Edit3,
  Check,
  X,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { store } from '../services/store';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [title, setTitle] = useState(user.title || '');
  const [bio, setBio] = useState(user.bio || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const myDocs = store.getDocuments().filter(d => d.ownerId === user.id || d.ownerEmail === user.email);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      title: title.trim(),
      bio: bio.trim()
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#19243A] tracking-tight">
            User Trust Profile
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Personal identity credentials and platform authorization level.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3.5 py-2 bg-white border border-[#E4E9F2] hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-[#356AE6]" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Profile changes saved successfully and persisted in database.</span>
        </div>
      )}

      {/* Main Profile Header Card */}
      <div className="bg-white border border-[#E4E9F2] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-slate-100">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
            alt={user.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-[#356AE6] shadow-sm shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-extrabold text-slate-900">{user.name}</h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#356AE6] border border-blue-200 uppercase">
                {user.role}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> VERIFIED HOLDER
              </span>
            </div>

            <p className="text-xs text-slate-600 font-medium mt-1">{user.title || 'Verified Credential Holder'}</p>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              <span>{user.email}</span>
            </p>
          </div>
        </div>

        {/* Bio */}
        <div className="pt-6">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Professional Bio
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {user.bio || 'No bio provided.'}
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Associated Documents</span>
            <span className="text-lg font-extrabold text-slate-900 mt-1 block">{myDocs.length}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Account Type</span>
            <span className="text-xs font-extrabold text-[#356AE6] capitalize mt-1 block">{user.role}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Organization</span>
            <span className="text-xs font-extrabold text-slate-900 mt-1 block truncate">
              {user.organizationName || 'Independent'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 font-bold block text-[10px] uppercase">Member Since</span>
            <span className="text-xs font-extrabold text-slate-900 mt-1 block">
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Edit Profile Information
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Professional Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bio / Statement</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#356AE6] text-white font-bold rounded-lg hover:bg-[#2857C7]"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
