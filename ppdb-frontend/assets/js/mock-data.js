const STORAGE_KEY = 'ppdb_data';

const DEFAULT_DATA = {
  users: [
    { id: 'u001', name: 'Ahmad Fauzi', email: 'ahmad@demo.com', password: '123456', role: 'pendaftar' },
    { id: 'u002', name: 'Panitia Admin', email: 'panitia@demo.com', password: '123456', role: 'panitia' },
    { id: 'u003', name: 'Bendahara Utama', email: 'bendahara@demo.com', password: '123456', role: 'bendahara' },
    { id: 'u004', name: 'Kepala Sekolah', email: 'kepsek@demo.com', password: '123456', role: 'kepsek' },
  ],
  students: [
    { id: 's001', user_id: 'u001', nisn: '0081234567', name: 'Ahmad Fauzi', nik: '3201234567890001', tempat_lahir: 'Jakarta', tanggal_lahir: '2008-05-15', jenis_kelamin: 'Laki-laki', agama: 'Islam', alamat: 'Jl. Sudirman No. 12, Jakarta Selatan', telepon: '081234567890', asal_sekolah: 'SMP Negeri 1 Jakarta', pendaftaran_status: 'terverifikasi' },
    { id: 's002', user_id: null, nisn: '0087654321', name: 'Siti Nurhaliza', nik: '3201987654321002', tempat_lahir: 'Bandung', tanggal_lahir: '2008-08-20', jenis_kelamin: 'Perempuan', agama: 'Islam', alamat: 'Jl. Merdeka No. 45, Bandung', telepon: '085678901234', asal_sekolah: 'SMP Negeri 3 Bandung', pendaftaran_status: 'menunggu_verifikasi' },
    { id: 's003', user_id: null, nisn: '0081112223', name: 'Budi Santoso', nik: '3201112223334003', tempat_lahir: 'Surabaya', tanggal_lahir: '2008-03-10', jenis_kelamin: 'Laki-laki', agama: 'Kristen', alamat: 'Jl. Pemuda No. 88, Surabaya', telepon: '087890123456', asal_sekolah: 'SMP Negeri 5 Surabaya', pendaftaran_status: 'lulus' },
    { id: 's004', user_id: null, nisn: '0084445556', name: 'Dewi Lestari', nik: '3201444555666004', tempat_lahir: 'Yogyakarta', tanggal_lahir: '2008-11-25', jenis_kelamin: 'Perempuan', agama: 'Hindu', alamat: 'Jl. Malioboro No. 10, Yogyakarta', telepon: '081223344556', asal_sekolah: 'SMP Negeri 2 Yogyakarta', pendaftaran_status: 'belum_lengkap' },
  ],
  documents: [
    { id: 'd001', student_id: 's001', file_type: 'kk', file_path: 'kk_ahmad.pdf', verification_status: 'disetujui', rejection_note: null },
    { id: 'd002', student_id: 's001', file_type: 'akta', file_path: 'akta_ahmad.pdf', verification_status: 'disetujui', rejection_note: null },
    { id: 'd003', student_id: 's002', file_type: 'kk', file_path: 'kk_siti.pdf', verification_status: 'menunggu', rejection_note: null },
    { id: 'd004', student_id: 's002', file_type: 'akta', file_path: 'akta_siti.pdf', verification_status: 'ditolak', rejection_note: 'Foto akta tidak jelas, mohon upload ulang' },
    { id: 'd005', student_id: 's004', file_type: 'kk', file_path: 'kk_dewi.pdf', verification_status: 'menunggu', rejection_note: null },
  ],
  payments: [
    { id: 'p001', student_id: 's001', proof_file_path: 'bukti_ahmad.jpg', payment_status: 'lunas', verified_at: '2026-06-20T10:00:00' },
    { id: 'p002', student_id: 's002', proof_file_path: 'bukti_siti.jpg', payment_status: 'pending', verified_at: null },
    { id: 'p003', student_id: 's003', proof_file_path: 'bukti_budi.jpg', payment_status: 'lunas', verified_at: '2026-06-18T14:30:00' },
  ],
  quotas: [
    { id: 'q001', program: 'IPA', max_quota: 120, current_count: 85, deadline: '2026-07-31' },
    { id: 'q002', program: 'IPS', max_quota: 80, current_count: 52, deadline: '2026-07-31' },
    { id: 'q003', program: 'Bahasa', max_quota: 40, current_count: 18, deadline: '2026-07-31' },
  ],
  tariffs: [
    { id: 't001', component: 'SPP Bulanan', amount: 350000, description: 'Biaya SPP per bulan' },
    { id: 't002', component: 'Biaya Pendaftaran', amount: 250000, description: 'Biaya pendaftaran PPDB' },
    { id: 't003', component: 'Biaya Seragam', amount: 500000, description: 'Paket seragam lengkap' },
    { id: 't004', component: 'Biaya Praktikum', amount: 200000, description: 'Biaya laboratorium per semester' },
  ],
  announcements: [
    { id: 'a001', title: 'Pengumuman Kelulusan PPDB 2026', content: 'Selamat kepada seluruh siswa yang dinyatakan lulus. Silakan melakukan daftar ulang.', date: '2026-06-28', published: true },
    { id: 'a002', title: 'Perpanjangan Waktu Pendaftaran', content: 'Batas waktu pendaftaran diperpanjang hingga 31 Juli 2026.', date: '2026-06-25', published: true },
  ],
  auditLogs: [
    { id: 'l001', action: 'Pembayaran Diverifikasi', student: 'Ahmad Fauzi', amount: 'Rp 250.000', date: '2026-06-20 10:00', officer: 'Bendahara Utama' },
    { id: 'l002', action: 'Pembayaran Diverifikasi', student: 'Budi Santoso', amount: 'Rp 250.000', date: '2026-06-18 14:30', officer: 'Bendahara Utama' },
    { id: 'l003', action: 'Tarif Diubah', student: '-', amount: 'SPP: Rp 350.000', date: '2026-06-15 09:00', officer: 'Bendahara Utama' },
  ]
};

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { /* ignore */ }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(MockDB));
}

