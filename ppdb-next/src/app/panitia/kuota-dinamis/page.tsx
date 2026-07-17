'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiGetQuotas, apiUpdateQuota } from '@/lib/api';
import { Toast } from '@/components/UI';

export default function KuotaDinamisPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [quotas, setQuotas] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ max_quota: 0, deadline: '' });

  useEffect(() => {
    if (!user || user.role !== 'panitia') { router.push('/auth/login'); return; }
    apiGetQuotas().then(setQuotas);
  }, [user, router]);

  if (!user) return null;

  const startEdit = (q: typeof quotas[0]) => {
    setEditId(q.id);
    setForm({ max_quota: q.max_quota, deadline: q.deadline });
  };

  const handleSave = async (quotaId: string) => {
    const result = await apiUpdateQuota(quotaId, { max_quota: form.max_quota, deadline: form.deadline });
    if (result.success) {
      setToast({ message: 'Kuota berhasil diupdate', type: 'success' });
      const updated = await apiGetQuotas();
      setQuotas(updated);
    }
    setEditId(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Kuota Dinamis</h2>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Program</th>
              <th>Kuota Maks</th>
              <th>Terisi</th>
              <th>Sisa</th>
              <th>Deadline</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {quotas.map(q => (
              <tr key={q.id}>
                <td className="font-medium">{q.program}</td>
                <td>
                  {editId === q.id ? (
                    <input type="number" className="input w-20" value={form.max_quota} onChange={e => setForm({ ...form, max_quota: Number(e.target.value) })} />
                  ) : q.max_quota}
                </td>
                <td>{q.current_count}</td>
                <td className={q.max_quota - q.current_count <= 10 ? 'text-red-500 font-medium' : ''}>{q.max_quota - q.current_count}</td>
                <td>
                  {editId === q.id ? (
                    <input type="date" className="input w-36" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
                  ) : q.deadline}
                </td>
                <td>
                  {editId === q.id ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleSave(q.id)} className="btn btn-success btn-sm">Simpan</button>
                      <button onClick={() => setEditId(null)} className="btn btn-outline btn-sm">Batal</button>
                    </div>
                  ) : (
                    <button onClick={() => startEdit(q)} className="btn btn-outline btn-sm">Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
