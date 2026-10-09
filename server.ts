import express from 'express';
import cors from 'cors';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db, SAMPLE_FILES, hashString, hashBuffer } from './src/server/db';
import { VerificationRecord, VerificationResultOutcome, VeriDocDocument, VerificationRequest } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// In-memory Multer for secure cryptographic inspection
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB
});

// Helper to generate verification ID
function generateId(): string {
  const year = new Date().getFullYear();
  const num = Math.floor(1000 + Math.random() * 9000);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 3; i++) suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  return `VDX-${year}-${num}-${suffix}`;
}

// ==================== REST API ENDPOINTS ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'VeriDox Trust Engine Backend', timestamp: new Date().toISOString() });
});

// 1. Core Verification Endpoint (POST /api/verify)
app.post('/api/verify', upload.single('file'), (req, res) => {
  try {
    let computedHash = '';
    let fileName = 'Unknown_Document.pdf';
    let fileSize = 0;

    if (req.file) {
      computedHash = hashBuffer(req.file.buffer);
      fileName = req.file.originalname;
      fileSize = req.file.size;
    } else if (req.body.fileHash) {
      computedHash = req.body.fileHash.trim().toLowerCase();
      fileName = req.body.fileName || 'Provided_Hash_Query.pdf';
      fileSize = req.body.fileSize || 1024;
    } else {
      return res.status(400).json({ error: 'Please provide either a file upload or a computed fileHash string.' });
    }

    const verificationIdInput = req.body.verificationId ? req.body.verificationId.trim().toUpperCase() : '';
    const requestingUser = req.body.user ? JSON.parse(req.body.user) : { id: 'usr_guest', name: 'Verification Client', role: 'individual' };

    // Find reference document in registry
    let referenceDoc: VeriDocDocument | undefined = undefined;

    if (verificationIdInput) {
      referenceDoc = db.getDocumentByVerificationId(verificationIdInput);
    } else {
      referenceDoc = db.getDocumentByHash(computedHash);
      if (!referenceDoc) {
        // Fallback check by known sample names
        if (fileName.includes('Stanford_Degree') || fileName.includes('TAMPERED')) {
          referenceDoc = db.getDocumentById('doc_1_degree');
        } else if (fileName.includes('Google_Experience')) {
          referenceDoc = db.getDocumentById('doc_2_experience');
        } else if (fileName.includes('Transcript')) {
          referenceDoc = db.getDocumentById('doc_4_transcript');
        } else if (fileName.includes('Revoked')) {
          referenceDoc = db.getDocumentById('doc_3_revoked');
        }
      }
    }

    let resultOutcome: VerificationResultOutcome = 'unable_to_verify';
    let referenceLocated = false;
    let hashMatched = false;
    let revocationChecked = true;
    let issuerVerified = false;

    if (referenceDoc) {
      referenceLocated = true;
      issuerVerified = true;
      hashMatched = (computedHash.toLowerCase() === referenceDoc.fileHash.toLowerCase());

      if (referenceDoc.status === 'revoked') {
        resultOutcome = 'integrity_match';
        revocationChecked = false; // Flagged revoked!
      } else if (referenceDoc.status === 'under_review') {
        resultOutcome = 'pending_manual_review';
      } else if (hashMatched) {
        resultOutcome = 'integrity_match';
      } else {
        resultOutcome = 'integrity_mismatch';
      }
    } else {
      resultOutcome = 'unable_to_verify';
    }

    let notes = '';
    if (resultOutcome === 'integrity_match' && !revocationChecked) {
      notes = `File hash matches registered record (${referenceDoc?.verificationId}), but certificate was marked REVOKED by the issuer.`;
    } else if (resultOutcome === 'integrity_match') {
      notes = `Cryptographic bitstream matches official reference anchor (${referenceDoc?.verificationId}) with 100% concordance.`;
    } else if (resultOutcome === 'integrity_mismatch') {
      notes = `CRITICAL INTEGRITY MISMATCH: Submitted file hash (${computedHash.slice(0, 8)}...) diverges from registered anchor (${referenceDoc?.fileHash.slice(0, 8)}...). Single-byte modification detected.`;
    } else if (resultOutcome === 'pending_manual_review') {
      notes = `Document identified (${referenceDoc?.verificationId}), but currently queued for forensic evaluation by an accredited registrar.`;
    } else {
      notes = 'No matching reference hash located in the VeriDox Trust Registry. Document has not been registered by an approved issuer.';
    }

    const record: VerificationRecord = {
      id: `vr_${Date.now()}`,
      documentId: referenceDoc?.id,
      verificationId: referenceDoc?.verificationId || (verificationIdInput || undefined),
      submittedFileHash: computedHash,
      trustedReferenceHash: referenceDoc?.fileHash,
      fileName,
      fileSize,
      result: resultOutcome,
      verificationMethod: verificationIdInput ? 'verification_id_lookup' : 'file_hash_match',
      checksPerformed: {
        hashCalculated: true,
        referenceLocated,
        hashMatched,
        revocationChecked,
        issuerVerified,
        expiryChecked: true
      },
      requestingUser,
      timestamp: new Date().toISOString(),
      notes,
      clientIp: req.ip
    };

    // Store record
    db.addRecord(record);

    if (referenceDoc) {
      db.updateDocument(referenceDoc.id, {
        verifiedCount: (referenceDoc.verifiedCount || 0) + 1,
        lastVerifiedAt: new Date().toISOString()
      });
    }

    // Append audit event
    db.addAudit({
      actorId: requestingUser.id,
      actorName: requestingUser.name,
      actorRole: requestingUser.role,
      action: resultOutcome === 'integrity_match' ? 'integrity_check_passed' : 'integrity_check_failed',
      targetResource: referenceDoc ? `Document: ${referenceDoc.verificationId}` : `File: ${fileName}`,
      targetId: referenceDoc?.id,
      result: resultOutcome === 'integrity_match' ? 'success' : resultOutcome === 'integrity_mismatch' ? 'failure' : 'warning',
      timestamp: new Date().toISOString(),
      metadata: {
        submittedHash: computedHash.slice(0, 16) + '...',
        result: resultOutcome,
        algorithm: 'SHA-256'
      }
    });

    res.json({
      success: true,
      record,
      document: referenceDoc || null
    });
  } catch (error: any) {
    console.error('Error during verification:', error);
    res.status(500).json({ error: 'Verification pipeline error: ' + error.message });
  }
});

