const PublicPages = {
  beranda() {
    return `
      <div class="public-layout">
        <section class="public-hero">
          <h1>Selamat Datang di PPDB Online</h1>
          <p>Sistem Penerimaan Peserta Didik Baru yang transparan, mudah, dan terpercaya. Daftar sekarang untuk tahun ajaran 2026/2027.</p>
          <a href="#/auth/register" class="btn btn-secondary btn-lg">Daftar Sekarang</a>
        </section>
        <section class="public-section" style="background:var(--bg-gray);">
          <h2>Langkah Pendaftaran</h2>
          <p>Ikuti langkah-langkah berikut untuk mendaftar sebagai siswa baru.</p>
          <div class="grid grid-3">
            <div class="card" style="text-align:center;"><div class="card-body" style="padding:32px 20px;"><div style="font-size:2.5rem;margin-bottom:12px;">1</div><h3 style="margin-bottom:8px;">Buat Akun</h3><p style="color:var(--text-muted);font-size:0.9375rem;">Registrasi akun baru dengan email aktif.</p></div></div>
            <div class="card" style="text-align:center;"><div class="card-body" style="padding:32px 20px;"><div style="font-size:2.5rem;margin-bottom:12px;">2</div><h3 style="margin-bottom:8px;">Isi Biodata & Upload Berkas</h3><p style="color:var(--text-muted);font-size:0.9375rem;">Lengkapi data diri dan unggah KK & Akta.</p></div></div>
            <div class="card" style="text-align:center;"><div class="card-body" style="padding:32px 20px;"><div style="font-size:2.5rem;margin-bottom:12px;">3</div><h3 style="margin-bottom:8px;">Bayar & Tunggu Hasil</h3><p style="color:var(--text-muted);font-size:0.9375rem;">Unggah bukti transfer dan pantau kelulusan.</p></div></div>
          </div>
        </section>
        <section class="public-section">
          <h2>Alur Pendaftaran</h2>
          <div style="max-width:700px;margin:0 auto;">
            ${[{s:1,t:'Registrasi Akun',d:'Buat akun pendaftar.'},{s:2,t:'Isi Formulir Biodata',d:'Lengkapi data pribadi.'},{s:3,t:'Upload Berkas Wajib',d:'Unggah KK dan Akta.'},{s:4,t:'Upload Bukti Transfer',d:'Unggah foto struk.'}].map((item,i,arr) => `<div style="display:flex;gap:16px;align-items:flex-start;"><div style="display:flex;flex-direction:column;align-items:center;"><div style="width:40px;height:40px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;">${item.s}</div>${i<arr.length-1?'<div style="width:2px;height:40px;background:var(--border);"></div>':''}</div><div style="padding-bottom:16px;"><strong>${item.t}</strong><p style="color:var(--text-muted);font-size:0.9375rem;">${item.d}</p></div></div>`).join('')}
            <div style="display:flex;gap:16px;align-items:flex-start;"><div style="width:40px;height:40px;border-radius:50%;background:var(--secondary);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;">5</div><div><strong>Tunggu Pengumuman</strong><p style="color:var(--text-muted);font-size:0.9375rem;">Pantau status kelulusan.</p></div></div>
          </div>
        </section>
        <section class="public-section" style="background:var(--bg-gray);"><h2>Pengumuman Terbaru</h2><div id="public-announcements"></div></section>
      </div>`;
  },

  login() {
    return `
      <div class="auth-layout">
        <div class="auth-panel auth-panel-left"><div style="text-align:center;max-width:400px;"><div style="font-size:3rem;margin-bottom:20px;">&#127891;</div><h1 style="font-size:2rem;margin-bottom:12px;">PPDB Online</h1><p style="opacity:0.9;font-size:1.125rem;">Sistem Penerimaan Peserta Didik Baru yang transparan dan mudah.</p></div></div>
        <div class="auth-panel"><div class="auth-form-wrapper"><div class="auth-card">
          <h2>Masuk</h2><p style="color:var(--text-muted);margin-bottom:24px;">Silakan masuk ke akun Anda</p>
          <div id="login-error" class="alert alert-error" style="display:none;"></div>
          <form id="login-form">
            <div class="form-group"><label for="login-email">Email</label><input type="email" id="login-email" class="form-control" placeholder="Masukkan email" required></div>
            <div class="form-group"><label for="login-password">Password</label><input type="password" id="login-password" class="form-control" placeholder="Masukkan password" required></div>
            <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top:8px;">Masuk</button>
          </form>
          <p style="text-align:center;margin-top:20px;color:var(--text-muted);">Belum punya akun? <a href="#/auth/register">Daftar di sini</a></p>
          <div style="margin-top:24px;padding-top:20px;border-top:1px solid var(--border);">
            <p style="font-size:0.8125rem;color:var(--text-light);text-align:center;margin-bottom:12px;">Akun Demo</p>
            <div style="display:grid;gap:8px;">
              <button type="button" class="btn btn-outline btn-sm btn-block" onclick="document.getElementById('login-email').value='ahmad@demo.com';document.getElementById('login-password').value='123456';">Pendaftar: ahmad@demo.com</button>
              <button type="button" class="btn btn-outline btn-sm btn-block" onclick="document.getElementById('login-email').value='panitia@demo.com';document.getElementById('login-password').value='123456';">Panitia: panitia@demo.com</button>
              <button type="button" class="btn btn-outline btn-sm btn-block" onclick="document.getElementById('login-email').value='bendahara@demo.com';document.getElementById('login-password').value='123456';">Bendahara: bendahara@demo.com</button>
              <button type="button" class="btn btn-outline btn-sm btn-block" onclick="document.getElementById('login-email').value='kepsek@demo.com';document.getElementById('login-password').value='123456';">Kepsek: kepsek@demo.com</button>
            </div>
          </div>
        </div></div></div>
      </div>`;
  },

  register() {
    return `
      <div class="auth-layout">
        <div class="auth-panel auth-panel-left"><div style="text-align:center;max-width:400px;"><div style="font-size:3rem;margin-bottom:20px;">&#127891;</div><h1 style="font-size:2rem;margin-bottom:12px;">PPDB Online</h1><p style="opacity:0.9;font-size:1.125rem;">Daftarkan diri Anda untuk menjadi bagian dari sekolah terbaik.</p></div></div>
        <div class="auth-panel"><div class="auth-form-wrapper"><div class="auth-card">
          <h2>Daftar Akun Baru</h2><p style="color:var(--text-muted);margin-bottom:24px;">Isi data berikut untuk membuat akun pendaftar</p>
          <div id="register-error" class="alert alert-error" style="display:none;"></div>
          <form id="register-form">
            <div class="form-group"><label for="reg-name">Nama Lengkap</label><input type="text" id="reg-name" class="form-control" placeholder="Nama sesuai KK" required minlength="3"></div>
            <div class="form-group"><label for="reg-email">Email</label><input type="email" id="reg-email" class="form-control" placeholder="Aktif dan valid" required></div>
            <div class="form-group"><label for="reg-password">Password</label><input type="password" id="reg-password" class="form-control" placeholder="Minimal 6 karakter" required minlength="6"></div>
            <div class="form-group"><label for="reg-confirm">Konfirmasi Password</label><input type="password" id="reg-confirm" class="form-control" placeholder="Ulangi password" required></div>
            <div class="form-group" style="display:flex;gap:8px;align-items:flex-start;"><input type="checkbox" id="reg-agree" required style="margin-top:4px;"><label for="reg-agree" style="font-weight:400;font-size:0.875rem;color:var(--text-muted);">Saya menyetujui syarat dan ketentuan</label></div>
            <button type="submit" class="btn btn-primary btn-block btn-lg" style="margin-top:8px;">Daftar Sekarang</button>
          </form>
          <p style="text-align:center;margin-top:20px;color:var(--text-muted);">Sudah punya akun? <a href="#/auth/login">Masuk di sini</a></p>
        </div></div></div>
      </div>`;
  },

  initBeranda() {
    const el = document.getElementById('public-announcements');
    if (!el) return;
    const published = MockDB.announcements.filter(a => a.published);
    el.innerHTML = published.length ? published.map(a => `<div class="card" style="margin-bottom:12px;"><div class="card-body"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><strong>${a.title}</strong><span class="badge badge-info">${formatDate(a.date)}</span></div><p style="color:var(--text-muted);font-size:0.9375rem;">${a.content}</p></div></div>`).join('') : '<div class="empty-state"><div class="empty-icon">&#128227;</div><h3>Belum Ada Pengumuman</h3><p>Pengumuman akan muncul di sini.</p></div>';
  },

  // UC-001: Login Flow - POST /api/v1/auth/login
  initLogin() {
    const form = document.getElementById('login-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const errorEl = document.getElementById('login-error');
      errorEl.style.display = 'none';

      if (!email || !password) {
        errorEl.textContent = 'Email dan password wajib diisi.';
        errorEl.style.display = 'block';
        return;
      }

      const result = SessionManager.login(email, password);
      if (result.success) {
        const redirects = { pendaftar: '/pendaftar/dashboard', panitia: '/panitia/dashboard', bendahara: '/bendahara/dashboard', kepsek: '/kepsek/dashboard' };
        showToast(`Selamat datang, ${result.user.name}!`);
        setTimeout(() => router.navigate(redirects[result.user.role]), 500);
      } else {
        errorEl.textContent = result.message;
        errorEl.style.display = 'block';
      }
    });
  },

  // UC-001: Registration Flow
  initRegister() {
    const form = document.getElementById('register-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;
      const confirm = document.getElementById('reg-confirm').value;
      const errorEl = document.getElementById('register-error');
      errorEl.style.display = 'none';

      if (name.length < 3) { errorEl.textContent = 'Nama minimal 3 karakter.'; errorEl.style.display = 'block'; return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errorEl.textContent = 'Format email tidak valid.'; errorEl.style.display = 'block'; return; }
      if (password.length < 6) { errorEl.textContent = 'Password minimal 6 karakter.'; errorEl.style.display = 'block'; return; }
      if (password !== confirm) { errorEl.textContent = 'Password tidak cocok.'; errorEl.style.display = 'block'; return; }

      const result = SessionManager.register(name, email, password);
      if (result.success) {
        showToast('Registrasi berhasil! Silakan masuk.');
        setTimeout(() => router.navigate('/auth/login'), 1500);
      } else {
        errorEl.textContent = result.message;
        errorEl.style.display = 'block';
      }
    });
  }
};
