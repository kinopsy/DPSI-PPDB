# SoT-6: Backend API Contract Specification

**Document Version:** v1.0  
**Project:** Sistem Informasi Penerimaan Peserta Didik Baru (PPDB)  
**Status:** Approved  

## 1. POST /api/v1/auth/login
- **Request Body:** `{"email": "...", "password": "..."}`
- **Response Success (200 OK):** Mengembalikan token autentikasi sesi dan peran (*role*) pengguna untuk pengalihan dashboard secara efisien tanpa informasi tambahan berlebih.

## 2. POST /api/v1/payments/upload
- **Request Headers:** Multipart/Form-Data, Bearer Token
- **Payload:** `proof_image` (Binary File, max 2MB)
- **Response Success (201 Created):** `{"success": true, "data": {"payment_status": "pending"}}`
