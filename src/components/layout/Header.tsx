import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  User as UserIcon,
  Shield,
  LogOut,
  X,
  FileText,
  Sliders,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { store } from '../../services/store';
import { VeriDocDocument, Notification } from '../../types';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  collapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileSidebar,
  collapsed,
}) => {
  const { user, logout, switchRole, allDemoUsers } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<VeriDocDocument[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Notification dropdown
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // User menu
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Notifications
  const notifications: Notification[] = store.getNotifications(user.id);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search handler
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }
    const q = query.toLowerCase();
    const docs = store.getDocuments().filter(doc => 
      doc.title.toLowerCase().includes(q) ||
      doc.verificationId.toLowerCase().includes(q) ||
      doc.ownerName.toLowerCase().includes(q) ||
      doc.fileHash.toLowerCase().includes(q)
    );
    setSearchResults(docs);
    setIsSearchOpen(true);
  };

  // Breadcrumb generator
  const getBreadcrumbs = () => {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length === 0) return [{ label: 'Home', path: '/' }];
    
    const crumbs = [];
    if (parts[0] === 'app') {
      crumbs.push({ label: 'App', path: '/app/overview' });
      if (parts[1]) {
        const titleMap: Record<string, string> = {
          overview: 'Overview',
          verify: 'Verify Document',
          documents: 'My Documents',
          requests: 'Verification Requests',
          issued: 'Issued Documents',
          integrity: 'Integrity Checker',
          qr: 'QR Verification',
          history: 'Verification History',
          audit: 'Audit Trail',
          analytics: 'Analytics',
          organizations: 'Organizations',
          notifications: 'Notifications',
          profile: 'My Profile',
          security: 'Security Settings',
          preferences: 'Preferences',
          help: 'Help & Support',
        };
        crumbs.push({ 
          label: titleMap[parts[1]] || parts[1].charAt(0).toUpperCase() + parts[1].slice(1), 
          path: location.pathname 
        });
      }
    } else if (parts[0] === 'admin') {
      crumbs.push({ label: 'Administration', path: '/admin' });
      if (parts[1]) {
        crumbs.push({ label: parts[1].replace('-', ' ').toUpperCase(), path: location.pathname });
      }
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-[#E4E9F2] px-4 lg:px-6 flex items-center justify-between transition-all">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb nav */}
        <nav className="hidden sm:flex items-center text-xs font-medium text-slate-500 gap-1.5">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.path}>
              {idx > 0 && <span className="text-slate-300">/</span>}
              <span
                className={idx === breadcrumbs.length - 1 ? 'text-[#19243A] font-semibold' : 'text-slate-500 hover:text-slate-800 cursor-pointer'}
                onClick={() => navigate(crumb.path)}
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Middle: Global Search */}
      <div ref={searchRef} className="relative flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => searchQuery && setIsSearchOpen(true)}
            placeholder="Search verification ID (VDX-*), document, hash, owner..."
            className="w-full bg-[#F5F7FB] border border-[#E4E9F2] rounded-lg pl-9 pr-8 py-1.5 text-xs text-[#19243A] focus:outline-none focus:border-[#356AE6] focus:bg-white transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E4E9F2] rounded-xl shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto">
            <div className="p-2 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 font-semibold">
              <span>Matching Documents ({searchResults.length})</span>
              <span>Direct Link</span>
            </div>
            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No registered records found for "{searchQuery}". Try searching "Stanford", "VDX-2026-9041-K8", or "Alex".
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {searchResults.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigate(`/app/documents/${doc.id}`);
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{doc.title}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                        <span className="text-[#356AE6]">{doc.verificationId}</span>
                        <span>•</span>
                        <span>{doc.ownerName}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      doc.status === 'valid' ? 'bg-emerald-50 text-emerald-700' :
                      doc.status === 'revoked' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Actions, Persona Switcher, Notifications, User */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Hackathon Role Tag / Selector */}
        <div className="hidden sm:flex items-center bg-[#F0F4FE] border border-[#D5E1FD] rounded-lg px-2.5 py-1 text-xs">
          <span className="text-[#356AE6] font-semibold flex items-center gap-1 mr-2 text-[11px]">
            <Sparkles className="w-3.5 h-3.5" /> Persona:
          </span>
          <select
            value={user.role}
            onChange={(e) => switchRole(e.target.value as any)}
            className="bg-transparent text-xs font-semibold text-slate-800 cursor-pointer focus:outline-none"
          >
            <option value="individual">Alex Morgan (Applicant)</option>
            <option value="issuer">Dr. Eleanor (Stanford Registrar)</option>
            <option value="reviewer">Marcus Sterling (Forensic Reviewer)</option>
            <option value="admin">Sarah Chen (Compliance Admin)</option>
          </select>
        </div>

        {/* Notifications Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label="Open notifications"
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#356AE6] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E4E9F2] rounded-xl shadow-xl overflow-hidden z-50">
              <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-800">Notifications ({unreadCount} new)</span>
                <button
                  onClick={() => store.markAllNotificationsRead(user.id)}
                  className="text-[11px] text-[#356AE6] hover:underline"
                >
                  Mark all as read
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No new notifications.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        store.markNotificationRead(n.id);
                        setNotifOpen(false);
                        if (n.relatedDocId) navigate(`/app/documents/${n.relatedDocId}`);
                        else navigate('/app/notifications');
                      }}
                      className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors ${
                        !n.isRead ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">
                          {n.type === 'verification_completed' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : n.type === 'security_alert' ? (
                            <AlertTriangle className="w-4 h-4 text-rose-500" />
                          ) : (
                            <FileText className="w-4 h-4 text-[#356AE6]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 truncate">{n.title}</p>
                          <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{n.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1 font-mono">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-100 text-center bg-slate-50">
                <Link
                  to="/app/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs font-semibold text-[#356AE6] hover:underline"
                >
                  View All Notifications →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-[#E4E9F2]"
            />
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E4E9F2] rounded-xl shadow-xl overflow-hidden z-50 py-1 text-xs">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                <span className="inline-block mt-1 uppercase text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                  {user.role}
                </span>
              </div>

              <button
                onClick={() => { setUserMenuOpen(false); navigate('/app/profile'); }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-slate-700"
              >
                <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => { setUserMenuOpen(false); navigate('/app/security'); }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-slate-700"
              >
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span>Security & Keys</span>
              </button>

              <button
                onClick={() => { setUserMenuOpen(false); navigate('/app/preferences'); }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 text-slate-700"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                <span>Preferences</span>
              </button>

              <div className="border-t border-slate-100 my-1"></div>

              <button
                onClick={() => { setUserMenuOpen(false); logout(); }}
                className="w-full px-3 py-2 text-left hover:bg-rose-50 flex items-center gap-2.5 text-rose-600 font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
