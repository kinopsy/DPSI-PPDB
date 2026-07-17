'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiGetPayments, apiGetTariffs, formatCurrency } from '@/lib/api';
import Link from 'next/link';

export default function BendaharaDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [payments, setPayments] = useState<any[]>([]);
  const [tariffs, setTariffs] = useState<any[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'bendahara') { router.push('/auth/login'); return; }
    (async () => {
      setPayments(await apiGetPayments());
      setTariffs(await apiGetTariffs());
    })();
  }, [user, router]);

  if (!user) return null;

  const lunas = payments.filter(p => p.payment_status === 'lunas').length;
  const pending = payments.filter(p => p.payment_status === 'pending').length;
  const revenue = lunas * 250000;

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
          { icon: '💳', label: 'Transaksi', value: payments.length, color: 'text-slate-800', bg: 'bg-slate-50' },
          { icon: '✅', label: 'Lunas', value: lunas, color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: '⏳', label: 'Pending', value: pending, color: 'text-amber-600', bg: 'bg-amber-50' },
          { icon: '💰', label: 'Pendapatan', value: formatCurrency(revenue), color: 'text-blue-600', bg: 'bg-blue-50', small: true },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center text-lg mb-3`}>{s.icon}</div>
            <div className={`${s.small ? 'text-lg' : 'text-2xl'} font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-400 font-semibold mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">Aksi Cepat</h3>
          <div className="space-y-3">
            {[
              { href: '/bendahara/verifikasi-pembayaran', icon: '💳', title: 'Verifikasi Pembayaran', desc: `${pending} menunggu` },
              { href: '/bendahara/tarif-biaya', icon: '💲', title: 'Kelola Tarif', desc: `${tariffs.length} komponen` },
              { href: '/bendahara/audit-log', icon: '📝', title: 'Audit Log', desc: 'Riwayat transaksi' },
            ].map((m, i) => (
              <Link key={i} href={m.href} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all group flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center text-xl transition-colors">{m.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800">{m.title}</h3>
                  <p className="text-sm text-slate-400">{m.desc}</p>
                </div>
                <div className="text-slate-200 group-hover:text-slate-400 transition-colors">→</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">Komponen Biaya</h3>
          <div className="space-y-2">
            {tariffs.map((t: any) => (
              <div key={t.id} className="flex justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm text-slate-600">{t.component}</span>
                <span className="text-sm font-semibold text-slate-800">{formatCurrency(t.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
