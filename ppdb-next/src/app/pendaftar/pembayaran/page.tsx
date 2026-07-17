'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiGetStudents, apiGetPayments, apiCreatePayment } from '@/lib/api';
import { StatusBadge, Toast } from '@/components/UI';

export default function PembayaranPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [payment, setPayment] = useState<any>(undefined);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    Promise.all([apiGetStudents(), apiGetPayments()]).then(([students, payments]) => {
      const s = students.find((st: any) => st.user_id === user.id);
      if (s) {
        setStudentId(s.id);
        setPayment(payments.find((p: any) => p.student_id === s.id));
      }
    });
  }, [user, router]);

  if (!user) return null;

  const handleUpload = async (file: File) => {
    if (!studentId) { setToast({ message: 'Lengkapi biodata terlebih dahulu', type: 'error' }); return; }
    await apiCreatePayment(studentId, file.name);
    const payments = await apiGetPayments();
    setPayment(payments.find((p: any) => p.student_id === studentId));
    setToast({ message: 'Bukti pembayaran berhasil diupload', type: 'success' });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Pembayaran</h2>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="card p-6">
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">Biaya pendaftaran: <strong>Rp 250.000</strong></p>
          <p className="text-sm text-blue-600 mt-1">Transfer ke: BCA 1234567890 a.n SD Muhammadiyah Karangkajen</p>
        </div>

        {payment && (
          <div className="flex items-center gap-3 mb-4 p-4 bg-slate-50 rounded-lg">
            <span className="text-sm text-slate-600">Status:</span>
            <StatusBadge status={payment.payment_status} />
            {payment.proof_file_path && <span className="text-sm text-slate-500">{payment.proof_file_path}</span>}
          </div>
        )}

        <div className="flex items-center gap-4">
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            className="hidden"
            id="payment-file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (!file.type.startsWith('image/')) { setToast({ message: 'Hanya file gambar yang diperbolehkan', type: 'error' }); return; }
                if (file.size > 2 * 1024 * 1024) { setToast({ message: 'Ukuran file maks 2MB', type: 'error' }); return; }
                handleUpload(file);
              }
            }}
          />
          <label htmlFor="payment-file" className="btn btn-primary cursor-pointer">
            Upload Bukti Pembayaran
          </label>
        </div>
        <p className="text-xs text-slate-400 mt-2">Format: JPG, PNG. Maksimal 2MB.</p>
      </div>
    </div>
  );
}
