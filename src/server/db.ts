import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { 
  VeriDocDocument, 
  VerificationRecord, 
  VerificationRequest, 
  Organization, 
  AuditEvent, 
  User, 
  SystemSettings 
} from '../types';

export const SAMPLE_TEXTS = {
  pristine: [
    "%PDF-1.4",
    "% VeriDox Official Document",
    "DocumentID: VDX-2026-9041-K8",
    "Issuer: Stanford University Department of Registrar",
    "Recipient: Alex Morgan (ID: ST-992144)",
    "Awarded: Bachelor of Science in Computer Science",
    "Graduation: June 15, 2025",
    "Honors: Summa Cum Laude",
    "Official Registrar Seal: Cryptographically Anchored",
    "%%EOF"
  ].join('\n'),

  tampered: [
    "%PDF-1.4",
    "% VeriDox Official Document",
    "DocumentID: VDX-2026-9041-K8",
    "Issuer: Stanford University Department of Registrar",
    "Recipient: Alex Morgan (ID: ST-992144)",
    "Awarded: Bachelor of Science in Computer Science",
    "Graduation: June 15, 2025",
    "Honors: Magna Cum Laude [FORGED TAMPER ATTEMPT]",
    "Official Registrar Seal: Cryptographically Anchored",
    "%%EOF"
  ].join('\n'),

  experience: [
    "%PDF-1.4",
    "% VeriDox Official Document",
    "DocumentID: VDX-2026-3819-M4",
    "Issuer: Google LLC Engineering HR Staffing",
    "Recipient: Alex Morgan (ID: GOOG-88192)",
    "Role: Staff Software Engineer",
    "Tenure: 2022 - 2025",
    "Status: Certified",
    "%%EOF"
  ].join('\n'),

  transcript: [
    "%PDF-1.4",
    "% VeriDox Official Document",
    "DocumentID: VDX-2026-7729-T1",
    "Issuer: Stanford Registrar Office",
    "Student: Alex Morgan",
    "Program: Master of Science",
    "GPA: 3.98",
    "Official Evaluation Ledger Record",
    "%%EOF"
  ].join('\n'),

  revoked: [
    "%PDF-1.4",
    "% VeriDox Official Document",
    "DocumentID: VDX-2025-1102-REV",
    "Issuer: National Education & Accreditation Board",
    "Recipient: Alex Morgan",
    "Credential: Level 3 Cybersecurity Specialist",
    "REVOKED by governing board.",
    "%%EOF"
  ].join('\n'),

  unregistered: [
    "%PDF-1.4",
    "Unregistered applicant resume",
    "Candidate: John Doe",
    "Created: 2026-10-01",
    "%%EOF"
  ].join('\n')
};

export function hashString(str: string): string {
  return crypto.createHash('sha256').update(str).digest('hex');
}

