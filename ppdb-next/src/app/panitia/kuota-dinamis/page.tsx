'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiGetQuotas, apiCreateQuota, apiUpdateQuota, apiDeleteQuota } from '@/lib/api';
import { Toast } from '@/components/UI';

export default function KuotaDinamisPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [quotas, setQuotas] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ program: '', max_quota: 0, deadline: '' });

  useEffect(() => {
    if (!user || user.role !== 'panitia') { router.push('/auth/login'); return; }
    apiGetQuotas().then(setQuotas);
  }, [user, router]);

  if (!user) return null;

  const resetForm = () => setForm({ program: '', max_quota: 0, deadline: '' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.program || !form.max_quota || !form.deadline) return;
    await apiCreateQuota(form);
    const updated = await apiGetQuotas();
    setQuotas(updated);
    resetForm();
    setAdding(false);
    setToast({ message: 'Kuota berhasil ditambahkan', type: 'success' });
  };

  const startEdit = (q: any) => {
    setEditId(q.id);
    setForm({ program: q.program, max_quota: q.max_quota, deadline: q.deadline });
  };

  const handleSave = async (quotaId: string) => {
    await apiUpdateQuota(quotaId, { program: form.program, max_quota: form.max_quota, deadline: form.deadline });
    setToast({ message: 'Kuota berhasil diupdate', type: 'success' });
    const updated = await apiGetQuotas();
    setQuotas(updated);
    setEditId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus kuota ini?')) return;
    await apiDeleteQuota(id);
    const updated = await apiGetQuotas();
    setQuotas(updated);
    setToast({ message: 'Kuota berhasil dihapus', type: 'success' });
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Kuota Dinamis</h2>
          <p className="text-sm text-slate-400 mt-1">Atur kuota dan deadline setiap program</p>
        </div>
        <button onClick={() => { setAdding(true); resetForm(); }} className="btn btn-primary">+ Tambah</button>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {adding && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
          <h3 className="font-semibold text-slate-800 mb-4">Tambah Program Baru</h3>
          <form onSubmit={handleAdd} className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Program</label>
              <input className="input" value={form.program} onChange={e => setForm({ ...form, program: e.target.value })} placeholder="Nama program" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kuota Maks</label>
              <input type="number" className="input" value={form.max_quota || ''} onChange={e => setForm({ ...form, max_quota: Number(e.target.value) })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
              <input type="date" className="input" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} required />
            </div>
            <div className="flex gap-2 items-end pb-0.5">
              <button type="submit" className="btn btn-primary">Simpan</button>
              <button type="button" onClick={() => setAdding(false)} className="btn bg-slate-100 text-slate-700 hover:bg-slate-200">Batal</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Program</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kuota Maks</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Terisi</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sisa</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Deadline</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">Belum ada program kuota</td>
                </tr>
              ) : (
                quotas.map(q => (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-slate-800">
                      {editId === q.id ? (
                        <input className="input" value={form.program} onChange={e => setForm({ ...form, program: e.target.value })} />
                      ) : q.program}
                    </td>
                    <td className="px-5 py-4">
                      {editId === q.id ? (
                        <input type="number" className="input w-20" value={form.max_quota} onChange={e => setForm({ ...form, max_quota: Number(e.target.value) })} />
                      ) : q.max_quota}
                    </td>
                    <td className="px-5 py-4">{q.current_count || 0}</td>
                    <td className={`px-5 py-4 font-medium ${(q.max_quota - (q.current_count || 0)) <= 10 ? 'text-red-500' : 'text-slate-600'}`}>
                      {q.max_quota - (q.current_count || 0)}
                    </td>
                    <td className="px-5 py-4">
                      {editId === q.id ? (
                        <input type="date" className="input w-36" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
                      ) : q.deadline}
                    </td>
                    <td className="px-5 py-4">
                      {editId === q.id ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleSave(q.id)} className="btn btn-success btn-sm">Simpan</button>
                          <button onClick={() => setEditId(null)} className="btn btn-outline btn-sm">Batal</button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(q)} className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
                          <button onClick={() => handleDelete(q.id)} className="text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">Hapus</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
