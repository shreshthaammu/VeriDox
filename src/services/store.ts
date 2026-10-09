import { 
  User, 
  VeriDocDocument, 
  VerificationRecord, 
  VerificationRequest, 
  Organization, 
  Notification, 
  AuditEvent, 
  SystemSettings 
} from '../types';

import { DETERMINISTIC_HASHES } from './crypto';

const STORAGE_KEYS = {
  USERS: 'veridox_users',
  CURRENT_USER: 'veridox_current_user',
  DOCUMENTS: 'veridox_documents',
  VERIFICATION_RECORDS: 'veridox_verification_records',
  VERIFICATION_REQUESTS: 'veridox_verification_requests',
  ORGANIZATIONS: 'veridox_organizations',
  NOTIFICATIONS: 'veridox_notifications',
  AUDIT_EVENTS: 'veridox_audit_events',
  SYSTEM_SETTINGS: 'veridox_system_settings',
};

// Seed demo users
export const DEMO_USERS: User[] = [
  {
    id: 'usr_individual_1',
    name: 'Alex Morgan',
    email: 'alex.morgan@stanford.alumni.edu',
    role: 'individual',
    title: 'Senior Software Engineer Candidate',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'BS in Computer Science (Summa Cum Laude). Actively sharing verified credentials with prospective employers.',
    createdAt: '2024-08-12T10:00:00Z',
    verifiedStatus: 'verified',
    documentCount: 4,
    preferences: {
      theme: 'light',
      emailAlerts: true,
      verificationNotifications: true,
      auditLogDigest: 'instant',
      twoFactorEnabled: true,
    }
  },
  {
    id: 'usr_issuer_1',
    name: 'Dr. Eleanor Vance',
    email: 'e.vance@stanford.edu',
    role: 'issuer',
    title: 'University Registrar & Academic Integrity Dean',
    organizationId: 'org_stanford',
    organizationName: 'Stanford University',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Authorized issuer for academic degrees, transcripts, and faculty appointments at Stanford University.',
    createdAt: '2023-01-15T09:30:00Z',
    verifiedStatus: 'verified',
    documentCount: 1420,
    preferences: {
      theme: 'light',
      emailAlerts: true,
      verificationNotifications: true,
      auditLogDigest: 'instant',
      twoFactorEnabled: true,
    }
  },
  {
    id: 'usr_reviewer_1',
    name: 'Marcus Sterling',
    email: 'm.sterling@certreview.org',
    role: 'reviewer',
    title: 'Senior Forensic Credential Auditor',
    organizationId: 'org_gov_auth',
    organizationName: 'Ministry of Education & Accreditation',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Independent verification specialist handling manual integrity audits and organizational accreditations.',
    createdAt: '2023-05-20T14:15:00Z',
    verifiedStatus: 'verified',
    documentCount: 88,
    preferences: {
      theme: 'light',
      emailAlerts: true,
      verificationNotifications: true,
      auditLogDigest: 'daily',
      twoFactorEnabled: true,
    }
  },
  {
    id: 'usr_admin_1',
    name: 'Sarah Chen',
    email: 'sarah.chen@veridox.security',
    role: 'admin',
    title: 'Chief Compliance & Platform Security Officer',
    organizationId: 'org_veridox_hq',
    organizationName: 'VeriDox Platform Governance',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    bio: 'Platform super-administrator managing system rules, organization vetting, and cryptographic trust anchors.',
    createdAt: '2022-11-01T08:00:00Z',
    verifiedStatus: 'verified',
    documentCount: 3840,
    preferences: {
      theme: 'light',
      emailAlerts: true,
      verificationNotifications: true,
      auditLogDigest: 'instant',
      twoFactorEnabled: true,
    }
  }
];

