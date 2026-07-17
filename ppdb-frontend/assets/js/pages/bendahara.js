const BendaharaPages = {
  _sidebar() {
    const pendingPay = MockDB.payments.filter(p => p.payment_status === 'pending').length;
    return `
      <aside class="sidebar" id="app-sidebar">
        <div class="sidebar-section"><div class="sidebar-section-title">Panel Keuangan</div></div>
        <div class="sidebar-nav">
          <a href="#/bendahara/dashboard" data-route="/bendahara/dashboard" class="sidebar-link"><span class="icon">&#9632;</span> Dashboard</a>
          <a href="#/bendahara/verifikasi-pembayaran" data-route="/bendahara/verifikasi-pembayaran" class="sidebar-link"><span class="icon">&#128179;</span> Verifikasi Bayar${pendingPay > 0 ? `<span class="badge-count">${pendingPay}</span>` : ''}</a>
          <a href="#/bendahara/tarif-biaya" data-route="/bendahara/tarif-biaya" class="sidebar-link"><span class="icon">&#128197;</span> Tarif Biaya</a>
          <a href="#/bendahara/audit-log" data-route="/bendahara/audit-log" class="sidebar-link"><span class="icon">&#128202;</span> Audit Log</a>
        </div>
      </aside>`;
  },

  dashboard() {
    const pendingPayments = MockDB.payments.filter(p => p.payment_status === 'pending').length;
    const lunasPayments = MockDB.payments.filter(p => p.payment_status === 'lunas').length;
    const totalRevenue = lunasPayments * 250000;
    const totalTariff = MockDB.tariffs.reduce((s, t) => s + t.amount, 0);
    return `
      <div class="page-header"><h1>Dashboard Bendahara</h1><p>Ringkasan keuangan dan status pembayaran PPDB.</p></div>
      <div class="grid grid-4" style="margin-bottom:24px;">
        <div class="stat-card"><div class="stat-label">Total Pendaftar</div><div class="stat-value">${MockDB.students.length}</div></div>
        <div class="stat-card"><div class="stat-label">Pembayaran Pending</div><div class="stat-value" style="color:var(--warning);">${pendingPayments}</div></div>
        <div class="stat-card"><div class="stat-label">Sudah Lunas</div><div class="stat-value" style="color:var(--success);">${lunasPayments}</div></div>
        <div class="stat-card"><div class="stat-label">Total Pendapatan</div><div class="stat-value" style="font-size:1.25rem;">${formatCurrency(totalRevenue)}</div></div>
      </div>
      <div class="grid grid-2">
        <div class="card"><div class="card-header">Pembayaran Terbaru</div><div class="card-body" style="padding:0;"><table class="table"><thead><tr><th>Siswa</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${MockDB.payments.map(p => { const s = MockDB.students.find(st => st.id === p.student_id); return `<tr><td>${s ? s.name : '-'}</td><td>${getStatusBadge(p.payment_status)}</td><td><a href="#/bendahara/verifikasi-pembayaran" class="btn btn-sm btn-outline">Detail</a></td></tr>`; }).join('')}</tbody></table></div></div>
        <div class="card"><div class="card-header">Komponen Biaya</div><div class="card-body">${MockDB.tariffs.map(t => `<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);"><span>${t.component}</span><strong>${formatCurrency(t.amount)}</strong></div>`).join('')}<div style="display:flex;justify-content:space-between;padding:12px 0;font-weight:700;font-size:1.125rem;"><span>Total</span><span style="color:var(--primary);">${formatCurrency(totalTariff)}</span></div></div></div>
      </div>`;
  },

  // UC-005: Payment Verification Flow
  verifikasiPembayaran() {
    return `
      <div class="page-header"><h1>Verifikasi Pembayaran Manual</h1><p>Validasi bukti transfer yang diunggah calon siswa berdasarkan mutasi rekening sekolah.</p></div>
      <div class="card">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;">
          <span>Antrian Pembayaran</span>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-sm btn-outline filter-pay active" data-filter="all">Semua</button>
            <button class="btn btn-sm btn-outline filter-pay" data-filter="pending">Pending</button>
            <button class="btn btn-sm btn-outline filter-pay" data-filter="lunas">Lunas</button>
          </div>
        </div>
        <div class="card-body" style="padding:0;"><table class="table"><thead><tr><th>Siswa</th><th>Bukti</th><th>Status</th><th>Diverifikasi</th><th>Aksi</th></tr></thead><tbody id="pay-tbody"></tbody></table></div>
      </div>
      <div class="modal-overlay" id="proof-modal"><div class="modal"><div class="modal-header"><h3>Bukti Transfer</h3><button class="modal-close" onclick="document.getElementById('proof-modal').classList.remove('active')">&times;</button></div><div class="modal-body" id="proof-content" style="text-align:center;"></div></div></div>`;
  },

  initVerifikasiPembayaran() {
    let filter = 'all';
    function render() {
      const tbody = document.getElementById('pay-tbody');
      if (!tbody) return;
      let payments = filter === 'all' ? MockDB.payments : MockDB.payments.filter(p => p.payment_status === filter);
      if (payments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5"><div class="empty-state" style="padding:40px;"><div class="empty-icon">&#128179;</div><h3>Tidak Ada Pembayaran</h3><p>Tidak ada pembayaran dengan filter ini.</p></div></td></tr>';
        return;
      }
      tbody.innerHTML = payments.map(p => {
        const s = MockDB.students.find(st => st.id === p.student_id);
        return `<tr><td><strong>${s ? s.name : '-'}</strong><br><span style="font-size:0.8125rem;color:var(--text-muted);">${s ? s.nisn : ''}</span></td><td><button class="btn btn-sm btn-outline" data-view-proof="${p.proof_file_path}">Lihat</button></td><td>${getStatusBadge(p.payment_status)}</td><td style="font-size:0.875rem;">${p.verified_at ? formatDate(p.verified_at) : '-'}</td><td>${p.payment_status === 'pending' ? `<button class="btn btn-sm btn-secondary" data-approve-pay="${p.id}">Setujui (Lunas)</button> <button class="btn btn-sm btn-danger" data-reject-pay="${p.id}">Tolak</button>` : '-'}</td></tr>`;
      }).join('');

      tbody.querySelectorAll('[data-approve-pay]').forEach(btn => {
        btn.addEventListener('click', () => {
          verifyPayment(btn.dataset.approvePay, 'lunas');
          render(); showToast('Pembayaran disetujui (Lunas)!');
          const sidebar = document.getElementById('app-sidebar');
          if (sidebar) sidebar.outerHTML = BendaharaPages._sidebar();
          router.updateActiveLinks(router.currentRoute);
        });
      });
      tbody.querySelectorAll('[data-reject-pay]').forEach(btn => {
        btn.addEventListener('click', () => {
          verifyPayment(btn.dataset.rejectPay, 'ditolak_bayar');
          render(); showToast('Pembayaran ditolak.', 'warning');
          const sidebar = document.getElementById('app-sidebar');
          if (sidebar) sidebar.outerHTML = BendaharaPages._sidebar();
          router.updateActiveLinks(router.currentRoute);
        });
      });
      tbody.querySelectorAll('[data-view-proof]').forEach(btn => {
        btn.addEventListener('click', () => {
          document.getElementById('proof-content').innerHTML = `<div style="padding:40px;background:var(--bg-gray);border-radius:var(--radius-md);margin-bottom:16px;"><div style="font-size:3rem;margin-bottom:12px;">&#128247;</div><p style="font-size:1.125rem;font-weight:600;">${btn.dataset.viewProof}</p><p style="color:var(--text-muted);font-size:0.875rem;margin-top:8px;">Bukti transfer dari calon siswa</p></div><div style="text-align:left;padding:16px;background:var(--bg-gray);border-radius:var(--radius-md);"><p style="font-size:0.875rem;color:var(--text-muted);">Dalam implementasi nyata, gambar bukti transfer ditampilkan di sini. Bendahara membandingkan dengan mutasi rekening sekolah.</p></div>`;
          document.getElementById('proof-modal').classList.add('active');
        });
      });
    }
    document.querySelectorAll('.filter-pay').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-pay').forEach(b => b.classList.remove('active'));
        this.classList.add('active'); filter = this.dataset.filter; render();
      });
    });
    render();
  },

  tarifBiaya() {
    return `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;"><div><h1>Pengaturan Tarif Biaya</h1><p>Konfigurasi komponen biaya PPDB. Perubahan tercatat di audit log.</p></div><button class="btn btn-primary" id="add-tariff-btn">Tambah Komponen</button></div>
      <div class="card"><div class="card-body" style="padding:0;"><table class="table"><thead><tr><th>Komponen</th><th>Deskripsi</th><th>Nominal</th><th>Aksi</th></tr></thead><tbody id="tariff-tbody"></tbody></table></div></div>
      <div class="card" style="margin-top:24px;"><div class="card-header">Ringkasan Total</div><div class="card-body" id="tariff-total"></div></div>
      <div class="modal-overlay" id="tariff-modal"><div class="modal"><div class="modal-header"><h3 id="tariff-modal-title">Tambah Komponen Biaya</h3><button class="modal-close" onclick="document.getElementById('tariff-modal').classList.remove('active')">&times;</button></div><div class="modal-body"><div class="form-group"><label>Nama Komponen <span style="color:var(--error);">*</span></label><input type="text" id="tariff-name" class="form-control" required></div><div class="form-group"><label>Nominal (Rp) <span style="color:var(--error);">*</span></label><input type="number" id="tariff-amount" class="form-control" min="0" required></div><div class="form-group"><label>Deskripsi</label><textarea id="tariff-desc" class="form-control" rows="2"></textarea></div></div><div class="modal-footer"><button class="btn btn-outline" onclick="document.getElementById('tariff-modal').classList.remove('active')">Batal</button><button class="btn btn-primary" id="tariff-save-btn">Simpan</button></div></div></div>`;
  },

  initTarifBiaya() {
    let editId = null;
    function render() {
      const tbody = document.getElementById('tariff-tbody');
      if (!tbody) return;
      let total = 0;
      tbody.innerHTML = MockDB.tariffs.map(t => { total += t.amount; return `<tr><td><strong>${t.component}</strong></td><td style="color:var(--text-muted);font-size:0.9375rem;">${t.description}</td><td style="font-weight:600;">${formatCurrency(t.amount)}</td><td><button class="btn btn-sm btn-outline" data-edit-tariff="${t.id}">Edit</button> <button class="btn btn-sm btn-danger" data-del-tariff="${t.id}">Hapus</button></td></tr>`; }).join('');
      document.getElementById('tariff-total').innerHTML = `<div style="display:flex;justify-content:space-between;font-size:1.25rem;"><strong>Total Komponen Biaya</strong><strong style="color:var(--primary);">${formatCurrency(total)}</strong></div>`;
      tbody.querySelectorAll('[data-edit-tariff]').forEach(btn => {
        btn.addEventListener('click', () => {
          editId = btn.dataset.editTariff;
          const t = MockDB.tariffs.find(t => t.id === editId);
          document.getElementById('tariff-modal-title').textContent = 'Edit Komponen Biaya';
          document.getElementById('tariff-name').value = t.component;
          document.getElementById('tariff-amount').value = t.amount;
          document.getElementById('tariff-desc').value = t.description;
          document.getElementById('tariff-modal').classList.add('active');
        });
      });
      tbody.querySelectorAll('[data-del-tariff]').forEach(btn => {
        btn.addEventListener('click', () => {
          if (!confirm('Hapus komponen biaya ini?')) return;
          deleteTariff(btn.dataset.delTariff);
          render(); showToast('Komponen biaya dihapus.');
        });
      });
    }
    document.getElementById('add-tariff-btn')?.addEventListener('click', () => {
      editId = null;
      document.getElementById('tariff-modal-title').textContent = 'Tambah Komponen Biaya';
      document.getElementById('tariff-name').value = '';
      document.getElementById('tariff-amount').value = '';
      document.getElementById('tariff-desc').value = '';
      document.getElementById('tariff-modal').classList.add('active');
    });
    document.getElementById('tariff-save-btn')?.addEventListener('click', () => {
      const name = document.getElementById('tariff-name').value.trim();
      const amount = parseInt(document.getElementById('tariff-amount').value);
      const desc = document.getElementById('tariff-desc').value.trim();
      if (!name || isNaN(amount) || amount < 0) { showToast('Nama dan nominal wajib diisi.', 'error'); return; }
      if (editId) { updateTariff(editId, name, amount, desc); } else { addTariff(name, amount, desc); }
      document.getElementById('tariff-modal').classList.remove('active');
      render(); showToast(editId ? 'Tarif diperbarui!' : 'Komponen biaya ditambahkan!');
    });
    render();
  },

  auditLog() {
    return `
      <div class="page-header"><h1>Audit Log Keuangan</h1><p>Catatan semua aktivitas keuangan terkait pembayaran dan tarif.</p></div>
      <div class="card">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;"><span>Riwayat Aktivitas</span><button class="btn btn-sm btn-outline" id="export-log-btn">Export CSV</button></div>
        <div class="card-body" style="padding:0;"><table class="table"><thead><tr><th>Waktu</th><th>Aksi</th><th>Siswa/Komponen</th><th>Detail</th><th>Penanggung Jawab</th></tr></thead><tbody id="log-tbody"></tbody></table></div>
      </div>`;
  },

  initAuditLog() {
    const tbody = document.getElementById('log-tbody');
    if (!tbody) return;
    if (MockDB.auditLogs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5"><div class="empty-state" style="padding:40px;"><div class="empty-icon">&#128202;</div><h3>Belum Ada Log</h3><p>Audit log akan muncul setelah ada aktivitas.</p></div></td></tr>';
    } else {
      tbody.innerHTML = MockDB.auditLogs.map(log => `<tr><td style="font-size:0.875rem;white-space:nowrap;">${log.date}</td><td><span class="badge badge-info">${log.action}</span></td><td>${log.student}</td><td style="font-weight:500;">${log.amount}</td><td style="font-size:0.875rem;">${log.officer}</td></tr>`).join('');
    }
    document.getElementById('export-log-btn')?.addEventListener('click', () => {
      let csv = 'Waktu,Aksi,Siswa,Detail,Penanggung Jawab\n';
      MockDB.auditLogs.forEach(log => { csv += `"${log.date}","${log.action}","${log.student}","${log.amount}","${log.officer}"\n`; });
      const blob = new Blob([csv], { type: 'text/csv' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'audit_log_ppdb.csv'; a.click();
      showToast('Audit log berhasil di-export!');
    });
  }
};
