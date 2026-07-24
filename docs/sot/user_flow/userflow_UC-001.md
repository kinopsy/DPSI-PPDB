# User Flow: UC-001 — Registrasi & Login Akun

**Use Case ID:** UC-001

**Project:** SIPDB — Sistem Informasi Penerimaan Peserta Didik Baru

---

## Actor

- **Calon Siswa / Orang Tua** (Pendaftar)

## Precondition

- Belum memiliki akun (untuk registrasi)
- Memiliki akun terdaftar (untuk login)

---

## Flow: Registrasi

1. Pengunjung mengakses halaman beranda (`/`)
2. Klik "Daftar Sekarang" → navigasi ke `/auth/register`
3. Sistem menampilkan form registrasi (split layout: gradient kiri + form kanan)
4. Pengguna mengisi:
   - Nama Lengkap (required)
   - Email (required, unique)
   - Password (min. 6 karakter)
5. Klik "Daftar" → sistem memvalidasi input
6. Jika valid → `createUserWithEmailAndPassword` (Firebase Auth)
7. Dokumen user dibuat di Firestore collection `users`:
   - `name`, `email`, `role: 'pendaftar'`, `createdAt: serverTimestamp()`
8. Login otomatis → `AuthContext.setUser()`
9. Redirect ke `/pendaftar/dashboard`

## Flow: Login

1. Pengguna mengakses `/auth/login`
2. Sistem menampilkan form login (split layout: gradient kiri + form kanan)
3. Pengguna mengisi Email + Password
4. Klik "Masuk" → `signInWithEmailAndPassword` (Firebase Auth)
5. Data user diambil dari Firestore `users` by UID
6. `AuthContext.setUser({ id, name, email, role })`
7. Redirect ke dashboard sesuai role:
   - `pendaftar` → `/pendaftar/dashboard`
   - `panitia` → `/panitia/dashboard`
   - `bendahara` → `/bendahara/dashboard`
   - `kepsek` → `/kepsek/dashboard`

## Flow: Logout

1. Klik "Keluar" di sidebar atau navbar
2. `signOut(auth)` (Firebase Auth)
3. `AuthContext.setUser(null)`
4. Redirect ke `/`

## Postcondition

- User terautentikasi
- Sidebar menampilkan menu sesuai role
- Session tersimpan di Firebase Auth (onAuthStateChanged listener)

## Business Rules

- Email harus unik (dijamin Firebase Auth)
- Password minimal 6 karakter
- Role default saat register: `pendaftar`
- Panitia, bendahara, dan kepsek dibuat oleh admin (bukan registrasi publik)
- Error handling: email already in use, weak password, invalid credential, too many requests

---

## Diagram

```mermaid
flowchart TD
    A([Beranda /]) --> B{Punya akun?}
    B -->|Tidak| C[/auth/register/]
    B -->|Ya| D[/auth/login/]

    C --> C1[Isi: Nama, Email, Password]
    C1 --> C2{Valid?}
    C2 -->|Tidak| C3[Tampilkan Error]
    C3 --> C
    C2 -->|Ya| C4[Firebase Auth: createUserWithEmailAndPassword]
    C4 --> C5[Firestore: setDoc users - role: pendaftar]
    C5 --> C6[AuthContext.setUser]
    C6 --> C7[Redirect /pendaftar/dashboard]

    D --> D1[Isi: Email, Password]
    D1 --> D2{Valid?}
    D2 -->|Tidak| D3[Tampilkan Error]
    D3 --> D
    D2 -->|Ya| D4[Firebase Auth: signInWithEmailAndPassword]
    D4 --> D5[Firestore: getDoc users by UID]
    D5 --> D6[AuthContext.setUser]
    D6 --> D7[Redirect /role/dashboard]

    D7 --> E{User role?}
    E -->|pendaftar| E1[/pendaftar/dashboard]
    E -->|panitia| E2[/panitia/dashboard]
    E -->|bendahara| E3[/bendahara/dashboard]
    E -->|kepsek| E4[/kepsek/dashboard]
```
