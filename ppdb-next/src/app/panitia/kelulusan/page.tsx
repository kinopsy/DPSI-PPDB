'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiGetStudents, apiUpdateStudent, apiGetQuotas, apiUpdateQuotaCount } from '@/lib/api';
import { StatusBadge, Toast } from '@/components/UI';

export default function KelulusanPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [students, setStudents] = useState<any[]>([]);

  const loadStudents = () => {
    apiGetStudents().then(setStudents);
  };

  useEffect(() => {
    if (!user || user.role !== 'panitia') { router.push('/auth/login'); return; }
    loadStudents();
  }, [user, router]);
  if (!user) return null;

  const verifiedStudents = students.filter((s: any) => s.pendaftaran_status === 'terverifikasi' || s.pendaftaran_status === 'lulus' || s.pendaftaran_status === 'belum_lengkap');

  const handleSetGraduation = async (student: any, status: string) => {
    await apiUpdateStudent(student.id, { pendaftaran_status: status });
    const quotas = await apiGetQuotas();
    const target = quotas.find((q: any) => q.program === student.gelombang);
    if (target) {
      const wasLulus = student.pendaftaran_status === 'lulus';
      const nowLulus = status === 'lulus';
      if (!wasLulus && nowLulus) await apiUpdateQuotaCount(target.id, 1);
      else if (wasLulus && !nowLulus) await apiUpdateQuotaCount(target.id, -1);
    }
    loadStudents();
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
                    <button onClick={() => handleSetGraduation(s, 'lulus')} className="btn btn-success btn-sm" disabled={s.pendaftaran_status === 'lulus'}>
                      Lulus
                    </button>
                    <button onClick={() => handleSetGraduation(s, 'belum_lengkap')} className="btn btn-danger btn-sm" disabled={s.pendaftaran_status === 'belum_lengkap'}>
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
