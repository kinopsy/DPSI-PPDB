'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { apiVerifyDocument } from '@/lib/api';
import { StatusBadge, Toast } from '@/components/UI';

export default function VerifikasiBerkasPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [verifyModal, setVerifyModal] = useState<{ open: boolean; docId: string; action: string } | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'panitia') { router.push('/auth/login'); return; }

    const unsubStudents = onSnapshot(collection(db, 'students'), snap => {
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubDocs = onSnapshot(collection(db, 'documents'), snap => {
      setDocuments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubStudents(); unsubDocs(); };
  }, [user, router]);

  if (!user) return null;

  const studentDocs = students.map(s => ({
    student: s,
    docs: documents.filter((d: any) => d.student_id === s.id),
  })).filter(({ docs }) => docs.length > 0);

  const handleVerify = async () => {
    if (!verifyModal) return;
    await apiVerifyDocument(verifyModal.docId, verifyModal.action, note || undefined);
    setVerifyModal(null);
    setNote('');
    setToast({ message: `Berkas ${verifyModal.action === 'disetujui' ? 'disetujui' : 'ditolak'}`, type: 'success' });
  };

  const isImage = (path: string) => /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(path) || path.includes('cloudinary');

  const IMG_BASE = 'https://res.cloudinary.com/fb73ycvg/image/upload/w_200,h_150,c_fill/';

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
          <h2 className="text-2xl font-bold text-slate-800">Verifikasi Berkas</h2>
          <p className="text-sm text-slate-400 mt-1">Periksa dan verifikasi dokumen setiap pendaftar</p>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {studentDocs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="text-4xl mb-3">📄</div>
          <p className="text-slate-500">Belum ada pendaftar yang mengunggah dokumen</p>
        </div>
      ) : (
        <div className="space-y-3">
          {studentDocs.map(({ student, docs }) => {
            const isOpen = expandedId === student.id;
            const pendingCount = docs.filter((d: any) => d.verification_status === 'menunggu').length;
            const status = docs.every((d: any) => d.verification_status === 'disetujui') ? 'terverifikasi'
              : docs.some((d: any) => d.verification_status === 'ditolak') ? 'belum_lengkap'
              : 'menunggu_verifikasi';

            return (
              <div key={student.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <button onClick={() => setExpandedId(isOpen ? null : student.id)} className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors text-left">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-lg shrink-0">
                    {student.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-800 truncate">{student.name || 'Tanpa Nama'}</div>
                    <div className="text-sm text-slate-400">{student.nisn || '-'} &middot; {docs.length} dokumen</div>
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
                  <div className="border-t border-slate-100 p-5 space-y-6">
                    <div className="grid md:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 text-sm">
                      {[
                        { label: 'NISN', value: student.nisn },
                        { label: 'NIK', value: student.nik },
                        { label: 'Tempat Lahir', value: student.tempat_lahir },
                        { label: 'Tanggal Lahir', value: student.tanggal_lahir },
                        { label: 'Jenis Kelamin', value: student.jenis_kelamin },
                        { label: 'Agama', value: student.agama },
                        { label: 'Telepon', value: student.telepon },
                        { label: 'Asal Sekolah', value: student.asal_sekolah },
                        { label: 'Gelombang', value: student.gelombang },
                      ].map(f => f.value ? (
                        <div key={f.label}>
                          <span className="text-slate-400">{f.label}</span>
                          <p className="font-medium text-slate-700">{f.value}</p>
                        </div>
                      ) : null)}
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-slate-800">Dokumen</h4>
                      {docs.map((doc: any) => (
                        <div key={doc.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                          {doc.file_path ? (
                            <button onClick={() => setPreviewUrl(doc.file_path)} className="w-16 h-14 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0 hover:opacity-80 transition-opacity">
                              <img src={getThumb(doc.file_path) || doc.file_path} alt={doc.file_type} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).src = ''; (e.target as HTMLImageElement).classList.add('hidden'); }} />
                            </button>
                          ) : (
                            <div className="w-16 h-14 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300 text-xs shrink-0">No File</div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-700 uppercase">{doc.file_type}</div>
                            <StatusBadge status={doc.verification_status} />
                            {doc.rejection_note && <p className="text-xs text-red-500 mt-0.5">{doc.rejection_note}</p>}
                          </div>
                          {doc.verification_status === 'menunggu' && (
                            <div className="flex gap-2 shrink-0">
                              <button onClick={() => setVerifyModal({ open: true, docId: doc.id, action: 'disetujui' })} className="w-9 h-9 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center transition-colors" title="Setuju">✓</button>
                              <button onClick={() => setVerifyModal({ open: true, docId: doc.id, action: 'ditolak' })} className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors" title="Tolak">✕</button>
                            </div>
                          )}
                          {doc.verification_status === 'disetujui' && (
                            <span className="text-green-600 text-xs font-semibold shrink-0">✓ Disetujui</span>
                          )}
                          {doc.verification_status === 'ditolak' && (
                            <span className="text-red-500 text-xs font-semibold shrink-0">✕ Ditolak</span>
                          )}
                        </div>
                      ))}
                    </div>
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
              {verifyModal.action === 'disetujui' ? 'Setujui Berkas?' : 'Tolak Berkas?'}
            </h3>
            {verifyModal.action === 'ditolak' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Catatan Penolakan</label>
                <textarea className="input" rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="Alasan penolakan" />
              </div>
            )}
            <div className="flex gap-3 justify-end">
              <button onClick={() => setVerifyModal(null)} className="btn bg-slate-100 text-slate-700 hover:bg-slate-200">Batal</button>
              <button onClick={handleVerify} className={verifyModal.action === 'disetujui' ? 'btn btn-success' : 'btn btn-danger'} disabled={verifyModal.action === 'ditolak' && !note}>
                {verifyModal.action === 'disetujui' ? 'Setujui' : 'Tolak'}
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
