# SoT-7: Use Case Integration Contract (UCIC)

**Document Version:** v2.0

**Project:** SIPDB — Sistem Informasi Penerimaan Peserta Didik Baru

**Product:** Web-Based PPDB Management System (Next.js + Firebase)

**Status:** Validated

**Last Updated:** 2026-07-24

**Source:** Derived dari SoT-4 (User Flows), SoT-5 (Prototype), SoT-6 (Data Model)

---

## 1. Overview

Dokumen integrasi final yang mengunci pemetaan hubungan ujung-ke-ujung (*end-to-end trace*) antara skenario fungsional, komponen visual, collection database, dan API function. Setiap Use Case dihubungkan ke UI Component, DB Impact, dan API Contract secara terpadu.

**Konvensi:**
- **Use Case** → merujuk ke SoT-4
- **UI Component** → merujuk ke SoT-3 dan SoT-5
- **DB Impact** → merujuk ke SoT-6 (collection + field)
- **API Contract** → merujuk ke fungsi di `api.ts`

---

## 2. UCIC Mapping Table

| Use Case (SoT-4) | UI Component (SoT-3/SoT-5) | DB Impact (SoT-6) | API Contract (`api.ts`) |
|---|---|---|---|
| **UC-001** Registrasi | Input Form (nama, email, password) + Primary Button | Create `users` doc (role: `pendaftar`) | `AuthContext.register()` → `createUserWithEmailAndPassword` + `setDoc(db, 'users', ...)` |
| **UC-001** Login | Input Form (email, password) + Primary Button | Read `users` doc by UID | `AuthContext.login()` → `signInWithEmailAndPassword` + `getDoc(db, 'users', uid)` |
| **UC-002** Biodata Siswa | Form Fields (NISN 10 digit, NIK 16 digit, nama, tempat/tanggal lahir, JK, agama, telepon, alamat, asal sekolah) | Create/Update `students` doc | `apiCreateStudent(data)` / `apiUpdateStudent(id, data)` |
| **UC-002** Upload Berkas | 4 Row Upload Cards (KK, Akta, SKHUN, SKL) + StatusBadge | Create/Update `documents` doc (upsert by student_id + file_type) | `apiUpsertDocument(studentId, fileType, filePath)` |
| **UC-003** Kuota Dinamis | Form Kuota per Program (Reguler, Tahfidz, Bilingual) + Deadline Picker | Update `quotas` doc | `apiUpdateQuota(id, data)` |
| **UC-003** Tarif Biaya | CRUD Table (komponen, nominal, deskripsi) | Create/Update/Delete `tariffs` doc | `apiCreateTariff(data)` / `apiUpdateTariff(id, data)` / `apiDeleteTariff(id)` |
| **UC-004** Verifikasi Berkas | Table Row List + Aksi (Setujui/Tolak + Catatan) | Update `documents.verification_status` → Auto-update `students.pendaftaran_status` | `apiVerifyDocument(docId, status, note)` |
| **UC-005** Upload Bukti Bayar | Info Box (Rp 250.000, BCA) + Upload Button (JPG/PNG, max 2MB) | Create `payments` doc (upsert by student_id) | `apiCreatePayment(studentId, proofPath)` |
| **UC-005** Verifikasi Pembayaran | Table Row List + Aksi (Lunas/Ditolak) + Preview Gambar | Update `payments.payment_status` → Auto-create `auditLogs` entry | `apiVerifyPayment(paymentId, status, officer)` |
| **UC-006** Kelulusan | Daftar Siswa Terverifikasi + Aksi (Lulus/Tidak Lulus) | Update `students.pendaftaran_status` = `lulus` | `apiUpdateStudent(id, { pendaftaran_status: 'lulus' })` |
| **UC-007** Dashboard Kepsek | Executive Summary Cards (Read-Only) | Aggregate read: `students`, `documents`, `quotas`, `payments` | Client-side aggregation from `apiGetStudents()`, `apiGetDocuments()`, `apiGetQuotas()`, `apiGetPayments()` |
| **UC-007** Pengumuman Publik | Announcement Cards (sorted by date desc) | Read `announcements` docs (published: true) | `apiGetAnnouncements()` |
| **UC-004** Audit Log | Table Jejak Aktivitas (sorted by date desc) | Read `auditLogs` docs | `apiGetAuditLogs()` |

