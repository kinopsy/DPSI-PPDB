'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiGetAuditLogs } from '@/lib/api';

export default function AuditLogPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);

  const loadLogs = useCallback(() => {
    apiGetAuditLogs().then(setLogs);
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'bendahara') { router.push('/auth/login'); return; }
    loadLogs();
  }, [user, router, loadLogs]);

  const handlePrint = () => {
    loadLogs();
    setTimeout(() => window.print(), 100);
  };

  if (!user) return null;

  const totalNominal = logs.reduce((sum, log) => {
    const num = parseInt(log.amount.replace(/[^0-9]/g, ''), 10);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6 no-print">
        <h2 className="text-2xl font-bold text-slate-800">Audit Log</h2>
        <button onClick={handlePrint} className="btn btn-primary">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Cetak Laporan
        </button>
      </div>

      <div className="print-header hidden">
        <div className="flex items-center gap-3 mb-2">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-xl object-contain bg-white p-1 shadow-lg" />
          <div>
            <h1 className="text-lg font-bold text-slate-800">SD Muhammadiyah Karangkajen</h1>
            <p className="text-xs text-slate-500">Yogyakarta</p>
          </div>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mt-4">Laporan Audit Log</h2>
        <p className="text-sm text-slate-500">Dicetak: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        <div className="border-b-2 border-slate-800 mt-3 mb-4" />
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Aksi</th>
              <th>Siswa</th>
              <th>Nominal</th>
              <th>Waktu</th>
              <th>Petugas</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-500">Belum ada log</td></tr>
            ) : logs.map((log, i) => (
              <tr key={log.id}>
                <td>{i + 1}</td>
                <td className="font-medium">{log.action}</td>
                <td>{log.student}</td>
                <td className="font-medium">{log.amount}</td>
                <td className="text-sm text-slate-500">{log.date}</td>
                <td>{log.officer}</td>
              </tr>
            ))}
          </tbody>
          {logs.length > 0 && (
            <tfoot>
              <tr className="font-bold text-slate-800">
                <td colSpan={3} className="text-right">Total</td>
                <td>Rp {totalNominal.toLocaleString('id-ID')}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <div className="print-footer hidden mt-4 text-xs text-slate-500">
        <p>Total {logs.length} transaksi | SD Muhammadiyah Karangkajen &copy; {new Date().getFullYear()}</p>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .table-container, .table-container * { visibility: visible; }
          .table-container { position: absolute; left: 0; top: 80px; width: 100%; border: none; box-shadow: none; }
          .print-header, .print-header.hidden, .print-header.visible { display: block !important; visibility: visible !important; position: absolute; top: 0; left: 0; width: 100%; }
          .print-footer, .print-footer.hidden, .print-footer.visible { display: block !important; visibility: visible !important; position: fixed; bottom: 0; left: 0; width: 100%; }
          .no-print { display: none !important; }
          @page { margin: 20mm 15mm; }
        }
      `}</style>
    </div>
  );
}
