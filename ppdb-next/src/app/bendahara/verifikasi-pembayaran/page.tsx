'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiGetPayments, apiGetStudents, apiVerifyPayment } from '@/lib/api';
import { StatusBadge, Toast } from '@/components/UI';

export default function VerifikasiPembayaranPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'bendahara') { router.push('/auth/login'); return; }
    Promise.all([apiGetPayments(), apiGetStudents()]).then(([p, s]) => {
      setPayments(p);
      setStudents(s);
    });
  }, [user, router]);
  if (!user) return null;

  const pendingPayments = payments.filter((p: any) => p.payment_status === 'pending');

  const handleVerify = async (paymentId: string, status: string) => {
    await apiVerifyPayment(paymentId, status);
    const [p, s] = await Promise.all([apiGetPayments(), apiGetStudents()]);
    setPayments(p);
    setStudents(s);
    setToast({ message: `Pembayaran ${status === 'lunas' ? 'disetujui' : 'ditolak'}`, type: 'success' });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Verifikasi Pembayaran</h2>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Siswa</th>
              <th>Bukti Bayar</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pendingPayments.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-slate-500">Tidak ada pembayaran menunggu verifikasi</td></tr>
            ) : pendingPayments.map((p, i) => {
              const student = students.find(s => s.id === p.student_id);
              return (
                <tr key={p.id}>
                  <td>{i + 1}</td>
                  <td>{student?.name || '-'}</td>
                  <td className="text-sm text-slate-500">{p.proof_file_path}</td>
                  <td><StatusBadge status={p.payment_status} /></td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => handleVerify(p.id, 'lunas')} className="btn btn-success btn-sm">Setuju</button>
                      <button onClick={() => handleVerify(p.id, 'ditolak_bayar')} className="btn btn-danger btn-sm">Tolak</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
