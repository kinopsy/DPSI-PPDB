'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiGetStudents, apiGetDocuments } from '@/lib/api';
import Link from 'next/link';

export default function PanitiaDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0, passed: 0, pendingDocs: 0 });

  useEffect(() => {
    if (!user || user.role !== 'panitia') { router.push('/auth/login'); return; }
    (async () => {
      const students = await apiGetStudents();
      const documents = await apiGetDocuments();
      setStats({
        total: students.length,
        verified: students.filter((s: any) => s.pendaftaran_status === 'terverifikasi').length,
        pending: students.filter((s: any) => s.pendaftaran_status === 'menunggu_verifikasi').length,
        passed: students.filter((s: any) => s.pendaftaran_status === 'lulus').length,
        pendingDocs: documents.filter((d: any) => d.verification_status === 'menunggu').length,
      });
    })();
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="animate-fadeIn">
      <div className="bg-gradient-to-r from-[#0D104A] via-[#121667] to-[#0D104A] rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full -mr-12 -mt-12" />
        <div className="relative z-10">
          <p className="text-white/40 text-sm mb-1">Selamat datang,</p>
          <h2 className="text-2xl font-bold">{user.name}</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: '👥', label: 'Total', value: stats.total, color: 'text-slate-800', bg: 'bg-slate-50' },
          { icon: '✅', label: 'Terverifikasi', value: stats.verified, color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: '⏳', label: 'Menunggu', value: stats.pending, color: 'text-amber-600', bg: 'bg-amber-50' },
          { icon: '🎓', label: 'Lulus', value: stats.passed, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center text-lg mb-3`}>{s.icon}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-400 font-semibold mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">Aksi Cepat</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { href: '/panitia/verifikasi-berkas', icon: '✅', title: 'Verifikasi Berkas', desc: `${stats.pendingDocs} menunggu`, color: 'bg-blue-50' },
          { href: '/panitia/kelulusan', icon: '🎓', title: 'Kelulusan', desc: 'Tentukan kelulusan', color: 'bg-blue-50' },
          { href: '/panitia/kuota-dinamis', icon: '📋', title: 'Kuota Dinamis', desc: 'Atur kuota', color: 'bg-violet-50' },
          { href: '/panitia/pengumuman', icon: '✍️', title: 'Buat Pengumuman', desc: 'Kelola pengumuman', color: 'bg-amber-50' },
        ].map((m, i) => (
          <Link key={i} href={m.href} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${m.color} flex items-center justify-center text-xl group-hover:scale-105 transition-transform`}>{m.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">{m.title}</h3>
                <p className="text-sm text-slate-400">{m.desc}</p>
              </div>
              <div className="text-slate-200 group-hover:text-slate-400 transition-colors">→</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
