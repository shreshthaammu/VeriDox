import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Check,
  Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { store } from '../services/store';
import { Notification } from '../types';

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>(() => store.getNotifications(user.id));

  const markAllRead = () => {
    store.markAllNotificationsRead(user.id);
    setNotifications(store.getNotifications(user.id));
  };

  const handleNotificationClick = (notif: Notification) => {
    store.markNotificationRead(notif.id);
    setNotifications(store.getNotifications(user.id));
    if (notif.relatedDocId) {
      navigate(`/app/documents/${notif.relatedDocId}`);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#19243A] tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#356AE6]" />
            <span>Platform Notifications</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            System alerts, completed verification reports, and cryptographic mismatch notices.
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="px-3 py-1.5 bg-white border border-[#E4E9F2] hover:bg-slate-50 text-xs font-semibold text-[#356AE6] rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
        >
          <Check className="w-4 h-4" />
          <span>Mark all as read</span>
        </button>
      </div>

      <div className="bg-white border border-[#E4E9F2] rounded-2xl shadow-xs divide-y divide-slate-100 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No notifications found.
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              className={`p-5 cursor-pointer hover:bg-slate-50 transition-colors flex items-start gap-4 ${
                !n.isRead ? 'bg-blue-50/30' : ''
              }`}
            >
              <div className="mt-1 shrink-0">
                {n.type === 'verification_completed' ? (
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                ) : n.type === 'security_alert' ? (
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#356AE6] flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{n.title}</h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {n.message}
                </p>
                {n.relatedVerificationId && (
                  <span className="inline-block mt-2 font-mono text-[11px] text-[#356AE6] font-semibold bg-blue-50 px-2 py-0.5 rounded">
                    Record: {n.relatedVerificationId}
                  </span>
                )}
              </div>

              {!n.isRead && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#356AE6] shrink-0 mt-2"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
