export type UserRole = 'individual' | 'issuer' | 'reviewer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  organizationId?: string;
  organizationName?: string;
  title?: string;
  bio?: string;
  createdAt: string;
  verifiedStatus: 'verified' | 'pending' | 'unverified';
  documentCount?: number;
  preferences?: {
    theme: 'light' | 'system' | 'dark';
    emailAlerts: boolean;
    verificationNotifications: boolean;
    auditLogDigest: 'instant' | 'daily' | 'weekly';
    twoFactorEnabled: boolean;
  };
}

export type DocumentType = 
  | 'degree_certificate' 
  | 'experience_letter' 
  | 'identity_document' 
  | 'training_credential' 
  | 'transcript' 
  | 'license'
  | 'medical_report';

export type DocumentStatus = 'valid' | 'revoked' | 'expired' | 'under_review';

export interface VeriDocDocument {
  id: string;
  verificationId: string; // e.g. "VDX-2026-9812-7A"
  title: string;
  type: DocumentType;
  fileHash: string; // SHA-256 fingerprint hex
  fileSize: number; // in bytes
  fileName: string;
  fileMimeType: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  issuerId: string;
  issuerName: string;
  issuerOrgId: string;
  issueDate: string;
  expiryDate?: string;
  status: DocumentStatus;
  revocationReason?: string;
  revokedAt?: string;
  publicMetadata: {
    discloseRecipientName: boolean;
    discloseIssueDate: boolean;
    discloseDocumentType: boolean;
    discloseIssuerName: boolean;
    description?: string;
  };
  metadata?: Record<string, string | number>;
  createdAt: string;
  updatedAt: string;
  verifiedCount: number;
  lastVerifiedAt?: string;
  downloadUrl?: string;
}

export type VerificationResultOutcome = 
  | 'integrity_match' 
  | 'integrity_mismatch' 
  | 'pending_manual_review' 
  | 'unable_to_verify' 
  | 'invalid_file';

export interface VerificationRecord {
  id: string;
  documentId?: string;
  verificationId?: string;
  submittedFileHash: string;
  trustedReferenceHash?: string;
  fileName: string;
  fileSize: number;
  result: VerificationResultOutcome;
  verificationMethod: 'file_hash_match' | 'verification_id_lookup' | 'qr_instant_check' | 'manual_review';
  checksPerformed: {
    hashCalculated: boolean;
    referenceLocated: boolean;
    hashMatched: boolean;
    revocationChecked: boolean;
    issuerVerified: boolean;
    expiryChecked: boolean;
  };
  requestingUser?: {
    id: string;
    name: string;
    role: string;
  };
  timestamp: string;
  notes?: string;
  clientIp?: string;
}

export type RequestStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | 'cancelled';

export interface VerificationRequest {
  id: string;
  documentId: string;
  documentTitle: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  targetOrgId: string;
  targetOrgName: string;
  purpose: string;
  status: RequestStatus;
  reviewerNotes?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: Array<{
    status: RequestStatus;
    timestamp: string;
    actor: string;
    note?: string;
  }>;
}

export interface Organization {
  id: string;
  name: string;
  type: 'university' | 'enterprise' | 'government' | 'cert_authority';
  description: string;
  website: string;
  contactEmail: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  supportedCategories: DocumentType[];
  logo: string;
  location: string;
  registeredDate: string;
  issuedCount: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'verification_completed' | 'verification_rejected' | 'request_received' | 'document_revoked' | 'security_alert' | 'document_issued';
  title: string;
  message: string;
  relatedDocId?: string;
  relatedVerificationId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: 
    | 'document_issued'
    | 'document_verified'
    | 'integrity_check_passed'
    | 'integrity_check_failed'
    | 'document_revoked'
    | 'verification_requested'
    | 'verification_approved'
    | 'verification_rejected'
    | 'user_status_changed'
    | 'settings_updated'
    | 'security_alert_triggered';
  targetResource: string;
  targetId?: string;
  result: 'success' | 'warning' | 'failure';
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface SystemSettings {
  maxUploadSizeMB: number;
  allowedExtensions: string[];
  autoVerifyEnabled: boolean;
  requireAdminOrgApproval: boolean;
  tamperProofAuditChaining: boolean;
  publicVerificationDisclosures: {
    showRecipientName: boolean;
    showExactTimestamp: boolean;
    showHashPrefixOnly: boolean;
  };
  retentionDays: number;
}
