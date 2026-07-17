# SoT-4: User Flow Specifications

**Document Version:** v1.0  
**Project:** Sistem Informasi Penerimaan Peserta Didik Baru (PPDB)  
**Status:** Approved  

## CATALOG INDEX USE CASES
- **UC-001:** Registrasi & Login Akun Pendaftar
- **UC-002:** Pengisian Formulir & Unggah Berkas Wajib
- **UC-003:** Manajemen Kuota Dinamis & Pengaturan Tarif
- **UC-004:** Verifikasi Berkas & Notifikasi Revisi
- **UC-005:** Unggah Bukti & Verifikasi Pembayaran Manual
- **UC-006:** Penentuan & Penerbitan Kelulusan
- **UC-007:** Pemantauan Dashboard Eksekutif Satu Halaman

## DETAIL FLOW HIGHLIGHTS
- **UC-003 Aturan Bisnis (Kuota Dinamis):** Kuota dapat diubah di tengah jalan saat pendaftaran aktif. Perubahan kuota ke angka yang lebih rendah dari jumlah siswa yang sudah dinyatakan lulus otomatis ditolak sistem.
- **UC-005 Aturan Bisnis (Pembayaran):** Orang tua cukup mengunggah foto struk/bukti transfer tanpa perlu mengisi form teks tambahan (Nama pengirim, dll). Bendahara memvalidasi berdasarkan mutasi riil rekening sekolah.
- **UC-007 Aturan Bisnis (Kepsek):** Dashboard bersifat *Read-Only*, menyajikan agregasi data akun, berkas, kuota, dan nominal dana masuk sekaligus dalam satu layar tunggal.
