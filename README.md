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
| **Pendaftar** | Registrasi akun, pengisian biodata, upload berkas (KK & Akta), upload bukti transfer, melihat status pendaftaran |
| **Panitia** | Verifikasi berkas, kuota dinamis, manajemen kelulusan, buat pengumuman |
| **Bendahara** | Verifikasi pembayaran, pengaturan tarif biaya, audit log |
| **Kepala Sekolah** | Dashboard ringkasan eksekutif (read-only) |

### Alur Sistem

```
Registrasi → Login → Pengisian Biodata → Upload Berkas → Verifikasi Berkas (Panitia)
    → Upload Bukti Transfer → Verifikasi Pembayaran (Bendahara)
    → Penentuan Kelulusan (Panitia) → Pengumuman
```

### Kredensial Demo (Frontend Prototype)

| Role | Email | Password |
|------|-------|----------|
| Pendaftar | `evan@user.com` | `123456` |
| Panitia | `haidar@gmail.com` | `123456` |
| Bendahara | `sudrajat@user.com` | `123456` |
| Kepala Sekolah | `alfiardichannel@gmail.com` | `12345678` |

## Installation

### Prasyarat

- Node.js **^18+** ([download](https://nodejs.org/))
- npm atau yarn atau pnpm
- Akun Firebase (project `dpsi-ppdb`)
- Akun Cloudinary (untuk upload file)

### Langkah

```bash
# 1. Clone repository
git clone <repository-url> DPSI-PPDB
cd DPSI-PPDB

# 2. Install dependencies (Next.js app)
cd ppdb-next
npm install

# 3. Buat file .env.local (opsional — Firebase config hardcode di firebase.ts)
# Berisi environment variables jika diperlukan

# 4. Jalankan development server
npm run dev

# 5. Buka browser
# http://localhost:3000
```

### Frontend Prototype (Static HTML)

```bash
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
│   ├── 01-requirements/                # SRS (SoT-1)
│   ├── 02-architecture/                # IA (SoT-2), SAD (SoT-5)
│   ├── 03-design/                      # Design System (SoT-3)
│   ├── 04-user-flows/                  # User Flows (SoT-4)
│   ├── 05-api/                         # API Contract (SoT-6)
│   ├── 06-integration/                 # Integration (SoT-7)
│   ├── analisis_kebutuhan/             # Analisis Kebutuhan
│   ├── class_diagram/                  # Class Diagram & Data Model
│   └── observasi/                      # Transkrip Wawancara
├── ppdb-next/                          # Aplikasi utama (Next.js)
│   ├── src/
│   │   ├── app/                        # Next.js App Router pages
│   │   │   ├── auth/                   # Login & Register
│   │   │   ├── pendaftar/              # Dashboard pendaftar
│   │   │   ├── panitia/                # Dashboard panitia
│   │   │   ├── bendahara/              # Dashboard bendahara
│   │   │   ├── kepsek/                 # Dashboard kepsek
│   │   │   └── pengumuman/             # Halaman pengumuman publik
│   │   ├── components/                 # Shared components
│   │   │   ├── DashboardLayout.tsx     # Layout dengan sidebar
│   │   │   ├── Sidebar.tsx             # Navigasi sidebar per role
│   │   │   ├── Navbar.tsx              # Navbar publik
│   │   │   ├── Providers.tsx           # Auth & layout provider
│   │   │   └── UI.tsx                  # Shared UI components
│   │   ├── context/
│   │   │   └── AuthContext.tsx          # Firebase Auth context
│   │   └── lib/
│   │       ├── firebase.ts             # Firebase config & init
│   │       ├── api.ts                  # Firestore CRUD API
│   │       ├── types.ts                # TypeScript interfaces
│   │       └── cloudinary.ts           # Cloudinary upload
│   ├── public/                         # Static assets
│   └── package.json
├── ppdb-frontend/                      # Frontend prototype (static HTML)
│   ├── index.html                      # SPA entry point
│   ├── assets/
│   │   ├── css/                        # Design system & layout
│   │   └── js/                         # Router, app, mock data, pages
│   └── IMPLEMENTATION_NOTES.md
├── contoh_README.md                    # Contoh format README
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
| Authentication | Firebase Authentication |
| Database | Firebase Firestore (NoSQL) |
| File Storage | Cloudinary |
| Deployment | Vercel (frontend) |

### Alur Autentikasi

```
LoginPage
  └─ signInWithEmailAndPassword (Firebase Auth)
        └─ getDoc(doc(db, 'users', uid))
              └─ { name, email, role }
                    └─ setUser() → AuthContext
                          └─ redirect ke /{role}/dashboard
```

### Alur Verifikasi Berkas

```
Panitia klik "Setujui"/"Tolak"
  └─ apiVerifyDocument(docId, status, note)
        └─ updateDoc(doc, { verification_status, rejection_note })
        └─ query semua berkas siswa
              └─ semua disetujui? →学生.pendaftaran_status = 'terverifikasi'
              └─ ada yang ditolak? →学生.pendaftaran_status = 'belum_lengkap'
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

Semua route menggunakan **Next.js App Router** (file-based routing).

| Path | Role | Halaman |
|------|------|---------|
| `/` | Publik | Beranda (homepage) |
| `/auth/login` | — | Login |
| `/auth/register` | — | Register |
| `/pengumuman` | Publik | Daftar pengumuman |
| `/pendaftar/dashboard` | Pendaftar | Dashboard pendaftar |
| `/pendaftar/biodata` | Pendaftar | Form pengisian biodata |
| `/pendaftar/dokumen` | Pendaftar | Upload berkas persyaratan |
| `/pendaftar/pembayaran` | Pendaftar | Upload bukti transfer |
| `/pendaftar/status` | Pendaftar | Status pendaftaran |
| `/panitia/dashboard` | Panitia | Dashboard panitia |
| `/panitia/verifikasi-berkas` | Panitia | Verifikasi berkas pendaftar |
| `/panitia/kuota-dinamis` | Panitia | Pengaturan kuota per program |
| `/panitia/kelulusan` | Panitia | Manajemen kelulusan |
| `/panitia/pengumuman` | Panitia | Buat & kelola pengumuman |
| `/bendahara/dashboard` | Bendahara | Dashboard bendahara |
| `/bendahara/verifikasi-pembayaran` | Bendahara | Validasi pembayaran |
| `/bendahara/tarif-biaya` | Bendahara | Pengaturan komponen biaya |
| `/bendahara/audit-log` | Bendahara | Jejak audit aktivitas |
| `/kepsek/dashboard` | Kepsek | Dashboard eksekutif (read-only) |

### Layout Strategy

- **Publik** (`/`, `/auth/*`, `/pengumuman`): Menggunakan `Navbar` saja tanpa sidebar
- **Dashboard** (`/pendaftar/*`, `/panitia/*`, `/bendahara/*`, `/kepsek/*`): Menggunakan `DashboardLayout` dengan sidebar + header

### Auth Guard

```
AuthContext:
  if (!user && path bukan /auth/*) → redirect ke /auth/login
  if (user && path == /auth/*)     → redirect ke /{role}/dashboard
```

## Role-based Access

### Pendaftar (Orang Tua / Wali Murid)
- **Sidebar:** Dashboard, Biodata, Dokumen, Pembayaran, Status
- **Aksi:** Isi biodata, upload KK & Akta, upload bukti transfer, lihat status

### Panitia (Admin Sekolah)
- **Sidebar:** Dashboard, Verifikasi Berkas, Kuota Dinamis, Kelulusan, Buat Pengumuman
- **Aksi:** Setujui/tolak berkas, atur kuota, tetapkan kelulusan, buat pengumuman

### Bendahara (Keuangan)
- **Sidebar:** Dashboard, Verifikasi Pembayaran, Tarif Biaya, Audit Log
- **Aksi:** Validasi pembayaran (lunas/tolak), kelola tarif, lihat audit log

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
// Contoh pengambilan data
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
// Upload preset: ppdb_ml_default
// Cloud name: fb73ycvg
```

## Data Model

### Firestore Collections

| Collection | Deskripsi |
|-----------|-----------|
| `users` | Akun pengguna (Firebase Auth UID) |
| `students` | Biodata siswa calon pendaftar |
| `documents` | Berkas persyaratan (KK, Akta, dll.) |
| `payments` | Bukti pembayaran |
| `quotas` | Kuota per program studi |
| `tariffs` | Komponen biaya PPDB |
| `announcements` | Pengumuman resmi |
| `auditLogs` | Jejak audit aktivitas |

### TypeScript Interfaces

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'pendaftar' | 'panitia' | 'bendahara' | 'kepsek';
}

interface Student {
  id: string;
  user_id: string | null;
  nisn: string;
  name: string;
  nik: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  agama: string;
  alamat: string;
  telepon: string;
  asal_sekolah: string;
  pendaftaran_status: string;
}

interface Document {
  id: string;
  student_id: string;
  file_type: string;
  file_path: string;
  verification_status: string;
  rejection_note: string | null;
}

interface Payment {
  id: string;
  student_id: string;
  proof_file_path: string;
  payment_status: string;
  verified_at: string | null;
}
```

Detail lengkap lihat di [`docs/class_diagram/data_model.md`](docs/class_diagram/data_model.md).

## Deployment

### Next.js App (Production)

```bash
cd ppdb-next

# Build
npm run build

# Output: .next/
# Deploy ke Vercel atau platform lain yang mendukung Next.js
```

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd ppdb-next
vercel

# Atau hubungkan repository GitHub ke Vercel Dashboard
```

### Frontend Prototype

```bash
# Static files — deploy ke any web server
# Upload seluruh folder ppdb-frontend/ ke web server (nginx, Apache, dll.)
```

### Konfigurasi Firebase

Pastikan project Firebase `dpsi-ppdb` sudah dikonfigurasi dengan:
- **Firebase Authentication:** Email/Password provider aktif
- **Firestore Database:** Rules sudah disesuaikan
- **Cloudinary:** Upload preset `ppdb_ml_default` aktif

## Troubleshooting

### `npm run dev` gagal

```
Error: Cannot find module '...'
```

```bash
# Hapus node_modules dan reinstall
rm -rf node_modules
npm install
```

### Firebase permission denied

```
FirebaseError: Missing or insufficient permissions
```

Pastikan Firestore Rules mengizinkan akses:
- Development: `allow read, write: if true;`
- Production: Sesuaikan dengan kebutuhan (lihat `data_model.md` Section 7)

### Cloudinary upload gagal

```
Error: Invalid upload preset
```

Pastikan upload preset `ppdb_ml_default` aktif di Cloudinary Dashboard.

### Halaman kosong setelah login

```bash
# Pastikan redirect berfungsi
# Login → /{role}/dashboard
# Contoh: /pendaftar/dashboard
```

### Deployment

- https://ppdb-next-ten.vercel.app/  
- https://github.com/kinopsy/DPSI-PPDB.git -- repo

### TypeScript errors

```bash
# Jalankan type checking
npx tsc --noEmit
```

