# SoT-5: Software Architecture Document (SAD)

**Document Version:** v1.0  
**Project:** Sistem Informasi Penerimaan Peserta Didik Baru (PPDB)  
**Status:** Approved  

## 1. ARCHITECTURAL PATTERN
Sistem menggunakan pola **Model-View-Controller (MVC) Monolith** berbasis web untuk efisiensi pemeliharaan infrastruktur sekolah.

## 2. DATABASE SCHEMA & DATA DICTIONARY
### Tabel: `users`
- `id` (UUID, PK)
- `name` (Varchar)
- `email` (Varchar, Unique)
- `password` (Varchar, Encrypted via Bcrypt)
- `role` (Enum: pendaftar, panitia, bendahara, kepsek)

### Tabel: `students`
- `id` (UUID, PK)
- `user_id` (FK to `users.id`)
- `nik` (Char(16), Unique) - Batasan dasar tanpa data seragam/rapor.
- `pendaftaran_status` (Enum)

### Tabel: `documents`
- `id`, `student_id` (FK), `file_type` (Enum), `file_path`, `verification_status`, `rejection_note`

### Tabel: `payments`
- `id`, `student_id` (FK), `proof_file_path`, `payment_status`, `verified_at`