export const DEMO_ORGANIZATIONS: Organization[] = [
  {
    id: 'org_stanford',
    name: 'Stanford University',
    type: 'university',
    description: 'Premier research university in California, issuing cryptographically signed degree certificates and academic transcripts.',
    website: 'https://stanford.edu',
    contactEmail: 'registrar-trust@stanford.edu',
    verificationStatus: 'verified',
    supportedCategories: ['degree_certificate', 'transcript'],
    logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=120&auto=format&fit=crop&q=80',
    location: 'Stanford, CA, USA',
    registeredDate: '2023-01-10T00:00:00Z',
    issuedCount: 1420
  },
  {
    id: 'org_google',
    name: 'Google LLC - Engineering HR',
    type: 'enterprise',
    description: 'Global technology leader verifying employee experience letters, patents, and engineering credentials.',
    website: 'https://google.com',
    contactEmail: 'verifications@google.corp',
    verificationStatus: 'verified',
    supportedCategories: ['experience_letter', 'training_credential'],
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
    location: 'Mountain View, CA, USA',
    registeredDate: '2023-03-14T00:00:00Z',
    issuedCount: 890
  },
  {
    id: 'org_gov_auth',
    name: 'National Education & Accreditation Board',
    type: 'government',
    description: 'Federal accreditation authority maintaining cryptographic registers for licensed institutions and official licenses.',
    website: 'https://accreditation.gov',
    contactEmail: 'audit@accreditation.gov',
    verificationStatus: 'verified',
    supportedCategories: ['license', 'identity_document', 'degree_certificate'],
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80',
    location: 'Washington, DC, USA',
    registeredDate: '2022-11-15T00:00:00Z',
    issuedCount: 3120
  },
  {
    id: 'org_apex_health',
    name: 'Apex Global Medical Certifications',
    type: 'cert_authority',
    description: 'Specialist medical compliance credentialing body pending board re-certification review for 2026.',
    website: 'https://apexhealthcerts.org',
    contactEmail: 'compliance@apexhealthcerts.org',
    verificationStatus: 'pending',
    supportedCategories: ['medical_report', 'license'],
    logo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=120&auto=format&fit=crop&q=80',
    location: 'Boston, MA, USA',
    registeredDate: '2026-02-01T00:00:00Z',
    issuedCount: 45
  }
];

