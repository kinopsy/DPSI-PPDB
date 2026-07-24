# SIPDB — Sistem Informasi Penerimaan Peserta Didik Baru

Aplikasi PPDB Online untuk **SD Muhammadiyah Karangkajen Yogyakarta**. Dibangun dengan **Next.js 16** dan **Firebase Firestore**, mendukung pendaftaran online, verifikasi berkas, pembayaran, hingga pengumuman kelulusan — semua dalam satu platform terintegrasi.

**Kelompok:**
- Alfiardi Yuangga Saputra (2400016040)
- Zulfan Haidar Hammam (2400016025)
- Edi Wiyono (2400016037)
- Farhan Hanif El-Zaki (2400016085)
- Rafi Yudistira Prasetyo (2400016096)

## Daftar Isi

- [Fitur](#fitur)
- [Source of Truth (SoT)](#source-of-truth-sot)
- [Installation](#installation)
- [Folder Structure](#folder-structure)
- [Architecture](#architecture)
- [Packages](#packages)
- [Routing](#routing)
- [Role-based Access](#role-based-access)
- [State Management](#state-management)
- [API Layer](#api-layer)
- [Data Model](#data-model)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Fitur

| Role | Akses |
|------|-------|
| **Pendaftar** | Registrasi akun, pengisian biodata (NISN 10 digit, NIK 16 digit), upload berkas (KK, Akta, SKHUN, SKL), upload bukti transfer (Rp 250.000), melihat status pendaftaran |
| **Panitia** | Verifikasi berkas (setujui/tolak + catatan), kuota dinamis (Reguler/Tahfidz/Bilingual), manajemen kelulusan, buat pengumuman |
| **Bendahara** | Verifikasi pembayaran (lunas/ditolak), pengaturan tarif biaya, audit log |
| **Kepala Sekolah** | Dashboard ringkasan eksekutif (read-only) |

### Program Studi

| Program | Kuota | Deskripsi |
|---------|-------|-----------|
| Kelas Reguler (A) | 120 siswa | Kurikulum nasional dengan pendekatan modern |
| Kelas Tahfidz (B) | 80 siswa | Integrasi kurikulum nasional dengan tahfidz Qur'an |
| Kelas Bilingual (C) | 40 siswa | Pembelajaran metode bilingual Indonesia-Inggris |

### Alur Sistem

```
Registrasi → Login → Pengisian Biodata → Upload Berkas → Verifikasi Berkas (Panitia)
    → Upload Bukti Transfer (Rp 250.000) → Verifikasi Pembayaran (Bendahara)
    → Penentuan Kelulusan (Panitia) → Pengumuman
```

### Kredensial Demo

| Role | Email | Password |
|------|-------|----------|
| Pendaftar | `jaya@gmail.com` | `123456` |
| Panitia | `sukarno@gmail.com` | `123456` |
| Bendahara | `sudrajat@gmail.com` | `123456` |
| Bendahara | `rahmi@gmail.com` | `123456` |
| Kepala Sekolah | `herman@gmail.com` | `123456` |

## Source of Truth (SoT)

Dokumen-dokumen berikut didefinisikan mengikuti metodologi **Chain of Truth** (faridsurya-dev). Setiap SoT merupakan validasi dari artifact sebelumnya, menghubungkan kebutuhan bisnis hingga implementasi teknis secara end-to-end.

| SoT | Dokumen | Deskripsi |
|-----|---------|-----------|
| **SoT-1** | [`SoT-1_SRS.md`](docs/sot/SoT-1_SRS.md) | Software Requirements Specification — 18 fitur, 4 role, business rules, NFR |
| **SoT-2** | [`SoT-2_IA.md`](docs/sot/SoT-2_IA.md) | Information Architecture — 5 modul, 19 routes, layout strategy, routing rules |
| **SoT-3** | [`SoT-3_Design_System.md`](docs/sot/SoT-3_Design_System.md) | Design System — color palette, typography, component library, responsive breakpoints |
| **SoT-4** | [`SoT-4_User_Flows.md`](docs/sot/SoT-4_User_Flows.md) | User Flow Specifications — 7 use cases (UC-001 s/d UC-007), flow detail, business rules |
| **SoT-5** | [`SoT-5_Prototype.md`](docs/sot/SoT-5_Prototype.md) | Prototype Reference — component hierarchy, page-by-page mapping, data flow diagrams |
| **SoT-6** | [`SoT-6_Data_Model.md`](docs/sot/SoT-6_Data_Model.md) | Data Model — 8 Firestore collections, field definitions, relationships, indexes |
| **SoT-7** | [`SoT-7_UCIC.md`](docs/sot/SoT-7_UCIC.md) | Use Case Integration Contract — mapping UC → UI → DB → API, 18 API functions |

### User Flow Diagrams

Detail diagram untuk setiap use case tersedia di [`docs/sot/user_flow/`](docs/sot/user_flow/):

| File | Use Case |
|------|----------|
| [`userflow_UC-001.md`](docs/sot/user_flow/userflow_UC-001.md) | Registrasi & Login Akun |
| [`userflow_UC-002.md`](docs/sot/user_flow/userflow_UC-002.md) | Pengisian Formulir & Upload Berkas Wajib |
| [`userflow_UC-003.md`](docs/sot/user_flow/userflow_UC-003.md) | Pengaturan Kuota Dinamis & Tarif |
| [`userflow_UC-004.md`](docs/sot/user_flow/userflow_UC-004.md) | Verifikasi Berkas & Notifikasi Revisi |
| [`userflow_UC-005.md`](docs/sot/user_flow/userflow_UC-005.md) | Upload Bukti & Verifikasi Pembayaran |
| [`userflow_UC-006.md`](docs/sot/user_flow/userflow_UC-006.md) | Penentuan & Penerbitan Kelulusan |
| [`userflow_UC-007.md`](docs/sot/user_flow/userflow_UC-007.md) | Pemantauan Dashboard Eksekutif |

**Koneksi antar SoT:**
```
SoT-1 (SRS) → SoT-2 (IA) → SoT-3 (Design System)
                                    ↓
SoT-4 (User Flows) → SoT-5 (Prototype) → SoT-6 (Data Model) → SoT-7 (UCIC)
                                    ↓
                        user_flow/ (per UC diagrams)
```

## Installation

### Prasyarat

- Node.js **^18+** ([download](https://nodejs.org/))
- npm atau yarn atau pnpm
- Akun Firebase (project `dpsi-ppdb`)
- Akun Cloudinary (untuk upload file)

### Langkah

```bash
# 1. Clone repository
git clone https://github.com/kinopsy/DPSI-PPDB.git
cd DPSI-PPDB

# 2. Install dependencies (Next.js app)
cd ppdb-next
npm install

# 3. Jalankan development server
npm run dev

# 4. Buka browser
# http://localhost:3000
```

### Frontend Prototype (Static HTML)

```bash
# Catatan: ppdb-frontend adalah prototipe independen TANPA backend
# Semua data disimpan di localStorage, bukan Firebase

# Tanpa server — buka langsung
# Buka ppdb-frontend/index.html di browser

# Atau dengan local server
cd ppdb-frontend
python -m http.server 8000
# Buka http://localhost:8000
```

## Folder Structure

```
DPSI-PPDB/
├── docs/                               # Dokumen proyek
│   ├── sot/                            # Source of Truth (Chain of Truth)
│   │   ├── SoT-1_SRS.md
│   │   ├── SoT-2_IA.md
│   │   ├── SoT-3_Design_System.md
│   │   ├── SoT-4_User_Flows.md
│   │   ├── SoT-5_Prototype.md
│   │   ├── SoT-6_Data_Model.md
│   │   ├── SoT-7_UCIC.md
│   │   └── user_flow/                  # User flow diagrams per UC
│   │       ├── userflow_UC-001.md
│   │       ├── userflow_UC-002.md
│   │       ├── userflow_UC-003.md
│   │       ├── userflow_UC-004.md
│   │       ├── userflow_UC-005.md
│   │       ├── userflow_UC-006.md
│   │       └── userflow_UC-007.md
|
|
│   ├── analisis_kebutuhan/             # Analisis Kebutuhan — original
│   ├── class_diagram/                  # Class Diagram & Data Model (Firestore)
│   └── observasi/                      # Transkrip Wawancara
├── ppdb-next/                          # Aplikasi utama (Next.js + Firebase)
│   ├── src/
│   │   ├── app/                        # Next.js App Router pages (19 routes)
│   │   │   ├── auth/                   # Login & Register
│   │   │   ├── pendaftar/              # Dashboard pendaftar
│   │   │   ├── panitia/                # Dashboard panitia
│   │   │   ├── bendahara/              # Dashboard bendahara
│   │   │   ├── kepsek/                 # Dashboard kepsek
│   │   │   └── pengumuman/             # Halaman pengumuman publik
│   │   ├── components/                 # Shared components
│   │   │   ├── Providers.tsx           # AuthProvider + DashboardLayout wrapper
│   │   │   ├── DashboardLayout.tsx     # Auth guard + Sidebar + Header
│   │   │   ├── Sidebar.tsx             # Navigasi sidebar per role
│   │   │   ├── Navbar.tsx              # Navbar publik (desktop + mobile)
│   │   │   └── UI.tsx                  # Modal, Toast, StatusBadge, FileUpload
│   │   ├── context/
│   │   │   └── AuthContext.tsx          # Firebase Auth context
│   │   └── lib/
│   │       ├── firebase.ts             # Firebase config & init
│   │       ├── api.ts                  # Firestore CRUD API (18 functions)
│   │       ├── types.ts                # TypeScript interfaces (8 collections)
│   │       └── cloudinary.ts           # Cloudinary upload utility
│   ├── public/                         # Static assets (logo.png)
│   └── package.json
|
└── README.md                           # File ini
```

## Architecture

### Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Authentication | Firebase Authentication (email + password) |
| Database | Firebase Firestore (NoSQL, project: `dpsi-ppdb`) |
| File Storage | Cloudinary (cloud name: `fb73ycvg`, preset: `ppdb_ml_default`) |
| Deployment | Vercel |

### Component Architecture

```
RootLayout
  └─ Providers (AuthProvider + DashboardLayout)
       ├─ [Public] Navbar + children (tanpa sidebar)
       └─ [Dashboard] Sidebar + Header + children
```

### Alur Autentikasi

```
LoginPage
  └─ signInWithEmailAndPassword (Firebase Auth)
        └─ getDoc(doc(db, 'users', uid))
              └─ { name, email, role }
                    └─ setUser() → AuthContext
                          └─ DashboardLayout: render Sidebar + Header
                          └─ redirect ke /{role}/dashboard
```

### Alur Verifikasi Berkas

```
Panitia klik "Setujui"/"Tolak"
  └─ apiVerifyDocument(docId, status, note)
        └─ updateDoc(doc, { verification_status, rejection_note })
        └─ query semua berkas siswa
              └─ semua disetujui? → students.pendaftaran_status = 'terverifikasi'
              └─ ada yang ditolak? → students.pendaftaran_status = 'belum_lengkap'
```

### Alur Verifikasi Pembayaran

```
Bendahara klik "Lunas"/"Tolak"
  └─ apiVerifyPayment(paymentId, status, officer)
        └─ updateDoc(doc, { payment_status, verified_at })
        └─ addDoc(auditLogs, { action, student, amount, date, officer })
```

## Packages

### Dependencies

| Package | Versi | Fungsi |
|---------|-------|--------|
| `next` | 16.2.10 | Framework frontend |
| `react` | 19.2.4 | UI library |
| `react-dom` | 19.2.4 | React DOM renderer |
| `firebase` | ^12.16.0 | Firebase SDK (Auth + Firestore) |
| `mongodb` | ^7.5.0 | MongoDB driver (tersedia, belum digunakan) |

### Dev Dependencies

| Package | Versi | Fungsi |
|---------|-------|--------|
| `typescript` | ^5 | Type checking |
| `tailwindcss` | ^4 | Utility-first CSS |
| `@tailwindcss/postcss` | ^4 | PostCSS plugin untuk Tailwind |
| `eslint` | ^9 | Code linting |
| `eslint-config-next` | 16.2.10 | ESLint config untuk Next.js |
| `@types/node` | ^20 | TypeScript types untuk Node.js |
| `@types/react` | ^19 | TypeScript types untuk React |
| `@types/react-dom` | ^19 | TypeScript types untuk ReactDOM |

## Routing

### Route Definitions

Semua route menggunakan **Next.js App Router** (file-based routing). Total: **19 routes**.

| Path | Role | Halaman |
|------|------|---------|
| `/` | Publik | Beranda (hero, stats, fitur, program, pengumuman, CTA) |
| `/auth/login` | — | Login (split layout: gradient + form) |
| `/auth/register` | — | Register (split layout: gradient + form) |
| `/pengumuman` | Publik | Daftar pengumuman |
| `/pendaftar/dashboard` | Pendaftar | Dashboard (progres, status, menu cepat) |
| `/pendaftar/biodata` | Pendaftar | Form biodata (11 fields) |
| `/pendaftar/dokumen` | Pendaftar | Upload berkas (KK, Akta, SKHUN, SKL) |
| `/pendaftar/pembayaran` | Pendaftar | Upload bukti transfer (Rp 250.000) |
| `/pendaftar/status` | Pendaftar | Status pendaftaran |
| `/panitia/dashboard` | Panitia | Dashboard panitia |
| `/panitia/verifikasi-berkas` | Panitia | Verifikasi berkas pendaftar |
| `/panitia/kuota-dinamis` | Panitia | Pengaturan kuota per program |
| `/panitia/kelulusan` | Panitia | Manajemen kelulusan |
| `/panitia/pengumuman` | Panitia | Buat & kelola pengumuman |
| `/bendahara/dashboard` | Bendahara | Dashboard (rekap pembayaran) |
| `/bendahara/verifikasi-pembayaran` | Bendahara | Validasi pembayaran |
| `/bendahara/tarif-biaya` | Bendahara | Pengaturan komponen biaya |
| `/bendahara/audit-log` | Bendahara | Jejak audit aktivitas |
| `/kepsek/dashboard` | Kepsek | Dashboard eksekutif (read-only) |

### Layout Strategy

- **Publik** (`/`, `/auth/*`, `/pengumuman`): `DashboardLayout` render `<>{children}</>` + `Navbar`
- **Dashboard** (`/pendaftar/*`, `/panitia/*`, `/bendahara/*`, `/kepsek/*`): `DashboardLayout` dengan `Sidebar` + `Header` + main content

### Auth Guard

```
DashboardLayout:
  if (loading) → spinner "Memuat..."
  if (!user) → render children (public mode)
  if (user) → render Sidebar + Header + children (dashboard mode)
```

## Role-based Access

### Pendaftar (Orang Tua / Wali Murid)
- **Sidebar:** Dashboard, Biodata, Dokumen, Pembayaran, Status
- **Aksi:** Isi biodata (NISN 10 digit, NIK 16 digit), upload KK/Akta/SKHUN/SKL, upload bukti transfer (Rp 250.000), lihat status

### Panitia (Admin Sekolah)
- **Sidebar:** Dashboard, Verifikasi Berkas, Kuota Dinamis, Kelulusan, Buat Pengumuman
- **Aksi:** Setujui/tolak berkas (+ catatan), atur kuota (Reguler/Tahfidz/Bilingual), tetapkan kelulusan, buat pengumuman

### Bendahara (Keuangan)
- **Sidebar:** Dashboard, Verifikasi Pembayaran, Tarif Biaya, Audit Log
- **Aksi:** Validasi pembayaran (lunas/ditolak), kelola tarif, lihat audit log

### Kepala Sekolah (Eksekutif)
- **Sidebar:** Dashboard
- **Aksi:** Lihat ringkasan statistik (read-only)

## State Management

Menggunakan **React Context** (AuthContext) untuk autentikasi dan state global:

### AuthContext

```typescript
// context/AuthContext.tsx
interface AuthUser {
  id: string;       // Firebase Auth UID
  name: string;
  email: string;
  role: string;     // 'pendaftar' | 'panitia' | 'bendahara' | 'kepsek'
}

// Menyediakan: user, loading, login(), register(), logout()
```

### Data Fetching

Data di-fetch langsung dari Firestore menggunakan fungsi di `api.ts`:

```typescript
const students = await apiGetStudents();
const payments = await apiGetPayments();
const quotas = await apiGetQuotas();
```

Tidak ada library state management tambahan — semua state dikelola secara lokal di setiap halaman menggunakan `useState` dan `useEffect`.

## API Layer

### Firestore API (`lib/api.ts`)

| Fungsi | Collection | Keterangan |
|--------|-----------|------------|
| `apiGetStudents()` | `students` | Ambil semua siswa |
| `apiCreateStudent(data)` | `students` | Tambah siswa baru |
| `apiUpdateStudent(id, data)` | `students` | Update data siswa |
| `apiGetDocuments()` | `documents` | Ambil semua berkas |
| `apiUpsertDocument(studentId, fileType, filePath)` | `documents` | Upload/update berkas (upsert) |
| `apiVerifyDocument(docId, status, note?)` | `documents` | Verifikasi berkas + auto-update status siswa |
| `apiGetPayments()` | `payments` | Ambil semua pembayaran |
| `apiCreatePayment(studentId, proofPath)` | `payments` | Upload bukti pembayaran (upsert) |
| `apiVerifyPayment(paymentId, status, officer?)` | `payments` | Validasi pembayaran + buat audit log |
| `apiGetQuotas()` | `quotas` | Ambil semua kuota |
| `apiUpdateQuota(id, data)` | `quotas` | Update kuota |
| `apiGetTariffs()` | `tariffs` | Ambil semua tarif |
| `apiCreateTariff(data)` | `tariffs` | Tambah tarif baru |
| `apiUpdateTariff(id, data)` | `tariffs` | Update tarif |
| `apiDeleteTariff(id)` | `tariffs` | Hapus tarif |
| `apiGetAnnouncements()` | `announcements` | Ambil pengumuman (sorted by date desc) |
| `apiCreateAnnouncement(title, content)` | `announcements` | Buat pengumuman baru |
| `apiGetAuditLogs()` | `auditLogs` | Ambil audit log (sorted by date desc) |

### Cloudinary Upload (`lib/cloudinary.ts`)

```typescript
uploadToCloudinary(file: File): Promise<string>
// Mengembalikan secure_url dari Cloudinary
// Cloud name: fb73ycvg
// Upload preset: ppdb_ml_default
// Format: PDF, JPG, PNG (max 2MB)
```

## Data Model

### Firestore Collections

| Collection | Deskripsi |
|-----------|-----------|
| `users` | Akun pengguna (Firebase Auth UID, role: pendaftar/panitia/bendahara/kepsek) |
| `students` | Biodata siswa (NISN 10 digit, NIK 16 digit, status pendaftaran) |
| `documents` | Berkas persyaratan (kk, akta, skhun, skl) + status verifikasi |
| `payments` | Bukti pembayaran (Rp 250.000) + status verifikasi |
| `quotas` | Kuota per program (Reguler: 120, Tahfidz: 80, Bilingual: 40) |
| `tariffs` | Komponen biaya PPDB |
| `announcements` | Pengumuman resmi |
| `auditLogs` | Jejak audit verifikasi pembayaran & perubahan tarif |

### TypeScript Interfaces

```typescript
interface User {
  id: string; name: string; email: string;
  role: 'pendaftar' | 'panitia' | 'bendahara' | 'kepsek';
}

interface Student {
  id: string; user_id: string | null;
  nisn: string; name: string; nik: string;
  tempat_lahir: string; tanggal_lahir: string;
  jenis_kelamin: string; agama: string;
  alamat: string; telepon: string; asal_sekolah: string;
  pendaftaran_status: string; // menunggu_verifikasi | terverifikasi | belum_lengkap | lulus
}

interface Document {
  id: string; student_id: string;
  file_type: string; // kk | akta | skhun | skl
  file_path: string;
  verification_status: string; // menunggu | disetujui | ditolak
  rejection_note: string | null;
}

interface Payment {
  id: string; student_id: string;
  proof_file_path: string;
  payment_status: string; // pending | lunas | ditolak
  verified_at: string | null;
}
```

Detail lengkap lihat di [`docs/class_diagram/data_model.md`](docs/class_diagram/data_model.md).

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd ppdb-next
vercel

# Atau hubungkan repository GitHub ke Vercel Dashboard
```

### Konfigurasi Firebase

Pastikan project Firebase `dpsi-ppdb` sudah dikonfigurasi dengan:
- **Firebase Authentication:** Email/Password provider aktif
- **Firestore Database:** Rules sudah disesuaikan
- **Cloudinary:** Upload preset `ppdb_ml_default` aktif

### Deployment Links

- https://ppdb-next-ten.vercel.app/
- https://github.com/kinopsy/DPSI-PPDB.git

## Troubleshooting

### `npm run dev` gagal

```bash
# Hapus node_modules dan reinstall
rm -rf node_modules
npm install
```

### Firebase permission denied

Pastikan Firestore Rules mengizinkan akses:
- Development: `allow read, write: if true;`
- Production: Sesuaikan dengan kebutuhan (lihat `data_model.md` Section 7)

### Cloudinary upload gagal

Pastikan upload preset `ppdb_ml_default` aktif di Cloudinary Dashboard.

### Halaman kosong setelah login

```bash
# Pastikan redirect berfungsi
# Login → /{role}/dashboard
# Contoh: /pendaftar/dashboard
```

### TypeScript errors

```bash
npx tsc --noEmit
```
