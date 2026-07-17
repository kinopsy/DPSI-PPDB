const PanitiaPages = {
  _sidebar() {
    const pendingDocs = MockDB.documents.filter(d => d.verification_status === 'menunggu').length;
    return `
      <aside class="sidebar" id="app-sidebar">
        <div class="sidebar-section"><div class="sidebar-section-title">Panel Panitia</div></div>
        <div class="sidebar-nav">
          <a href="#/panitia/dashboard" data-route="/panitia/dashboard" class="sidebar-link"><span class="icon">&#9632;</span> Dashboard</a>
          <a href="#/panitia/verifikasi-berkas" data-route="/panitia/verifikasi-berkas" class="sidebar-link"><span class="icon">&#128196;</span> Verifikasi Berkas${pendingDocs > 0 ? `<span class="badge-count">${pendingDocs}</span>` : ''}</a>
          <a href="#/panitia/kuota-dinamis" data-route="/panitia/kuota-dinamis" class="sidebar-link"><span class="icon">&#127919;</span> Kuota Dinamis</a>
          <a href="#/panitia/kelulusan" data-route="/panitia/kelulusan" class="sidebar-link"><span class="icon">&#10003;</span> Konsol Kelulusan</a>
          <a href="#/panitia/pengumuman" data-route="/panitia/pengumuman" class="sidebar-link"><span class="icon">&#128227;</span> Pengumuman</a>
        </div>
      </aside>`;
  },

  dashboard() {
    const pendingDocs = MockDB.documents.filter(d => d.verification_status === 'menunggu').length;
    const pendingPayments = MockDB.payments.filter(p => p.payment_status === 'pending').length;
    const graduated = MockDB.students.filter(s => s.pendaftaran_status === 'lulus').length;
    return `
      <div class="page-header"><h1>Dashboard Panitia</h1><p>Ringkasan aktivitas pendaftaran dan verifikasi PPDB.</p></div>
      <div class="grid grid-4" style="margin-bottom:24px;">
        <div class="stat-card"><div class="stat-label">Total Pendaftar</div><div class="stat-value">${MockDB.students.length}</div></div>
        <div class="stat-card"><div class="stat-label">Menunggu Verifikasi</div><div class="stat-value" style="color:var(--warning);">${pendingDocs}</div></div>
        <div class="stat-card"><div class="stat-label">Pembayaran Pending</div><div class="stat-value" style="color:var(--error);">${pendingPayments}</div></div>
        <div class="stat-card"><div class="stat-label">Siswa Lulus</div><div class="stat-value" style="color:var(--success);">${graduated}</div></div>
      </div>
      <div class="grid grid-2">
        <div class="card"><div class="card-header">Pendaftar Terbaru</div><div class="card-body" style="padding:0;"><table class="table"><thead><tr><th>Nama</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${MockDB.students.map(s => `<tr><td>${s.name}</td><td>${getStatusBadge(s.pendaftaran_status)}</td><td><a href="#/panitia/verifikasi-berkas" class="btn btn-sm btn-outline">Detail</a></td></tr>`).join('')}</tbody></table></div></div>
        <div class="card"><div class="card-header">Kuota per Program</div><div class="card-body">${MockDB.quotas.map(q => { const pct = Math.round((q.current_count / q.max_quota) * 100); const color = pct > 90 ? 'var(--error)' : pct > 70 ? 'var(--warning)' : 'var(--secondary)'; return `<div style="margin-bottom:16px;"><div style="display:flex;justify-content:space-between;margin-bottom:6px;"><strong>${q.program}</strong><span style="color:var(--text-muted);">${q.current_count}/${q.max_quota}</span></div><div class="progress"><div class="progress-bar" style="width:${pct}%;background:${color};"></div></div><p style="font-size:0.75rem;color:var(--text-light);margin-top:4px;">Batas: ${formatDate(q.deadline)}</p></div>`; }).join('')}</div></div>
      </div>`;
  },

  // UC-004: Document Verification Flow - PATCH /api/v1/admin/verify-document
  verifikasiBerkas() {
    return `
      <div class="page-header"><h1>Verifikasi Berkas Pendaftaran</h1><p>Setujui atau tolak berkas yang diunggah oleh calon siswa. Sertakan catatan jika menolak.</p></div>
      <div class="card">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
          <span>Antrian Berkas</span>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-sm btn-outline filter-doc active" data-filter="all">Semua</button>
            <button class="btn btn-sm btn-outline filter-doc" data-filter="menunggu">Menunggu</button>
            <button class="btn btn-sm btn-outline filter-doc" data-filter="disetujui">Disetujui</button>
            <button class="btn btn-sm btn-outline filter-doc" data-filter="ditolak">Ditolak</button>
          </div>
        </div>
        <div class="card-body" style="padding:0;"><table class="table"><thead><tr><th>Nama Siswa</th><th>Jenis</th><th>File</th><th>Status</th><th>Catatan</th><th>Aksi</th></tr></thead><tbody id="docs-tbody"></tbody></table></div>
      </div>
      <div class="modal-overlay" id="reject-modal"><div class="modal"><div class="modal-header"><h3>Tolak Berkas</h3><button class="modal-close" onclick="document.getElementById('reject-modal').classList.remove('active')">&times;</button></div><div class="modal-body"><div class="form-group"><label>Alasan Penolakan <span style="color:var(--error);">*</span></label><textarea id="reject-note" class="form-control" rows="3" placeholder="Jelaskan alasan penolakan (wajib)..." required></textarea></div></div><div class="modal-footer"><button class="btn btn-outline" onclick="document.getElementById('reject-modal').classList.remove('active')">Batal</button><button class="btn btn-danger" id="confirm-reject-btn">Tolak</button></div></div></div>`;
  },

  initVerifikasiBerkas() {
    let filter = 'all';
    let currentRejectId = null;

    function render() {
      const tbody = document.getElementById('docs-tbody');
      if (!tbody) return;
      let docs = filter === 'all' ? MockDB.documents : MockDB.documents.filter(d => d.verification_status === filter);
      if (docs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state" style="padding:40px;"><div class="empty-icon">&#128196;</div><h3>Tidak Ada Berkas</h3><p>Tidak ada berkas dengan filter ini.</p></div></td></tr>';
        return;
      }
      tbody.innerHTML = docs.map(doc => {
        const s = MockDB.students.find(st => st.id === doc.student_id);
        return `<tr><td><strong>${s ? s.name : '-'}</strong></td><td>${doc.file_type === 'kk' ? 'Kartu Keluarga' : 'Akta Kelahiran'}</td><td style="font-size:0.875rem;color:var(--text-muted);">${doc.file_path}</td><td>${getStatusBadge(doc.verification_status)}</td><td style="font-size:0.875rem;max-width:200px;">${doc.rejection_note || '-'}</td><td>${doc.verification_status === 'menunggu' ? `<button class="btn btn-sm btn-secondary" data-approve="${doc.id}">Setujui</button> <button class="btn btn-sm btn-danger" data-reject="${doc.id}">Tolak</button>` : '-'}</td></tr>`;
      }).join('');

      tbody.querySelectorAll('[data-approve]').forEach(btn => {
        btn.addEventListener('click', () => {
          const doc = verifyDocument(btn.dataset.approve, 'disetujui', null);
          if (doc) {
            updateStudentStatusFromDocs(doc.student_id);
            render();
            showToast('Berkas berhasil disetujui!');
            // Re-render sidebar to update badge count
            const sidebar = document.getElementById('app-sidebar');
            if (sidebar) sidebar.outerHTML = PanitiaPages._sidebar();
            router.updateActiveLinks(router.currentRoute);
          }
        });
      });

      tbody.querySelectorAll('[data-reject]').forEach(btn => {
        btn.addEventListener('click', () => {
          currentRejectId = btn.dataset.reject;
          document.getElementById('reject-note').value = '';
          document.getElementById('reject-modal').classList.add('active');
        });
      });
    }

    document.querySelectorAll('.filter-doc').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-doc').forEach(b => b.classList.remove('active'));
        this.classList.add('active'); filter = this.dataset.filter; render();
      });
    });

    document.getElementById('confirm-reject-btn')?.addEventListener('click', () => {
      const note = document.getElementById('reject-note').value.trim();
      if (!note) { showToast('Alasan penolakan wajib diisi.', 'error'); return; }
      const doc = verifyDocument(currentRejectId, 'ditolak', note);
      if (doc) {
        updateStudentStatusFromDocs(doc.student_id);
        document.getElementById('reject-modal').classList.remove('active');
        render();
        showToast('Berkas ditolak dengan catatan.');
        const sidebar = document.getElementById('app-sidebar');
        if (sidebar) sidebar.outerHTML = PanitiaPages._sidebar();
        router.updateActiveLinks(router.currentRoute);
      }
    });
    render();
  },

  // UC-003: Dynamic Quota Management Flow
  kuotaDinamis() {
    return `
      <div class="page-header"><h1>Pengaturan Kuota Dinamis</h1><p>Atur kuota maksimal per program studi. Kuota dapat diubah kapan saja saat pendaftaran aktif.</p></div>
      <div class="alert alert-warning"><strong>Aturan Bisnis:</strong> Penurunan kuota di bawah jumlah siswa yang sudah dinyatakan lulus akan ditolak oleh sistem.</div>
      <div id="kuota-list"></div>
      <div class="modal-overlay" id="kuota-modal"><div class="modal"><div class="modal-header"><h3>Edit Kuota: <span id="kuota-edit-program"></span></h3><button class="modal-close" onclick="document.getElementById('kuota-modal').classList.remove('active')">&times;</button></div><div class="modal-body"><div class="form-group"><label>Kuota Maksimal <span style="color:var(--error);">*</span></label><input type="number" id="kuota-edit-val" class="form-control" min="0"></div><div class="form-group"><label>Batas Waktu <span style="color:var(--error);">*</span></label><input type="date" id="kuota-edit-deadline" class="form-control"></div><div id="kuota-edit-error" class="alert alert-error" style="display:none;"></div></div><div class="modal-footer"><button class="btn btn-outline" onclick="document.getElementById('kuota-modal').classList.remove('active')">Batal</button><button class="btn btn-primary" id="kuota-save-btn">Simpan</button></div></div></div>`;
  },

  initKuotaDinamis() {
    let editId = null;
    function render() {
      const el = document.getElementById('kuota-list');
      if (!el) return;
      el.innerHTML = MockDB.quotas.map(q => {
        const pct = Math.round((q.current_count / q.max_quota) * 100);
        const color = pct > 90 ? 'var(--error)' : pct > 70 ? 'var(--warning)' : 'var(--secondary)';
        return `<div class="card" style="margin-bottom:16px;"><div class="card-body"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;"><div><h3 style="font-size:1.125rem;">${q.program}</h3><p style="font-size:0.875rem;color:var(--text-muted);">Batas waktu: ${formatDate(q.deadline)}</p></div><button class="btn btn-sm btn-outline" data-edit-kuota="${q.id}">Edit</button></div><div style="display:flex;gap:32px;margin-bottom:12px;"><div><p style="font-size:0.75rem;color:var(--text-light);text-transform:uppercase;">Terisi</p><p style="font-size:1.5rem;font-weight:700;color:var(--primary);">${q.current_count}</p></div><div><p style="font-size:0.75rem;color:var(--text-light);text-transform:uppercase;">Maksimal</p><p style="font-size:1.5rem;font-weight:700;">${q.max_quota}</p></div><div><p style="font-size:0.75rem;color:var(--text-light);text-transform:uppercase;">Sisa</p><p style="font-size:1.5rem;font-weight:700;color:${q.max_quota - q.current_count < 10 ? 'var(--error)' : 'var(--success)'};">${q.max_quota - q.current_count}</p></div></div><div class="progress"><div class="progress-bar" style="width:${pct}%;background:${color};"></div></div><p style="font-size:0.8125rem;color:var(--text-muted);margin-top:6px;">${pct}% terisi</p></div></div>`;
      }).join('');
      el.querySelectorAll('[data-edit-kuota]').forEach(btn => {
        btn.addEventListener('click', () => {
          editId = btn.dataset.editKuota;
          const q = MockDB.quotas.find(q => q.id === editId);
          document.getElementById('kuota-edit-program').textContent = q.program;
          document.getElementById('kuota-edit-val').value = q.max_quota;
          document.getElementById('kuota-edit-deadline').value = q.deadline;
          document.getElementById('kuota-edit-error').style.display = 'none';
          document.getElementById('kuota-modal').classList.add('active');
        });
      });
    }

    document.getElementById('kuota-save-btn')?.addEventListener('click', () => {
      const val = parseInt(document.getElementById('kuota-edit-val').value);
      const deadline = document.getElementById('kuota-edit-deadline').value;
      const errEl = document.getElementById('kuota-edit-error');
      if (isNaN(val) || val < 0) { errEl.textContent = 'Kuota harus angka positif.'; errEl.style.display = 'block'; return; }
      const result = updateQuota(editId, val, deadline);
      if (!result.success) { errEl.textContent = result.message; errEl.style.display = 'block'; return; }
      document.getElementById('kuota-modal').classList.remove('active');
      render();
      showToast('Kuota berhasil diperbarui!');
    });
    render();
  },

  // UC-006: Graduation Management Flow
  kelulusan() {
    function getStats() {
      return { lulus: MockDB.students.filter(s => s.pendaftaran_status === 'lulus').length, pending: MockDB.students.filter(s => s.pendaftaran_status !== 'lulus' && s.pendaftaran_status !== 'belum_lengkap').length };
    }
    const stats = getStats();
    return `
      <div class="page-header"><h1>Konsol Kelulusan</h1><p>Tentukan status kelulusan siswa secara individual.</p></div>
      <div class="grid grid-3" style="margin-bottom:24px;">
        <div class="stat-card"><div class="stat-label">Total Pendaftar</div><div class="stat-value">${MockDB.students.length}</div></div>
        <div class="stat-card"><div class="stat-label">Lulus</div><div class="stat-value" style="color:var(--success);" id="kel-lulus-count">${stats.lulus}</div></div>
        <div class="stat-card"><div class="stat-label">Belum Diproses</div><div class="stat-value" style="color:var(--warning);" id="kel-pending-count">${stats.pending}</div></div>
      </div>
      <div class="card">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;"><span>Daftar Pendaftar</span><button class="btn btn-sm btn-primary" id="publish-ann-btn">Terbitkan Pengumuman</button></div>
        <div class="card-body" style="padding:0;"><table class="table"><thead><tr><th>Nama</th><th>NISN</th><th>Asal Sekolah</th><th>Status</th><th>Aksi</th></tr></thead><tbody id="kel-student-list"></tbody></table></div>
      </div>
      <div class="modal-overlay" id="publish-modal"><div class="modal"><div class="modal-header"><h3>Terbitkan Pengumuman Kelulusan</h3><button class="modal-close" onclick="document.getElementById('publish-modal').classList.remove('active')">&times;</button></div><div class="modal-body"><p style="margin-bottom:16px;color:var(--text-muted);">Pastikan semua status kelulusan sudah benar.</p><div style="padding:12px;background:var(--bg-gray);border-radius:var(--radius-md);">Lulus: <span id="pub-lulus">0</span> | Belum Diproses: <span id="pub-tidak">0</span></div></div><div class="modal-footer"><button class="btn btn-outline" onclick="document.getElementById('publish-modal').classList.remove('active')">Batal</button><button class="btn btn-primary" id="pub-confirm-btn">Terbitkan</button></div></div></div>`;
  },

  initKelulusan() {
    function render() {
      const tbody = document.getElementById('kel-student-list');
      if (!tbody) return;
      let lulusCount = 0, pendingCount = 0;
      MockDB.students.forEach(s => {
        if (s.pendaftaran_status === 'lulus') lulusCount++;
        else if (s.pendaftaran_status !== 'belum_lengkap') pendingCount++;
      });
      document.getElementById('kel-lulus-count').textContent = lulusCount;
      document.getElementById('kel-pending-count').textContent = pendingCount;
      tbody.innerHTML = MockDB.students.map(s => `<tr><td><strong>${s.name}</strong></td><td>${s.nisn || '-'}</td><td>${s.asal_sekolah || '-'}</td><td>${getStatusBadge(s.pendaftaran_status)}</td><td>${s.pendaftaran_status !== 'lulus' ? `<button class="btn btn-sm btn-secondary" data-set-lulus="${s.id}">Lulus</button>` : `<button class="btn btn-sm btn-outline" data-set-batal="${s.id}">Batal Lulus</button>`}</td></tr>`).join('');

      tbody.querySelectorAll('[data-set-lulus]').forEach(btn => {
        btn.addEventListener('click', () => {
          setGraduation(btn.dataset.setLulus, 'lulus');
          const s = MockDB.students.find(s => s.id === btn.dataset.setLulus);
          render(); showToast(`${s.name} dinyatakan lulus!`);
        });
      });
      tbody.querySelectorAll('[data-set-batal]').forEach(btn => {
        btn.addEventListener('click', () => {
          setGraduation(btn.dataset.setBatal, 'terverifikasi');
          const s = MockDB.students.find(s => s.id === btn.dataset.setBatal);
          render(); showToast(`Status ${s.name} dikembalikan.`, 'warning');
        });
      });
    }
    render();

    document.getElementById('publish-ann-btn')?.addEventListener('click', () => {
      const lulus = MockDB.students.filter(s => s.pendaftaran_status === 'lulus').length;
      document.getElementById('pub-lulus').textContent = lulus;
      document.getElementById('pub-tidak').textContent = MockDB.students.filter(s => s.pendaftaran_status !== 'lulus' && s.pendaftaran_status !== 'belum_lengkap').length;
      document.getElementById('publish-modal').classList.add('active');
    });
    document.getElementById('pub-confirm-btn')?.addEventListener('click', () => {
      createAnnouncement('Pengumuman Kelulusan PPDB 2026', 'Pengumuman kelulusan telah diterbitkan. Silakan cek status pendaftaran Anda.');
      document.getElementById('publish-modal').classList.remove('active');
      showToast('Pengumuman berhasil diterbitkan!');
    });
  },

  pengumuman() {
    return `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;"><div><h1>Manajemen Pengumuman</h1><p>Buat dan kelola pengumuman untuk calon siswa.</p></div><button class="btn btn-primary" id="create-ann-btn">Buat Pengumuman</button></div>
      <div id="ann-list"></div>
      <div class="modal-overlay" id="ann-modal"><div class="modal"><div class="modal-header"><h3>Buat Pengumuman Baru</h3><button class="modal-close" onclick="document.getElementById('ann-modal').classList.remove('active')">&times;</button></div><div class="modal-body"><div class="form-group"><label>Judul <span style="color:var(--error);">*</span></label><input type="text" id="ann-title" class="form-control" placeholder="Judul pengumuman" required></div><div class="form-group"><label>Isi Pengumuman <span style="color:var(--error);">*</span></label><textarea id="ann-content" class="form-control" rows="5" placeholder="Tulis pengumuman..." required></textarea></div></div><div class="modal-footer"><button class="btn btn-outline" onclick="document.getElementById('ann-modal').classList.remove('active')">Batal</button><button class="btn btn-primary" id="ann-publish-btn">Terbitkan</button></div></div></div>`;
  },

  initPengumuman() {
    function render() {
      document.getElementById('ann-list').innerHTML = MockDB.announcements.map(a => `<div class="card" style="margin-bottom:12px;"><div class="card-body"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><strong>${a.title}</strong><div style="display:flex;gap:8px;align-items:center;"><span class="badge ${a.published ? 'badge-success' : 'badge-warning'}">${a.published ? 'Diterbitkan' : 'Draft'}</span><span style="font-size:0.8125rem;color:var(--text-light);">${formatDate(a.date)}</span></div></div><p style="color:var(--text-muted);font-size:0.9375rem;">${a.content}</p></div></div>`).join('');
    }
    render();
    document.getElementById('create-ann-btn')?.addEventListener('click', () => {
      document.getElementById('ann-title').value = '';
      document.getElementById('ann-content').value = '';
      document.getElementById('ann-modal').classList.add('active');
    });
    document.getElementById('ann-publish-btn')?.addEventListener('click', () => {
      const title = document.getElementById('ann-title').value.trim();
      const content = document.getElementById('ann-content').value.trim();
      if (!title || !content) { showToast('Judul dan isi wajib diisi.', 'error'); return; }
      createAnnouncement(title, content);
      document.getElementById('ann-modal').classList.remove('active');
      render(); showToast('Pengumuman berhasil diterbitkan!');
    });
  }
};
