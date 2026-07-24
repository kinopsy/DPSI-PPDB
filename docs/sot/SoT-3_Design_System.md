# SoT-3: Design System

**Document Version:** v2.0

**Project:** SIPDB — Sistem Informasi Penerimaan Peserta Didik Baru

**Product:** Web-Based PPDB Management System (Next.js + Firebase)

**Status:** Validated

**Last Updated:** 2026-07-24

**Source:** Derived from SoT-2 (IA) and validasi source code (`ppdb-next/src/`, Tailwind CSS 4)

---

## 1. Design Principles

| Prinsip | Deskripsi |
|---|---|
| Modern & Clean | Tampilan minimalis-modern, profesional untuk institusi pendidikan |
| Mobile-Friendly First | Responsive — orang tua dapat mengakses dari ponsel |
| Intuitif | Interface sederhana — non-tech-savvy user dapat menggunakannya |
| Konsisten | Pola komponen seragam di seluruh halaman |
| Terstruktur | Informasi tersusun rapi, mudah dipindai |

---

## 2. Color Palette & Tokens

### 2.1 Primary Colors (Hero Gradients)

| Token | Warna | Hex | Penggunaan |
|---|---|---|---|
| Hero Dark | Deep Navy | `#0D104A` | Hero section gradient start/end |
| Hero Mid | Navy Blue | `#121667` | Hero section gradient middle |
| Primary | Deep Blue | `#1D20DA` | Tombol utama, sidebar gradient, active states |
| Primary Light | Light Blue | `#4B50E8` | Gradient sidebar end, hover states |

### 2.2 Semantic Colors

| Token | Warna | Hex | Penggunaan |
|---|---|---|---|
| Success | Green | `#10B981` | Status berhasil, badge sukses |
| Warning | Amber | `#F59E0B` | Status peringatan, pending |
| Error | Red | `#EF4444` | Status gagal, error, ditolak |
| Info | Blue | `#3B82F6` | Informasi, badge netral |

### 2.3 Neutral Colors (Tailwind)

| Token | Tailwind Class | Hex | Penggunaan |
|---|---|---|---|
| Background | `bg-slate-100` | `#F1F5F9` | Background halaman dashboard |
| Background Alt | `bg-slate-50` | `#F8FAFC` | Alternating sections |
| Card/Surface | `bg-white` | `#FFFFFF` | Kartu, panel, sidebar item |
| Text Primary | `text-slate-800` | `#1E293B` | Teks utama |
| Text Secondary | `text-slate-400` | `#94A3B8` | Teks pendukung, label |
| Text Tertiary | `text-slate-500` | `#64748B` | Teks deskripsi |
| Border | `border-slate-100` / `border-slate-200` | `#F1F5F9` / `#E2E8F0` | Garis tepi, pembatas |

---

## 3. Typography

| Elemen | Font | Tailwind Class | Size | Weight |
|---|---|---|---|---|
| Hero Heading | System (sans-serif) | `text-4xl md:text-6xl` | 36-60px | Bold (700) |
| Section Heading | System | `text-3xl md:text-4xl` | 30-36px | Bold (700) |
| Card Heading | System | `text-lg` | 18px | Bold (700) |
| Body Text | System | `text-sm` | 14px | Regular (400) |
| Caption/Label | System | `text-xs` | 12px | Medium (500) / Semibold (600) |
| Button Text | System | `text-sm` | 14px | Semibold (600) |
| Badge Text | System | `text-xs` | 12px | Semibold (600) |

---

## 4. Component Library Standards

### 4.1 Buttons

| Tipe | Tailwind Classes | Penggunaan |
|---|---|---|
| Primary | `btn btn-primary` (bg-slate-900 text-white rounded-xl) | Aksi utama (Submit, Simpan, Login, Daftar) |
| Secondary | `btn btn-outline` (border text-slate-600 rounded-xl) | Aksi sekunder (Batal, Kembali) |
| Primary (Hero) | `bg-white text-slate-900 rounded-2xl font-semibold` | CTA di hero section |
| Ghost | `hover:bg-slate-100 rounded-xl` | Navigasi sidebar, aksi ringan |

### 4.2 Form Elements

| Elemen | Tailwind Classes |
|---|---|
| Input | `input` (w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-deep-blue) |
| Select | `input` (same as input) |
| Textarea | `input` (rows={3}) |
| Label | `text-sm font-semibold text-slate-700 mb-2` |
| File Upload | Hidden input + label button `btn btn-outline btn-sm` |

### 4.3 Status Badges

