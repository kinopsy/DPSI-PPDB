# Implementation Notes

## Architecture Decisions

### SPA vs Multi-Page
**Decision:** Single Page Application (SPA) with hash-based routing
**Reason:** The IA (SoT-2) defines clean routes like `/auth/login` and `/pendaftar/dashboard`. A multi-file approach would require a server for proper routing. Hash-based routing (`#/auth/login`) works without server configuration while matching the IA route structure.

### localStorage vs SessionStorage
**Decision:** localStorage for data persistence, sessionStorage for auth session
**Reason:** Data modifications (biodata, documents, payments, quotas) need to persist across browser sessions for the demo to be meaningful. Auth session uses sessionStorage so logging out clears the session.

### File Upload Simulation
**Decision:** Store file metadata only, no actual file storage
**Reason:** Without a backend, actual file storage is impossible. File names are generated and stored in the data layer. In production, these would be actual file uploads to a server.

### Password Storage
**Decision:** Plain text in localStorage (demo only)
**Reason:** Bcrypt encryption requires a backend. The prototype is frontend-only. In production, passwords would be encrypted server-side.

## Document Conflicts & Resolutions

### SoT-4 vs SoT-6: Payment Upload
**Conflict:** SoT-4 says "tanpa perlu mengisi form teks tambahan" but SoT-6 defines `proof_image` as binary file.
**Resolution:** Implemented as photo-only upload with no text forms. The upload zone accepts only JPG/PNG files, matching both documents.

### SoT-5 vs Prototype: UUID vs Auto-increment
**Conflict:** SoT-5 specifies UUID primary keys but the prototype uses auto-increment IDs for simplicity.
**Resolution:** Used auto-increment IDs (`u001`, `s001`, etc.) for readability in the demo. In production, UUIDs would be used.

### SoT-2 vs Implementation: Route Paths
**Conflict:** SoT-2 defines paths like `/auth/login` but the prototype uses hash-based routing `#/auth/login`.
**Resolution:** Hash-based routing matches the IA path structure when the `#` prefix is added. The visual URL in the browser shows the IA routes clearly.

### SoT-7 vs Implementation: API Endpoints
**Conflict:** SoT-7 defines backend API endpoints but no backend exists.
**Resolution:** All API operations are simulated in JavaScript. Each function (e.g., `verifyDocument()`) performs the same data operations that the API would, including audit logging.

## Business Rules Implemented

### UC-003: Quota Validation
**Rule:** "Perubahan kuota ke angka yang lebih rendah dari jumlah siswa yang sudah dinyatakan lulus otomatis ditolak sistem."
**Implementation:** `updateQuota()` function checks `maxQuota < current_count` and returns error if violated.

### UC-004: Document Rejection
**Rule:** Rejection requires a mandatory note.
**Implementation:** The reject modal validates that the note field is not empty before allowing submission.

### UC-005: Payment Upload
**Rule:** "Orang tua cukup mengunggah foto struk/bukti transfer tanpa perlu mengisi form teks tambahan."
**Implementation:** Upload zone accepts only image files. No text input fields for sender name, amount, etc.

### UC-007: Executive Dashboard
**Rule:** "Dashboard bersifat Read-Only."
**Implementation:** Kepsek dashboard has no edit buttons, no forms, no action links. Pure display of aggregated data.

## Data Flow

### Document Verification → Student Status
When a document is verified or rejected, the student's `pendaftaran_status` is automatically updated:
- All documents approved → `terverifikasi`
- Any document rejected → `belum_lengkap`

This is handled by `updateStudentStatusFromDocs()`.

### Payment Verification → Audit Log
When a payment is verified (lunas/ditolak), an audit log entry is automatically created with:
- Action type
- Student name
- Amount
- Timestamp
- Officer name

This is handled by `verifyPayment()`.

### Tariff Changes → Audit Log
When a tariff is added, updated, or deleted, an audit log entry is created automatically.

## Component Library

### Design System (SoT-3)
All components follow the design system:
- **Buttons:** Solid Deep Blue (`#1E3A8A`) with `border-radius: 6px`
- **Inputs:** Thin gray border, transitions to Deep Blue on focus
- **Badges:** 10% transparent semantic background with solid text
- **Cards:** White background, subtle shadow, clean borders

### Responsive Breakpoints
- **Mobile:** `< 768px` - Single column, collapsed sidebar
- **Tablet:** `769px - 1024px` - Narrower sidebar, 2-column grids
- **Desktop:** `> 1025px` - Full sidebar, 4-column grids

## Testing Checklist

- [x] Registration creates new user in localStorage
- [x] Login validates credentials and redirects by role
- [x] Cross-role access shows 403 error
- [x] Biodata form validates NISN (10 digits) and NIK (16 digits)
- [x] Document upload validates file type and size (2MB)
- [x] Document verification updates student status automatically
- [x] Quota edit rejects values below graduated count
- [x] Payment upload accepts only images (JPG/PNG)
- [x] Payment verification creates audit log entry
- [x] Graduation status changes are persisted
- [x] Announcements are created and displayed
- [x] Tariff changes create audit log entries
- [x] Executive dashboard shows read-only aggregated data
- [x] All data persists in localStorage across refreshes
- [x] Reset data function works correctly
- [x] Mobile responsive layout works
- [x] All routes match IA definitions

## Future Enhancements

1. **Backend Integration:** Replace mock functions with actual API calls
2. **File Storage:** Implement actual file upload to cloud storage
3. **Real-time Updates:** Add WebSocket for live data sync
4. **Email Notifications:** Send email on document verification
5. **PDF Export:** Generate PDF for registration confirmation
6. **Search & Filter:** Add search functionality to data tables
7. **Pagination:** Add pagination for large datasets
8. **Form Auto-save:** Auto-save form data as user types
9. **Offline Support:** Add service worker for offline access
10. **Multi-language:** Add English language support
