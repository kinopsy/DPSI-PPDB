'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiGetStudents, apiCreateStudent, apiUpdateStudent, apiGetQuotas } from '@/lib/api';
import { Toast } from '@/components/UI';

export default function BiodataPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [student, setStudent] = useState<any>(undefined);
  const [quotas, setQuotas] = useState<any[]>([]);
  const [form, setForm] = useState({
    nisn: '',
    name: '',
    nik: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    jenis_kelamin: '',
    agama: '',
    alamat: '',
    telepon: '',
    asal_sekolah: '',
    gelombang: '',
  });

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    apiGetQuotas().then(setQuotas);
    apiGetStudents().then(students => {
      const s = students.find((st: any) => st.user_id === user.id);
      setStudent(s);
      if (s) {
        setForm({
          nisn: s.nisn || '',
          name: s.name || user.name,
          nik: s.nik || '',
          tempat_lahir: s.tempat_lahir || '',
          tanggal_lahir: s.tanggal_lahir || '',
          jenis_kelamin: s.jenis_kelamin || '',
          agama: s.agama || '',
          alamat: s.alamat || '',
          telepon: s.telepon || '',
          asal_sekolah: s.asal_sekolah || '',
          gelombang: s.gelombang || '',
        });
      } else {
        setForm(prev => ({ ...prev, name: user.name }));
      }
    });
  }, [user, router]);

  if (!user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.nisn.length !== 10) { setToast({ message: 'NISN harus 10 digit', type: 'error' }); return; }
    if (form.nik.length !== 16) { setToast({ message: 'NIK harus 16 digit', type: 'error' }); return; }

    if (student) {
      await apiUpdateStudent(student.id, form);
    } else {
      await apiCreateStudent({ user_id: user.id, ...form });
    }
    setToast({ message: 'Biodata berhasil disimpan', type: 'success' });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Biodata Siswa</h2>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">NISN (10 digit)</label>
              <input name="nisn" className="input" value={form.nisn} onChange={handleChange} maxLength={10} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">NIK (16 digit)</label>
              <input name="nik" className="input" value={form.nik} onChange={handleChange} maxLength={16} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
              <input name="name" className="input" value={form.name} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tempat Lahir</label>
              <input name="tempat_lahir" className="input" value={form.tempat_lahir} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
              <input name="tanggal_lahir" type="date" className="input" value={form.tanggal_lahir} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Kelamin</label>
              <select name="jenis_kelamin" className="input" value={form.jenis_kelamin} onChange={handleChange} required>
                <option value="">Pilih</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Agama</label>
              <select name="agama" className="input" value={form.agama} onChange={handleChange} required>
                <option value="">Pilih</option>
                <option value="Islam">Islam</option>
                <option value="Kristen">Kristen</option>
                <option value="Katolik">Katolik</option>
                <option value="Hindu">Hindu</option>
                <option value="Buddha">Buddha</option>
                <option value="Konghucu">Konghucu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Telepon</label>
              <input name="telepon" className="input" value={form.telepon} onChange={handleChange} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Alamat</label>
            <textarea name="alamat" className="input" rows={3} value={form.alamat} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Asal Sekolah</label>
            <input name="asal_sekolah" className="input" value={form.asal_sekolah} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Gelombang</label>
            <select name="gelombang" className="input" value={form.gelombang} onChange={handleChange} required>
              <option value="">Pilih gelombang</option>
              {quotas.map(q => <option key={q.id} value={q.program}>{q.program}</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Simpan Biodata</button>
        </form>
      </div>
    </div>
  );
}
