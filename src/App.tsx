/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppLayout } from './components/layout/AppLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PublicVerifyPage } from './pages/PublicVerifyPage';
import { NotFoundPage, UnauthorizedPage } from './pages/NotFoundPage';

// Workspace Pages
import { OverviewPage } from './pages/OverviewPage';
import { VerifyDocumentPage } from './pages/VerifyDocumentPage';
import { MyDocumentsPage } from './pages/MyDocumentsPage';
import { DocumentDetailsPage } from './pages/DocumentDetailsPage';
import { IssueDocumentPage } from './pages/IssueDocumentPage';
import { IntegrityCheckerPage } from './pages/IntegrityCheckerPage';
import { QRVerificationPage } from './pages/QRVerificationPage';
import { VerificationRequestsPage } from './pages/VerificationRequestsPage';
import { DatasetsPage } from './pages/DatasetsPage';
import { IssuedDocumentsPage } from './pages/IssuedDocumentsPage';
import { VerificationHistoryPage } from './pages/VerificationHistoryPage';
import { AuditTrailPage } from './pages/AuditTrailPage';

// Insights & Account Pages
import { AnalyticsPage } from './pages/AnalyticsPage';
import { OrganizationsPage } from './pages/OrganizationsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SecuritySettingsPage } from './pages/SecuritySettingsPage';
import { PreferencesPage } from './pages/PreferencesPage';
import { HelpSupportPage } from './pages/HelpSupportPage';

// Admin Pages
import { AdminOverviewPage } from './pages/AdminOverviewPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminOrganizationsPage } from './pages/AdminOrganizationsPage';
import { AdminVerificationQueuePage } from './pages/AdminVerificationQueuePage';
import { AdminAuditLogsPage } from './pages/AdminAuditLogsPage';
import { AdminSystemSettingsPage } from './pages/AdminSystemSettingsPage';

// Role Guard Component
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (user.role !== 'admin' && user.role !== 'reviewer') {
    return <UnauthorizedPage />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify/:verificationId" element={<PublicVerifyPage />} />

          {/* App Workspace Routes */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/overview" replace />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="verify" element={<VerifyDocumentPage />} />
            <Route path="documents" element={<MyDocumentsPage />} />
            <Route path="datasets" element={<DatasetsPage />} />
            <Route path="documents/:id" element={<DocumentDetailsPage />} />
            <Route path="issue" element={<IssueDocumentPage />} />
            <Route path="integrity" element={<IntegrityCheckerPage />} />
            <Route path="qr" element={<QRVerificationPage />} />
            <Route path="requests" element={<VerificationRequestsPage />} />
            <Route path="issued" element={<IssuedDocumentsPage />} />
            <Route path="history" element={<VerificationHistoryPage />} />
            <Route path="audit" element={<AuditTrailPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="organizations" element={<OrganizationsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="security" element={<SecuritySettingsPage />} />
            <Route path="preferences" element={<PreferencesPage />} />
            <Route path="help" element={<HelpSupportPage />} />
          </Route>

          {/* Admin Routes with Shared AppLayout */}
          <Route path="/admin" element={<AppLayout />}>
            <Route index element={<AdminRoute><AdminOverviewPage /></AdminRoute>} />
            <Route path="users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
            <Route path="organizations" element={<AdminRoute><AdminOrganizationsPage /></AdminRoute>} />
            <Route path="verifications" element={<AdminRoute><AdminVerificationQueuePage /></AdminRoute>} />
            <Route path="audit-logs" element={<AdminRoute><AdminAuditLogsPage /></AdminRoute>} />
            <Route path="settings" element={<AdminRoute><AdminSystemSettingsPage /></AdminRoute>} />
          </Route>

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
