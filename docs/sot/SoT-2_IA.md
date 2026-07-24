# SoT-2: Information Architecture (IA)

**Document Version:** v2.0

**Project:** SIPDB — Sistem Informasi Penerimaan Peserta Didik Baru

**Product:** Web-Based PPDB Management System (Next.js + Firebase)

**Status:** Validated

**Last Updated:** 2026-07-24



---

## 1. Product Structure

### 1.1 Product Modules

| ID | Modul | Deskripsi | Target Pengguna |
|---|---|---|---|
| M-01 | Public Module | Halaman sebelum login: Beranda, Pengumuman, Login/Daftar | Semua pengunjung |
| M-02 | Applicant Module | Dashboard pendaftar: Biodata, Dokumen, Pembayaran, Status | Pendaftar |
| M-03 | Admin/Panitia Module | Dashboard panitia: Verifikasi Berkas, Kuota, Kelulusan, Pengumuman | Panitia |
| M-04 | Finance Module | Dashboard bendahara: Verifikasi Pembayaran, Tarif, Audit Log | Bendahara |
| M-05 | Executive Module | Dashboard kepsek: Ringkasan Statistik Real-time (Read-Only) | Kepala Sekolah |

---

## 2. Site Map & Routing Conventions

### 2.1 Complete Route Map

| Route | Modul | Halaman | Akses |
|---|---|---|---|
| `/` | Public | Beranda utama (hero, stats, fitur, program, pengumuman) | Semua |
| `/pengumuman` | Public | Pengumuman publik | Semua |
| `/auth/login` | Public | Formulir login (split layout) | Public |
| `/auth/register` | Public | Formulir registrasi (split layout) | Public |
| `/pendaftar/dashboard` | Applicant | Dashboard pendaftar (progres, status, menu cepat) | Pendaftar |
| `/pendaftar/biodata` | Applicant | Formulir biodata siswa | Pendaftar |
| `/pendaftar/dokumen` | Applicant | Upload berkas (KK, Akta, SKHUN, SKL) | Pendaftar |
| `/pendaftar/pembayaran` | Applicant | Upload bukti bayar (Rp 250.000) | Pendaftar |
| `/pendaftar/status` | Applicant | Status pendaftaran | Pendaftar |
| `/panitia/dashboard` | Admin | Dashboard panitia | Panitia |
| `/panitia/verifikasi-berkas` | Admin | Verifikasi berkas | Panitia |
| `/panitia/kuota-dinamis` | Admin | Pengaturan kuota | Panitia |
| `/panitia/kelulusan` | Admin | Penentuan kelulusan | Panitia |
| `/panitia/pengumuman` | Admin | Buat pengumuman | Panitia |
| `/bendahara/dashboard` | Finance | Dashboard bendahara | Bendahara |
| `/bendahara/verifikasi-pembayaran` | Finance | Validasi pembayaran | Bendahara |
| `/bendahara/tarif-biaya` | Finance | Pengaturan tarif | Bendahara |
| `/bendahara/audit-log` | Finance | Jejak audit | Bendahara |
| `/kepsek/dashboard` | Executive | Dashboard eksekutif | Kepsek |

### 2.2 Navigation Structure

```
Sidebar Navigation (per role):
├── Pendaftar
│   ├── Dashboard → /pendaftar/dashboard
│   ├── Biodata → /pendaftar/biodata
│   ├── Dokumen → /pendaftar/dokumen
│   ├── Pembayaran → /pendaftar/pembayaran
│   └── Status → /pendaftar/status
├── Panitia
│   ├── Dashboard → /panitia/dashboard
│   ├── Verifikasi Berkas → /panitia/verifikasi-berkas
│   ├── Kuota Dinamis → /panitia/kuota-dinamis
│   ├── Kelulusan → /panitia/kelulusan
│   └── Buat Pengumuman → /panitia/pengumuman
├── Bendahara
│   ├── Dashboard → /bendahara/dashboard
│   ├── Verifikasi Pembayaran → /bendahara/verifikasi-pembayaran
│   ├── Tarif Biaya → /bendahara/tarif-biaya
│   └── Audit Log → /bendahara/audit-log
├── Kepsek
│   └── Dashboard → /kepsek/dashboard
└── Bottom Links
    ├── Pengumuman → /pengumuman (semua role)
    └── Beranda → / (panitia only)
```

---

## 3. Layout Architecture

### 3.1 Layout Strategy

