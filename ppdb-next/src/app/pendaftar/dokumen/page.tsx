'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiGetStudents, apiGetDocuments, apiUpsertDocument } from '@/lib/api';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { StatusBadge, Toast } from '@/components/UI';

const DOC_TYPES = [
  { value: 'kk', label: 'Kartu Keluarga' },
  { value: 'akta', label: 'Akta Kelahiran' },
  { value: 'skhun', label: 'SKHUN' },
  { value: 'skl', label: 'SKL' },
];

export default function DokumenPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const [docs, setDocs] = useState<any[]>([]);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    Promise.all([apiGetStudents(), apiGetDocuments()]).then(([students, documents]) => {
      const s = students.find((st: any) => st.user_id === user.id);
      if (s) {
        setStudentId(s.id);
        setDocs(documents.filter((d: any) => d.student_id === s.id));
      }
    });
  }, [user, router]);

  if (!user) return null;

  const handleUpload = async (fileType: string, file: File) => {
    if (!studentId) { setToast({ message: 'Lengkapi biodata terlebih dahulu', type: 'error' }); return; }
    try {
      setToast({ message: 'Mengupload...', type: 'info' });
      const url = await uploadToCloudinary(file);
      await apiUpsertDocument(studentId, fileType, url);
      const documents = await apiGetDocuments();
      setDocs(documents.filter((d: any) => d.student_id === studentId));
      setToast({ message: `File ${fileType.toUpperCase()} berhasil diupload`, type: 'success' });
    } catch {
      setToast({ message: 'Gagal upload file. Coba lagi.', type: 'error' });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Upload Dokumen</h2>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="card p-6">
        <div className="space-y-4">
          {DOC_TYPES.map(dt => {
            const doc = docs.find(d => d.file_type === dt.value);
            return (
              <div key={dt.value} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <div className="font-medium">{dt.label}</div>
                  {doc && <div className="text-sm text-slate-500 mt-1">{doc.file_path}</div>}
                </div>
                <div className="flex items-center gap-3">
                  {doc && <StatusBadge status={doc.verification_status} />}
                  {doc?.rejection_note && <span className="text-xs text-red-500">{doc.rejection_note}</span>}
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id={`file-${dt.value}`}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 2 * 1024 * 1024) { setToast({ message: 'Ukuran file maks 2MB', type: 'error' }); return; }
                        handleUpload(dt.value, file);
                      }
                    }}
                  />
                  <label htmlFor={`file-${dt.value}`} className="btn btn-outline btn-sm cursor-pointer">
                    {doc ? 'Upload Ulang' : 'Upload'}
                  </label>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 mt-4">Format: PDF, JPG, PNG. Maksimal 2MB per file.</p>
      </div>
    </div>
  );
}
