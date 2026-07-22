# SoT-5: Validated Prototype Reference

**Document Version:** v1.0

**Project:** SIPDB — Sistem Informasi Penerimaan Peserta Didik Baru

**Product:** Web-Based PPDB Management System (Next.js + Firebase)

**Status:** Validated

**Last Updated:** 2026-07-23

**Source:** Derived from SoT-4 (Validated User Flows) dan implementasi aktual (`ppdb-next/src/app/`)

---

## 1. Prototype Overview

Dokumen ini mereferensikan prototipe HiFi yang sudah diimplementasikan dalam bentuk aplikasi web nyata. Setiap halaman merupakan implementasi aktual dari user flow yang didefinisikan di SoT-4.

**Arsitektur Prototipe:**
- **Framework:** Next.js 16 (App Router)
- **Rendering:** Server Component + Client Component (`'use client'`)
- **Styling:** Tailwind CSS 4
- **State Management:** React Context (`AuthContext`)
- **Routing:** File-based routing (`src/app/`)

---

## 2. Page-by-Page Reference

### 2.1 Public Pages

| Halaman | Route | File | Komponen Kunci |
|---|---|---|---|
| Beranda | `/` | `src/app/page.tsx` | Landing page, CTA daftar/login |
| Pengumuman | `/pengumuman` | `src/app/pengumuman/page.tsx` | Daftar pengumuman publik |
| Login | `/auth/login` | `src/app/auth/login/page.tsx` | Form email + password |
| Register | `/auth/register` | `src/app/auth/register/page.tsx` | Form nama + email + password |

### 2.2 Pendaftar Pages

| Halaman | Route | File | Komponen Kunci |
|---|---|---|---|
| Dashboard | `/pendaftar/dashboard` | `src/app/pendaftar/dashboard/page.tsx` | Status ringkasan, antrian |
| Biodata | `/pendaftar/biodata` | `src/app/pendaftar/biodata/page.tsx` | Form data siswa |
| Dokumen | `/pendaftar/dokumen` | `src/app/pendaftar/dokumen/page.tsx` | Upload grid berkas |
| Pembayaran | `/pendaftar/pembayaran` | `src/app/pendaftar/pembayaran/page.tsx` | Upload bukti bayar |
| Status | `/pendaftar/status` | `src/app/pendaftar/status/page.tsx` | Ringkasan status |

### 2.3 Panitia Pages

| Halaman | Route | File | Komponen Kunci |
|---|---|---|---|
| Dashboard | `/panitia/dashboard` | `src/app/panitia/dashboard/page.tsx` | Ringkasan statistik |
| Verifikasi Berkas | `/panitia/verifikasi-berkas` | `src/app/panitia/verifikasi-berkas/page.tsx` | Tabel antrian + aksi |
| Kuota Dinamis | `/panitia/kuota-dinamis` | `src/app/panitia/kuota-dinamis/page.tsx` | Form kuota per program |
| Kelulusan | `/panitia/kelulusan` | `src/app/panitia/kelulusan/page.tsx` | Daftar siswa + aksi |
| Pengumuman | `/panitia/pengumuman` | `src/app/panitia/pengumuman/page.tsx` | Form buat pengumuman |

### 2.4 Bendahara Pages

| Halaman | Route | File | Komponen Kunci |
|---|---|---|---|
| Dashboard | `/bendahara/dashboard` | `src/app/bendahara/dashboard/page.tsx` | Rekap pembayaran |
| Verifikasi Pembayaran | `/bendahara/verifikasi-pembayaran` | `src/app/bendahara/verifikasi-pembayaran/page.tsx` | Tabel bukti bayar + aksi |
| Tarif Biaya | `/bendahara/tarif-biaya` | `src/app/bendahara/tarif-biaya/page.tsx` | CRUD komponen biaya |
| Audit Log | `/bendahara/audit-log` | `src/app/bendahara/audit-log/page.tsx` | Tabel jejak aktivitas |

### 2.5 Kepsek Pages

| Halaman | Route | File | Komponen Kunci |
|---|---|---|---|
| Dashboard | `/kepsek/dashboard` | `src/app/kepsek/dashboard/page.tsx` | Dashboard read-only |

---

## 3. Shared Components

| Komponen | File | Deskripsi |
|---|---|---|
| Sidebar | `src/components/Sidebar.tsx` | Navigasi samping — render berdasarkan role |
| Providers | `src/components/Providers.tsx` | AuthContext provider wrapper |
| AuthContext | `src/context/AuthContext.tsx` | State autentikasi global |
| Layout Root | `src/app/layout.tsx` | Root layout dengan Providers |

---

## 4. Interaction Patterns

### 4.1 Authentication Flow
```
User → /auth/login atau /auth/register
  → Firebase Auth (signIn/createUser)
  → Firestore users doc
  → AuthContext setUser
  → Sidebar render berdasarkan role
  → Redirect ke dashboard sesuai role
```

### 4.2 Data Flow — Pendaftar
```
Pendaftar → /pendaftar/biodata
  → apiCreateStudent / apiUpdateStudent
  → Firestore students collection

Pendaftar → /pendaftar/dokumen
  → Upload file → Cloudinary
  → apiUpsertDocument
  → Firestore documents collection

Pendaftar → /pendaftar/pembayaran
  → Upload bukti → Cloudinary
  → apiCreatePayment
  → Firestore payments collection
```

### 4.3 Data Flow — Panitia/Bendahara
```
Panitia → /panitia/verifikasi-berkas
  → apiVerifyDocument
  → Auto-update students.pendaftaran_status
  → Firestore documents + students

Bendahara → /bendahara/verifikasi-pembayaran
  → apiVerifyPayment
  → Auto-create auditLogs entry
  → Firestore payments + auditLogs
```

---

## 5. Validation Status

| Aspek | Status | Keterangan |
|---|---|---|
| Route Implementation | ✅ Validated | 19 page.tsx files sesuai route map |
| Shared Components | ✅ Validated | Sidebar, Providers, AuthContext terimplementasi |
| Data Flow | ✅ Validated | API functions di `api.ts` sesuai user flows |
| Responsive Design | ✅ Validated | Tailwind CSS breakpoints + sidebar overlay mobile |
| Role-Based UI | ✅ Validated | Sidebar render dinamis berdasarkan role |
