# User Flow: UC-002 — Pengisian Formulir & Upload Berkas Wajib

**Use Case ID:** UC-002

**Project:** SIPDB — Sistem Informasi Penerimaan Peserta Didik Baru

---

## Actor

- **Pendaftar** (Orang Tua / Wali Murid)

## Precondition

- Telah login sebagai `pendaftar`
- Belum mengisi biodata (atau ingin mengubah biodata)

---

## Flow: Pengisian Biodata

1. Akses `/pendaftar/biodata`
2. Sistem menampilkan form biodata (jika sudah ada data, form terisi otomatis)
3. Pengguna mengisi 11 field:
   - NISN (10 digit, required)
   - NIK (16 digit, required)
   - Nama Lengkap (required)
   - Tempat Lahir (required)
   - Tanggal Lahir (date picker, required)
   - Jenis Kelamin (select: Laki-laki/Perempuan, required)
   - Agama (select: Islam/Kristen/Katolik/Hindu/Buddha/Konghucu, required)
   - Telepon (required)
   - Alamat (textarea, required)
   - Asal Sekolah (required)
4. Klik "Simpan Biodata"
5. Sistem memvalidasi: NISN = 10 digit, NIK = 16 digit
6. Jika valid:
   - Jika belum punya siswa → `apiCreateStudent({ user_id: uid, ...form })`
   - Jika sudah punya siswa → `apiUpdateStudent(studentId, form)`
7. Toast: "Biodata berhasil disimpan"

## Flow: Upload Berkas

1. Akses `/pendaftar/dokumen`
2. Sistem menampilkan 4 row berkas: KK, Akta Kelahiran, SKHUN, SKL
3. Setiap row menampilkan: nama berkas, StatusBadge, rejection_note (jika ditolak), tombol Upload
4. Klik "Upload" pada salah satu berkas
5. Sistem membuka file picker (accept: .pdf, .jpg, .jpeg, .png)
6. Pengguna memilih file (maks. 2MB)
7. Sistem memvalidasi ukuran file
8. Jika valid → `uploadToCloudinary(file)` → return URL
9. `apiUpsertDocument(studentId, fileType, url)`
10. Status verifikasi default: `menunggu`
11. Refresh daftar berkas
12. Toast: "File {TYPE} berhasil diupload"

## Flow: Upload Ulang (Upsert)

1. Jika berkas sudah ada dan ingin diupload ulang
2. Klik "Upload Ulang" pada row yang sama
3. Pilih file baru
4. `apiUpsertDocument` → update `file_path`, reset `verification_status: 'menunggu'`, `rejection_note: null`

## Postcondition

- Biodata siswa tersimpan di Firestore `students`
- Berkas terupload di Cloudinary, metadata di Firestore `documents`
- Status pendaftaran: `menunggu_verifikasi`

## Business Rules

- `user_id` diisi otomatis dari Firebase Auth UID
- NISN harus tepat 10 digit
- NIK harus tepat 16 digit
- File max 2MB
- Format file: PDF, JPG, PNG
- Pola upsert: upload ulang file yang sama akan update (bukan tambah baru)
- Berkas harus diverifikasi panitia sebelum status berubah

---

## Diagram

```mermaid
flowchart TD
    A[/pendaftar/dashboard] --> B[/pendaftar/biodata]
    A --> C[/pendaftar/dokumen]

    B --> B1[Form: NISN, NIK, Nama, Lahir, JK, Agama, Telp, Alamat, Sekolah]
    B1 --> B2{NISN=10 digit\nNIK=16 digit?}
    B2 -->|Tidak| B3[Toast Error]
    B3 --> B1
    B2 -->|Ya| B4{Sudah punya siswa?}
    B4 -->|Tidak| B5[apiCreateStudent]
    B4 -->|Ya| B6[apiUpdateStudent]
    B5 --> B7[Toast: Biodata berhasil disimpan]
    B6 --> B7

    C --> C1[Row: KK, Akta, SKHUN, SKL]
    C1 --> C2[Klik Upload]
    C2 --> C3[Pilih file - max 2MB]
    C3 --> C4{Ukuran valid?}
    C4 -->|Tidak| C5[Toast Error]
    C5 --> C2
    C4 -->|Ya| C6[uploadToCloudinary]
    C6 --> C7[apiUpsertDocument]
    C7 --> C8[Status: menunggu]
    C8 --> C9[Toast: File berhasil diupload]
    C9 --> C1
```