export function hashBuffer(buf: Buffer): string {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

export const EXACT_HASHES = {
  pristine: hashString(SAMPLE_TEXTS.pristine),
  tampered: hashString(SAMPLE_TEXTS.tampered),
  experience: hashString(SAMPLE_TEXTS.experience),
  transcript: hashString(SAMPLE_TEXTS.transcript),
  revoked: hashString(SAMPLE_TEXTS.revoked),
  unregistered: hashString(SAMPLE_TEXTS.unregistered)
};

export const SAMPLE_FILES = {
  pristine: {
    filename: 'Stanford_Degree_Alex_Morgan.pdf',
    verificationId: 'VDX-2026-9041-K8',
    content: SAMPLE_TEXTS.pristine,
    hash: EXACT_HASHES.pristine
  },
  tampered: {
    filename: 'Stanford_Degree_Alex_Morgan_TAMPERED.pdf',
    verificationId: 'VDX-2026-9041-K8',
    content: SAMPLE_TEXTS.tampered,
    hash: EXACT_HASHES.tampered
  },
  experience: {
    filename: 'Google_Experience_Letter_Morgan.pdf',
    verificationId: 'VDX-2026-3819-M4',
    content: SAMPLE_TEXTS.experience,
    hash: EXACT_HASHES.experience
  },
  transcript: {
    filename: 'Stanford_Official_Transcript_Morgan.pdf',
    verificationId: 'VDX-2026-7729-T1',
    content: SAMPLE_TEXTS.transcript,
    hash: EXACT_HASHES.transcript
  },
  revoked: {
    filename: 'Cloud_Security_Cert_Revoked.pdf',
    verificationId: 'VDX-2025-1102-REV',
    content: SAMPLE_TEXTS.revoked,
    hash: EXACT_HASHES.revoked
  },
  unregistered: {
    filename: 'Random_Unregistered_Resume.pdf',
    verificationId: 'NONE',
    content: SAMPLE_TEXTS.unregistered,
    hash: EXACT_HASHES.unregistered
  }
};

interface DatabaseSchema {
  documents: VeriDocDocument[];
  records: VerificationRecord[];
  requests: VerificationRequest[];
  organizations: Organization[];
  audit: AuditEvent[];
  users: User[];
  settings: SystemSettings;
}

class Database {
  private data: DatabaseSchema;
  private dbPath: string;

  constructor() {
    this.dbPath = path.resolve(process.cwd(), 'data', 'veridox_db.json');
    this.data = this.loadOrSeed();
  }

  private loadOrSeed(): DatabaseSchema {
    try {
      if (fs.existsSync(this.dbPath)) {
        const raw = fs.readFileSync(this.dbPath, 'utf8');
        const parsed = JSON.parse(raw);
        // Ensure pristine hash is up-to-date
        const doc1 = parsed.documents?.find((d: any) => d.id === 'doc_1_degree');
        if (doc1 && doc1.fileHash !== EXACT_HASHES.pristine) {
          doc1.fileHash = EXACT_HASHES.pristine;
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to read db file, initializing with seed data:', e);
    }
    const seed = this.generateSeed();
    this.saveToDisk(seed);
    return seed;
  }

  private saveToDisk(data: DatabaseSchema) {
    try {
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      console.warn('Failed to write db file to disk:', e);
    }
  }

  private persist() {
    this.saveToDisk(this.data);
  }

  public generateSeed(): DatabaseSchema {
    const documents: VeriDocDocument[] = [
      {
        id: 'doc_1_degree',
        verificationId: 'VDX-2026-9041-K8',
        title: 'Bachelor of Science in Computer Science - Alex Morgan',
        type: 'degree_certificate',
        fileHash: EXACT_HASHES.pristine,
        fileSize: Buffer.byteLength(SAMPLE_TEXTS.pristine),
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
        fileHash: EXACT_HASHES.experience,
        fileSize: Buffer.byteLength(SAMPLE_TEXTS.experience),
        fileName: 'Google_Experience_Letter_Morgan.pdf',
        fileMimeType: 'application/pdf',
        ownerId: 'usr_individual_1',
        ownerName: 'Alex Morgan',
        ownerEmail: 'alex.morgan@stanford.alumni.edu',
        issuerId: 'usr_issuer_1',
        issuerName: 'Google LLC Engineering HR',
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
        fileHash: EXACT_HASHES.revoked,
        fileSize: Buffer.byteLength(SAMPLE_TEXTS.revoked),
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
        fileHash: EXACT_HASHES.transcript,
        fileSize: Buffer.byteLength(SAMPLE_TEXTS.transcript),
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

    const records: VerificationRecord[] = [
      {
        id: 'vr_rec_101',
        documentId: 'doc_1_degree',
        verificationId: 'VDX-2026-9041-K8',
        submittedFileHash: EXACT_HASHES.pristine,
        trustedReferenceHash: EXACT_HASHES.pristine,
        fileName: 'Stanford_Degree_Alex_Morgan.pdf',
        fileSize: Buffer.byteLength(SAMPLE_TEXTS.pristine),
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
        submittedFileHash: EXACT_HASHES.tampered,
        trustedReferenceHash: EXACT_HASHES.pristine,
        fileName: 'Stanford_Degree_Alex_Morgan_TAMPERED.pdf',
        fileSize: Buffer.byteLength(SAMPLE_TEXTS.tampered),
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
        notes: 'CRITICAL MISMATCH: Uploaded file bitstream differed from official registered hash. Forged honors text detected.'
      }
    ];

    const organizations: Organization[] = [
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

    const users: User[] = [
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

    const requests: VerificationRequest[] = [
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
      }
    ];

    const audit: AuditEvent[] = [
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
          hashPrefix: EXACT_HASHES.pristine.slice(0, 8),
          matchScore: 1.0
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
          uploadedHash: EXACT_HASHES.tampered.slice(0, 8),
          referenceHash: EXACT_HASHES.pristine.slice(0, 8)
        }
      }
    ];

    const settings: SystemSettings = {
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

    return {
      documents,
      records,
      requests,
      organizations,
      audit,
      users,
      settings
    };
  }

  // Database Accessors
  public getDocuments(): VeriDocDocument[] {
    return this.data.documents;
  }

  public getDocumentById(id: string): VeriDocDocument | undefined {
    return this.data.documents.find(d => d.id === id);
  }

  public getDocumentByVerificationId(vId: string): VeriDocDocument | undefined {
    const normalized = vId.trim().toUpperCase();
    return this.data.documents.find(d => d.verificationId.toUpperCase() === normalized);
  }

  public getDocumentByHash(hash: string): VeriDocDocument | undefined {
    const normalized = hash.trim().toLowerCase();
    return this.data.documents.find(d => d.fileHash.toLowerCase() === normalized);
  }

  public addDocument(doc: VeriDocDocument): void {
    this.data.documents.unshift(doc);
    this.persist();
  }

  public updateDocument(id: string, updates: Partial<VeriDocDocument>): VeriDocDocument {
    const idx = this.data.documents.findIndex(d => d.id === id);
    if (idx === -1) throw new Error('Document not found');
    this.data.documents[idx] = { ...this.data.documents[idx], ...updates, updatedAt: new Date().toISOString() };
    this.persist();
    return this.data.documents[idx];
  }

  public revokeDocument(id: string, reason: string, actor: { id: string; name: string; role: any }): VeriDocDocument {
    const doc = this.getDocumentById(id);
    if (!doc) throw new Error('Document not found');
    const updated = this.updateDocument(id, {
      status: 'revoked',
      revocationReason: reason,
      revokedAt: new Date().toISOString()
    });
    this.addAudit({
      actorId: actor.id,
      actorName: actor.name,
      actorRole: actor.role,
      action: 'document_revoked',
      targetResource: `Document: ${doc.verificationId}`,
      targetId: doc.id,
      result: 'warning',
      timestamp: new Date().toISOString(),
      metadata: { reason }
    });
    return updated;
  }

  public getRecords(): VerificationRecord[] {
    return this.data.records;
  }

  public addRecord(record: VerificationRecord): void {
    this.data.records.unshift(record);
    this.persist();
  }

  public getRequests(): VerificationRequest[] {
    return this.data.requests;
  }

  public addRequest(req: VerificationRequest): void {
    this.data.requests.unshift(req);
    this.persist();
  }

  public updateRequest(id: string, updates: Partial<VerificationRequest>): VerificationRequest {
    const idx = this.data.requests.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Request not found');
    this.data.requests[idx] = { ...this.data.requests[idx], ...updates, updatedAt: new Date().toISOString() };
    this.persist();
    return this.data.requests[idx];
  }

  public getOrganizations(): Organization[] {
    return this.data.organizations;
  }

  public addOrganization(org: Organization): void {
    this.data.organizations.unshift(org);
    this.persist();
  }

  public updateOrganization(id: string, status: any): Organization {
    const idx = this.data.organizations.findIndex(o => o.id === id);
    if (idx === -1) throw new Error('Organization not found');
    this.data.organizations[idx].verificationStatus = status;
    this.persist();
    return this.data.organizations[idx];
  }

  public getAudit(): AuditEvent[] {
    return this.data.audit;
  }

  public addAudit(event: Omit<AuditEvent, 'id'>): AuditEvent {
    const newEvent: AuditEvent = {
      ...event,
      id: `aud_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    };
    this.data.audit.unshift(newEvent);
    this.persist();
    return newEvent;
  }

  public getUsers(): User[] {
    return this.data.users;
  }

  public updateUser(id: string, updates: Partial<User>): User {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) throw new Error('User not found');
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.persist();
    return this.data.users[idx];
  }

  public getSettings(): SystemSettings {
    return this.data.settings;
  }

  public updateSettings(settings: Partial<SystemSettings>): SystemSettings {
    this.data.settings = { ...this.data.settings, ...settings };
    this.persist();
    return this.data.settings;
  }

  public reset(): DatabaseSchema {
    this.data = this.generateSeed();
    this.persist();
    return this.data;
  }
}

export const db = new Database();
