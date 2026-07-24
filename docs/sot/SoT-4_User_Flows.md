# SoT-4: Validated User Flow Specifications

**Document Version:** v1.0

**Project:** SIPDB — Sistem Informasi Penerimaan Peserta Didik Baru

**Product:** Web-Based PPDB Management System (Next.js + Firebase)

**Status:** Validated

**Last Updated:** 2026-07-23



---

## Catalog Index Use Cases

| ID | Use Case | Pengguna | Modul |
|---|---|---|---|
| UC-001 | Registrasi & Login Akun | Pendaftar | Auth |
| UC-002 | Pengisian Formulir & Upload Berkas Wajib | Pendaftar | Applicant |
| UC-003 | Pengaturan Kuota Dinamis & Tarif | Panitia/Bendahara | Admin/Finance |
| UC-004 | Verifikasi Berkas & Notifikasi Revisi | Panitia | Admin |
| UC-005 | Upload Bukti & Verifikasi Pembayaran | Pendaftar/Bendahara | Applicant/Finance |
| UC-006 | Penentuan & Penerbitan Kelulusan | Panitia | Admin |
| UC-007 | Pemantauan Dashboard Eksekutif | Kepsek | Executive |

---

## UC-001: Registrasi & Login Akun

**Actor:** Calon Siswa / Orang Tua

**Precondition:** Belum memiliki akun

**Flow:**
1. Pengunjung mengakses halaman beranda (`/`)
2. Klik "Daftar" → navigasi ke `/auth/register`
3. Mengisi form: Nama, Email, Password
4. Klik "Daftar" → `createUserWithEmailAndPassword` (Firebase Auth)
5. Dokumen user dibuat di Firestore collection `users` (role: `pendaftar`)
6. Login otomatis → redirect ke `/pendaftar/dashboard`

**Alternative Flow (Login):**
1. Pengguna mengakses `/auth/login`
2. Mengisi Email + Password
3. Klik "Masuk" → `signInWithEmailAndPassword` (Firebase Auth)
4. Data user diambil dari Firestore `users`
5. Redirect ke dashboard sesuai role

**Postcondition:** User terautentikasi, sidebar menampilkan menu sesuai role

**Business Rules:**
- Email harus unik (dijamin Firebase Auth)
- Password minimal 6 karakter
- Role default saat register: `pendaftar`

---

## UC-002: Pengisian Formulir & Upload Berkas Wajib

**Actor:** Pendaftar

**Precondition:** Telah login sebagai `pendaftar`

**Flow:**
1. Akses `/pendaftar/biodata`
2. Mengisi form biodata: NISN, NIK, Nama, Tempat/Tanggal Lahir, Jenis Kelamin, Agama, Alamat, Telepon, Asal Sekolah
3. Klik "Simpan" → `apiCreateStudent` atau `apiUpdateStudent`
4. Akses `/pendaftar/dokumen`
5. Upload berkas: KK, Akta Kelahiran, SKL, Foto (drag-and-drop atau klik)
6. Setiap upload → `apiUpsertDocument(studentId, fileType, filePath)`
7. File tersimpan di Cloudinary, metadata di Firestore `documents`
8. Status verifikasi default: `menunggu`

**Postcondition:** Biodata tersimpan, berkas terupload, status pendaftaran `menunggu_verifikasi`

**Business Rules:**
- `user_id` diisi otomatis dari Firebase Auth UID
- Pola upsert: upload ulang file yang sama akan update (bukan tambah baru)
- Berkas harus diverifikasi panitia sebelum status berubah

---

## UC-003: Pengaturan Kuota Dinamis & Tarif

**Actor:** Panitia (Kuota), Bendahara (Tarif)

**Precondition:** Telah login sebagai `panitia` atau `bendahara`

### Flow Kuota (Panitia):
1. Akses `/panitia/kuota-dinamis`
2. Melihat daftar program (IPA, IPS, Bahasa) beserta kuota saat ini
3. Mengubah kuota atau deadline → `apiUpdateQuota(id, data)`
4. Kuota diperbarui secara real-time

### Flow Tarif (Bendahara):
1. Akses `/bendahara/tarif-biaya`
2. Melihat daftar komponen biaya
3. Tambah komponen baru → `apiCreateTariff(data)`
4. Edit komponen → `apiUpdateTariff(id, data)`
5. Hapus komponen → `apiDeleteTariff(id)`
6. Setiap perubahan tercatat di `auditLogs`

