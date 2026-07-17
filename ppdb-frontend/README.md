# PPDB Online - Frontend Prototype

Sistem Penerimaan Peserta Didik Baru (PPDB) Web Application - Runnable Frontend Prototype

## Requirements

- Modern web browser (Chrome, Firefox, Edge, Safari)
- No server required - runs entirely from file system
- LocalStorage enabled (for data persistence)

## How to Run

### Option 1: Direct File Opening
1. Open `ppdb-frontend/index.html` in your browser
2. The application will load at `#/` (Beranda)

### Option 2: Local Server (Recommended)
```bash
# Using Python
cd ppdb-frontend
python -m http.server 8000

# Using Node.js (npx)
npx serve ppdb-frontend

# Using PHP
cd ppdb-frontend
php -S localhost:8000
```
Then open `http://localhost:8000` in your browser.

## Login

The prototype includes 4 demo accounts. Click the demo buttons on the login page or enter manually:

| Role | Email | Password |
|---|---|---|
| Calon Siswa/Orang Tua | `ahmad@demo.com` | `123456` |
| Panitia PPDB | `panitia@demo.com` | `123456` |
| Bendahara | `bendahara@demo.com` | `123456` |
| Kepala Sekolah | `kepsek@demo.com` | `123456` |

### Login Steps
1. Navigate to `#/auth/login`
2. Enter email and password (or click a demo account button)
3. Click "Masuk"
4. You will be redirected to the role-based dashboard

## Registration (New Account)
1. Navigate to `#/auth/register`
2. Fill in name, email, password
3. Confirm password and agree to terms
4. Click "Daftar Sekarang"
5. You will be redirected to login

## Routes

### Public Routes
- `#/` - Beranda (Homepage)
- `#/auth/login` - Login
- `#/auth/register` - Register

### Pendaftar Routes (login as `ahmad@demo.com`)
- `#/pendaftar/dashboard` - Dashboard
- `#/pendaftar/biodata` - Form Biodata
- `#/pendaftar/dokumen` - Upload Berkas (KK & Akta)
- `#/pendaftar/pembayaran` - Upload Bukti Transfer
- `#/pendaftar/status` - Status Kelulusan

### Panitia Routes (login as `panitia@demo.com`)
- `#/panitia/dashboard` - Dashboard
- `#/panitia/verifikasi-berkas` - Verifikasi Berkas
- `#/panitia/kuota-dinamis` - Kuota Dinamis
- `#/panitia/kelulusan` - Konsol Kelulusan
- `#/panitia/pengumuman` - Manajemen Pengumuman

### Bendahara Routes (login as `bendahara@demo.com`)
- `#/bendahara/dashboard` - Dashboard
- `#/bendahara/verifikasi-pembayaran` - Verifikasi Pembayaran
- `#/bendahara/tarif-biaya` - Tarif Biaya
- `#/bendahara/audit-log` - Audit Log

### Kepsek Routes (login as `kepsek@demo.com`)
- `#/kepsek/dashboard` - Dashboard Eksekutif (Read-Only)

## Testing the Flows

### UC-001: Registration & Login
1. Open `#/auth/register`
2. Fill in a new account (name, email, password)
3. Submit and verify redirect to login
4. Login with the new credentials
5. Verify redirect to pendaftar dashboard

### UC-002: Biodata & Document Upload
1. Login as `ahmad@demo.com`
2. Go to `#/pendaftar/biodata`
3. Fill in all fields (NISN must be 10 digits, NIK must be 16 digits)
4. Submit and verify redirect to document upload
5. Go to `#/pendaftar/dokumen`
6. Upload KK file (drag-drop or click)
7. Upload Akta file
8. Click "Simpan & Lanjutkan"

### UC-003: Dynamic Quota
1. Login as `panitia@demo.com`
2. Go to `#/panitia/kuota-dinamis`
3. Click "Edit" on any program
4. Try setting quota below current count - verify error
5. Set valid quota and save

### UC-004: Document Verification
1. Login as `panitia@demo.com`
2. Go to `#/panitia/verifikasi-berkas`
3. Filter by "Menunggu"
4. Click "Setujui" or "Tolak" on a document
5. If rejecting, enter a reason and submit

### UC-005: Payment Verification
1. Login as `pendaftar` and upload bukti transfer
2. Login as `bendahara@demo.com`
3. Go to `#/bendahara/verifikasi-pembayaran`
4. Filter by "Pending"
5. Click "Setujui (Lunas)" or "Tolak"

### UC-006: Graduation Management
1. Login as `panitia@demo.com`
2. Go to `#/panitia/kelulusan`
3. Click "Lulus" on a student
4. Click "Terbitkan Pengumuman" to publish results

### UC-007: Executive Dashboard
1. Login as `kepsek@demo.com`
2. View the read-only dashboard with aggregated data
3. Verify no edit actions are available

## Reset localStorage

To reset all data to defaults:

### Method 1: Console
Open browser console (F12) and run:
```javascript
resetData();
location.reload();
```

### Method 2: Clear Site Data
1. Open browser DevTools (F12)
2. Go to Application tab
3. Expand Local Storage
4. Delete `ppdb_data` key
5. Refresh the page

### Method 3: incognito/Private Window
Open the app in a new incognito/private window for fresh data each session.

## Data Persistence

All data modifications are saved to localStorage with key `ppdb_data`. This includes:
- User accounts (registration)
- Student biodata
- Document uploads
- Payment records
- Quota changes
- Graduation status
- Announcements
- Tariff changes
- Audit logs

Data persists across page refreshes and browser sessions until explicitly cleared.

## Project Structure

```
ppdb-frontend/
├── index.html                    # SPA entry point
├── assets/
│   ├── css/
│   │   ├── design-system.css     # Design tokens & components (SoT-3)
│   │   └── layout.css            # Sidebar, navbar, grid, modals
│   └── js/
│       ├── router.js             # Hash-based SPA router
│       ├── app.js                # App bootstrap & layout
│       ├── mock-data.js          # Data layer & localStorage
│       └── pages/
│           ├── public.js         # M001: Public pages
│           ├── pendaftar.js      # M002: Applicant pages
│           ├── panitia.js        # M003: Admin pages
│           ├── bendahara.js      # M004: Finance pages
│           └── kepsek.js         # M005: Executive pages
└── IMPLEMENTATION_NOTES.md       # Implementation decisions
```

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

## Known Limitations

- File uploads are simulated (no actual file storage)
- Authentication uses plain text passwords (demo only)
- No real-time updates (requires page refresh for cross-tab sync)
- No backend API - all logic is client-side
