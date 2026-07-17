# SoT-7: Use Case Integration Contract (UCIC)

**Document Version:** v1.0  
**Project:** Sistem Informasi Penerimaan Peserta Didik Baru (PPDB)  
**Status:** Approved  

Dokumen integrasi final yang mengunci pemetaan hubungan ujung-ke-ujung (*end-to-end trace*) antara skenario fungsional, komponen visual, tabel database, dan endpoint API.

| Use Case (SoT-4) | UI Component (SoT-3) | DB Impact (SoT-5) | Backend API Contract (SoT-6) |
|---|---|---|---|
| UC-001 (Login) | Input Form & Primary Button | Read `users` table | `POST /api/v1/auth/login` |
| UC-002 (Form & Berkas) | Drag-and-Drop Box Grid | Insert/Update `students` & `documents` | `POST /api/v1/students/upload` |
| UC-004 (Verifikasi Berkas) | Queue Table Row List | Update `documents.verification_status` | `PATCH /api/v1/admin/verify-document` |
| UC-005 (Upload Bukti Bayar) | Minimalist Upload Box | Insert `payments` table | `POST /api/v1/payments/upload` |
| UC-007 (Dashboard Kepsek) | Executive Charts & Summaries | Aggregate Query (`COUNT`/`SUM`) | `GET /api/v1/executive/summary` |