**Business Rules:**
- Kuota dapat diubah di tengah jalan saat pendaftaran aktif
- Perubahan tarif otomatis tercatat di audit log

---

## UC-004: Verifikasi Berkas & Notifikasi Revisi

**Actor:** Panitia

**Precondition:** Telah login sebagai `panitia`, ada berkas yang perlu diverifikasi

**Flow:**
1. Akses `/panitia/verifikasi-berkas`
2. Melihat tabel antrian berkas (siswa, jenis berkas, status)
3. Klik berkas → melihat detail (preview file)
4. Pilih aksi:
   - **Setujui** → status: `disetujui`
   - **Tolak** → isi catatan penolakan → status: `ditolak`
5. `apiVerifyDocument(docId, status, note)`
6. Sistem otomatis mengecek semua berkas siswa:
   - Jika semua `disetujui` → `students.pendaftaran_status` = `terverifikasi`
   - Jika ada `ditolak` → `students.pendaftaran_status` = `belum_lengkap`

**Postcondition:** Status berkas dan siswa diperbarui otomatis

**Business Rules:**
- Catatan wajib diisi saat menolak
- Status siswa berubah otomatis berdasarkan kombinasi status semua berkas

---

## UC-005: Upload Bukti & Verifikasi Pembayaran

**Actor:** Pendaftar (Upload), Bendahara (Verifikasi)

### Flow Upload (Pendaftar):
1. Akses `/pendaftar/pembayaran`
2. Upload foto bukti transfer (drag-and-drop atau klik)
3. `apiCreatePayment(studentId, proofPath)`
4. Status default: `pending`

### Flow Verifikasi (Bendahara):
1. Akses `/bendahara/verifikasi-pembayaran`
2. Melihat tabel bukti bayar (siswa, foto, status)
3. Klik bukti → preview gambar
4. Pilih aksi:
   - **Lunas** → status: `lunas`
   - **Tolak** → status: `ditolak`
5. `apiVerifyPayment(paymentId, status, officer)`
6. Audit log otomatis dicatat di `auditLogs`

**Business Rules:**
- Orang tua cukup upload foto struk — tanpa form teks tambahan
- Bendahara memvalidasi berdasarkan mutasi rekening sekolah
- Pola upsert: satu siswa hanya memiliki satu catatan pembayaran

---

## UC-006: Penentuan & Penerbitan Kelulusan

**Actor:** Panitia

**Precondition:** Telah login sebagai `panitia`, ada siswa dengan status `terverifikasi`

**Flow:**
1. Akses `/panitia/kelulusan`
2. Melihat daftar siswa terverifikasi
3. Tentukan kelulusan per siswa
4. Update `students.pendaftaran_status` = `lulus`

**Postcondition:** Siswa dinyatakan lulus, kuota program dikurangi

---

## UC-007: Pemantauan Dashboard Eksekutif

**Actor:** Kepala Sekolah

**Precondition:** Telah login sebagai `kepsek`

**Flow:**
1. Akses `/kepsek/dashboard`
2. Melihat satu halaman ringkasan:
   - Total pendaftar
   - Jumlah berkas per status
   - Kuota tersisa per program
   - Total dana masuk
3. Semua data bersifat **read-only**

**Postcondition:** Kepsek memiliki visibilitas real-time terhadap seluruh proses PPDB

**Business Rules:**
- Dashboard bersifat read-only — tidak ada aksi edit
- Menyajikan agregasi data akun, berkas, kuota, dan nominal dana masuk

---

## Validation Status

| Use Case | Status | Keterangan |
|---|---|---|
| UC-001 | ✅ Validated | Sesuai dengan `AuthContext.tsx` (login, register, logout) |
| UC-002 | ✅ Validated | Sesuai dengan `apiCreateStudent`, `apiUpsertDocument` |
| UC-003 | ✅ Validated | Sesuai dengan `apiUpdateQuota`, `apiCreateTariff`, `apiUpdateTariff`, `apiDeleteTariff` |
| UC-004 | ✅ Validated | Sesuai dengan `apiVerifyDocument` (auto-update siswa) |
| UC-005 | ✅ Validated | Sesuai dengan `apiCreatePayment`, `apiVerifyPayment` (auto audit log) |
| UC-006 | ✅ Validated | Sesuai dengan halaman `panitia/kelulusan/page.tsx` |
| UC-007 | ✅ Validated | Sesuai dengan halaman `kepsek/dashboard/page.tsx` (read-only) |
