const App = {
  layoutEl: null,
  navbarEl: null,
  sidebarEl: null,
  mainEl: null,

  init() {
    this.layoutEl = document.getElementById('app-layout');
    this.navbarEl = document.getElementById('app-navbar');
    this.mainEl = document.getElementById('app-main');
    this.setupRouter();
    router.resolve();
  },

  setupRouter() {
    const publicRoutes = ['/', '/auth/login', '/auth/register'];

    router.beforeEach = (path, meta) => {
      const user = SessionManager.getUser();

      if (publicRoutes.includes(path)) {
        if (user) {
          const redirects = { pendaftar: '/pendaftar/dashboard', panitia: '/panitia/dashboard', bendahara: '/bendahara/dashboard', kepsek: '/kepsek/dashboard' };
          router.navigate(redirects[user.role]);
          return false;
        }
        this.layoutEl.className = 'public-layout-wrapper';
        return true;
      }

      if (!user) {
        router.navigate('/auth/login');
        return false;
      }

      const roleRoutes = {
        pendaftar: '/pendaftar/',
        panitia: '/panitia/',
        bendahara: '/bendahara/',
        kepsek: '/kepsek/'
      };

      const allowedPrefix = roleRoutes[user.role];
      if (!path.startsWith(allowedPrefix)) {
        this.render403();
        return false;
      }

      this.layoutEl.className = 'app-layout-wrapper';
      return true;
    };

    // M001: Public Module
    router.on('/', () => {
      this.renderPublicLayout();
      this.mainEl.innerHTML = PublicPages.beranda();
      PublicPages.initBeranda();
    });
    router.on('/auth/login', () => {
      this.renderPublicLayout();
      this.mainEl.innerHTML = PublicPages.login();
      PublicPages.initLogin();
    });
    router.on('/auth/register', () => {
      this.renderPublicLayout();
      this.mainEl.innerHTML = PublicPages.register();
      PublicPages.initRegister();
    });

    // M002: Applicant Module
    router.on('/pendaftar/dashboard', () => {
      this.renderAppLayout('pendaftar');
      this.mainEl.innerHTML = PendaftarPages.dashboard();
      PendaftarPages.initDashboard();
    });
    router.on('/pendaftar/biodata', () => {
      this.renderAppLayout('pendaftar');
      this.mainEl.innerHTML = PendaftarPages.biodata();
      PendaftarPages.initBiodata();
    });
    router.on('/pendaftar/dokumen', () => {
      this.renderAppLayout('pendaftar');
      this.mainEl.innerHTML = PendaftarPages.dokumen();
      PendaftarPages.initDokumen();
    });
    router.on('/pendaftar/pembayaran', () => {
      this.renderAppLayout('pendaftar');
      this.mainEl.innerHTML = PendaftarPages.pembayaran();
      PendaftarPages.initPembayaran();
    });
    router.on('/pendaftar/status', () => {
      this.renderAppLayout('pendaftar');
      this.mainEl.innerHTML = PendaftarPages.status();
    });

    // M003: Admin/Panitia Module
    router.on('/panitia/dashboard', () => {
      this.renderAppLayout('panitia');
      this.mainEl.innerHTML = PanitiaPages.dashboard();
    });
    router.on('/panitia/verifikasi-berkas', () => {
      this.renderAppLayout('panitia');
      this.mainEl.innerHTML = PanitiaPages.verifikasiBerkas();
      PanitiaPages.initVerifikasiBerkas();
    });
    router.on('/panitia/kuota-dinamis', () => {
      this.renderAppLayout('panitia');
      this.mainEl.innerHTML = PanitiaPages.kuotaDinamis();
      PanitiaPages.initKuotaDinamis();
    });
    router.on('/panitia/kelulusan', () => {
      this.renderAppLayout('panitia');
      this.mainEl.innerHTML = PanitiaPages.kelulusan();
      PanitiaPages.initKelulusan();
    });
    router.on('/panitia/pengumuman', () => {
      this.renderAppLayout('panitia');
      this.mainEl.innerHTML = PanitiaPages.pengumuman();
      PanitiaPages.initPengumuman();
    });

    // M004: Finance Module
    router.on('/bendahara/dashboard', () => {
      this.renderAppLayout('bendahara');
      this.mainEl.innerHTML = BendaharaPages.dashboard();
    });
    router.on('/bendahara/verifikasi-pembayaran', () => {
      this.renderAppLayout('bendahara');
      this.mainEl.innerHTML = BendaharaPages.verifikasiPembayaran();
      BendaharaPages.initVerifikasiPembayaran();
    });
    router.on('/bendahara/tarif-biaya', () => {
      this.renderAppLayout('bendahara');
      this.mainEl.innerHTML = BendaharaPages.tarifBiaya();
      BendaharaPages.initTarifBiaya();
    });
    router.on('/bendahara/audit-log', () => {
      this.renderAppLayout('bendahara');
      this.mainEl.innerHTML = BendaharaPages.auditLog();
      BendaharaPages.initAuditLog();
    });

    // M005: Executive Module
    router.on('/kepsek/dashboard', () => {
      this.renderAppLayout('kepsek');
      this.mainEl.innerHTML = KepsekPages.dashboard();
    });
  },

  renderPublicLayout() {
    this.navbarEl.innerHTML = `
      <div class="navbar-brand">PPDB<span>Online</span></div>
      <div class="navbar-nav" id="navLinks">
        <a href="#/" data-route="/" class="active">Beranda</a>
        <a href="#/auth/login" data-route="/auth/login">Masuk</a>
        <a href="#/auth/register" class="btn btn-secondary btn-sm">Daftar</a>
      </div>
      <button class="hamburger" onclick="document.getElementById('navLinks').classList.toggle('open')">&#9776;</button>`;
    this.layoutEl.innerHTML = '';
    this.layoutEl.appendChild(this.navbarEl);
    this.layoutEl.appendChild(this.mainEl);
  },

  renderAppLayout(role) {
    const user = SessionManager.getUser();
    const sidebarContent = role === 'pendaftar' ? PendaftarPages._sidebar() :
                           role === 'panitia' ? PanitiaPages._sidebar() :
                           role === 'bendahara' ? BendaharaPages._sidebar() : '';

    this.navbarEl.innerHTML = `
      <div class="navbar-brand">PPDB<span>Online</span></div>
      <div class="navbar-nav" id="navLinks"></div>
      <div class="navbar-user">
        <div class="avatar">${user.name.charAt(0)}</div>
        <span class="hide-mobile">${user.name}</span>
        <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:#fff;border:none;" onclick="SessionManager.logout();router.navigate('/');">Keluar</button>
      </div>
      <button class="hamburger" onclick="document.getElementById('navLinks').classList.toggle('open')">&#9776;</button>`;

    this.layoutEl.innerHTML = `
      ${sidebarContent}
      <main class="layout-main" id="app-main"></main>`;
    this.mainEl = document.getElementById('app-main');

    // Re-apply active state after DOM update
    setTimeout(() => router.updateActiveLinks(router.currentRoute), 0);
  },

  render403() {
    this.renderPublicLayout();
    this.mainEl.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;min-height:80vh;padding:40px;">
        <div style="text-align:center;">
          <div style="font-size:5rem;margin-bottom:16px;">&#128683;</div>
          <h1 style="font-size:2rem;margin-bottom:8px;color:var(--error);">403 Access Denied</h1>
          <p style="color:var(--text-muted);font-size:1.125rem;margin-bottom:24px;">Anda tidak memiliki akses ke halaman ini.</p>
          <a href="#/" class="btn btn-primary btn-lg">Kembali ke Beranda</a>
        </div>
      </div>`;
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
