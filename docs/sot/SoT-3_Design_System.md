# SoT-3: Validated Design System

**Document Version:** v1.0

**Project:** SIPDB — Sistem Informasi Penerimaan Peserta Didik Baru

**Product:** Web-Based PPDB Management System (Next.js + Firebase)

**Status:** Validated

**Last Updated:** 2026-07-23

**Source:** Derived from SoT-2 (Validated IA) and validasi source code (`ppdb-next/src/`, Tailwind CSS 4)

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

### 2.1 Primary Colors

| Token | Warna | Hex | Penggunaan |
|---|---|---|---|
| Primary | Deep Blue | `#1E3A8A` / `#1D20DA` | Tombol utama, sidebar, branding |
| Primary Light | Light Blue | `#4B50E8` | Gradient sidebar, hover states |
| Secondary | Emerald Green | `#10B981` | Status sukses (lunas, lulus) |

### 2.2 Semantic Colors

| Token | Warna | Hex | Penggunaan |
|---|---|---|---|
| Success | Green | `#10B981` | Status berhasil, badge sukses |
| Warning | Amber | `#F59E0B` | Status peringatan, pending |
| Error | Red | `#EF4444` | Status gagal, error, ditolak |
| Info | Blue | `#3B82F6` | Informasi, badge netral |

### 2.3 Neutral Colors

| Token | Warna | Hex | Penggunaan |
|---|---|---|---|
| Background | Gray | `#F9FAFB` | Background halaman |
| Card/Surface | White | `#FFFFFF` | Kartu, panel, sidebar item |
| Text Primary | Dark | `#111827` | Teks utama |
| Text Secondary | Gray | `#6B7280` | Teks pendukung, label |
| Border | Light Gray | `#E5E7EB` | Garis tepi, pembatas |

---

## 3. Typography

| Elemen | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | System (Inter/sans-serif) | 24-30px | Bold (700) |
| Heading 2 | System | 18-20px | Semibold (600) |
| Body Text | System | 14-16px | Regular (400) |
| Caption/Label | System | 11-12px | Medium (500) |
| Button Text | System | 14px | Semibold (600) |

---

## 4. Component Library Standards

### 4.1 Buttons

| Tipe | Style | Penggunaan |
|---|---|---|
| Primary | Solid Deep Blue, `border-radius: 6px`, white text | Aksi utama (Submit, Simpan, Login) |
| Secondary | Outline/border, Deep Blue text | Aksi sekunder (Batal, Kembali) |
| Danger | Solid Red | Aksi destruktif (Hapus, Tolak) |
| Success | Solid Green | Aksi positif (Setujui, Lunas) |
| Ghost | Transparent, hover:bg-white/5 | Navigasi sidebar, aksi ringan |

### 4.2 Form Elements

| Elemen | Style |
|---|---|
| Input Box | Kotak bersih, `border: 1px solid #E5E7EB`, transisi Deep Blue saat fokus |
| Select | Dropdown dengan styling serupa input |
| Textarea | Area teks dengan border konsisten |
| Label | Teks di atas input, weight medium |

### 4.3 Status Badges

| Status | Warna Badge |
|---|---|
| Menunggu Verifikasi | Amber background transparan + amber text |
| Terverifikasi | Green background transparan + green text |
| Belum Lengkap | Red background transparan + red text |
| Lulus | Green solid badge |
| Pending (Pembayaran) | Amber badge |
| Lunas | Green badge |
| Ditolak | Red badge |

### 4.4 Cards & Containers

| Elemen | Style |
|---|---|
| Card | White background, `border-radius: 12px`, `shadow: sm`, padding 16-24px |
| Sidebar | Deep Blue gradient background, white text |
| Table | Striped rows, hover highlight, responsive |

---

## 5. Layout & Spacing

| Aspek | Standar |
|---|---|
| Max Content Width | Tailwind default (1280px) |
| Page Padding | 16-24px (mobile: 16px, desktop: 24px) |
| Card Gap | 16-24px |
| Section Gap | 32px |
| Sidebar Width | 240px (desktop), full overlay (mobile) |
| Border Radius — Card | 12px |
| Border Radius — Button | 6px |
| Border Radius — Badge | 9999px (pill) |

---

## 6. Responsive Breakpoints

| Breakpoint | Tag | Perilaku |
|---|---|---|
| < 768px | `md:` | Mobile — sidebar overlay, stack layout |
| ≥ 768px | `md:` | Tablet — sidebar persisten |
| ≥ 1024px | `lg:` | Desktop — layout lebar |

---

## 7. Validation Status

| Aspek | Status | Keterangan |
|---|---|---|
| Color Palette | ✅ Validated | Sesuai dengan CSS classes di source code (`#1D20DA`, `#10B981`, `#EF4444`) |
| Component Standards | ✅ Validated | Sesuai dengan Tailwind classes di Sidebar.tsx dan page components |
| Typography | ✅ Validated | System font, weight sesuai dengan implementation |
| Layout | ✅ Validated | Responsive layout dengan Tailwind breakpoints |
| Status Badges | ✅ Validated | Warna sesuai dengan enum status di `types.ts` |
