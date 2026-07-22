'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiGetAnnouncements, apiCreateAnnouncement, apiUpdateAnnouncement, apiDeleteAnnouncement } from '@/lib/api';
import { Toast } from '@/components/UI';

export default function PengumumanPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [creating, setCreating] = useState(false);

  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'panitia') { router.push('/auth/login'); return; }
    apiGetAnnouncements().then(setAnnouncements);
  }, [user, router]);

  if (!user) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setCreating(true);
    await apiCreateAnnouncement(title, content);
    const updated = await apiGetAnnouncements();
    setAnnouncements(updated);
    setTitle('');
    setContent('');
    setCreating(false);
    setToast({ message: 'Pengumuman berhasil dibuat', type: 'success' });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId || !editTitle || !editContent) return;
    await apiUpdateAnnouncement(editId, { title: editTitle, content: editContent });
    const updated = await apiGetAnnouncements();
    setAnnouncements(updated);
    setEditId(null);
    setEditTitle('');
    setEditContent('');
    setToast({ message: 'Pengumuman berhasil diperbarui', type: 'success' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus pengumuman ini?')) return;
    await apiDeleteAnnouncement(id);
    const updated = await apiGetAnnouncements();
    setAnnouncements(updated);
    setToast({ message: 'Pengumuman berhasil dihapus', type: 'success' });
  };

  const openEdit = (ann: any) => {
    setEditId(ann.id);
    setEditTitle(ann.title);
    setEditContent(ann.content);
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Pengumuman</h2>
          <p className="text-sm text-slate-400 mt-1">Kelola pengumuman PPDB</p>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
        <h3 className="font-semibold text-slate-800 mb-1">Buat Pengumuman Baru</h3>
        <p className="text-sm text-slate-400 mb-5">Pengumuman akan langsung tampil di halaman publik</p>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Judul</label>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Judul pengumuman" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Isi</label>
            <textarea className="input" rows={4} value={content} onChange={e => setContent(e.target.value)} placeholder="Tulis isi pengumuman..." required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={creating}>
            {creating ? 'Menyimpan...' : 'Terbitkan'}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
            <div className="text-4xl mb-3">📢</div>
            <p className="text-slate-500">Belum ada pengumuman</p>
          </div>
        ) : (
          announcements.map(ann => (
            <div key={ann.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between p-6 pb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-lg shrink-0">📢</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800">{ann.title}</h4>
                    <p className="text-sm text-slate-400 mt-0.5">{ann.date}</p>
                    <p className="text-sm text-slate-600 mt-3 whitespace-pre-wrap">{ann.content}</p>
                  </div>
                </div>
                <span className="bg-green-50 text-green-600 text-xs font-semibold px-3 py-1 rounded-full shrink-0 ml-4">Published</span>
              </div>
              <div className="flex gap-2 px-6 pb-4">
                <button onClick={() => openEdit(ann)} className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
                <button onClick={() => handleDelete(ann.id)} className="text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">Hapus</button>
              </div>
            </div>
          ))
        )}
      </div>

      {editId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setEditId(null); }}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-slate-800">Edit Pengumuman</h3>
              <button onClick={() => setEditId(null)} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" /></svg>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Judul</label>
                <input className="input" value={editTitle} onChange={e => setEditTitle(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Isi</label>
                <textarea className="input" rows={4} value={editContent} onChange={e => setEditContent(e.target.value)} required />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setEditId(null)} className="btn bg-slate-100 text-slate-700 hover:bg-slate-200">Batal</button>
                <button type="submit" className="btn btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
