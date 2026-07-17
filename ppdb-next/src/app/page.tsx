'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiGetAnnouncements } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    if (user && user.role !== 'panitia') {
      router.push(`/${user.role}/dashboard`);
      return;
    }
    apiGetAnnouncements().then(data => setAnnouncements(data.slice(0, 2)));
  }, [user, router]);

  if (user && user.role !== 'panitia') return null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="relative bg-gradient-to-br from-[#0D104A] via-[#121667] to-[#0D104A] text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full text-sm text-white/60 mb-8">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Tahun Ajaran 2026/2027
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
              Penerimaan Peserta Didik Baru
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-4 font-medium">SD Muhammadiyah Karangkajen Yogyakarta</p>
            <p className="text-white/50 mb-12 max-w-xl mx-auto leading-relaxed">
              Daftar secara online, upload dokumen, dan pantau status pendaftaran dalam satu platform terintegrasi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register" className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-3.5 rounded-2xl font-semibold text-base transition-all shadow-lg shadow-black/20">
                Daftar Sekarang
              </Link>
              <Link href="/auth/login" className="border border-white/20 text-white hover:bg-white/5 px-8 py-3.5 rounded-2xl font-semibold text-base transition-all">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 text-center">
            <div className="text-3xl font-bold text-slate-800">120+</div>
            <div className="text-sm text-slate-400 mt-1 font-medium">Kuota Kelas A</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 text-center">
            <div className="text-3xl font-bold text-blue-500">80+</div>
            <div className="text-sm text-slate-400 mt-1 font-medium">Kuota Kelas B</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 text-center">
            <div className="text-3xl font-bold text-blue-500">40+</div>
            <div className="text-sm text-slate-400 mt-1 font-medium">Kuota Kelas C</div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-slate-100 text-slate-500 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4">Fitur</div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Kemudahan Pendaftaran</h2>
            <p className="text-slate-400 max-w-lg mx-auto">Semua proses bisa dilakukan secara online dari mana saja</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '📝', title: 'Pendaftaran Online', desc: 'Daftar dari mana saja tanpa harus datang ke sekolah. Isi formulir dan lengkapi data secara digital.', color: 'blue' },
               { icon: '📄', title: 'Upload Dokumen', desc: 'Upload dokumen persyaratan secara digital. Status verifikasi bisa dipantau secara real-time.', color: 'slate' },
              { icon: '💳', title: 'Pembayaran Online', desc: 'Bayar biaya pendaftaran dengan mudah. Upload bukti pembayaran dan tunggu verifikasi.', color: 'violet' },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center text-2xl mb-6 transition-colors">{f.icon}</div>
                <h4 className="font-bold text-lg text-slate-800 mb-3">{f.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-slate-200 text-slate-500 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4">Program</div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Kelas Unggulan</h2>
            <p className="text-slate-400">Pilih kelas yang sesuai dengan minat dan bakat anak</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { letter: 'A', name: 'Kelas Reguler', desc: 'Kurikulum nasional dengan pendekatan modern', quota: 120, color: 'from-[#0D104A] to-[#121667]' },
               { letter: 'B', name: 'Kelas Tahfidz', desc: 'Integrasi kurikulum nasional dengan tahfidz Qur\'an', quota: 80, color: 'from-[#121667] to-[#1D20DA]' },
               { letter: 'C', name: 'Kelas Bilingual', desc: 'Pembelajaran dengan metode bilingual Indonesia-Inggris', quota: 40, color: 'from-[#1D20DA] to-[#4B50E8]' },
            ].map((p, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 group">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} text-white flex items-center justify-center font-bold text-xl mb-6 group-hover:scale-105 transition-transform`}>{p.letter}</div>
                <h4 className="font-bold text-lg text-slate-800 mb-2">{p.name}</h4>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{p.desc}</p>
                <div className="text-sm font-semibold text-slate-600">Kuota: {p.quota} siswa</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {announcements.length > 0 && (
        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="inline-block bg-slate-100 text-slate-500 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4">Informasi</div>
                <h2 className="text-3xl font-bold text-slate-800">Pengumuman Terbaru</h2>
              </div>
              <Link href="/pengumuman" className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors hidden sm:block">
                Lihat Semua →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {announcements.map(ann => (
                <div key={ann.id} className="bg-white rounded-3xl p-7 border border-slate-100 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center text-lg shrink-0 transition-colors">📢</div>
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-deep-blue transition-colors">{ann.title}</h4>
                      <p className="text-xs text-slate-300 mt-1.5 font-medium">{ann.date}</p>
                      <p className="text-sm text-slate-400 mt-3 leading-relaxed line-clamp-2">{ann.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#0D104A] via-[#121667] to-[#0D104A] rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap untuk Mendaftar?</h2>
              <p className="text-white/40 mb-10 max-w-md mx-auto">Jangan lewatkan kesempatan untuk bergabung di SD Muhammadiyah Karangkajen</p>
              <Link href="/auth/register" className="bg-white text-slate-900 hover:bg-slate-100 px-10 py-4 rounded-2xl font-semibold text-base transition-all shadow-lg inline-block">
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <img src="/logo.png" alt="Logo Sekolah" className="w-16 h-16 rounded-xl object-contain bg-white shadow-lg p-1.5" />
            <div>
              <span className="text-base font-bold text-slate-800 block leading-tight">SD Muhammadiyah Karangkajen</span>
              <span className="text-[10px] text-slate-400">Yogyakarta</span>
            </div>
          </div>
          <p className="text-sm text-slate-400">&copy; 2026 SD Karangkajen. Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