| Status | Tailclass | Label |
|---|---|---|
| `terverifikasi` | `badge-success` (green bg + green text) | Terverifikasi |
| `menunggu_verifikasi` | `badge-warning` (amber bg + amber text) | Menunggu |
| `belum_lengkap` | `badge-error` (red bg + red text) | Belum Lengkap |
| `lulus` | `badge-success` | Lulus |
| `disetujui` | `badge-success` | Disetujui |
| `menunggu` | `badge-warning` | Menunggu |
| `ditolak` | `badge-error` | Ditolak |
| `lunas` | `badge-success` | Lunas |
| `pending` | `badge-warning` | Pending |
| `ditolak_bayar` | `badge-error` | Ditolak |

### 4.4 Cards & Containers

| Elemen | Tailwind Classes |
|---|---|
| Dashboard Card | `bg-white rounded-2xl p-5 border border-slate-100 shadow-sm` |
| Feature Card | `bg-white rounded-3xl p-8 border border-slate-100 hover:shadow-xl transition-all` |
| Content Card | `bg-white rounded-2xl shadow-sm border border-slate-200` |
| Welcome Banner | `bg-gradient-to-r from-[#0D104A] via-[#121667] to-[#0D104A] rounded-3xl p-8 text-white` |
| Hero Section | `bg-gradient-to-br from-[#0D104A] via-[#121667] to-[#0D104A] rounded-3xl` |
| CTA Section | `bg-gradient-to-br from-[#0D104A] via-[#121667] to-[#0D104A] rounded-3xl p-12` |

### 4.5 Toast Notifications

| Tipe | Class | Ikon |
|---|---|---|
| Success | `toast-success` | ✓ |
| Error | `toast-error` | ✕ |
| Info | `toast-info` | — |

### 4.6 Modal

| Elemen | Deskripsi |
|---|---|
| Overlay | `modal-overlay` (fixed inset-0 bg-black/50) |
| Content | `modal-content` (white, rounded-2xl, max-w-md) |
| Header | Title + close button (X) |
| Body | Children content |

---

## 5. Layout & Spacing

| Aspek | Standar |
|---|---|
| Max Content Width | `max-w-6xl` (1152px) |
| Page Padding | `p-4 md:p-8` (16px mobile, 32px desktop) |
| Card Gap | `gap-4` (16px) / `gap-6` (24px) |
| Section Gap | `py-24` (96px vertical) |
| Sidebar Width | `md:ml-[260px]` (260px) |
| Header Height | `h-14` mobile (56px), `h-16` desktop (64px) |
| Border Radius — Card | `rounded-2xl` (16px) / `rounded-3xl` (24px) |
| Border Radius — Button | `rounded-xl` (12px) |
| Border Radius — Badge | `rounded-full` (pill) |
| Border Radius — Input | `rounded-xl` (12px) |

---

## 6. Responsive Breakpoints

| Breakpoint | Tailwind Tag | Perilaku |
|---|---|---|
| < 768px | `md:` | Mobile — sidebar overlay, hamburger menu, stack layout |
| ≥ 768px | `md:` | Tablet/Desktop — sidebar persisten, multi-column grid |
| ≥ 1024px | `lg:` | Desktop — split layout (login/register), wider grids |

---

## 7. Shared UI Components

| Komponen | File | Props | Deskripsi |
|---|---|---|---|
| `Modal` | `UI.tsx` | `open, onClose, title, children` | Dialog overlay dengan judul dan close button |
| `Toast` | `UI.tsx` | `message, type, onClose` | Notifikasi otomatis hilang (3 detik) |
| `StatusBadge` | `UI.tsx` | `status` | Badge otomatis berdasarkan status string |
| `FileUpload` | `UI.tsx` | `accept, maxSizeMB, onFile` | Upload button dengan validasi ukuran |
| `Navbar` | `Navbar.tsx` | — | Navigasi publik dengan mobile menu |
| `Sidebar` | `Sidebar.tsx` | `open, onClose` | Navigasi samping per role |
| `DashboardLayout` | `DashboardLayout.tsx` | `children` | Layout wrapper (auth guard + sidebar + header) |

---

## 8. Validation Status

| Aspek | Status | Keterangan |
|---|---|---|
| Color Palette | ✅ Validated | Hex dari actual CSS: `#0D104A`, `#121667`, `#1D20DA`, `#4B50E8` |
| Component Standards | ✅ Validated | Tailwind classes dari Sidebar.tsx, page components, UI.tsx |
| Typography | ✅ Validated | System font, weight sesuai dengan implementation |
| Layout | ✅ Validated | Responsive layout dengan DashboardLayout + Sidebar |
| Status Badges | ✅ Validated | 10 status dari `StatusBadge` component di UI.tsx |
| Shared Components | ✅ Validated | 7 komponen shared terdokumentasi |