---

## 3. Detailed Integration Contracts

### 3.1 UC-001: Registrasi & Login

**Flow:**
```
/auth/register → AuthContext.register()
  → Firebase Auth: createUserWithEmailAndPassword
  → Firestore: setDoc(db, 'users', uid, { name, email, role: 'pendaftar', createdAt })
  → AuthContext.setUser({ id, name, email, role })
  → Redirect → /pendaftar/dashboard
```

**Validasi:** Nama required, Email required, Password min 6 karakter
**DB Write:** `users` collection (create)
**API Functions:** `AuthContext.register()`

### 3.2 UC-002: Biodata & Upload Berkas

**Flow:**
```
/pendaftar/biodata → apiGetStudents() → find by user_id
  → Jika ada: apiUpdateStudent(id, form)
  → Jika tidak: apiCreateStudent({ user_id, ...form })
  → Validasi: NISN = 10 digit, NIK = 16 digit
  → Toast: "Biodata berhasil disimpan"

/pendaftar/dokumen → apiGetStudents() + apiGetDocuments()
  → Upload file → uploadToCloudinary(file) → return URL
  → apiUpsertDocument(studentId, fileType, url)
  → Refresh documents list
  → File types: kk, akta, skhun, skl
  → Max size: 2MB per file
```

**DB Write:** `students` (create/update), `documents` (upsert)
**API Functions:** `apiCreateStudent`, `apiUpdateStudent`, `apiUpsertDocument`, `uploadToCloudinary`

### 3.3 UC-004: Verifikasi Berkas

**Flow:**
```
/panitia/verifikasi-berkas → apiVerifyDocument(docId, status, note)
  → Firestore: updateDoc (documents: verification_status, rejection_note)
  → Query: all documents where student_id == X
  → Check: all disetujui? → updateDoc (students: pendaftaran_status = 'terverifikasi')
  → Check: any ditolak? → updateDoc (students: pendaftaran_status = 'belum_lengkap')
```

**DB Write:** `documents` (update), `students` (auto-update)
**API Functions:** `apiVerifyDocument`

### 3.4 UC-005: Upload & Verifikasi Pembayaran

**Flow:**
```
/pendaftar/pembayaran → apiGetStudents() + apiGetPayments()
  → Display: Biaya Rp 250.000, Transfer ke BCA 1234567890
  → Upload bukti (JPG/PNG, max 2MB) → apiCreatePayment(studentId, fileName)
  → Refresh payment status

/bendahara/verifikasi-pembayaran → apiVerifyPayment(paymentId, status, officer)
  → Firestore: updateDoc (payments: payment_status, verified_at)
  → Jika status == 'lunas' atau 'ditolak':
    → addDoc (auditLogs: { action, student, amount, date, officer })
```

**DB Write:** `payments` (upsert), `auditLogs` (create on verify)
**API Functions:** `apiCreatePayment`, `apiVerifyPayment`

### 3.5 UC-007: Dashboard Kepsek

**Flow:**
```
/kepsek/dashboard → Parallel fetch:
  → apiGetStudents() → count by pendaftaran_status
  → apiGetDocuments() → count by verification_status
  → apiGetQuotas() → display remaining quota per program (Reguler/Tahfidz/Bilingual)
  → apiGetPayments() → sum by payment_status
  → Render: aggregate cards (read-only)
```

**DB Read:** `students`, `documents`, `quotas`, `payments` (aggregate)
**API Functions:** `apiGetStudents`, `apiGetDocuments`, `apiGetQuotas`, `apiGetPayments`

---

## 4. API Functions Reference