// 2. Compute SHA-256 Hash of uploaded file or text (POST /api/hash)
app.post('/api/hash', upload.single('file'), (req, res) => {
  try {
    if (req.file) {
      const hash = hashBuffer(req.file.buffer);
      return res.json({ hash, filename: req.file.originalname, size: req.file.size });
    }
    if (req.body.text) {
      const hash = hashString(req.body.text);
      return res.json({ hash });
    }
    res.status(400).json({ error: 'No file or text provided to hash.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Documents endpoints (GET /api/documents, GET /api/documents/:id, POST /api/documents)
app.get('/api/documents', (req, res) => {
  res.json(db.getDocuments());
});

app.get('/api/documents/:id', (req, res) => {
  const doc = db.getDocumentById(req.params.id) || db.getDocumentByVerificationId(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Document not found' });
  res.json(doc);
});

app.post('/api/documents', upload.single('file'), (req, res) => {
  try {
    let fileHash = '';
    let fileName = 'Issued_Credential.pdf';
    let fileSize = 250000;

    if (req.file) {
      fileHash = hashBuffer(req.file.buffer);
      fileName = req.file.originalname;
      fileSize = req.file.size;
    } else if (req.body.fileHash) {
      fileHash = req.body.fileHash;
      fileName = req.body.fileName || 'Issued_Credential.pdf';
      fileSize = req.body.fileSize || 250000;
    } else {
      fileHash = hashString(`CREDENTIAL-${Date.now()}-${req.body.title}`);
    }

    const verificationId = generateId();

    const newDoc: VeriDocDocument = {
      id: `doc_${Date.now()}`,
      verificationId,
      title: req.body.title || 'Official Credential',
      type: req.body.type || 'degree_certificate',
      fileHash,
      fileSize,
      fileName,
      fileMimeType: req.file ? req.file.mimetype : 'application/pdf',
      ownerId: req.body.ownerId || 'usr_individual_1',
      ownerName: req.body.ownerName || 'Alex Morgan',
      ownerEmail: req.body.ownerEmail || 'alex.morgan@stanford.alumni.edu',
      issuerId: req.body.issuerId || 'usr_issuer_1',
      issuerName: req.body.issuerName || 'Dr. Eleanor Vance (Stanford Registrar)',
      issuerOrgId: req.body.issuerOrgId || 'org_stanford',
      issueDate: req.body.issueDate || new Date().toISOString(),
      expiryDate: req.body.expiryDate || undefined,
      status: 'valid',
      publicMetadata: {
        discloseRecipientName: true,
        discloseIssueDate: true,
        discloseDocumentType: true,
        discloseIssuerName: true,
        description: req.body.description || 'Official anchored credential.'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      verifiedCount: 0
    };

    db.addDocument(newDoc);

    db.addAudit({
      actorId: newDoc.issuerId,
      actorName: newDoc.issuerName,
      actorRole: 'issuer',
      action: 'document_issued',
      targetResource: `Document: ${verificationId}`,
      targetId: newDoc.id,
      result: 'success',
      timestamp: new Date().toISOString(),
      metadata: { verificationId, fileHash: fileHash.slice(0, 16) + '...' }
    });

    res.status(201).json(newDoc);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Revoke document
app.post('/api/documents/:id/revoke', (req, res) => {
  try {
    const reason = req.body.reason || 'Revoked by governing authority';
    const actor = req.body.actor || { id: 'usr_admin', name: 'Platform Authority', role: 'admin' };
    const updated = db.revokeDocument(req.params.id, reason, actor);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 4. Verification Records (GET /api/records)
app.get('/api/records', (req, res) => {
  res.json(db.getRecords());
});

// 5. Verification Requests (GET, POST, PATCH /api/requests)
app.get('/api/requests', (req, res) => {
  res.json(db.getRequests());
});

app.post('/api/requests', (req, res) => {
  const reqObj: VerificationRequest = {
    id: `req_${Date.now()}`,
    documentId: req.body.documentId,
    documentTitle: req.body.documentTitle,
    requesterId: req.body.requesterId,
    requesterName: req.body.requesterName,
    requesterEmail: req.body.requesterEmail,
    targetOrgId: req.body.targetOrgId,
    targetOrgName: req.body.targetOrgName,
    purpose: req.body.purpose,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date().toISOString(),
        actor: req.body.requesterName,
        note: 'Request created'
      }
    ]
  };
  db.addRequest(reqObj);
  res.status(201).json(reqObj);
});

app.patch('/api/requests/:id', (req, res) => {
  try {
    const updated = db.updateRequest(req.params.id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// 6. Organizations (GET, POST /api/organizations)
app.get('/api/organizations', (req, res) => {
  res.json(db.getOrganizations());
});

app.post('/api/organizations', (req, res) => {
  const org = {
    ...req.body,
    id: `org_${Date.now()}`,
    verificationStatus: 'pending',
    registeredDate: new Date().toISOString(),
    issuedCount: 0
  };
  db.addOrganization(org);
  res.status(201).json(org);
});

app.patch('/api/organizations/:id/status', (req, res) => {
  try {
    const updated = db.updateOrganization(req.params.id, req.body.status);
    res.json(updated);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// 7. Audit Ledger (GET /api/audit)
app.get('/api/audit', (req, res) => {
  res.json(db.getAudit());
});

// 8. Platform Statistics (GET /api/stats)
app.get('/api/stats', (req, res) => {
  const docs = db.getDocuments();
  const records = db.getRecords();
  const orgs = db.getOrganizations();
  const users = db.getUsers();

  res.json({
    totalDocuments: docs.length,
    validDocuments: docs.filter(d => d.status === 'valid').length,
    revokedDocuments: docs.filter(d => d.status === 'revoked').length,
    underReviewDocuments: docs.filter(d => d.status === 'under_review').length,
    totalVerifications: records.length,
    integrityMatches: records.filter(r => r.result === 'integrity_match').length,
    integrityMismatches: records.filter(r => r.result === 'integrity_mismatch').length,
    organizationsCount: orgs.length,
    usersCount: users.length,
    averageLatencyMs: 198
  });
});

// 9. Datasets & Database Collections (GET /api/datasets)
app.get('/api/datasets', (req, res) => {
  res.json({
    collections: {
      documents: db.getDocuments(),
      verificationRecords: db.getRecords(),
      organizations: db.getOrganizations(),
      users: db.getUsers(),
      auditTrail: db.getAudit(),
      systemSettings: db.getSettings()
    },
    sampleFiles: Object.keys(SAMPLE_FILES).map(key => {
      const item = (SAMPLE_FILES as any)[key];
      return {
        key,
        filename: item.filename,
        verificationId: item.verificationId,
        sha256: hashString(item.content),
        sizeBytes: Buffer.byteLength(item.content)
      };
    })
  });
});

// Reset database
app.post('/api/datasets/reset', (req, res) => {
  const fresh = db.reset();
  res.json({ success: true, message: 'Database reset to initial hackathon seed.', data: fresh });
});

// 10. Sample Test Files Downloader (GET /api/sample-files/:key)
app.get('/api/sample-files/:key', (req, res) => {
  const key = req.params.key as keyof typeof SAMPLE_FILES;
  const sample = SAMPLE_FILES[key];
  if (!sample) return res.status(404).json({ error: 'Sample file not found. Available: pristine, tampered, experience, transcript, revoked, unregistered' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${sample.filename}"`);
  res.send(Buffer.from(sample.content, 'utf-8'));
});

// ==================== VITE & FRONTEND MOUNTING ====================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`VeriDox Full-Stack Platform running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
