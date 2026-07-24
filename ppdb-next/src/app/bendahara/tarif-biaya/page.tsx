'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiGetTariffs, apiCreateTariff, apiUpdateTariff, apiDeleteTariff, formatCurrency } from '@/lib/api';
import { Toast, Modal } from '@/components/UI';

export default function TarifBiayaPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [tariffs, setTariffs] = useState<any[]>([]);
  const [modal, setModal] = useState<{ open: boolean; editId?: string }>({ open: false });
  const [form, setForm] = useState({ component: '', amount: '', description: '' });

  useEffect(() => {
    if (!user || user.role !== 'bendahara') { router.push('/auth/login'); return; }
    apiGetTariffs().then(setTariffs);
  }, [user, router]);

  if (!user) return null;

  const openAdd = () => { setForm({ component: '', amount: '', description: '' }); setModal({ open: true }); };
  const openEdit = (t: any) => { setForm({ component: t.component, amount: String(t.amount), description: t.description }); setModal({ open: true, editId: t.id }); };

  const handleSave = async () => {
    if (!form.component || !form.amount || Number(form.amount) <= 0) return;
    const payload = { ...form, amount: Number(form.amount) };
    if (modal.editId) {
      await apiUpdateTariff(modal.editId, payload);
    } else {
      await apiCreateTariff(payload);
    }
    const updated = await apiGetTariffs();
    setTariffs(updated);
    setModal({ open: false });
    setToast({ message: 'Tarif berhasil disimpan', type: 'success' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus tarif ini?')) return;
    await apiDeleteTariff(id);
    const updated = await apiGetTariffs();
    setTariffs(updated);
    setToast({ message: 'Tarif berhasil dihapus', type: 'success' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Tarif Biaya</h2>
        <button onClick={openAdd} className="btn btn-primary">+ Tambah Tarif</button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Komponen</th>
              <th>Nominal</th>
              <th>Deskripsi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tariffs.map((t: any) => (
              <tr key={t.id}>
                <td className="font-medium">{t.component}</td>
                <td>{formatCurrency(t.amount)}</td>
                <td className="text-sm text-slate-500">{t.description}</td>
                <td>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(t)} className="btn btn-outline btn-sm">Edit</button>
                    <button onClick={() => handleDelete(t.id)} className="btn btn-danger btn-sm">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modal.open} onClose={() => setModal({ open: false })} title={modal.editId ? 'Edit Tarif' : 'Tambah Tarif'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Komponen</label>
            <input className="input" value={form.component} onChange={e => setForm({ ...form, component: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nominal (Rp)</label>
            <input type="text" inputMode="numeric" className="input" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value.replace(/\D/g, '') })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
            <input className="input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setModal({ open: false })} className="btn btn-outline">Batal</button>
            <button onClick={handleSave} className="btn btn-primary">Simpan</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
