'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiGetStudents, apiGetPayments, apiGetQuotas, apiGetTariffs, formatCurrency } from '@/lib/api';

export default function KepsekDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [quotas, setQuotas] = useState<any[]>([]);
  const [tariffs, setTariffs] = useState<any[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'kepsek') { router.push('/auth/login'); return; }
    (async () => {
      setStudents(await apiGetStudents());
      setPayments(await apiGetPayments());
      setQuotas(await apiGetQuotas());
      setTariffs(await apiGetTariffs());
    })();
  }, [user, router]);

  if (!user) return null;

  const revenue = payments.filter((p: any) => p.payment_status === 'lunas').length * 250000;

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
          { icon: '👥', label: 'Total', value: students.length, color: 'text-slate-800', bg: 'bg-slate-50' },
          { icon: '✅', label: 'Terverifikasi', value: students.filter((s: any) => s.pendaftaran_status === 'terverifikasi').length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: '🎓', label: 'Lulus', value: students.filter((s: any) => s.pendaftaran_status === 'lulus').length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: '💰', label: 'Pendapatan', value: formatCurrency(revenue), color: 'text-violet-600', bg: 'bg-violet-50', small: true },
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
              const pct = Math.round((q.current_count / q.max_quota) * 100);
              return (
                <div key={q.id}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700">{q.program}</span>
                    <span className="text-slate-400">{q.current_count}/{q.max_quota}</span>
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
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-5">Komponen Biaya</h3>
          <div className="space-y-2">
            {tariffs.map((t: any) => (
              <div key={t.id} className="flex justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm text-slate-600">{t.component}</span>
                <span className="text-sm font-semibold text-slate-800">{formatCurrency(t.amount)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-slate-50 rounded-xl">
            <div className="flex justify-between font-bold text-slate-800 text-sm">
              <span>Total</span>
              <span>{formatCurrency(tariffs.reduce((sum: number, t: any) => sum + t.amount, 0))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
