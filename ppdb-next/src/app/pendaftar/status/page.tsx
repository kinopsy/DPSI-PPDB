'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiGetStudents, apiGetDocuments, apiGetPayments } from '@/lib/api';
import { StatusBadge } from '@/components/UI';

export default function StatusPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [student, setStudent] = useState<any>(undefined);
  const [docs, setDocs] = useState<any[]>([]);
  const [payment, setPayment] = useState<any>(undefined);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    Promise.all([apiGetStudents(), apiGetDocuments(), apiGetPayments()]).then(([students, documents, payments]) => {
      const s = students.find((st: any) => st.user_id === user.id);
      setStudent(s);
      if (s) {
        setDocs(documents.filter((d: any) => d.student_id === s.id));
        setPayment(payments.find((p: any) => p.student_id === s.id));
      }
    });
  }, [user, router]);

  if (!user) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Status Pendaftaran</h2>

      {!student ? (
        <div className="card p-6 empty-state">
          <p>Anda belum mengisi biodata. Silakan lengkapi biodata terlebih dahulu.</p>
        </div>
      ) : (
        <>
          <div className="card p-6 mb-6">
            <h3 className="font-semibold mb-3">Status Pendaftaran</h3>
            <StatusBadge status={student.pendaftaran_status} />
          </div>

          <div className="card p-6 mb-6">
            <h3 className="font-semibold mb-3">Dokumen</h3>
            {docs.length === 0 ? (
              <p className="text-sm text-slate-500">Belum ada dokumen</p>
            ) : (
              <div className="space-y-2">
                {docs.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                    <div>
                      <span className="font-medium uppercase">{doc.file_type}</span>
                      <span className="text-sm text-slate-500 ml-2">{doc.file_path}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={doc.verification_status} />
                      {doc.rejection_note && <span className="text-xs text-red-500">{doc.rejection_note}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-6">
            <h3 className="font-semibold mb-3">Pembayaran</h3>
            {payment ? (
              <div className="flex items-center gap-3">
                <StatusBadge status={payment.payment_status} />
                <span className="text-sm text-slate-500">{payment.proof_file_path}</span>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Belum ada pembayaran</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
