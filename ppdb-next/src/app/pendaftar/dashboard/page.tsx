'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { apiGetStudents, apiGetDocuments, apiGetPayments } from '@/lib/api';
import { StatusBadge } from '@/components/UI';
import Link from 'next/link';

export default function PendaftarDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [docs, setDocs] = useState<any[]>([]);
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    (async () => {
      const students = await apiGetStudents();
      const s = students.find((st: any) => st.user_id === user.id);
      setStudent(s || null);
      if (s) {
        const allDocs = await apiGetDocuments();
        setDocs(allDocs.filter((d: any) => d.student_id === s.id));
        const allPayments = await apiGetPayments();
        setPayment(allPayments.find((p: any) => p.student_id === s.id) || null);
      }
    })();
  }, [user, router]);

  if (!user) return null;

  const approvedDocs = docs.filter((d: any) => d.verification_status === 'disetujui').length;
  const progress = student ? Math.min((docs.length > 0 ? 30 : 0) + (approvedDocs * 20) + (payment ? 30 : 0), 100) : 0;

  return (
    <div className="animate-fadeIn">
      <div className="bg-gradient-to-r from-[#0D104A] via-[#121667] to-[#0D104A] rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full -mr-12 -mt-12" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -ml-8 -mb-8" />
        <div className="relative z-10">
          <p className="text-white/40 text-sm mb-1">Selamat datang kembali,</p>
          <h2 className="text-2xl font-bold">{user.name}</h2>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Status</div>
          {student ? <StatusBadge status={student.pendaftaran_status} /> : <span className="text-sm text-slate-400">Belum mendaftar</span>}
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Dokumen</div>
          <div className="text-xl font-bold text-slate-800">{approvedDocs}<span className="text-slate-300 font-normal text-base">/{docs.length}</span></div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Pembayaran</div>
          {payment ? <StatusBadge status={payment.payment_status} /> : <span className="text-sm text-slate-400">Belum bayar</span>}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-800">Progres Pendaftaran</h3>
          <span className="text-sm font-bold text-slate-800">{progress}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className="bg-gradient-to-r from-[#1D20DA] to-[#4B50E8] h-2 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 text-center">
          {[{ label: 'Biodata', done: docs.length > 0 }, { label: 'Dokumen', done: approvedDocs > 0 }, { label: 'Bayar', done: !!payment }].map((s, i) => (
            <div key={i}>
              <div className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${s.done ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                {s.done ? '✓' : (i + 1)}
              </div>
              <div className="text-xs text-slate-400 mt-1.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">Menu Cepat</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { href: '/pendaftar/biodata', icon: '👤', title: 'Biodata', desc: 'Lengkapi data diri Anda', color: 'bg-blue-50' },
          { href: '/pendaftar/dokumen', icon: '📄', title: 'Dokumen', desc: 'Upload dokumen persyaratan', color: 'bg-slate-50' },
          { href: '/pendaftar/pembayaran', icon: '💳', title: 'Pembayaran', desc: 'Upload bukti pembayaran', color: 'bg-violet-50' },
          { href: '/pendaftar/status', icon: '📊', title: 'Status', desc: 'Lihat status pendaftaran', color: 'bg-amber-50' },
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
