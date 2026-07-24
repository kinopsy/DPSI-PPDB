'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatCurrency } from '@/lib/api';

export default function KepsekDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [quotas, setQuotas] = useState<any[]>([]);
  const [tariffs, setTariffs] = useState<any[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'kepsek') { router.push('/auth/login'); return; }

    const unsubStudents = onSnapshot(collection(db, 'students'), snap => {
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubPayments = onSnapshot(collection(db, 'payments'), snap => {
      setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubQuotas = onSnapshot(collection(db, 'quotas'), snap => {
      setQuotas(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubTariffs = onSnapshot(collection(db, 'tariffs'), snap => {
      setTariffs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubStudents(); unsubPayments(); unsubQuotas(); unsubTariffs(); };
  }, [user, router]);

  if (!user) return null;

  const totalQuota = quotas.reduce((sum: number, q: any) => sum + q.max_quota, 0);
  const totalRegistered = quotas.reduce((sum: number, q: any) => {
    const count = students.filter((s: any) => s.gelombang === q.program).length;
    return sum + count;
  }, 0);
  const revenue = payments.filter((p: any) => p.payment_status === 'lunas').reduce((sum: number, p: any) => sum + (p.amount || 250000), 0);
  const rejected = students.filter((s: any) => s.pendaftaran_status === 'belum_lengkap').length;
  const graduated = students.filter((s: any) => s.pendaftaran_status === 'lulus').length;

  return (
    <div className="animate-fadeIn">
      <div className="bg-gradient-to-r from-[#0D104A] via-[#121667] to-[#0D104A] rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full -mr-12 -mt-12" />
        <div className="relative z-10">
          <p className="text-white/40 text-sm mb-1">Selamat datang,</p>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-white/30 text-sm mt-1">Read Only Dashboard</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: '👥', label: 'Mendaftar', value: students.length, color: 'text-slate-800', bg: 'bg-slate-50' },
          { icon: '📋', label: 'Kuota', value: `${totalRegistered}/${totalQuota}`, color: 'text-blue-600', bg: 'bg-blue-50', small: true },
          { icon: '❌', label: 'Ditolak', value: rejected, color: 'text-red-600', bg: 'bg-red-50' },
          { icon: '🎓', label: 'Lulus', value: graduated, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center text-lg mb-3`}>{s.icon}</div>
            <div className={`${s.small ? 'text-lg' : 'text-2xl'} font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-400 font-semibold mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-5">Kuota per Kelas</h3>
          <div className="space-y-4">
            {quotas.map((q: any) => {
              const count = students.filter((s: any) => s.gelombang === q.program).length;
              const pct = Math.round((count / q.max_quota) * 100);
              return (
                <div key={q.id}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700">{q.program}</span>
                    <span className="text-slate-400">{count}/{q.max_quota}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-500 ${pct > 80 ? 'bg-amber-400' : 'bg-[#1D20DA]'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-5">Pendapatan Total</h3>
          <div className="text-3xl font-bold text-blue-600">{formatCurrency(revenue)}</div>
          <p className="text-sm text-slate-400 mt-2">Dari {payments.filter((p: any) => p.payment_status === 'lunas').length} pembayaran lunas</p>
        </div>
      </div>
    </div>
  );
}
