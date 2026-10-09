/**
 * Cryptographic utility functions for VeriDox
 * Uses standard Web Crypto API (SHA-256)
 */

export const EXACT_SAMPLE_TEXTS = {
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

export const DETERMINISTIC_HASHES = {
  pristine: '558309e2048da90e19378af35257791b36fc0ccaa85c285af848325233efaf3c',
  tampered: 'b293916c8b6ffe2864a5e1d424229003c079bc4cb7a336340732247a0e40a6f5',
  experience: 'b5507199734d61cac644fdad41518c01c7cef9afb1c49f7b3c2031b3651bc2d4',
  transcript: 'df07e28f1f4e0ee7e57d1aa92d76dc70e1e8a43a68666c2004390e445224c730',
  revoked: '769eac0edf495902bbc85ea86ecc858a9320c147a9420d32ebe37bd712443ff2'
};

export async function calculateArrayBufferHash(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export async function calculateFileHash(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  return calculateArrayBufferHash(arrayBuffer);
}

export async function calculateTextHash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  return calculateArrayBufferHash(data.buffer);
}

export function formatHash(hash: string, truncate: boolean = false): string {
  if (!hash) return '';
  if (truncate && hash.length > 16) {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  }
  return hash;
}

export function compareHashes(hashA: string, hashB: string): boolean {
  if (!hashA || !hashB) return false;
  return hashA.trim().toLowerCase() === hashB.trim().toLowerCase();
}

export function generateVerificationId(prefix: string = 'VDX'): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 3; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${year}-${randomNum}-${suffix}`;
}

export function createSampleTestFile(type: 'pristine' | 'tampered' | 'experience' | 'transcript' | 'revoked' | 'unregistered'): File {
  let content = '';
  let filename = '';

  if (type === 'pristine') {
    filename = 'Stanford_Degree_Alex_Morgan.pdf';
    content = EXACT_SAMPLE_TEXTS.pristine;
  } else if (type === 'tampered') {
    filename = 'Stanford_Degree_Alex_Morgan_TAMPERED.pdf';
    content = EXACT_SAMPLE_TEXTS.tampered;
  } else if (type === 'experience') {
    filename = 'Google_Experience_Letter_Morgan.pdf';
    content = EXACT_SAMPLE_TEXTS.experience;
  } else if (type === 'transcript') {
    filename = 'Stanford_Official_Transcript_Morgan.pdf';
    content = EXACT_SAMPLE_TEXTS.transcript;
  } else if (type === 'revoked') {
    filename = 'Cloud_Security_Cert_Revoked.pdf';
    content = EXACT_SAMPLE_TEXTS.revoked;
  } else {
    filename = 'Random_Unregistered_Resume.pdf';
    content = EXACT_SAMPLE_TEXTS.unregistered;
  }

  const blob = new Blob([content], { type: 'application/pdf' });
  return new File([blob], filename, { type: 'application/pdf' });
}
