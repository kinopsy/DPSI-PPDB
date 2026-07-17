'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiGetAnnouncements, apiCreateAnnouncement } from '@/lib/api';
import { Toast } from '@/components/UI';

export default function PengumumanPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'panitia') { router.push('/auth/login'); return; }
    apiGetAnnouncements().then(setAnnouncements);
  }, [user, router]);

  if (!user) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    await apiCreateAnnouncement(title, content);
    const updated = await apiGetAnnouncements();
    setAnnouncements(updated);
    setTitle('');
    setContent('');
    setToast({ message: 'Pengumuman berhasil dibuat', type: 'success' });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Pengumuman</h2>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="card p-6 mb-6">
        <h3 className="font-semibold mb-4">Buat Pengumuman</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Judul</label>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Isi</label>
            <textarea className="input" rows={4} value={content} onChange={e => setContent(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">Terbitkan</button>
        </form>
      </div>

      <div className="space-y-4">
        {announcements.map(ann => (
          <div key={ann.id} className="card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold">{ann.title}</h4>
                <p className="text-sm text-slate-500 mt-1">{ann.date}</p>
              </div>
              <span className="badge badge-success">Published</span>
            </div>
            <p className="text-sm text-slate-600 mt-3">{ann.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