export const DEMO_DOCUMENTS: VeriDocDocument[] = [
  {
    id: 'doc_1_degree',
    verificationId: 'VDX-2026-9041-K8',
    title: 'Bachelor of Science in Computer Science - Alex Morgan',
    type: 'degree_certificate',
    fileHash: DETERMINISTIC_HASHES.pristine,
    fileSize: 368400,
    fileName: 'Stanford_Degree_Alex_Morgan.pdf',
    fileMimeType: 'application/pdf',
    ownerId: 'usr_individual_1',
    ownerName: 'Alex Morgan',
    ownerEmail: 'alex.morgan@stanford.alumni.edu',
    issuerId: 'usr_issuer_1',
    issuerName: 'Dr. Eleanor Vance (Stanford Registrar)',
    issuerOrgId: 'org_stanford',
    issueDate: '2025-06-15T00:00:00Z',
    status: 'valid',
    publicMetadata: {
      discloseRecipientName: true,
      discloseIssueDate: true,
      discloseDocumentType: true,
      discloseIssuerName: true,
      description: 'Official degree conferred by Stanford School of Engineering with Summa Cum Laude honors.'
    },
    metadata: {
      major: 'Computer Science',
      gpa: '3.98',
      honors: 'Summa Cum Laude',
      studentId: 'ST-992144'
    },
    createdAt: '2025-06-16T12:00:00Z',
    updatedAt: '2026-03-01T08:30:00Z',
    verifiedCount: 14,
    lastVerifiedAt: '2026-10-08T15:20:00Z'
  },
  {
    id: 'doc_2_experience',
    verificationId: 'VDX-2026-3819-M4',
    title: 'Staff Software Engineer Experience Letter - Alex Morgan',
    type: 'experience_letter',
    fileHash: DETERMINISTIC_HASHES.experience,
    fileSize: 182300,
    fileName: 'Google_Experience_Letter_Morgan.pdf',
    fileMimeType: 'application/pdf',
    ownerId: 'usr_individual_1',
    ownerName: 'Alex Morgan',
    ownerEmail: 'alex.morgan@stanford.alumni.edu',
    issuerId: 'usr_issuer_1',
    issuerName: 'Google HR Staffing',
    issuerOrgId: 'org_google',
    issueDate: '2025-08-30T00:00:00Z',
    status: 'valid',
    publicMetadata: {
      discloseRecipientName: true,
      discloseIssueDate: true,
      discloseDocumentType: true,
      discloseIssuerName: true,
      description: 'Tenure verification for 3 years service on Google Distributed Systems core team.'
    },
    metadata: {
      department: 'Cloud Infrastructure',
      role: 'Staff Software Engineer',
      employeeId: 'GOOG-88192'
    },
    createdAt: '2025-09-01T10:00:00Z',
    updatedAt: '2026-01-12T11:00:00Z',
    verifiedCount: 8,
    lastVerifiedAt: '2026-09-22T09:15:00Z'
  },
  {
    id: 'doc_3_revoked',
    verificationId: 'VDX-2025-1102-REV',
    title: 'Temporary Cloud Security Credential (REVOKED)',
    type: 'training_credential',
    fileHash: DETERMINISTIC_HASHES.revoked,
    fileSize: 245000,
    fileName: 'Cloud_Security_Cert_Revoked.pdf',
    fileMimeType: 'application/pdf',
    ownerId: 'usr_individual_1',
    ownerName: 'Alex Morgan',
    ownerEmail: 'alex.morgan@stanford.alumni.edu',
    issuerId: 'usr_issuer_1',
    issuerName: 'National Education & Accreditation Board',
    issuerOrgId: 'org_gov_auth',
    issueDate: '2024-01-10T00:00:00Z',
    status: 'revoked',
    revocationReason: 'Superseded by updated 2026 National Cybersecurity Framework credential standard.',
    revokedAt: '2025-12-01T10:00:00Z',
    publicMetadata: {
      discloseRecipientName: true,
      discloseIssueDate: true,
      discloseDocumentType: true,
      discloseIssuerName: true,
      description: 'Revoked credential. Please request replacement credential from governing board.'
    },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z',
    verifiedCount: 29,
    lastVerifiedAt: '2026-08-14T11:45:00Z'
  },
  {
    id: 'doc_4_transcript',
    verificationId: 'VDX-2026-7729-T1',
    title: 'Official Academic Transcript (Master of Science) - In Review',
    type: 'transcript',
    fileHash: DETERMINISTIC_HASHES.transcript,
    fileSize: 512000,
    fileName: 'Stanford_Official_Transcript_Morgan.pdf',
    fileMimeType: 'application/pdf',
    ownerId: 'usr_individual_1',
    ownerName: 'Alex Morgan',
    ownerEmail: 'alex.morgan@stanford.alumni.edu',
    issuerId: 'usr_issuer_1',
    issuerName: 'Stanford Registrar Office',
    issuerOrgId: 'org_stanford',
    issueDate: '2026-01-20T00:00:00Z',
    status: 'under_review',
    publicMetadata: {
      discloseRecipientName: true,
      discloseIssueDate: false,
      discloseDocumentType: true,
      discloseIssuerName: true,
      description: 'Transcript document currently submitted for cross-border equivalency evaluation.'
    },
    createdAt: '2026-01-22T08:00:00Z',
    updatedAt: '2026-02-10T14:30:00Z',
    verifiedCount: 3,
    lastVerifiedAt: '2026-02-10T14:30:00Z'
  }
];

