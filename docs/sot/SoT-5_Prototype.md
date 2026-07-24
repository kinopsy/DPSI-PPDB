# SoT-5: Prototype Reference

**Document Version:** v2.0

**Project:** SIPDB — Sistem Informasi Penerimaan Peserta Didik Baru

**Product:** Web-Based PPDB Management System (Next.js + Firebase)

**Status:** Validated

**Last Updated:** 2026-07-24

**Source:** Derived from SoT-4 (User Flows) dan implementasi aktual (`ppdb-next/src/app/`, `ppdb-next/src/components/`)

---

## 1. Prototype Overview

Dokumen ini mereferensikan prototipe HiFi yang sudah diimplementasikan dalam bentuk aplikasi web nyata. Setiap halaman merupakan implementasi aktual dari user flow yang didefinisikan di SoT-4.

**Arsitektur Prototipe:**
- **Framework:** Next.js 16 (App Router)
- **Rendering:** Client Component (`'use client'`) untuk semua halaman
- **Styling:** Tailwind CSS 4
- **State Management:** React Context (`AuthContext`)
- **Routing:** File-based routing (`src/app/`)
- **Auth Guard:** `DashboardLayout.tsx` — cek `user` state, redirect jika belum login

---

## 2. Component Architecture

### 2.1 Component Hierarchy

```
src/
├── app/
│   ├── layout.tsx              # Root layout → <Providers>
│   ├── page.tsx                # Landing page (hero, stats, features, programs, announcements)
│   ├── auth/
│   │   ├── login/page.tsx      # Split layout: gradient left + form right
│   │   └── register/page.tsx   # Split layout: gradient left + form right
│   ├── pengumuman/page.tsx     # Public announcements page
│   ├── pendaftar/
│   │   ├── dashboard/page.tsx  # Welcome banner + status cards + progress bar + quick menu
│   │   ├── biodata/page.tsx    # Form 11 fields + validation
│   │   ├── dokumen/page.tsx    # 4-row document upload with status badges
│   │   ├── pembayaran/page.tsx # Payment info + upload bukti
│   │   └── status/page.tsx     # Summary: status + documents + payment
│   ├── panitia/
│   │   ├── dashboard/page.tsx
│   │   ├── verifikasi-berkas/page.tsx
│   │   ├── kuota-dinamis/page.tsx
│   │   ├── kelulusan/page.tsx
│   │   └── pengumuman/page.tsx
│   ├── bendahara/
│   │   ├── dashboard/page.tsx  # 4 stats + quick actions + tariff list
│   │   ├── verifikasi-pembayaran/page.tsx
│   │   ├── tarif-biaya/page.tsx
│   │   └── audit-log/page.tsx
│   └── kepsek/
│       └── dashboard/page.tsx
├── components/
│   ├── Providers.tsx           # AuthProvider + DashboardLayout wrapper
│   ├── DashboardLayout.tsx     # Auth guard + Sidebar + Header + main content
│   ├── Sidebar.tsx             # Role-based navigation sidebar
│   ├── Navbar.tsx              # Public navigation bar
│   └── UI.tsx                  # Modal, Toast, StatusBadge, FileUpload
├── context/
│   └── AuthContext.tsx          # Firebase Auth state + login/register/logout
└── lib/
    ├── firebase.ts             # Firebase config + init
    ├── api.ts                  # 18 Firestore API functions
    ├── types.ts                # TypeScript interfaces (8 collections)
    └── cloudinary.ts           # Cloudinary upload utility
```

### 2.2 Shared Components

| Komponen | File | Deskripsi |
|---|---|---|
| `Providers` | `components/Providers.tsx` | Membungkus `AuthProvider` + `DashboardLayout` |
| `DashboardLayout` | `components/DashboardLayout.tsx` | Auth guard (loading spinner → redirect), Sidebar + Header untuk dashboard, render `<>{children}</>` untuk public |
| `Sidebar` | `components/Sidebar.tsx` | Navigasi samping — render berdasarkan role, mobile overlay, user avatar, logout button |
| `Navbar` | `components/Navbar.tsx` | Navigasi publik — Beranda, Pengumuman, Login/Daftar (desktop) atau hamburger menu (mobile) |
| `Modal` | `components/UI.tsx` | Dialog overlay dengan title + close button |
| `Toast` | `components/UI.tsx` | Notifikasi 3 detik (success/error/info) |
| `StatusBadge` | `components/UI.tsx` | Badge otomatis berdasarkan status string (10 mappings) |
| `FileUpload` | `components/UI.tsx` | Upload button + hidden input + validasi ukuran |

---

## 3. Page-by-Page Reference

### 3.1 Public Pages

| Halaman | Route | File | Komponen Kunci |
|---|---|---|---|
| Beranda | `/` | `src/app/page.tsx` | Navbar, hero gradient, 3 stat cards, 3 feature cards, 3 program cards, announcements, CTA, footer |
| Pengumuman | `/pengumuman` | `src/app/pengumuman/page.tsx` | Navbar, header gradient, announcement cards |
| Login | `/auth/login` | `src/app/auth/login/page.tsx` | Split layout: kiri gradient info + kanan form email+password |
| Register | `/auth/register` | `src/app/auth/register/page.tsx` | Split layout: kiri gradient info + kanan form nama+email+password |

### 3.2 Pendaftar Pages