function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  Object.assign(MockDB, JSON.parse(JSON.stringify(DEFAULT_DATA)));
}

const MockDB = loadData();

function genId(prefix) {
  const collections = { u: MockDB.users, s: MockDB.students, d: MockDB.documents, p: MockDB.payments, q: MockDB.quotas, t: MockDB.tariffs, a: MockDB.announcements, l: MockDB.auditLogs };
  const col = collections[prefix] || [];
  const maxNum = col.reduce((max, item) => {
    const num = parseInt(item.id.replace(prefix, ''), 10);
    return num > max ? num : max;
  }, 0);
  return prefix + String(maxNum + 1).padStart(3, '0');
}

const SessionManager = {
  currentUser: null,
  login(email, password) {
    const user = MockDB.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUser = { ...user };
      delete this.currentUser.password;
      sessionStorage.setItem('ppdb_user', JSON.stringify(this.currentUser));
      return { success: true, user: this.currentUser };
    }
    return { success: false, message: 'Email atau password salah' };
  },
  register(name, email, password) {
    if (MockDB.users.find(u => u.email === email)) {
      return { success: false, message: 'Email sudah terdaftar' };
    }
    const newUser = { id: genId('u'), name, email, password, role: 'pendaftar' };
    MockDB.users.push(newUser);
    saveData();
    return { success: true, user: newUser };
  },
  logout() {
    this.currentUser = null;
    sessionStorage.removeItem('ppdb_user');
    window.location.hash = '#/';
    window.location.reload();
  },
  getUser() {
    if (!this.currentUser) {
      const stored = sessionStorage.getItem('ppdb_user');
      if (stored) this.currentUser = JSON.parse(stored);
    }
    return this.currentUser;
  },
  requireAuth(role) {
    const user = this.getUser();
    if (!user) { window.location.hash = '#/auth/login'; return false; }
    if (role && user.role !== role) { window.location.hash = '#/'; return false; }
    return true;
  }
};