export const DEMO_VERIFICATION_RECORDS: VerificationRecord[] = [
  {
    id: 'vr_rec_101',
    documentId: 'doc_1_degree',
    verificationId: 'VDX-2026-9041-K8',
    submittedFileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    trustedReferenceHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    fileName: 'Stanford_Degree_Alex_Morgan.pdf',
    fileSize: 368400,
    result: 'integrity_match',
    verificationMethod: 'file_hash_match',
    checksPerformed: {
      hashCalculated: true,
      referenceLocated: true,
      hashMatched: true,
      revocationChecked: true,
      issuerVerified: true,
      expiryChecked: true
    },
    requestingUser: {
      id: 'usr_individual_1',
      name: 'Alex Morgan',
      role: 'individual'
    },
    timestamp: '2026-10-08T15:20:00Z',
    notes: 'Cryptographic SHA-256 fingerprint verified against registered Stanford University trust anchor.'
  },
  {
    id: 'vr_rec_102',
    documentId: 'doc_1_degree',
    verificationId: 'VDX-2026-9041-K8',
    submittedFileHash: 'b4a15c328901239920192eab0981928374619283019283746192830192830192',
    trustedReferenceHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    fileName: 'Stanford_Degree_Alex_Morgan_TAMPERED.pdf',
    fileSize: 369100,
    result: 'integrity_mismatch',
    verificationMethod: 'file_hash_match',
    checksPerformed: {
      hashCalculated: true,
      referenceLocated: true,
      hashMatched: false,
      revocationChecked: true,
      issuerVerified: true,
      expiryChecked: true
    },
    requestingUser: {
      id: 'usr_reviewer_1',
      name: 'Marcus Sterling',
      role: 'reviewer'
    },
    timestamp: '2026-10-07T11:05:00Z',
    notes: 'CRITICAL MISMATCH: Uploaded file bitstream differed from official registered hash. Honors text altered.'
  },
  {
    id: 'vr_rec_103',
    documentId: 'doc_3_revoked',
    verificationId: 'VDX-2025-1102-REV',
    submittedFileHash: '4a44dc15364204a80fe80e9039455cc1608281820fe2b24f1e5233ade6af1dd5',
    trustedReferenceHash: '4a44dc15364204a80fe80e9039455cc1608281820fe2b24f1e5233ade6af1dd5',
    fileName: 'Cloud_Security_Cert_Revoked.pdf',
    fileSize: 245000,
    result: 'integrity_match',
    verificationMethod: 'verification_id_lookup',
    checksPerformed: {
      hashCalculated: true,
      referenceLocated: true,
      hashMatched: true,
      revocationChecked: false, // Flagged revoked!
      issuerVerified: true,
      expiryChecked: true
    },
    timestamp: '2026-09-30T16:40:00Z',
    notes: 'File hash matches registered record, but certificate was marked REVOKED by the issuer on Dec 1, 2025.'
  },
  {
    id: 'vr_rec_104',
    submittedFileHash: '8910293847561029384756102938475610293847561029384756102938475610',
    fileName: 'Unknown_Foreign_Diploma.pdf',
    fileSize: 420000,
    result: 'unable_to_verify',
    verificationMethod: 'file_hash_match',
    checksPerformed: {
      hashCalculated: true,
      referenceLocated: false,
      hashMatched: false,
      revocationChecked: false,
      issuerVerified: false,
      expiryChecked: false
    },
    timestamp: '2026-09-18T10:12:00Z',
    notes: 'No matching reference hash located in VeriDox Registry. Document has not been registered by an approved issuer.'
  }
];

export const DEMO_VERIFICATION_REQUESTS: VerificationRequest[] = [
  {
    id: 'req_881',
    documentId: 'doc_4_transcript',
    documentTitle: 'Official Academic Transcript (Master of Science) - In Review',
    requesterId: 'usr_individual_1',
    requesterName: 'Alex Morgan',
    requesterEmail: 'alex.morgan@stanford.alumni.edu',
    targetOrgId: 'org_gov_auth',
    targetOrgName: 'National Education & Accreditation Board',
    purpose: 'Employment credential compliance check for European Union technical visa application.',
    status: 'in_review',
    reviewerNotes: 'Reviewer Marcus Sterling has requested certified translation seal verification.',
    createdAt: '2026-10-01T09:00:00Z',
    updatedAt: '2026-10-04T14:00:00Z',
    statusHistory: [
      {
        status: 'pending',
        timestamp: '2026-10-01T09:00:00Z',
        actor: 'Alex Morgan',
        note: 'Submitted verification request with attached digital transcript.'
      },
      {
        status: 'in_review',
        timestamp: '2026-10-04T14:00:00Z',
        actor: 'Marcus Sterling',
        note: 'Assigned to forensic evaluation queue. Hash verified, verifying registrar digital seal.'
      }
    ]
  },
  {
    id: 'req_882',
    documentId: 'doc_2_experience',
    documentTitle: 'Staff Software Engineer Experience Letter - Alex Morgan',
    requesterId: 'usr_individual_1',
    requesterName: 'Alex Morgan',
    requesterEmail: 'alex.morgan@stanford.alumni.edu',
    targetOrgId: 'org_google',
    targetOrgName: 'Google LLC - Engineering HR',
    purpose: 'Background check verification for principal architect role.',
    status: 'approved',
    reviewerNotes: 'HR employment records fully confirmed. Cryptographic seal verified.',
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-09-16T11:20:00Z',
    statusHistory: [
      {
        status: 'pending',
        timestamp: '2026-09-15T10:00:00Z',
        actor: 'Alex Morgan'
      },
      {
        status: 'approved',
        timestamp: '2026-09-16T11:20:00Z',
        actor: 'Google Staffing Compliance',
        note: 'Record matches corporate HR ledger.'
      }
    ]
  }
];

