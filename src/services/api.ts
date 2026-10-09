import { VeriDocDocument, VerificationRecord, VerificationRequest, Organization, AuditEvent } from '../types';

const API_BASE = '/api';

export interface VerifyPayload {
  file?: File;
  fileHash?: string;
  verificationId?: string;
  fileName?: string;
  fileSize?: number;
  user?: {
    id: string;
    name: string;
    role: string;
  };
}

export const api = {
  // Verification Pipeline
  async verify(payload: VerifyPayload): Promise<{ success: boolean; record: VerificationRecord; document: VeriDocDocument | null }> {
    if (payload.file) {
      const formData = new FormData();
      formData.append('file', payload.file);
      if (payload.verificationId) formData.append('verificationId', payload.verificationId);
      if (payload.user) formData.append('user', JSON.stringify(payload.user));

      const res = await fetch(`${API_BASE}/verify`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Verification failed' }));
        throw new Error(err.error || 'Verification server error');
      }
      return res.json();
    } else {
      const res = await fetch(`${API_BASE}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Verification failed' }));
        throw new Error(err.error || 'Verification server error');
      }
      return res.json();
    }
  },

  // Documents
  async getDocuments(): Promise<VeriDocDocument[]> {
    const res = await fetch(`${API_BASE}/documents`);
    return res.json();
  },

  async getDocument(id: string): Promise<VeriDocDocument> {
    const res = await fetch(`${API_BASE}/documents/${id}`);
    if (!res.ok) throw new Error('Document not found');
    return res.json();
  },

  async issueDocument(formData: FormData): Promise<VeriDocDocument> {
    const res = await fetch(`${API_BASE}/documents`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Failed to issue document');
    return res.json();
  },

  async revokeDocument(id: string, reason: string, actor: any): Promise<VeriDocDocument> {
    const res = await fetch(`${API_BASE}/documents/${id}/revoke`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, actor }),
    });
    if (!res.ok) throw new Error('Failed to revoke document');
    return res.json();
  },

  // Datasets & Database
  async getDatasets(): Promise<{ collections: any; sampleFiles: any[] }> {
    const res = await fetch(`${API_BASE}/datasets`);
    return res.json();
  },

  async resetDatasets(): Promise<any> {
    const res = await fetch(`${API_BASE}/datasets/reset`, { method: 'POST' });
    return res.json();
  },

  // Audit Ledger
  async getAudit(): Promise<AuditEvent[]> {
    const res = await fetch(`${API_BASE}/audit`);
    return res.json();
  },

  // Stats
  async getStats(): Promise<any> {
    const res = await fetch(`${API_BASE}/stats`);
    return res.json();
  }
};