| Halaman | Route | File | Komponen Kunci |
|---|---|---|---|
| Dashboard | `/pendaftar/dashboard` | `src/app/pendaftar/dashboard/page.tsx` | Welcome banner (gradient), 3 status cards (status, dokumen, pembayaran), progress bar (0-100%), 4 quick menu cards |
| Biodata | `/pendaftar/biodata` | `src/app/pendaftar/biodata/page.tsx` | Form 11 fields: NISN (10 digit), NIK (16 digit), nama, tempat_lahir, tanggal_lahir, jenis_kelamin (select), agama (select), telepon, alamat (textarea), asal_sekolah |
| Dokumen | `/pendaftar/dokumen` | `src/app/pendaftar/dokumen/page.tsx` | 4 row cards (KK, Akta, SKHUN, SKL) — each: label, file_path, StatusBadge, rejection_note, upload button |
| Pembayaran | `/pendaftar/pembayaran` | `src/app/pendaftar/pembayaran/page.tsx` | Info box (Rp 250.000, BCA 1234567890), StatusBadge, upload button (JPG/PNG, max 2MB) |
| Status | `/pendaftar/status` | `src/app/pendaftar/status/page.tsx` | 3 cards: status pendaftaran, daftar dokumen + status, status pembayaran |

### 3.3 Panitia Pages

| Halaman | Route | File |
|---|---|---|
| Dashboard | `/panitia/dashboard` | `src/app/panitia/dashboard/page.tsx` |
| Verifikasi Berkas | `/panitia/verifikasi-berkas` | `src/app/panitia/verifikasi-berkas/page.tsx` |
| Kuota Dinamis | `/panitia/kuota-dinamis` | `src/app/panitia/kuota-dinamis/page.tsx` |
| Kelulusan | `/panitia/kelulusan` | `src/app/panitia/kelulusan/page.tsx` |
| Pengumuman | `/panitia/pengumuman` | `src/app/panitia/pengumuman/page.tsx` |

### 3.4 Bendahara Pages

| Halaman | Route | File |
|---|---|---|
| Dashboard | `/bendahara/dashboard` | `src/app/bendahara/dashboard/page.tsx` |
| Verifikasi Pembayaran | `/bendahara/verifikasi-pembayaran` | `src/app/bendahara/verifikasi-pembayaran/page.tsx` |
| Tarif Biaya | `/bendahara/tarif-biaya` | `src/app/bendahara/tarif-biaya/page.tsx` |
| Audit Log | `/bendahara/audit-log` | `src/app/bendahara/audit-log/page.tsx` |

### 3.5 Kepsek Pages

| Halaman | Route | File |
|---|---|---|
| Dashboard | `/kepsek/dashboard` | `src/app/kepsek/dashboard/page.tsx` |

---

## 4. Interaction Patterns

### 4.1 Authentication Flow
```
User → /auth/login atau /auth/register
  → Firebase Auth (signIn/createUser)
  → Firestore: setDoc(db, 'users', uid, { name, email, role: 'pendaftar' })
  → AuthContext.setUser({ id, name, email, role })
  → DashboardLayout: if (!user) → render children (public mode)
  → DashboardLayout: if (user) → render Sidebar + Header + children
  → Redirect → /{role}/dashboard
```

### 4.2 Data Flow — Pendaftar
```
Pendaftar → /pendaftar/biodata
  → apiGetStudents() → find by user_id
  → Jika ada: apiUpdateStudent(id, form)
  → Jika tidak: apiCreateStudent({ user_id, ...form })
  → Toast: "Biodata berhasil disimpan"

Pendaftar → /pendaftar/dokumen
  → apiGetStudents() + apiGetDocuments()
  → Upload file → uploadToCloudinary(file) → return URL
  → apiUpsertDocument(studentId, fileType, url)
  → Refresh documents list

Pendaftar → /pendaftar/pembayaran
  → apiGetStudents() + apiGetPayments()
  → Upload bukti → apiCreatePayment(studentId, fileName)
  → Refresh payment status
```

### 4.3 Data Flow — Panitia/Bendahara
```
Panitia → /panitia/verifikasi-berkas
  → apiVerifyDocument(docId, status, note)
  → Auto-update: all docs approved? → students.pendaftaran_status = 'terverifikasi'
  → Auto-update: any docs rejected? → students.pendaftaran_status = 'belum_lengkap'

Bendahara → /bendahara/verifikasi-pembayaran
  → apiVerifyPayment(paymentId, status, officer)
  → Auto-create: auditLogs entry
```

---

## 5. Validation Status

| Aspek | Status | Keterangan |
|---|---|---|
| Route Implementation | ✅ Validated | 19 page.tsx files sesuai route map |
| Component Architecture | ✅ Validated | Providers → DashboardLayout → Sidebar + Header + children |
| Shared Components | ✅ Validated | 7 komponen: Providers, DashboardLayout, Sidebar, Navbar, Modal, Toast, StatusBadge, FileUpload |
| Data Flow | ✅ Validated | API functions di `api.ts` sesuai user flows |
| Responsive Design | ✅ Validated | Tailwind CSS breakpoints + sidebar overlay mobile |
| Role-Based UI | ✅ Validated | Sidebar render dinamis berdasarkan role |
| Auth Guard | ✅ Validated | DashboardLayout handles loading + redirect |
