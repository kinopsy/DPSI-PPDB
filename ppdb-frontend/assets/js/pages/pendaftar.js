const PendaftarPages = {
  _sidebar() {
    return `
      <aside class="sidebar" id="app-sidebar">
        <div class="sidebar-section"><div class="sidebar-section-title">Menu Utama</div></div>
        <div class="sidebar-nav">
          <a href="#/pendaftar/dashboard" data-route="/pendaftar/dashboard" class="sidebar-link"><span class="icon">&#9632;</span> Dashboard</a>
          <a href="#/pendaftar/biodata" data-route="/pendaftar/biodata" class="sidebar-link"><span class="icon">&#9998;</span> Biodata</a>
          <a href="#/pendaftar/dokumen" data-route="/pendaftar/dokumen" class="sidebar-link"><span class="icon">&#128194;</span> Dokumen</a>
          <a href="#/pendaftar/pembayaran" data-route="/pendaftar/pembayaran" class="sidebar-link"><span class="icon">&#128179;</span> Pembayaran</a>
          <a href="#/pendaftar/status" data-route="/pendaftar/status" class="sidebar-link"><span class="icon">&#10003;</span> Status Kelulusan</a>
        </div>
      </aside>`;
  },

  dashboard() {
    const user = SessionManager.getUser();
    let student = getStudentByUserId(user.id);
    if (!student) {
      student = createStudent(user.id, { nisn: '', name: user.name, nik: '', tempat_lahir: '', tanggal_lahir: '', jenis_kelamin: '', agama: '', alamat: '', telepon: '', asal_sekolah: '' });
    }
    const docs = getStudentDocs(student.id);
    const payment = getStudentPayment(student.id);
    const approvedDocs = docs.filter(d => d.verification_status === 'disetujui').length;
    const paymentStatus = payment ? payment.payment_status : 'belum';

    return `
      <div class="page-header"><h1>Dashboard Pendaftar</h1><p>Selamat datang, ${user.name}! Pantau status pendaftaran Anda.</p></div>
      <div class="grid grid-3" style="margin-bottom:24px;">
        <div class="stat-card"><div class="stat-label">Status Pendaftaran</div><div class="stat-value" style="font-size:1.25rem;">${getStatusBadge(student.pendaftaran_status)}</div></div>
        <div class="stat-card"><div class="stat-label">Berkas Terverifikasi</div><div class="stat-value">${approvedDocs}/${docs.length || 2}</div><div class="stat-change ${(docs.length >= 2 && approvedDocs === docs.length) ? 'positive' : 'negative'}">${(docs.length >= 2 && approvedDocs === docs.length) ? 'Semua berkas lengkap' : 'Lengkapi berkas Anda'}</div></div>
        <div class="stat-card"><div class="stat-label">Pembayaran</div><div class="stat-value" style="font-size:1.25rem;">${getStatusBadge(paymentStatus)}</div></div>
      </div>
      <div class="grid grid-2">
        <div class="card"><div class="card-header">Status Pendaftaran</div><div class="card-body">
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">Nama</span><strong>${student.name}</strong></div>
            <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">NISN</span><strong>${student.nisn || '-'}</strong></div>
            <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">Asal Sekolah</span><strong>${student.asal_sekolah || '-'}</strong></div>
            <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">Status</span>${getStatusBadge(student.pendaftaran_status)}</div>
          </div>
        </div></div>
        <div class="card"><div class="card-header">Pengumuman Terbaru</div><div class="card-body" id="pendaftar-announcements"></div></div>
      </div>`;
  },

  initDashboard() {
    const el = document.getElementById('pendaftar-announcements');
    if (!el) return;
    const published = MockDB.announcements.filter(a => a.published).slice(0, 2);
    el.innerHTML = published.length ? published.map(a => `<div style="padding:12px 0;border-bottom:1px solid var(--border);"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;"><strong style="font-size:0.9375rem;">${a.title}</strong><span style="font-size:0.75rem;color:var(--text-light);">${formatDate(a.date)}</span></div><p style="font-size:0.875rem;color:var(--text-muted);">${a.content}</p></div>`).join('') : '<p style="color:var(--text-muted);text-align:center;padding:20px;">Belum ada pengumuman.</p>';
  },

  // UC-002: Biodata Form Flow
  biodata() {
    const user = SessionManager.getUser();
    let student = getStudentByUserId(user.id);
    if (!student) {
      student = createStudent(user.id, { nisn: '', name: user.name, nik: '', tempat_lahir: '', tanggal_lahir: '', jenis_kelamin: '', agama: '', alamat: '', telepon: '', asal_sekolah: '' });
    }
    return `
      <div class="page-header"><h1>Formulir Biodata</h1><p>Lengkapi data diri Anda dengan benar. NISN harus 10 digit dan NIK harus 16 digit.</p></div>
      <div class="card"><div class="card-body">
        <form id="biodata-form">
          <h3 style="margin-bottom:16px;font-size:1rem;color:var(--primary);">Data Pribadi</h3>
          <div class="grid grid-2">
            <div class="form-group"><label for="bio-nisn">NISN <span style="color:var(--error);">*</span></label><input type="text" id="bio-nisn" class="form-control" placeholder="10 digit angka" maxlength="10" required value="${student.nisn || ''}"><div class="form-text">Harus tepat 10 digit angka</div></div>
            <div class="form-group"><label for="bio-name">Nama Lengkap <span style="color:var(--error);">*</span></label><input type="text" id="bio-name" class="form-control" required value="${student.name || ''}"></div>
            <div class="form-group"><label for="bio-nik">NIK <span style="color:var(--error);">*</span></label><input type="text" id="bio-nik" class="form-control" placeholder="16 digit angka" maxlength="16" required value="${student.nik || ''}"><div class="form-text">Harus tepat 16 digit angka</div></div>
            <div class="form-group"><label for="bio-tl">Tempat Lahir <span style="color:var(--error);">*</span></label><input type="text" id="bio-tl" class="form-control" required value="${student.tempat_lahir || ''}"></div>
            <div class="form-group"><label for="bio-tgl">Tanggal Lahir <span style="color:var(--error);">*</span></label><input type="date" id="bio-tgl" class="form-control" required value="${student.tanggal_lahir || ''}"></div>
            <div class="form-group"><label for="bio-jk">Jenis Kelamin <span style="color:var(--error);">*</span></label><select id="bio-jk" class="form-control" required><option value="">Pilih</option><option ${student.jenis_kelamin === 'Laki-laki' ? 'selected' : ''}>Laki-laki</option><option ${student.jenis_kelamin === 'Perempuan' ? 'selected' : ''}>Perempuan</option></select></div>
            <div class="form-group"><label for="bio-agama">Agama <span style="color:var(--error);">*</span></label><select id="bio-agama" class="form-control" required><option value="">Pilih</option>${['Islam','Kristen','Katolik','Hindu','Buddha','Konghucu'].map(a => `<option ${student.agama === a ? 'selected' : ''}>${a}</option>`).join('')}</select></div>
            <div class="form-group"><label for="bio-telp">No. Telepon <span style="color:var(--error);">*</span></label><input type="tel" id="bio-telp" class="form-control" placeholder="08xxx" required value="${student.telepon || ''}"></div>
          </div>
          <div class="form-group"><label for="bio-alamat">Alamat Lengkap <span style="color:var(--error);">*</span></label><textarea id="bio-alamat" class="form-control" rows="3" placeholder="Jalan, No. RT/RW, Kelurahan, Kecamatan" required>${student.alamat || ''}</textarea></div>
          <h3 style="margin:24px 0 16px;font-size:1rem;color:var(--primary);">Data Asal Sekolah</h3>
          <div class="grid grid-2">
            <div class="form-group"><label for="bio-sekolah">Asal Sekolah <span style="color:var(--error);">*</span></label><input type="text" id="bio-sekolah" class="form-control" required value="${student.asal_sekolah || ''}"></div>
            <div class="form-group"><label for="bio-program">Program Pilihan <span style="color:var(--error);">*</span></label><select id="bio-program" class="form-control" required><option value="">Pilih Program</option><option>IPA</option><option>IPS</option><option>Bahasa</option></select></div>
          </div>
          <div style="display:flex;gap:12px;margin-top:24px;">
            <button type="submit" class="btn btn-primary btn-lg">Simpan Biodata</button>
            <a href="#/pendaftar/dashboard" class="btn btn-outline btn-lg">Batal</a>
          </div>
        </form>
      </div></div>`;
  },

  initBiodata() {
    const form = document.getElementById('biodata-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nisn = document.getElementById('bio-nisn').value.trim();
      const nik = document.getElementById('bio-nik').value.trim();
      const name = document.getElementById('bio-name').value.trim();
      const tl = document.getElementById('bio-tl').value.trim();
      const tgl = document.getElementById('bio-tgl').value;
      const jk = document.getElementById('bio-jk').value;
      const agama = document.getElementById('bio-agama').value;
      const telp = document.getElementById('bio-telp').value.trim();
      const alamat = document.getElementById('bio-alamat').value.trim();
      const sekolah = document.getElementById('bio-sekolah').value.trim();

      if (!/^\d{10}$/.test(nisn)) { showToast('NISN harus tepat 10 digit angka.', 'error'); return; }
      if (!/^\d{16}$/.test(nik)) { showToast('NIK harus tepat 16 digit angka.', 'error'); return; }
      if (!name || !tl || !tgl || !jk || !agama || !telp || !alamat || !sekolah) { showToast('Semua field wajib diisi.', 'error'); return; }

      const user = SessionManager.getUser();
      let student = getStudentByUserId(user.id);
      if (student) {
        updateStudent(student.id, { nisn, name, nik, tempat_lahir: tl, tanggal_lahir: tgl, jenis_kelamin: jk, agama, telepon: telp, alamat, asal_sekolah: sekolah });
      }
      showToast('Biodata berhasil disimpan!');
      setTimeout(() => router.navigate('/pendaftar/dokumen'), 1500);
    });
  },

  // UC-002: Document Upload Flow - POST /api/v1/students/upload
  dokumen() {
    const user = SessionManager.getUser();
    const student = getStudentByUserId(user.id);
    const docs = getStudentDocs(student.id);
    const kkDoc = docs.find(d => d.file_type === 'kk');
    const aktaDoc = docs.find(d => d.file_type === 'akta');

    return `
      <div class="page-header"><h1>Unggah Berkas Wajib</h1><p>Unggah Kartu Keluarga (KK) dan Akta Kelahiran. Format: JPG, PNG, atau PDF. Maks 2MB per file.</p></div>
      <div class="grid grid-2">
        <div class="card">
          <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;"><span>Kartu Keluarga (KK)</span><span id="kk-status">${kkDoc ? getStatusBadge(kkDoc.verification_status) : '<span class="badge badge-neutral">Belum Upload</span>'}</span></div>
          <div class="card-body">
            <div id="kk-zone" class="upload-zone" onclick="document.getElementById('kk-file').click()">
              <div class="upload-icon">&#128196;</div><div class="upload-text">Klik atau seret file ke sini</div><div class="upload-hint">JPG, PNG, atau PDF, maks 2MB</div>
            </div>
            <input type="file" id="kk-file" accept=".jpg,.jpeg,.png,.pdf" style="display:none;">
            <div id="kk-preview" style="display:none;margin-top:16px;text-align:center;"></div>
            ${kkDoc && kkDoc.file_path ? `<p style="margin-top:8px;font-size:0.8125rem;color:var(--text-muted);">File: ${kkDoc.file_path}</p>` : ''}
          </div>
        </div>
        <div class="card">
          <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;"><span>Akta Kelahiran</span><span id="akta-status">${aktaDoc ? getStatusBadge(aktaDoc.verification_status) : '<span class="badge badge-neutral">Belum Upload</span>'}</span></div>
          <div class="card-body">
            <div id="akta-zone" class="upload-zone" onclick="document.getElementById('akta-file').click()">
              <div class="upload-icon">&#128196;</div><div class="upload-text">Klik atau seret file ke sini</div><div class="upload-hint">JPG, PNG, atau PDF, maks 2MB</div>
            </div>
            <input type="file" id="akta-file" accept=".jpg,.jpeg,.png,.pdf" style="display:none;">
            <div id="akta-preview" style="display:none;margin-top:16px;text-align:center;"></div>
            ${aktaDoc && aktaDoc.file_path ? `<p style="margin-top:8px;font-size:0.8125rem;color:var(--text-muted);">File: ${aktaDoc.file_path}</p>` : ''}
          </div>
        </div>
      </div>
      ${(kkDoc && kkDoc.rejection_note) || (aktaDoc && aktaDoc.rejection_note) ? `<div class="card" style="margin-top:24px;"><div class="card-header">Catatan Verifikasi</div><div class="card-body">${kkDoc && kkDoc.rejection_note ? `<div class="alert alert-error" style="margin:0;">KK: ${kkDoc.rejection_note}</div>` : ''}${aktaDoc && aktaDoc.rejection_note ? `<div class="alert alert-error" style="margin:8px 0 0;">Akta: ${aktaDoc.rejection_note}</div>` : ''}</div></div>` : ''}
      <div style="display:flex;gap:12px;margin-top:24px;">
        <button class="btn btn-primary btn-lg" id="save-docs-btn">Simpan & Lanjutkan</button>
        <a href="#/pendaftar/biodata" class="btn btn-outline btn-lg">Kembali</a>
      </div>`;
  },

  initDokumen() {
    const user = SessionManager.getUser();
    const student = getStudentByUserId(user.id);
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

    function setupUpload(inputId, zoneId, previewId, statusId, fileType) {
      const input = document.getElementById(inputId);
      const zone = document.getElementById(zoneId);
      const preview = document.getElementById(previewId);
      if (!input) return;

      input.addEventListener('change', () => {
        const file = input.files[0];
        if (!file) return;
        if (!validateFileType(file, ALLOWED_TYPES)) { showToast('Format file tidak didukung. Gunakan JPG, PNG, atau PDF.', 'error'); input.value = ''; return; }
        if (!validateFileSize(file, 2)) { showToast('Ukuran file maksimal 2MB.', 'error'); input.value = ''; return; }

        const fileName = `doc_${student.id}_${fileType}_${Date.now()}${file.name.substring(file.name.lastIndexOf('.'))}`;
        upsertDocument(student.id, fileType, fileName);

        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => { preview.innerHTML = `<img src="${e.target.result}" style="max-width:100%;max-height:200px;border-radius:var(--radius-md);border:1px solid var(--border);"><p style="margin-top:8px;font-size:0.875rem;color:var(--text-muted);">${file.name}</p>`; preview.style.display = 'block'; zone.style.display = 'none'; };
          reader.readAsDataURL(file);
        } else {
          preview.innerHTML = `<div style="padding:20px;background:var(--bg-gray);border-radius:var(--radius-md);"><p style="font-weight:500;">${file.name}</p><p style="font-size:0.8125rem;color:var(--text-muted);">PDF file</p></div>`; preview.style.display = 'block'; zone.style.display = 'none';
        }
        document.getElementById(statusId).innerHTML = '<span class="badge badge-warning">Dikirim</span>';
        showToast(`File ${fileType.toUpperCase()} berhasil diunggah!`);
      });

      zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('dragover'); });
      zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
      zone.addEventListener('drop', (e) => { e.preventDefault(); zone.classList.remove('dragover'); input.files = e.dataTransfer.files; input.dispatchEvent(new Event('change')); });
    }

    setupUpload('kk-file', 'kk-zone', 'kk-preview', 'kk-status', 'kk');
    setupUpload('akta-file', 'akta-zone', 'akta-preview', 'akta-status', 'akta');

    document.getElementById('save-docs-btn')?.addEventListener('click', () => {
      const docs = getStudentDocs(student.id);
      if (docs.length < 2) { showToast('Unggah kedua berkas (KK dan Akta) terlebih dahulu.', 'error'); return; }
      showToast('Dokumen berhasil disimpan!');
      setTimeout(() => router.navigate('/pendaftar/pembayaran'), 1500);
    });
  },

  // UC-005: Payment Proof Upload Flow - POST /api/v1/payments/upload
  pembayaran() {
    const user = SessionManager.getUser();
    const student = getStudentByUserId(user.id);
    const payment = getStudentPayment(student.id);

    return `
      <div class="page-header"><h1>Unggah Bukti Pembayaran</h1><p>Unggah foto struk/bukti transfer. Cukup unggah gambar, tanpa perlu form teks tambahan.</p></div>
      <div class="alert alert-info"><strong>Rekening Pembayaran:</strong><br>Bank BCA - No. Rekening: 1234-5678-9012<br>Atas Nama: Yayasan Pendidikan Nusantara<br>Biaya Pendaftaran: Rp 250.000</div>
      <div class="grid grid-2">
        <div class="card">
          <div class="card-header">Status Pembayaran</div>
          <div class="card-body" id="pay-status-card">
            ${!payment || payment.payment_status === 'belum' ? '<div style="text-align:center;padding:20px;"><div style="font-size:2rem;margin-bottom:8px;">&#128179;</div><p style="color:var(--text-muted);">Belum ada pembayaran</p></div>' : `<div style="display:flex;flex-direction:column;gap:12px;"><div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">Status</span>${getStatusBadge(payment.payment_status)}</div><div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">Jumlah</span><strong>${formatCurrency(250000)}</strong></div>${payment.verified_at ? `<div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">Diverifikasi</span><span>${formatDate(payment.verified_at)}</span></div>` : ''}</div>`}
          </div>
        </div>
        <div class="card">
          <div class="card-header">Upload Bukti Transfer</div>
          <div class="card-body">
            <div id="pay-zone" class="upload-zone" onclick="document.getElementById('pay-file').click()">
              <div class="upload-icon">&#128247;</div><div class="upload-text">Klik atau seret foto struk ke sini</div><div class="upload-hint">JPG atau PNG, maks 2MB</div>
            </div>
            <input type="file" id="pay-file" accept="image/jpeg,image/png" style="display:none;">
            <div id="pay-preview" style="display:none;margin-top:16px;text-align:center;"></div>
            <div style="margin-top:16px;"><button class="btn btn-primary btn-block" id="pay-upload-btn" disabled>Unggah Bukti Transfer</button></div>
          </div>
        </div>
      </div>
      <div style="display:flex;gap:12px;margin-top:24px;"><a href="#/pendaftar/dokumen" class="btn btn-outline btn-lg">Kembali</a><a href="#/pendaftar/status" class="btn btn-primary btn-lg">Lihat Status</a></div>`;
  },

  initPembayaran() {
    const user = SessionManager.getUser();
    const student = getStudentByUserId(user.id);
    const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
    let uploadedFileName = null;

    const fileInput = document.getElementById('pay-file');
    const zone = document.getElementById('pay-zone');
    const preview = document.getElementById('pay-preview');
    const uploadBtn = document.getElementById('pay-upload-btn');

    if (!fileInput) return;

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      if (!validateFileType(file, ALLOWED_TYPES)) { showToast('Format harus JPG atau PNG.', 'error'); fileInput.value = ''; return; }
      if (!validateFileSize(file, 2)) { showToast('Ukuran file maksimal 2MB.', 'error'); fileInput.value = ''; return; }

      uploadedFileName = `bukti_${student.id}_${Date.now()}.jpg`;
      const reader = new FileReader();
      reader.onload = (e) => { preview.innerHTML = `<img src="${e.target.result}" style="max-width:100%;max-height:300px;border-radius:var(--radius-md);border:1px solid var(--border);"><p style="margin-top:8px;font-size:0.875rem;color:var(--text-muted);">${file.name}</p>`; preview.style.display = 'block'; zone.style.display = 'none'; };
      reader.readAsDataURL(file);
      uploadBtn.disabled = false;
    });

    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', (e) => { e.preventDefault(); zone.classList.remove('dragover'); fileInput.files = e.dataTransfer.files; fileInput.dispatchEvent(new Event('change')); });

    uploadBtn.addEventListener('click', () => {
      if (!uploadedFileName) return;
      createPayment(student.id, uploadedFileName);
      showToast('Bukti transfer berhasil diunggah! Menunggu verifikasi bendahara.');
      uploadBtn.disabled = true;
      uploadBtn.textContent = 'Terkirim';
      // Refresh status card
      const payment = getStudentPayment(student.id);
      document.getElementById('pay-status-card').innerHTML = `<div style="display:flex;flex-direction:column;gap:12px;"><div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">Status</span>${getStatusBadge(payment.payment_status)}</div><div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">Jumlah</span><strong>${formatCurrency(250000)}</strong></div></div>`;
    });
  },

  // UC-006: Status View
  status() {
    const user = SessionManager.getUser();
    const student = getStudentByUserId(user.id);
    const docs = getStudentDocs(student.id);
    const payment = getStudentPayment(student.id);
    const approvedDocs = docs.filter(d => d.verification_status === 'disetujui').length;

    let statusBanner = '';
    if (student.pendaftaran_status === 'lulus') {
      statusBanner = `<div class="card" style="border-left:4px solid var(--success);"><div class="card-body" style="text-align:center;padding:40px;"><div style="font-size:4rem;margin-bottom:16px;">&#127881;</div><h2 style="color:var(--success);margin-bottom:8px;">Selamat! Anda Dinyatakan Lulus</h2><p style="color:var(--text-muted);font-size:1.125rem;">Silakan melakukan daftar ulang sesuai jadwal yang ditentukan.</p></div></div>`;
    } else if (student.pendaftaran_status === 'terverifikasi') {
      statusBanner = `<div class="card" style="border-left:4px solid var(--primary);"><div class="card-body" style="text-align:center;padding:40px;"><div style="font-size:4rem;margin-bottom:16px;">&#128269;</div><h2 style="color:var(--primary);margin-bottom:8px;">Pendaftaran Sedang Diproses</h2><p style="color:var(--text-muted);font-size:1.125rem;">Pendaftaran Anda sedang dalam proses verifikasi oleh panitia.</p></div></div>`;
    } else if (student.pendaftaran_status === 'menunggu_verifikasi') {
      statusBanner = `<div class="card" style="border-left:4px solid var(--warning);"><div class="card-body" style="text-align:center;padding:40px;"><div style="font-size:4rem;margin-bottom:16px;">&#9203;</div><h2 style="color:var(--warning);margin-bottom:8px;">Menunggu Verifikasi</h2><p style="color:var(--text-muted);font-size:1.125rem;">Berkas pendaftaran Anda sedang menunggu verifikasi.</p></div></div>`;
    } else {
      statusBanner = `<div class="card" style="border-left:4px solid var(--error);"><div class="card-body" style="text-align:center;padding:40px;"><div style="font-size:4rem;margin-bottom:16px;">&#9888;</div><h2 style="color:var(--error);margin-bottom:8px;">Berkas Belum Lengkap</h2><p style="color:var(--text-muted);font-size:1.125rem;">Silakan lengkapi berkas pendaftaran Anda.</p><a href="#/pendaftar/dokumen" class="btn btn-primary" style="margin-top:16px;">Lengkapi Sekarang</a></div></div>`;
    }

    return `
      <div class="page-header"><h1>Status Pendaftaran & Kelulusan</h1></div>
      ${statusBanner}
      <div class="card" style="margin-top:24px;"><div class="card-header">Detail Pendaftaran</div><div class="card-body">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
          <div><p style="font-size:0.8125rem;color:var(--text-muted);margin-bottom:4px;">Nama</p><p style="font-weight:600;">${student.name}</p></div>
          <div><p style="font-size:0.8125rem;color:var(--text-muted);margin-bottom:4px;">NISN</p><p style="font-weight:600;">${student.nisn || '-'}</p></div>
          <div><p style="font-size:0.8125rem;color:var(--text-muted);margin-bottom:4px;">Asal Sekolah</p><p style="font-weight:600;">${student.asal_sekolah || '-'}</p></div>
          <div><p style="font-size:0.8125rem;color:var(--text-muted);margin-bottom:4px;">Status</p><p>${getStatusBadge(student.pendaftaran_status)}</p></div>
          <div><p style="font-size:0.8125rem;color:var(--text-muted);margin-bottom:4px;">Berkas</p><p>${approvedDocs}/${docs.length || 2} disetujui</p></div>
          <div><p style="font-size:0.8125rem;color:var(--text-muted);margin-bottom:4px;">Pembayaran</p><p>${getStatusBadge(payment ? payment.payment_status : 'belum')}</p></div>
        </div>
      </div></div>
      <div style="margin-top:24px;"><a href="#/pendaftar/pembayaran" class="btn btn-outline btn-lg">Kembali</a></div>`;
  }
};