| Layout | Komponen | Digunakan untuk |
|---|---|---|
| Root Layout | `layout.tsx` → `Providers` → `DashboardLayout` | Semua halaman |
| Public Mode | `DashboardLayout` render `<>{children}</>` (tanpa sidebar) | `/`, `/auth/*`, `/pengumuman` |
| Dashboard Mode | `DashboardLayout` render Sidebar + Header + Main | `/pendaftar/*`, `/panitia/*`, `/bendahara/*`, `/kepsek/*` |

### 3.2 Component Hierarchy

```
RootLayout
  └─ Providers (AuthProvider + DashboardLayout)
       ├─ [Public] children (tanpa sidebar, menggunakan Navbar)
       └─ [Dashboard] Sidebar + Header + children
```

### 3.3 Routing Rules

| Aturan | Deskripsi |
|---|---|
| Unauthenticated Access | Pengguna yang belum login dan mengakses rute internal otomatis dialihkan ke `/auth/login` |
| Role-Based Access | Hak akses lintas peran ditolak — sidebar hanya menampilkan menu sesuai role |
| Post-Login Redirect | Setelah login, pengguna dialihkan ke dashboard sesuai role |
| Logout | Menghapus session Firebase Auth, redirect ke `/` |
| Public Pages | `/`, `/pengumuman`, `/auth/login`, `/auth/register` dapat diakses tanpa login |
| Loading State | Saat auth state belum loaded, menampilkan spinner "Memuat..." |

---

## 4. Content Architecture

### 4.1 Public Pages

| Halaman | Konten |
|---|---|
| Beranda (`/`) | Hero section (gradient dark blue), statistik kuota (3 card), 3 fitur utama, 3 program kelas, pengumuman terbaru, CTA daftar, footer |
| Pengumuman (`/pengumuman`) | Header gradient, daftar pengumuman (card dengan published badge) |
| Login (`/auth/login`) | Split layout: kiri gradient info + kanan form email + password |
| Register (`/auth/register`) | Split layout: kiri gradient info + kanan form nama + email + password |

### 4.2 Pendaftar Pages

| Halaman | Konten |
|---|---|
| Dashboard | Welcome banner (gradient), 3 status card (status, dokumen, pembayaran), progres bar, 4 menu cepat |
| Biodata | Form: NISN (10 digit), NIK (16 digit), nama, tempat/tanggal lahir, jenis kelamin, agama, telepon, alamat, asal sekolah |
| Dokumen | 4 row berkas (KK, Akta, SKHUN, SKL) — masing-masing dengan upload button, status badge, rejection note |
| Pembayaran | Info biaya (Rp 250.000, rekening BCA), status badge, upload button |
| Status | Ringkasan: status pendaftaran, daftar dokumen + status, status pembayaran |

### 4.3 Panitia Pages

| Halaman | Konten |
|---|---|
| Dashboard | Welcome banner, statistik, aksi cepat |
| Verifikasi Berkas | Tabel antrian berkas — aksi Setujui/Tolak + catatan |
| Kuota Dinamis | Pengaturan kuota per program (Reguler, Tahfidz, Bilingual) + deadline |
| Kelulusan | Daftar siswa terverifikasi — aksi Lulus/Tidak Lulus |
| Pengumuman | Form buat pengumuman baru (judul + konten) |

### 4.4 Bendahara Pages

| Halaman | Konten |
|---|---|
| Dashboard | Welcome banner, 4 statistik (transaksi, lunas, pending, pendapatan), aksi cepat, daftar komponen biaya |
| Verifikasi Pembayaran | Tabel bukti bayar — aksi Lunas/Ditolak + preview gambar |
| Tarif Biaya | CRUD komponen biaya (nama, nominal, deskripsi) |
| Audit Log | Tabel jejak aktivitas (sorted by date desc) |

### 4.5 Kepsek Pages

| Halaman | Konten |
|---|---|
| Dashboard | Satu halaman ringkasan eksekutif — statistik agregat, kuota, dana masuk (read-only) |

---

## 5. Validation Status

| Aspek | Status | Keterangan |
|---|---|---|
| Module Structure | ✅ Validated | 5 modul sesuai dengan 4 role + public |
| Route Map | ✅ Validated | 19 routes sesuai dengan file `page.tsx` di `src/app/` |
| Navigation | ✅ Validated | Sesuai dengan `Sidebar.tsx` NAV_ITEMS + BOTTOM_LINKS |
| Layout | ✅ Validated | `Providers.tsx` → `DashboardLayout.tsx` handles auth guard + sidebar |
| Content Pages | ✅ Validated | Setiap route memiliki page.tsx implementasi |
| Routing Rules | ✅ Validated | Sesuai dengan `AuthContext.tsx` dan `DashboardLayout.tsx` |
