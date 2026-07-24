'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { apiGetAuditLogs, formatCurrency } from '@/lib/api';

export default function AuditLogPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'bendahara') { router.push('/auth/login'); return; }

    const unsubStudents = onSnapshot(collection(db, 'students'), snap => {
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    apiGetAuditLogs().then(setLogs);

    return () => unsubStudents();
  }, [user, router]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handlePrint = () => {
    apiGetAuditLogs().then(setLogs);
    setTimeout(() => window.print(), 100);
  };

  if (!user) return null;

  const studentMap: Record<string, string> = {};
  students.forEach(s => { studentMap[s.id] = s.name; studentMap[s.name] = s.name; });

  const resolveName = (log: any) => {
    if (studentMap[log.student]) return studentMap[log.student];
    if (log.student_id && studentMap[log.student_id]) return studentMap[log.student_id];
    return log.student || '-';
  };

  const resolveAmount = (log: any): number => {
    const amt = log.amount;
    if (typeof amt === 'number' && amt > 0) return amt;
    if (typeof amt === 'string') {
      const num = parseInt(amt.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(num) && num > 0) return num;
    }
    return 0;
  };

  const totalNominal = logs.reduce((sum, log) => {
    if (log.action !== 'Pembayaran Diverifikasi') return sum;
    return sum + resolveAmount(log);
  }, 0);

  const getThumb = (path: string) => {
    if (!path) return null;
    if (path.includes('cloudinary') && path.includes('/upload/')) {
      const parts = path.split('/upload/');
      return parts[0] + '/upload/w_80,h_60,c_fill/' + parts[1];
    }
    return path;
  };

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
              <th>Bukti</th>
              <th>Waktu</th>
              <th>Petugas</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-slate-500">Belum ada log</td></tr>
            ) : logs.map((log, i) => {
              const proofPath = log.proof_file_path || null;
              return (
                <tr key={log.id}>
                  <td>{i + 1}</td>
                  <td className="font-medium">{log.action}</td>
                  <td>{resolveName(log)}</td>
                  <td className="font-medium">{resolveAmount(log) > 0 ? formatCurrency(resolveAmount(log)) : '-'}</td>
                  <td>
                    {proofPath ? (
                      <button onClick={() => setPreviewUrl(proofPath)} className="w-12 h-10 rounded-lg overflow-hidden border border-slate-200 hover:opacity-80 transition-opacity">
                        <img src={getThumb(proofPath) || proofPath} alt="Bukti" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </button>
                    ) : '-'}
                  </td>
                  <td className="text-sm text-slate-500">{log.date ? new Date(log.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                  <td>{log.officer || '-'}</td>
                </tr>
              );
            })}
          </tbody>
          {logs.length > 0 && (
            <tfoot>
              <tr className="font-bold text-slate-800">
                <td colSpan={3} className="text-right">Total</td>
                <td>{formatCurrency(totalNominal)}</td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <div className="print-footer hidden mt-4 text-xs text-slate-500">
        <p>Total {logs.length} transaksi | SD Muhammadiyah Karangkajen &copy; {new Date().getFullYear()}</p>
      </div>

      {previewUrl && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setPreviewUrl(null)}>
          <div className="relative max-w-3xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewUrl(null)} className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-100 transition-colors z-10">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" /></svg>
            </button>
            <img src={previewUrl} alt="Preview" className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}

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