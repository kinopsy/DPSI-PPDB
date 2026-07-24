'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiGetStudents, apiGetPayments, apiCreatePayment, apiDeletePayment } from '@/lib/api';
import { uploadToCloudinary } from '@/lib/cloudinary';
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
    try {
      setToast({ message: 'Mengupload...', type: 'info' });
      const url = await uploadToCloudinary(file);
      await apiCreatePayment(studentId, url);
      const payments = await apiGetPayments();
      setPayment(payments.find((p: any) => p.student_id === studentId));
      setToast({ message: 'Bukti pembayaran berhasil diupload', type: 'success' });
    } catch {
      setToast({ message: 'Gagal upload. Coba lagi.', type: 'error' });
    }
  };

  const handleCancel = async () => {
    if (!payment?.id || !confirm('Batalkan pembayaran?')) return;
    await apiDeletePayment(payment.id);
    setPayment(undefined);
    setToast({ message: 'Pembayaran dibatalkan', type: 'success' });
  };

  const isPending = payment?.payment_status === 'pending';
  const canUpload = !payment || isPending || payment.payment_status === 'ditolak_bayar';

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Pembayaran</h2>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="card p-6">
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">Biaya pendaftaran: <strong>Rp {payment?.amount?.toLocaleString('id-ID') || '250.000'}</strong></p>
          <p className="text-sm text-blue-600 mt-1">Transfer ke: BCA 1234567890 a.n SD Muhammadiyah Karangkajen</p>
        </div>

        {payment && (
          <div className="mb-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm text-slate-600">Status:</span>
              <StatusBadge status={payment.payment_status} />
            </div>
            {payment.proof_file_path && (
              <img src={payment.proof_file_path} alt="Bukti Bayar" className="w-full max-w-xs rounded-lg border border-slate-200 mt-2" />
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          {canUpload && (
            <>
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
                {payment ? 'Upload Ulang' : 'Upload Bukti Pembayaran'}
              </label>
            </>
          )}
          {isPending && (
            <button onClick={handleCancel} className="btn btn-outline">Batalkan</button>
          )}
        </div>
        {canUpload && <p className="text-xs text-slate-400 mt-2">Format: JPG, PNG. Maksimal 2MB.</p>}
      </div>
    </div>
  );
}
