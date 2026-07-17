const KepsekPages = {
  // UC-007: Executive Dashboard - Read Only - GET /api/v1/executive/summary
  dashboard() {
    const totalStudents = MockDB.students.length;
    const totalDocs = MockDB.documents.length;
    const approvedDocs = MockDB.documents.filter(d => d.verification_status === 'disetujui').length;
    const lunasPayments = MockDB.payments.filter(p => p.payment_status === 'lunas').length;
    const totalRevenue = lunasPayments * 250000;
    const lulus = MockDB.students.filter(s => s.pendaftaran_status === 'lulus').length;
    const totalTariff = MockDB.tariffs.reduce((s, t) => s + t.amount, 0);

    return `
      <div class="page-header"><h1>Ringkasan Eksekutif PPDB</h1><p>Dashboard real-time read-only. Semua data bersifat agregasi dan tidak dapat diubah.</p></div>
      <div class="grid grid-4" style="margin-bottom:24px;">
        <div class="stat-card"><div class="stat-label">Total Pendaftar</div><div class="stat-value">${totalStudents}</div></div>
        <div class="stat-card"><div class="stat-label">Berkas Disetujui</div><div class="stat-value" style="color:var(--success);">${approvedDocs}/${totalDocs}</div></div>
        <div class="stat-card"><div class="stat-label">Siswa Lulus</div><div class="stat-value" style="color:var(--secondary);">${lulus}</div></div>
        <div class="stat-card"><div class="stat-label">Total Pendapatan</div><div class="stat-value" style="font-size:1.25rem;color:var(--primary);">${formatCurrency(totalRevenue)}</div></div>
      </div>
      <div class="grid grid-2" style="margin-bottom:24px;">
        <div class="card"><div class="card-header">Status Pendaftar</div><div class="card-body">
          <div style="display:flex;flex-direction:column;gap:14px;">
            <div style="display:flex;justify-content:space-between;align-items:center;"><span style="display:flex;align-items:center;gap:8px;"><span style="width:10px;height:10px;border-radius:50%;background:var(--success);"></span> Lulus</span><strong>${MockDB.students.filter(s => s.pendaftaran_status === 'lulus').length}</strong></div>
            <div style="display:flex;justify-content:space-between;align-items:center;"><span style="display:flex;align-items:center;gap:8px;"><span style="width:10px;height:10px;border-radius:50%;background:var(--primary);"></span> Terverifikasi</span><strong>${MockDB.students.filter(s => s.pendaftaran_status === 'terverifikasi').length}</strong></div>
            <div style="display:flex;justify-content:space-between;align-items:center;"><span style="display:flex;align-items:center;gap:8px;"><span style="width:10px;height:10px;border-radius:50%;background:var(--warning);"></span> Menunggu</span><strong>${MockDB.students.filter(s => s.pendaftaran_status === 'menunggu_verifikasi').length}</strong></div>
            <div style="display:flex;justify-content:space-between;align-items:center;"><span style="display:flex;align-items:center;gap:8px;"><span style="width:10px;height:10px;border-radius:50%;background:var(--error);"></span> Belum Lengkap</span><strong>${MockDB.students.filter(s => s.pendaftaran_status === 'belum_lengkap').length}</strong></div>
          </div>
        </div></div>
        <div class="card"><div class="card-header">Status Pembayaran</div><div class="card-body">
          <div style="display:flex;flex-direction:column;gap:14px;">
            <div style="display:flex;justify-content:space-between;align-items:center;"><span style="display:flex;align-items:center;gap:8px;"><span style="width:10px;height:10px;border-radius:50%;background:var(--success);"></span> Lunas</span><strong>${lunasPayments} siswa</strong></div>
            <div style="display:flex;justify-content:space-between;align-items:center;"><span style="display:flex;align-items:center;gap:8px;"><span style="width:10px;height:10px;border-radius:50%;background:var(--warning);"></span> Pending</span><strong>${MockDB.payments.filter(p => p.payment_status === 'pending').length} siswa</strong></div>
            <div style="margin-top:8px;padding-top:12px;border-top:1px solid var(--border);display:flex;justify-content:space-between;"><span>Total Diterima</span><strong style="color:var(--success);">${formatCurrency(totalRevenue)}</strong></div>
          </div>
        </div></div>
      </div>
      <div class="grid grid-2" style="margin-bottom:24px;">
        <div class="card"><div class="card-header">Kuota per Program</div><div class="card-body">
          ${MockDB.quotas.map(q => {
            const pct = Math.round((q.current_count / q.max_quota) * 100);
            const color = pct > 90 ? 'var(--error)' : pct > 70 ? 'var(--warning)' : 'var(--secondary)';
            return `<div style="margin-bottom:14px;"><div style="display:flex;justify-content:space-between;margin-bottom:4px;"><strong style="font-size:0.9375rem;">${q.program}</strong><span style="font-size:0.875rem;color:var(--text-muted);">${q.current_count}/${q.max_quota}</span></div><div class="progress"><div class="progress-bar" style="width:${pct}%;background:${color};"></div></div></div>`;
          }).join('')}
        </div></div>
        <div class="card"><div class="card-header">Pendapatan</div><div class="card-body">
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">Siswa Lunas</span><strong>${lunasPayments}</strong></div>
            <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">Total Tarif Pendaftaran</span><strong>${formatCurrency(totalTariff)}</strong></div>
            <div style="display:flex;justify-content:space-between;padding-top:12px;border-top:1px solid var(--border);font-size:1.125rem;"><strong>Pendapatan Diterima</strong><strong style="color:var(--primary);">${formatCurrency(totalRevenue)}</strong></div>
          </div>
        </div></div>
      </div>
      <div class="card"><div class="card-header">Pengumuman Terakhir</div><div class="card-body">
        ${MockDB.announcements[0] ? `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><strong>${MockDB.announcements[0].title}</strong><span style="font-size:0.8125rem;color:var(--text-light);">${formatDate(MockDB.announcements[0].date)}</span></div><p style="color:var(--text-muted);">${MockDB.announcements[0].content}</p>` : '<p style="color:var(--text-muted);">Belum ada pengumuman.</p>'}
      </div></div>
      <p style="text-align:center;margin-top:32px;font-size:0.8125rem;color:var(--text-light);">Data terakhir diperbarui: ${new Date().toLocaleString('id-ID')}</p>`;
  }
};
