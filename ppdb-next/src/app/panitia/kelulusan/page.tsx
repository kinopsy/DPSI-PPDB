'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { apiUpdateStudent } from '@/lib/api';
import { StatusBadge, Toast } from '@/components/UI';

export default function KelulusanPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'panitia') { router.push('/auth/login'); return; }
    const unsub = onSnapshot(collection(db, 'students'), snap => {
      setStudents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user, router]);
  if (!user) return null;

  const verifiedStudents = students.filter((s: any) => s.pendaftaran_status === 'terverifikasi' || s.pendaftaran_status === 'lulus' || s.pendaftaran_status === 'belum_lengkap');

  const handleSetGraduation = async (studentId: string, status: string) => {
    await apiUpdateStudent(studentId, { pendaftaran_status: status });
    setToast({ message: `Status siswa diperbarui`, type: 'success' });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Kelulusan</h2>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>NISN</th>
              <th>Asal Sekolah</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {verifiedStudents.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-500">Tidak ada data</td></tr>
            ) : verifiedStudents.map((s, i) => (
              <tr key={s.id}>
                <td>{i + 1}</td>
                <td>{s.name}</td>
                <td>{s.nisn}</td>
                <td>{s.asal_sekolah}</td>
                <td><StatusBadge status={s.pendaftaran_status} /></td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => handleSetGraduation(s.id, 'lulus')} className="btn btn-success btn-sm" disabled={s.pendaftaran_status === 'lulus'}>
                      Lulus
                    </button>
                    <button onClick={() => handleSetGraduation(s.id, 'belum_lengkap')} className="btn btn-danger btn-sm" disabled={s.pendaftaran_status === 'belum_lengkap'}>
                      Tidak Lulus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
