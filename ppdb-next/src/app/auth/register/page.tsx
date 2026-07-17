'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password) { setError('Semua field harus diisi'); return; }
    if (password.length < 6) { setError('Password minimal 6 karakter'); return; }

    setLoading(true);
    const result = await register(name, email, password);
    if (result.success) {
      window.location.href = '/pendaftar/dashboard';
    } else {
      setError(result.message || 'Registrasi gagal');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-[#121667] via-[#1D20DA] to-[#4B50E8] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <img src="/logo.png" alt="" className="w-[500px] h-auto object-contain opacity-10 select-none pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#121667]/80 via-[#1D20DA]/60 to-[#4B50E8]/80" />
        </div>
        <div className="relative z-10 px-16 max-w-lg">
          <div className="mb-10">
            <span className="text-xl font-bold text-white block leading-tight">SD Muhammadiyah Karangkajen</span>
            <span className="text-xs text-white/40">Yogyakarta</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">Daftar Sekarang</h1>
          <p className="text-lg text-white/60 mb-10">Buat akun baru untuk memulai pendaftaran SD Muhammadiyah Karangkajen</p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <p className="text-white/70 text-sm leading-relaxed">
              &ldquo;Pendaftaran online memudahkan orang tua tanpa harus datang ke sekolah. Semua proses bisa dilakukan dari rumah.&rdquo;
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-8 text-sm font-medium transition-colors group">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:-translate-x-0.5 transition-transform"><path d="M10 12L6 8l4-4" /></svg>
            Kembali
          </Link>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-800">Buat Akun</h2>
            <p className="text-slate-400 mt-2">Isi data diri untuk mendaftar</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-2xl mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8L8 12M8 8l4 4" /></svg>
              </div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap</label>
              <input type="text" className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Masukkan nama lengkap" disabled={loading} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" disabled={loading} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimal 6 karakter" disabled={loading} />
            </div>
            <button type="submit" className="btn btn-primary w-full py-3 text-base" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mendaftar...
                </span>
              ) : 'Daftar'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400">
              Sudah punya akun?{' '}
              <Link href="/auth/login" className="text-deep-blue font-semibold hover:underline">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