| Fungsi | HTTP Pattern | Collection | Deskripsi |
|---|---|---|---|
| `apiGetStudents()` | Read | `students` | Ambil semua siswa |
| `apiCreateStudent(data)` | Create | `students` | Buat siswa baru |
| `apiUpdateStudent(id, data)` | Update | `students` | Update data siswa |
| `apiGetDocuments()` | Read | `documents` | Ambil semua berkas |
| `apiUpsertDocument(sId, type, path)` | Create/Update | `documents` | Upsert berkas (kk/akta/skhun/skl) |
| `apiVerifyDocument(docId, status, note)` | Update | `documents` + `students` | Verifikasi + auto-update siswa |
| `apiGetPayments()` | Read | `payments` | Ambil semua pembayaran |
| `apiCreatePayment(sId, path)` | Create/Update | `payments` | Upsert pembayaran (Rp 250.000) |
| `apiVerifyPayment(pId, status, officer)` | Update | `payments` + `auditLogs` | Verifikasi + auto-create audit |
| `apiGetQuotas()` | Read | `quotas` | Ambil semua kuota |
| `apiUpdateQuota(id, data)` | Update | `quotas` | Update kuota |
| `apiGetTariffs()` | Read | `tariffs` | Ambil semua tarif |
| `apiCreateTariff(data)` | Create | `tariffs` | Tambah tarif |
| `apiUpdateTariff(id, data)` | Update | `tariffs` | Update tarif |
| `apiDeleteTariff(id)` | Delete | `tariffs` | Hapus tarif |
| `apiGetAnnouncements()` | Read | `announcements` | Ambil pengumuman (sorted desc) |
| `apiCreateAnnouncement(title, content)` | Create | `announcements` | Buat pengumuman |
| `apiGetAuditLogs()` | Read | `auditLogs` | Ambil audit log (sorted desc) |

---

## 5. Validation Status

| Use Case | Status | Keterangan |
|---|---|---|
| UC-001 | ✅ Validated | Auth flow sesuai dengan `AuthContext.tsx` |
| UC-002 | ✅ Validated | Data flow sesuai dengan `apiCreateStudent`, `apiUpsertDocument` + validasi NISN/NIK |
| UC-003 | ✅ Validated | Kuota & tarif sesuai dengan `apiUpdateQuota`, `apiCreateTariff` |
| UC-004 | ✅ Validated | Verifikasi sesuai dengan `apiVerifyDocument` (auto-update) |
| UC-005 | ✅ Validated | Pembayaran sesuai dengan `apiCreatePayment`, `apiVerifyPayment` (Rp 250.000) |
| UC-006 | ✅ Validated | Kelulusan sesuai dengan `apiUpdateStudent` |
| UC-007 | ✅ Validated | Dashboard sesuai dengan aggregate read pattern |

---

## 6. Traceability Matrix

| Use Case | UI Component | DB Collection | API Function | SoT Reference |
|---|---|---|---|---|
| UC-001 | Auth Forms | `users` | `AuthContext.login/register` | SoT-4 §UC-001 |
| UC-002 | Biodata Form + Upload Cards | `students`, `documents` | `apiCreateStudent`, `apiUpsertDocument` | SoT-4 §UC-002 |
| UC-003 | Kuota Form + Tariff CRUD | `quotas`, `tariffs` | `apiUpdateQuota`, `apiCreateTariff` | SoT-4 §UC-003 |
| UC-004 | Verification Table | `documents`, `students` | `apiVerifyDocument` | SoT-4 §UC-004 |
| UC-005 | Payment Info + Upload | `payments`, `auditLogs` | `apiCreatePayment`, `apiVerifyPayment` | SoT-4 §UC-005 |
| UC-006 | Graduation List | `students` | `apiUpdateStudent` | SoT-4 §UC-006 |
| UC-007 | Executive Dashboard | `students`, `documents`, `quotas`, `payments` | `apiGetStudents`, etc. | SoT-4 §UC-007 |
