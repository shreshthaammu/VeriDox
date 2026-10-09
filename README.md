# VeriDox — Digital Document Verification & Trust Platform

> **“Trust Every Document. Verify Every Detail.”**  
> *Make digital document verification faster, more transparent, and easier to audit.*

VeriDox is an enterprise-grade digital document trust platform engineered for educational institutions, employers, applicants, and verification authorities. It enables users to upload documents, calculate cryptographic SHA-256 fingerprints, verify bitstream integrity against trusted institutional reference anchors, generate public QR verification pages with selective disclosure, manage verification requests, and maintain immutable audit trails.

---

## 🌟 Hackathon Demo Personas (1-Click Switchable)

The top header bar and sidebar include an instant **Persona Switcher** allowing judges and reviewers to test all role-specific workflows without tedious re-registration:

1. **Alex Morgan (`individual`)**  
   - *Role:* Senior Software Engineer Candidate / Credential Holder  
   - *Email:* `alex.morgan@stanford.alumni.edu`  
   - *Features:* View personal credentials, submit verification requests, test candidate verification links.

2. **Dr. Eleanor Vance (`issuer`)**  
   - *Role:* University Registrar & Academic Integrity Dean at Stanford University  
   - *Email:* `e.vance@stanford.edu`  
   - *Features:* Issue and anchor new digital diplomas, revoke superseded transcripts, export institutional registry.

3. **Marcus Sterling (`reviewer`)**  
   - *Role:* Senior Forensic Credential Auditor at Ministry of Education & Accreditation  
   - *Email:* `m.sterling@certreview.org`  
   - *Features:* Inspect bitstream divergences, evaluate pending verification requests, add auditor endorsement notes.

4. **Sarah Chen (`admin`)**  
   - *Role:* Chief Compliance & Platform Security Officer  
   - *Email:* `sarah.chen@veridox.security`  
   - *Features:* Access `/admin`, manage platform users, vet organization accreditations, configure global governance rules.

*Default demo password for all accounts:* `password123`

---

## 🚀 Live Interactive Verification Scenarios

On the **Verify a Document** page (`/app/verify`) and **Integrity Checker** page (`/app/integrity`), judges can click pre-configured test scenarios with 1 click:

1. **Pristine Stanford Degree (`Stanford_Degree_Alex_Morgan.pdf`)**  
   - Generates SHA-256 bitstream matching the official anchor record `VDX-2026-9041-K8`.  
   - *Result:* **100% INTEGRITY MATCH**.

2. **Tampered Degree (`Stanford_Degree_Alex_Morgan_TAMPERED.pdf`)**  
   - A single altered phrase ("Magna Cum Laude" instead of "Summa Cum Laude") triggers the cryptographic avalanche effect.  
   - *Result:* **INTEGRITY MISMATCH (Tamper Blocked)**.

3. **Unregistered Document (`Random_Unregistered_Resume.pdf`)**  
   - No trusted reference anchor located in the VeriDox Trust Registry.  
   - *Result:* **UNABLE TO VERIFY (No False Authenticity Claim)**.

4. **Revoked Credential (`VDX-2025-1102-REV`)**  
   - Bitstream matches reference hash, but the issuer revoked the document due to standard upgrades.  
   - *Result:* **OFFICIALLY REVOKED NOTICE**.

---

## 📐 Architecture & Cryptographic Principles

### 1. Cryptographic Distinction
VeriDox enforces the fundamental cryptographic integrity distinction:
> *A matching SHA-256 hash indicates that compared files possess identical bitstream content. It does not by itself prove the issuer's identity or legal validity unless that hash is anchored to a vetted, authorized issuing institution.*

### 2. Selective Disclosure on Public QR Pages
Public verification pages (`/verify/:verificationId`) disclose **only explicitly consented metadata** (holder name, issuing institution, conferral date, and reference hash). The private PDF document remains safely sandboxed in private storage.

### 3. Tamper-Evident Audit Chaining
Every verification event, status transition, and policy modification is recorded in the **Audit Trail** (`/app/audit`) and linked cryptographically to prevent retrospective log rewriting.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, React Router DOM v7, Tailwind CSS v4, Lucide React icons, `qrcode` generator.
- **Cryptographic Engine:** Web Crypto API (`crypto.subtle.digest('SHA-256')`) for client-side and server-side bitstream digestion.
- **Persistence:** LocalStorage-backed state engine with pre-seeded realistic academic, enterprise, and government records.
- **Design System:** Custom Enterprise Navy (`#101B33`), Royal Blue (`#356AE6`), Cyan Accent (`#36C5F0`), with responsive desktop sidebar and mobile navigation drawer.

---

## 📋 All 28 Routes Implemented

- `Page 1:` `/` — Public Editorial Marketing Landing Page
- `Page 2:` `/login` — Split-Screen Authentication with 1-Click Demo Accounts
- `Page 3:` `/register` — Account Registration with Role Selection
- `Page 4:` `/app/overview` — Operational Dashboard with Metrics & Trends
- `Page 5:` `/app/verify` — Core Document Verification Pipeline
- `Page 6:` `/app/documents/:id` — Document Record Details & Timeline
- `Page 7:` `/app/documents` — My Documents Workspace (Table & Grid)
- `Page 8:` `/app/issue` — Authorized Registrar Credential Issuance
- `Page 9:` `/app/integrity` — Forensic Bitstream Integrity Checker
- `Page 10:` `/app/qr` — QR Code Trust Generator
- `Page 11:` `/app/requests` — Verification Requests & Reviewer Endorsements
- `Page 12:` `/app/issued` — Institutional Issuance Registry
- `Page 13:` `/app/history` — Chronological Verification History
- `Page 14:` `/app/audit` — Tamper-Evident Audit Trail Explorer
- `Page 15:` `/app/analytics` — Verification Telemetry & Velocity Charts
- `Page 16:` `/app/organizations` — Accredited Organization Directory
- `Page 17:` `/app/notifications` — Real-Time Alert Inbox
- `Page 18:` `/app/profile` — User Identity Profile (with Edit Mode)
- `Page 19:` `/app/security` — Workstation Security & Two-Factor Controls
- `Page 20:` `/app/preferences` — Workspace Preferences & Demo Data Reset
- `Page 21:` `/app/help` — Searchable Knowledge Base & Support Form
- `Page 22:` `/admin` — Platform Governance Administration Overview
- `Page 23:` `/admin/users` — User Governance & Role Management
- `Page 24:` `/admin/organizations` — Organization Accreditation Review Queue
- `Page 25:` `/admin/verifications` — Forensic Anomaly & Review Queue
- `Page 26:` `/admin/audit-logs` — Administrative Audit Logs
- `Page 27:` `/admin/settings` — System Governance Parameters & Ingestion Limits
- `Page 28:` `/verify/:verificationId` & `*` — Standalone Public Verification & 404 Pages
