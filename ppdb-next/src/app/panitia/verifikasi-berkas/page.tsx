'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiGetStudents, apiGetDocuments, apiVerifyDocument } from '@/lib/api';
import { StatusBadge, Modal, Toast } from '@/components/UI';

export default function VerifikasiBerkasPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [modal, setModal] = useState<{ open: boolean; docId: string; action: string }>({ open: false, docId: '', action: '' });
  const [note, setNote] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  const loadData = () => {
    Promise.all([apiGetStudents(), apiGetDocuments()]).then(([s, d]) => {
      setStudents(s);
      setDocuments(d);
    });
  };

  useEffect(() => {
    if (!user || user.role !== 'panitia') { router.push('/auth/login'); return; }
    loadData();
  }, [user, router]);
  if (!user) return null;

  const pendingDocs = documents.filter((d: any) => d.verification_status === 'menunggu');

  const handleVerify = async (docId: string, status: string) => {
    await apiVerifyDocument(docId, status, note || undefined);
    loadData();
    setModal({ open: false, docId: '', action: '' });
    setNote('');
    setToast({ message: `Berkas ${status === 'disetujui' ? 'disetujui' : 'ditolak'}`, type: 'success' });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Verifikasi Berkas</h2>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Siswa</th>
              <th>Jenis Dokumen</th>
              <th>File</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pendingDocs.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-500">Tidak ada berkas menunggu verifikasi</td></tr>
            ) : pendingDocs.map((doc, i) => {
              const student = students.find(s => s.id === doc.student_id);
              return (
                <tr key={doc.id}>
                  <td>{i + 1}</td>
                  <td>{student?.name || '-'}</td>
                  <td className="uppercase">{doc.file_type}</td>
                  <td className="text-sm text-slate-500">{doc.file_path}</td>
                  <td><StatusBadge status={doc.verification_status} /></td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => setModal({ open: true, docId: doc.id, action: 'disetujui' })} className="btn btn-success btn-sm">Setuju</button>
                      <button onClick={() => setModal({ open: true, docId: doc.id, action: 'ditolak' })} className="btn btn-danger btn-sm">Tolak</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal open={modal.open} onClose={() => setModal({ open: false, docId: '', action: '' })} title={modal.action === 'disetujui' ? 'Setujui Berkas?' : 'Tolak Berkas?'}>
        {modal.action === 'ditolak' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Catatan Penolakan (wajib)</label>
            <textarea className="input" rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="Masukkan alasan penolakan" />
          </div>
        )}
        <div className="flex gap-3 justify-end">
          <button onClick={() => setModal({ open: false, docId: '', action: '' })} className="btn btn-outline">Batal</button>
          <button
            onClick={() => handleVerify(modal.docId, modal.action)}
            className={modal.action === 'disetujui' ? 'btn btn-success' : 'btn btn-danger'}
            disabled={modal.action === 'ditolak' && !note}
          >
            {modal.action === 'disetujui' ? 'Setujui' : 'Tolak'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
