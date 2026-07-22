'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      window.location.href = `/${user.role}/dashboard`;
    }
  }, [user, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Email dan password harus diisi'); return; }

    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      window.location.href = `/${result.role}/dashboard`;
    } else {
      setError(result.message || 'Login gagal');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-[#0D104A] via-[#121667] to-[#0D104A] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 px-16 max-w-lg">
          <div className="flex items-center gap-3 mb-10">
            <img src="/logo.png" alt="Logo Sekolah" className="w-14 h-14 rounded-2xl object-contain bg-white p-1.5 shadow-lg shadow-black/30" />
            <div>
              <span className="text-xl font-bold text-white block leading-tight">SD Muhammadiyah Karangkajen</span>
              <span className="text-xs text-white/40">Yogyakarta</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">Selamat Datang</h1>
          <p className="text-lg text-white/50 mb-10">Sistem Penerimaan Peserta Didik Baru Tahun Ajaran 2026/2027</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <div className="text-3xl font-bold text-white">120+</div>
              <div className="text-sm text-white/40 mt-1">Kuota Kelas A</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <div className="text-3xl font-bold text-blue-400">80+</div>
              <div className="text-sm text-white/40 mt-1">Kuota Kelas B</div>
            </div>
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
            <h2 className="text-3xl font-bold text-slate-800">Masuk</h2>
            <p className="text-slate-400 mt-2">Silakan masuk ke akun Anda</p>
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
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" disabled={loading} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} placeholder="Masukkan password" disabled={loading} />
            </div>
            <button type="submit" className="btn btn-primary w-full py-3 text-base" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Masuk...
                </span>
              ) : 'Masuk'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400">
              Belum punya akun?{' '}
              <Link href="/auth/register" className="text-deep-blue font-semibold hover:underline">Daftar sekarang</Link>
            </p>
          </div>


        </div>
      </div>
    </div>
  );
}