function formatCurrency(amount) {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

function getStudentDocs(studentId) {
  return MockDB.documents.filter(d => d.student_id === studentId);
}

function getStudentPayment(studentId) {
  return MockDB.payments.find(p => p.student_id === studentId);
}

function getStudentByUserId(userId) {
  return MockDB.students.find(s => s.user_id === userId);
}

function createStudent(userId, data) {
  const student = { id: genId('s'), user_id: userId, ...data, pendaftaran_status: 'menunggu_verifikasi' };
  MockDB.students.push(student);
  saveData();
  return student;
}

function updateStudent(studentId, data) {
  const student = MockDB.students.find(s => s.id === studentId);
  if (student) {
    Object.assign(student, data);
    saveData();
  }
  return student;
}

function upsertDocument(studentId, fileType, filePath) {
  let doc = MockDB.documents.find(d => d.student_id === studentId && d.file_type === fileType);
  if (doc) {
    doc.file_path = filePath;
    doc.verification_status = 'menunggu';
    doc.rejection_note = null;
  } else {
    doc = { id: genId('d'), student_id: studentId, file_type: fileType, file_path: filePath, verification_status: 'menunggu', rejection_note: null };
    MockDB.documents.push(doc);
  }
  saveData();
  return doc;
}

function verifyDocument(docId, status, note) {
  const doc = MockDB.documents.find(d => d.id === docId);
  if (doc) {
    doc.verification_status = status;
    doc.rejection_note = status === 'ditolak' ? note : null;
    saveData();
  }
  return doc;
}

function updateStudentStatusFromDocs(studentId) {
  const docs = getStudentDocs(studentId);
  if (docs.length === 0) return;
  const allApproved = docs.every(d => d.verification_status === 'disetujui');
  const hasRejected = docs.some(d => d.verification_status === 'ditolak');
  const student = MockDB.students.find(s => s.id === studentId);
  if (!student) return;
  if (allApproved && student.pendaftaran_status === 'menunggu_verifikasi') {
    student.pendaftaran_status = 'terverifikasi';
    saveData();
  } else if (hasRejected) {
    student.pendaftaran_status = 'belum_lengkap';
    saveData();
  }
}

function createPayment(studentId, proofPath) {
  let payment = MockDB.payments.find(p => p.student_id === studentId);
  if (payment) {
    payment.proof_file_path = proofPath;
    payment.payment_status = 'pending';
    payment.verified_at = null;
  } else {
    payment = { id: genId('p'), student_id: studentId, proof_file_path: proofPath, payment_status: 'pending', verified_at: null };
    MockDB.payments.push(payment);
  }
  saveData();
  return payment;
}

function verifyPayment(paymentId, status) {
  const payment = MockDB.payments.find(p => p.id === paymentId);
  if (payment) {
    payment.payment_status = status;
    payment.verified_at = new Date().toISOString();
    const student = MockDB.students.find(s => s.id === payment.student_id);
    if (student) {
      MockDB.auditLogs.unshift({
        id: genId('l'), action: 'Pembayaran Diverifikasi', student: student.name,
        amount: formatCurrency(250000), date: new Date().toLocaleString('id-ID'),
        officer: SessionManager.getUser()?.name || 'System'
      });
    }
    saveData();
  }
  return payment;
}

function updateQuota(quotaId, maxQuota, deadline) {
  const quota = MockDB.quotas.find(q => q.id === quotaId);
  if (!quota) return { success: false, message: 'Kuota tidak ditemukan' };
  if (maxQuota < quota.current_count) {
    return { success: false, message: `Kuota tidak boleh lebih rendah dari jumlah siswa lulus saat ini (${quota.current_count})` };
  }
  quota.max_quota = maxQuota;
  quota.deadline = deadline;
  saveData();
  return { success: true };
}

function setGraduation(studentId, status) {
  const student = MockDB.students.find(s => s.id === studentId);
  if (student) {
    student.pendaftaran_status = status;
    saveData();
  }
  return student;
}

function createAnnouncement(title, content) {
  const ann = { id: genId('a'), title, content, date: new Date().toISOString().split('T')[0], published: true };
  MockDB.announcements.unshift(ann);
  saveData();
  return ann;
}

function addTariff(component, amount, description) {
  const t = { id: genId('t'), component, amount, description };
  MockDB.tariffs.push(t);
  MockDB.auditLogs.unshift({
    id: genId('l'), action: 'Tarif Ditambahkan', student: '-', amount: `${component}: ${formatCurrency(amount)}`,
    date: new Date().toLocaleString('id-ID'), officer: SessionManager.getUser()?.name || 'System'
  });
  saveData();
  return t;
}

function updateTariff(tariffId, component, amount, description) {
  const t = MockDB.tariffs.find(t => t.id === tariffId);
  if (t) {
    const oldAmount = t.amount;
    t.component = component; t.amount = amount; t.description = description;
    MockDB.auditLogs.unshift({
      id: genId('l'), action: 'Tarif Diubah', student: '-',
      amount: `${component}: ${formatCurrency(amount)} (sebelumnya: ${formatCurrency(oldAmount)})`,
      date: new Date().toLocaleString('id-ID'), officer: SessionManager.getUser()?.name || 'System'
    });
    saveData();
  }
  return t;
}

function deleteTariff(tariffId) {
  const t = MockDB.tariffs.find(t => t.id === tariffId);
  if (t) {
    MockDB.tariffs = MockDB.tariffs.filter(t => t.id !== tariffId);
    saveData();
  }
  return t;
}

function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getStatusBadge(status) {
  const map = {
    'terverifikasi': '<span class="badge badge-success">Terverifikasi</span>',
    'menunggu_verifikasi': '<span class="badge badge-warning">Menunggu</span>',
    'lulus': '<span class="badge badge-success">Lulus</span>',
    'belum_lengkap': '<span class="badge badge-error">Belum Lengkap</span>',
    'disetujui': '<span class="badge badge-success">Disetujui</span>',
    'menunggu': '<span class="badge badge-warning">Menunggu</span>',
    'ditolak': '<span class="badge badge-error">Ditolak</span>',
    'lunas': '<span class="badge badge-success">Lunas</span>',
    'pending': '<span class="badge badge-warning">Pending</span>',
    'ditolak_bayar': '<span class="badge badge-error">Ditolak</span>',
  };
  return map[status] || `<span class="badge badge-info">${status}</span>`;
}

function validateFileSize(file, maxMB = 2) {
  return file.size <= maxMB * 1024 * 1024;
}

function validateFileType(file, allowedTypes) {
  return allowedTypes.some(t => file.type === t || file.name.toLowerCase().endsWith('.' + t.split('/')[1]));
}