export const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_1',
    userId: 'usr_individual_1',
    type: 'verification_completed',
    title: 'Verification Complete: Stanford Degree',
    message: 'Your Bachelor of Science degree (VDX-2026-9041-K8) was verified successfully with 100% cryptographic SHA-256 integrity match.',
    relatedDocId: 'doc_1_degree',
    relatedVerificationId: 'VDX-2026-9041-K8',
    isRead: false,
    createdAt: '2026-10-08T15:21:00Z'
  },
  {
    id: 'notif_2',
    userId: 'usr_individual_1',
    type: 'security_alert',
    title: 'Integrity Check Warning Flagged',
    message: 'An integrity check for Stanford Degree with a modified file returned an INTEGRITY MISMATCH flag. Audit logged.',
    relatedDocId: 'doc_1_degree',
    isRead: false,
    createdAt: '2026-10-07T11:06:00Z'
  },
  {
    id: 'notif_3',
    userId: 'usr_individual_1',
    type: 'document_issued',
    title: 'New Official Document Registered',
    message: 'Stanford University Registrar issued your Official Academic Transcript and anchored its reference fingerprint.',
    relatedDocId: 'doc_4_transcript',
    isRead: true,
    createdAt: '2026-01-22T08:00:00Z'
  }
];

export const DEMO_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'aud_901',
    actorId: 'usr_individual_1',
    actorName: 'Alex Morgan',
    actorRole: 'individual',
    action: 'integrity_check_passed',
    targetResource: 'Document: VDX-2026-9041-K8',
    targetId: 'doc_1_degree',
    result: 'success',
    timestamp: '2026-10-08T15:20:00Z',
    metadata: {
      method: 'SHA-256 Comparison',
      hashPrefix: 'e3b0c442...',
      matchScore: '1.0'
    }
  },
  {
    id: 'aud_902',
    actorId: 'usr_reviewer_1',
    actorName: 'Marcus Sterling',
    actorRole: 'reviewer',
    action: 'integrity_check_failed',
    targetResource: 'Document: VDX-2026-9041-K8',
    targetId: 'doc_1_degree',
    result: 'failure',
    timestamp: '2026-10-07T11:05:00Z',
    metadata: {
      reason: 'Bitstream divergence detected',
      uploadedHash: 'b4a15c32...',
      referenceHash: 'e3b0c442...'
    }
  },
  {
    id: 'aud_903',
    actorId: 'usr_issuer_1',
    actorName: 'Dr. Eleanor Vance',
    actorRole: 'issuer',
    action: 'document_issued',
    targetResource: 'Document: VDX-2026-7729-T1',
    targetId: 'doc_4_transcript',
    result: 'success',
    timestamp: '2026-01-22T08:00:00Z',
    metadata: {
      issuerOrg: 'Stanford University',
      recipient: 'alex.morgan@stanford.alumni.edu',
      category: 'transcript'
    }
  },
  {
    id: 'aud_904',
    actorId: 'usr_admin_1',
    actorName: 'Sarah Chen',
    actorRole: 'admin',
    action: 'document_revoked',
    targetResource: 'Document: VDX-2025-1102-REV',
    targetId: 'doc_3_revoked',
    result: 'warning',
    timestamp: '2025-12-01T10:00:00Z',
    metadata: {
      reason: 'Superseded by updated 2026 framework'
    }
  },
  {
    id: 'aud_905',
    actorId: 'usr_admin_1',
    actorName: 'Sarah Chen',
    actorRole: 'admin',
    action: 'settings_updated',
    targetResource: 'System Security Configuration',
    result: 'success',
    timestamp: '2025-11-15T09:00:00Z',
    metadata: {
      settingChanged: 'tamperProofAuditChaining',
      status: true
    }
  }
];

