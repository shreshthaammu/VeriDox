import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  FileText,
  GitPullRequest,
  Award,
  Binary,
  QrCode,
  Clock,
  ScrollText,
  BarChart3,
  Building2,
  Bell,
  User,
  Shield,
  Sliders,
  HelpCircle,
  ShieldAlert,
  Users,
  Building,
  CheckSquare,
  FileCheck2,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  Database,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { store } from '../../services/store';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { user, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  const unreadNotifs = store.getNotifications(user.id).filter(n => !n.isRead).length;
  const pendingRequests = store.getVerificationRequests().filter(r => r.status === 'pending').length;

  const workspaceNav = [
    { name: 'Overview', path: '/app/overview', icon: LayoutDashboard },
    { name: 'Verify a Document', path: '/app/verify', icon: ShieldCheck, badge: 'Core' },
    { name: 'My Documents', path: '/app/documents', icon: FileText },
    { name: 'Database & Datasets', path: '/app/datasets', icon: Database, badge: 'MERN' },
    { name: 'Verification Requests', path: '/app/requests', icon: GitPullRequest, count: pendingRequests },
    { name: 'Issued Documents', path: '/app/issued', icon: Award, issuerOnly: true },
  ];

  const securityNav = [
    { name: 'Integrity Checker', path: '/app/integrity', icon: Binary, highlight: true },
    { name: 'QR Verification', path: '/app/qr', icon: QrCode },
    { name: 'Verification History', path: '/app/history', icon: Clock },
    { name: 'Audit Trail', path: '/app/audit', icon: ScrollText },
  ];

  const insightsNav = [
    { name: 'Analytics', path: '/app/analytics', icon: BarChart3 },
    { name: 'Organizations', path: '/app/organizations', icon: Building2 },
    { name: 'Notifications', path: '/app/notifications', icon: Bell, count: unreadNotifs },
  ];

  const accountNav = [
    { name: 'My Profile', path: '/app/profile', icon: User },
    { name: 'Security Settings', path: '/app/security', icon: Shield },
    { name: 'Preferences', path: '/app/preferences', icon: Sliders },
    { name: 'Help & Support', path: '/app/help', icon: HelpCircle },
  ];

  const adminNav = [
    { name: 'Admin Overview', path: '/admin', icon: ShieldAlert },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Org Verification', path: '/admin/organizations', icon: Building },
    { name: 'Verification Queue', path: '/admin/verifications', icon: CheckSquare, count: 2 },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: FileCheck2 },
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#101B33] text-slate-300 transition-all duration-200 border-r border-[#1E2D4C] ${
          collapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#1E2D4C]">
          <div
            onClick={() => navigate('/app/overview')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#356AE6] to-[#36C5F0] flex items-center justify-center text-white shadow-md shadow-[#356AE6]/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            {!collapsed && (
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg text-white tracking-tight">VeriDox</span>
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-[#356AE6]/30 text-[#36C5F0] border border-[#356AE6]/40">v2.6</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Digital Document Trust</p>
              </div>
            )}
          </div>

          {/* Collapse toggle button on Desktop */}
          <button
            onClick={onToggleCollapse}
            aria-label="Toggle sidebar"
            className="hidden lg:flex w-7 h-7 rounded-md items-center justify-center text-slate-400 hover:text-white hover:bg-[#1A2844] transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-6">
          {/* Quick Demo Switcher Hint */}
          {!collapsed && (
            <div className="bg-[#16233F] border border-[#22355C] rounded-lg p-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
                <span className="flex items-center gap-1 text-[#36C5F0]">
                  <Sparkles className="w-3.5 h-3.5" /> Hackathon Persona
                </span>
                <span className="uppercase text-[10px] px-1.5 py-0.2 rounded bg-[#356AE6] text-white">
                  {user.role}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2 leading-tight">
                Switch role instantly to test role-specific workflows:
              </p>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <button
                  onClick={() => switchRole('individual')}
                  className={`px-2 py-1 rounded text-left truncate transition-colors ${
                    user.role === 'individual'
                      ? 'bg-[#356AE6] text-white font-medium'
                      : 'bg-[#1C2C4E] text-slate-300 hover:bg-[#253A66]'
                  }`}
                >
                  Applicant (Alex)
                </button>
                <button
                  onClick={() => switchRole('issuer')}
                  className={`px-2 py-1 rounded text-left truncate transition-colors ${
                    user.role === 'issuer'
                      ? 'bg-[#356AE6] text-white font-medium'
                      : 'bg-[#1C2C4E] text-slate-300 hover:bg-[#253A66]'
                  }`}
                >
                  Issuer (Stanford)
                </button>
                <button
                  onClick={() => switchRole('reviewer')}
                  className={`px-2 py-1 rounded text-left truncate transition-colors ${
                    user.role === 'reviewer'
                      ? 'bg-[#356AE6] text-white font-medium'
                      : 'bg-[#1C2C4E] text-slate-300 hover:bg-[#253A66]'
                  }`}
                >
                  Reviewer (Auditor)
                </button>
                <button
                  onClick={() => switchRole('admin')}
                  className={`px-2 py-1 rounded text-left truncate transition-colors ${
                    user.role === 'admin'
                      ? 'bg-[#356AE6] text-white font-medium'
                      : 'bg-[#1C2C4E] text-slate-300 hover:bg-[#253A66]'
                  }`}
                >
                  Admin (Sarah)
                </button>
              </div>
            </div>
          )}

          {/* Section: WORKSPACE */}
          <div>
            {!collapsed && (
              <h3 className="px-2 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Workspace
              </h3>
            )}
            <nav className="space-y-1">
              {workspaceNav.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#356AE6] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-[#16233F]'
                    } ${collapsed ? 'justify-center px-0' : ''}`
                  }
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {!collapsed && (
                    <span className="flex-1 truncate">{item.name}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#36C5F0]/20 text-[#36C5F0] font-semibold border border-[#36C5F0]/30">
                      {item.badge}
                    </span>
                  )}
                  {!collapsed && typeof item.count === 'number' && item.count > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-700 text-slate-200">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Section: DOCUMENT SECURITY */}
          <div>
            {!collapsed && (
              <h3 className="px-2 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Document Security
              </h3>
            )}
            <nav className="space-y-1">
              {securityNav.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#356AE6] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-[#16233F]'
                    } ${collapsed ? 'justify-center px-0' : ''}`
                  }
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className="w-4 h-4 shrink-0 text-[#36C5F0]" />
                  {!collapsed && <span className="flex-1 truncate">{item.name}</span>}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Section: INSIGHTS */}
          <div>
            {!collapsed && (
              <h3 className="px-2 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Insights
              </h3>
            )}
            <nav className="space-y-1">
              {insightsNav.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#356AE6] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-[#16233F]'
                    } ${collapsed ? 'justify-center px-0' : ''}`
                  }
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="flex-1 truncate">{item.name}</span>}
                  {!collapsed && typeof item.count === 'number' && item.count > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500 text-white font-semibold">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Section: ACCOUNT */}
          <div>
            {!collapsed && (
              <h3 className="px-2 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Account
              </h3>
            )}
            <nav className="space-y-1">
              {accountNav.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#356AE6] text-white shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-[#16233F]'
                    } ${collapsed ? 'justify-center px-0' : ''}`
                  }
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="flex-1 truncate">{item.name}</span>}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Section: ADMINISTRATION (Visible only to Admin or Reviewer, or toggleable) */}
          {(user.role === 'admin' || user.role === 'reviewer') && (
            <div>
              {!collapsed && (
                <div className="flex items-center justify-between px-2 mb-2">
                  <h3 className="text-[11px] font-semibold tracking-wider text-amber-400 uppercase">
                    Administration
                  </h3>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                    SECURED
                  </span>
                </div>
              )}
              <nav className="space-y-1">
                {adminNav.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-amber-600/90 text-white shadow-sm'
                          : 'text-amber-200/80 hover:text-white hover:bg-[#1C253B]'
                      } ${collapsed ? 'justify-center px-0' : ''}`
                    }
                    title={collapsed ? item.name : undefined}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="flex-1 truncate">{item.name}</span>}
                    {!collapsed && typeof item.count === 'number' && item.count > 0 && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-900 font-bold">
                        {item.count}
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>
          )}

          {/* Public Landing Link */}
          <div className="pt-2 border-t border-[#1E2D4C]">
            <NavLink
              to="/"
              onClick={handleNavClick}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-[#36C5F0] hover:bg-[#16233F] transition-colors ${
                collapsed ? 'justify-center px-0' : ''
              }`}
              title={collapsed ? 'Public Portal' : undefined}
            >
              <ExternalLink className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Public Portal & Landing</span>}
            </NavLink>
          </div>
        </div>

        {/* User Footer Profile & Logout */}
        <div className="p-3 border-t border-[#1E2D4C] bg-[#0C1527]">
          <div className="flex items-center justify-between">
            <div
              onClick={() => navigate('/app/profile')}
              className={`flex items-center gap-2.5 cursor-pointer hover:opacity-85 transition-opacity ${
                collapsed ? 'justify-center w-full' : ''
              }`}
            >
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-[#356AE6]"
              />
              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate capitalize">{user.role} {user.organizationName ? `• ${user.organizationName}` : ''}</p>
                </div>
              )}
            </div>

            {!collapsed && (
              <button
                onClick={logout}
                title="Log out"
                className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-[#1A2844] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
