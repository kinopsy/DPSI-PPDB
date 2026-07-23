'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { apiVerifyPayment } from '@/lib/api';
import { StatusBadge, Toast } from '@/components/UI';

export default function VerifikasiPembayaranPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [verifyModal, setVerifyModal] = useState<{ open: boolean; paymentId: string; action: string } | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'bendahara') { router.push('/auth/login'); return; }

    const unsubStudents = onSnapshot(collection(db, 'students'), snap => {
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubPayments = onSnapshot(collection(db, 'payments'), snap => {
      setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubStudents(); unsubPayments(); };
  }, [user, router]);

  if (!user) return null;

  const studentPayments = students.map(s => ({
    student: s,
    payments: payments.filter((p: any) => p.student_id === s.id),
  })).filter(({ payments }) => payments.length > 0);

  const handleVerify = async () => {
    if (!verifyModal) return;
    await apiVerifyPayment(verifyModal.paymentId, verifyModal.action, user.name);
    setVerifyModal(null);
    setToast({ message: `Pembayaran ${verifyModal.action === 'lunas' ? 'disetujui' : 'ditolak'}`, type: 'success' });
  };

  const getThumb = (path: string) => {
    if (!path) return null;
    if (path.includes('cloudinary') && path.includes('/upload/')) {
      const parts = path.split('/upload/');
      return parts[0] + '/upload/w_200,h_150,c_fill/' + parts[1];
    }
    return path;
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Verifikasi Pembayaran</h2>
          <p className="text-sm text-slate-400 mt-1">Periksa dan verifikasi bukti pembayaran setiap pendaftar</p>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {studentPayments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <p className="text-slate-500">Belum ada pembayaran masuk</p>
        </div>
      ) : (
        <div className="space-y-3">
          {studentPayments.map(({ student, payments }) => {
            const isOpen = expandedId === student.id;
            const pendingCount = payments.filter((p: any) => p.payment_status === 'pending').length;
            const status = payments.every((p: any) => p.payment_status === 'lunas') ? 'lunas'
              : payments.some((p: any) => p.payment_status === 'ditolak_bayar') ? 'ditolak_bayar'
              : 'pending';

            return (
              <div key={student.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <button onClick={() => setExpandedId(isOpen ? null : student.id)} className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors text-left">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-lg shrink-0">
                    {student.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-800 truncate">{student.name || 'Tanpa Nama'}</div>
                    <div className="text-sm text-slate-400">{student.nisn || '-'} &middot; {payments.length} pembayaran</div>
                  </div>
                  <StatusBadge status={status} />
                  {pendingCount > 0 && (
                    <span className="bg-amber-50 text-amber-600 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0">
                      {pendingCount} menunggu
                    </span>
                  )}
                  <svg className={`w-5 h-5 text-slate-300 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 p-5 space-y-3">
                    {payments.map((p: any) => (
                      <div key={p.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                        {p.proof_file_path ? (
                          <button onClick={() => setPreviewUrl(p.proof_file_path)} className="w-20 h-16 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0 hover:opacity-80 transition-opacity">
                            <img src={getThumb(p.proof_file_path) || p.proof_file_path} alt="Bukti Bayar" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = ''; (e.target as HTMLImageElement).classList.add('hidden'); }} />
                          </button>
                        ) : (
                          <div className="w-20 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300 text-xs shrink-0">No File</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-700">Pembayaran {p.payment_for || 'Pendaftaran'}</div>
                          <div className="text-sm font-semibold text-slate-800">Rp {p.amount?.toLocaleString('id-ID') || '250.000'}</div>
                          <StatusBadge status={p.payment_status} />
                        </div>
                        {p.payment_status === 'pending' && (
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => setVerifyModal({ open: true, paymentId: p.id, action: 'lunas' })} className="w-9 h-9 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center transition-colors" title="Setuju">✓</button>
                            <button onClick={() => setVerifyModal({ open: true, paymentId: p.id, action: 'ditolak_bayar' })} className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors" title="Tolak">✕</button>
                          </div>
                        )}
                        {p.payment_status === 'lunas' && (
                          <span className="text-green-600 text-xs font-semibold shrink-0">✓ Disetujui</span>
                        )}
                        {p.payment_status === 'ditolak_bayar' && (
                          <span className="text-red-500 text-xs font-semibold shrink-0">✕ Ditolak</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {verifyModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setVerifyModal(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-slate-800 mb-4">
              {verifyModal.action === 'lunas' ? 'Setujui Pembayaran?' : 'Tolak Pembayaran?'}
            </h3>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setVerifyModal(null)} className="btn bg-slate-100 text-slate-700 hover:bg-slate-200">Batal</button>
              <button onClick={handleVerify} className={verifyModal.action === 'lunas' ? 'btn btn-success' : 'btn btn-danger'}>
                {verifyModal.action === 'lunas' ? 'Setujui' : 'Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}