export const DEMO_SYSTEM_SETTINGS: SystemSettings = {
  maxUploadSizeMB: 25,
  allowedExtensions: ['.pdf', '.png', '.jpg', '.jpeg', '.docx', '.json'],
  autoVerifyEnabled: true,
  requireAdminOrgApproval: true,
  tamperProofAuditChaining: true,
  publicVerificationDisclosures: {
    showRecipientName: true,
    showExactTimestamp: true,
    showHashPrefixOnly: false
  },
  retentionDays: 730
};

// Store Helper class
class StorageService {
  private getItem<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data);
    } catch {
      return fallback;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  // Current User
  getCurrentUser(): User {
    const stored = this.getItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (stored) return stored;
    // Default to Alex Morgan (individual) with seamless 1-click role switching
    this.setCurrentUser(DEMO_USERS[0]);
    return DEMO_USERS[0];
  }

  setCurrentUser(user: User): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER, user);
    // Also update in users list if present
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
      this.setItem(STORAGE_KEYS.USERS, users);
    }
  }

  getUsers(): User[] {
    return this.getItem<User[]>(STORAGE_KEYS.USERS, DEMO_USERS);
  }

  updateUser(id: string, updates: Partial<User>): User {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      this.setItem(STORAGE_KEYS.USERS, users);
      const currentUser = this.getCurrentUser();
      if (currentUser.id === id) {
        this.setItem(STORAGE_KEYS.CURRENT_USER, users[idx]);
      }
      return users[idx];
    }
    throw new Error('User not found');
  }

  // Documents
  getDocuments(): VeriDocDocument[] {
    const docs = this.getItem<VeriDocDocument[]>(STORAGE_KEYS.DOCUMENTS, DEMO_DOCUMENTS);
    const doc1 = docs.find(d => d.id === 'doc_1_degree');
    if (doc1 && (doc1.fileHash.startsWith('e3b0c44') || doc1.fileHash !== DETERMINISTIC_HASHES.pristine)) {
      doc1.fileHash = DETERMINISTIC_HASHES.pristine;
      this.setItem(STORAGE_KEYS.DOCUMENTS, docs);
    }
    return docs;
  }

  getDocumentById(id: string): VeriDocDocument | undefined {
    return this.getDocuments().find(d => d.id === id);
  }

  getDocumentByVerificationId(vId: string): VeriDocDocument | undefined {
    const normalized = vId.trim().toUpperCase();
    return this.getDocuments().find(d => d.verificationId.toUpperCase() === normalized);
  }

  getDocumentByHash(hash: string): VeriDocDocument | undefined {
    const normalized = hash.trim().toLowerCase();
    return this.getDocuments().find(d => d.fileHash.toLowerCase() === normalized);
  }

  saveDocument(doc: VeriDocDocument): void {
    const docs = this.getDocuments();
    const idx = docs.findIndex(d => d.id === doc.id);
    if (idx >= 0) {
      docs[idx] = doc;
    } else {
      docs.unshift(doc);
    }
    this.setItem(STORAGE_KEYS.DOCUMENTS, docs);
  }

  revokeDocument(id: string, reason: string): VeriDocDocument {
    const doc = this.getDocumentById(id);
    if (!doc) throw new Error('Document not found');
    const updated: VeriDocDocument = {
      ...doc,
      status: 'revoked',
      revocationReason: reason,
      revokedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.saveDocument(updated);

    // Audit event
    this.addAuditEvent({
      actorId: this.getCurrentUser().id,
      actorName: this.getCurrentUser().name,
      actorRole: this.getCurrentUser().role,
      action: 'document_revoked',
      targetResource: `Document: ${doc.verificationId}`,
      targetId: doc.id,
      result: 'warning',
      timestamp: new Date().toISOString(),
      metadata: { reason }
    });

    return updated;
  }

  deleteDocument(id: string): void {
    const docs = this.getDocuments().filter(d => d.id !== id);
    this.setItem(STORAGE_KEYS.DOCUMENTS, docs);
  }

  // Verification Records
  getVerificationRecords(): VerificationRecord[] {
    return this.getItem<VerificationRecord[]>(STORAGE_KEYS.VERIFICATION_RECORDS, DEMO_VERIFICATION_RECORDS);
  }

  addVerificationRecord(record: VerificationRecord): void {
    const records = this.getVerificationRecords();
    records.unshift(record);
    this.setItem(STORAGE_KEYS.VERIFICATION_RECORDS, records);
  }

  // Verification Requests
  getVerificationRequests(): VerificationRequest[] {
    return this.getItem<VerificationRequest[]>(STORAGE_KEYS.VERIFICATION_REQUESTS, DEMO_VERIFICATION_REQUESTS);
  }

  addVerificationRequest(req: VerificationRequest): void {
    const reqs = this.getVerificationRequests();
    reqs.unshift(req);
    this.setItem(STORAGE_KEYS.VERIFICATION_REQUESTS, reqs);
  }

  updateVerificationRequest(id: string, updates: Partial<VerificationRequest>): VerificationRequest {
    const reqs = this.getVerificationRequests();
    const idx = reqs.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Request not found');
    reqs[idx] = { ...reqs[idx], ...updates, updatedAt: new Date().toISOString() };
    this.setItem(STORAGE_KEYS.VERIFICATION_REQUESTS, reqs);
    return reqs[idx];
  }

  // Organizations
  getOrganizations(): Organization[] {
    return this.getItem<Organization[]>(STORAGE_KEYS.ORGANIZATIONS, DEMO_ORGANIZATIONS);
  }

  updateOrganizationStatus(id: string, status: 'verified' | 'pending' | 'rejected'): Organization {
    const orgs = this.getOrganizations();
    const idx = orgs.findIndex(o => o.id === id);
    if (idx === -1) throw new Error('Organization not found');
    orgs[idx].verificationStatus = status;
    this.setItem(STORAGE_KEYS.ORGANIZATIONS, orgs);
    return orgs[idx];
  }

  // Notifications
  getNotifications(userId?: string): Notification[] {
    const notifs = this.getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, DEMO_NOTIFICATIONS);
    if (!userId) return notifs;
    return notifs.filter(n => n.userId === userId);
  }

  markNotificationRead(id: string): void {
    const notifs = this.getNotifications();
    const idx = notifs.findIndex(n => n.id === id);
    if (idx !== -1) {
      notifs[idx].isRead = true;
      this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
    }
  }

  markAllNotificationsRead(userId: string): void {
    const notifs = this.getNotifications();
    notifs.forEach(n => {
      if (n.userId === userId) n.isRead = true;
    });
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }

  // Audit Events
  getAuditEvents(): AuditEvent[] {
    return this.getItem<AuditEvent[]>(STORAGE_KEYS.AUDIT_EVENTS, DEMO_AUDIT_EVENTS);
  }

  addAuditEvent(event: Omit<AuditEvent, 'id'>): void {
    const events = this.getAuditEvents();
    const newEvent: AuditEvent = {
      ...event,
      id: `aud_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    };
    events.unshift(newEvent);
    this.setItem(STORAGE_KEYS.AUDIT_EVENTS, events);
  }

  // System Settings
  getSystemSettings(): SystemSettings {
    return this.getItem<SystemSettings>(STORAGE_KEYS.SYSTEM_SETTINGS, DEMO_SYSTEM_SETTINGS);
  }

  updateSystemSettings(settings: Partial<SystemSettings>): SystemSettings {
    const current = this.getSystemSettings();
    const updated = { ...current, ...settings };
    this.setItem(STORAGE_KEYS.SYSTEM_SETTINGS, updated);
    return updated;
  }

  // Reset to initial demo state
  resetToDemo(): void {
    localStorage.clear();
    this.setItem(STORAGE_KEYS.USERS, DEMO_USERS);
    this.setItem(STORAGE_KEYS.CURRENT_USER, DEMO_USERS[0]);
    this.setItem(STORAGE_KEYS.DOCUMENTS, DEMO_DOCUMENTS);
    this.setItem(STORAGE_KEYS.VERIFICATION_RECORDS, DEMO_VERIFICATION_RECORDS);
    this.setItem(STORAGE_KEYS.VERIFICATION_REQUESTS, DEMO_VERIFICATION_REQUESTS);
    this.setItem(STORAGE_KEYS.ORGANIZATIONS, DEMO_ORGANIZATIONS);
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, DEMO_NOTIFICATIONS);
    this.setItem(STORAGE_KEYS.AUDIT_EVENTS, DEMO_AUDIT_EVENTS);
    this.setItem(STORAGE_KEYS.SYSTEM_SETTINGS, DEMO_SYSTEM_SETTINGS);
  }
}

export const store = new StorageService();
