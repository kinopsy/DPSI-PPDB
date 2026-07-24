import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function apiGetStudents(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'students'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function apiCreateStudent(data: any) {
  const ref = await addDoc(collection(db, 'students'), { ...data, pendaftaran_status: 'menunggu_verifikasi', createdAt: serverTimestamp() });
  if (data.gelombang) {
    const q = query(collection(db, 'quotas'), where('program', '==', data.gelombang));
    const quotaSnap = await getDocs(q);
    if (!quotaSnap.empty) {
      const quotaRef = quotaSnap.docs[0].ref;
      const current = quotaSnap.docs[0].data().current_count || 0;
      await updateDoc(quotaRef, { current_count: current + 1 });
    }
  }
  const snap = await getDoc(ref);
  return { success: true, id: ref.id, ...snap.data() };
}

export async function apiUpdateStudent(id: string, data: any) {
  await updateDoc(doc(db, 'students', id), data);
  const snap = await getDoc(doc(db, 'students', id));
  return { success: true, id, ...snap.data() };
}

export async function apiGetDocuments(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'documents'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function apiUpsertDocument(studentId: string, fileType: string, filePath: string, isOptional = false) {
  const q = query(collection(db, 'documents'), where('student_id', '==', studentId), where('file_type', '==', fileType));
  const existing = await getDocs(q);

  if (!existing.empty) {
    const ref = existing.docs[0].ref;
    await updateDoc(ref, { file_path: filePath, verification_status: 'menunggu', rejection_note: null, is_optional: isOptional });
    const snap = await getDoc(ref);
    return { success: true, id: ref.id, ...snap.data() };
  }

  const ref = await addDoc(collection(db, 'documents'), {
    student_id: studentId,
    file_type: fileType,
    file_path: filePath,
    verification_status: 'menunggu',
    rejection_note: null,
    is_optional: isOptional,
    createdAt: serverTimestamp(),
  });
  const snap = await getDoc(ref);
  return { success: true, id: ref.id, ...snap.data() };
}

export async function apiVerifyDocument(docId: string, status: string, note?: string) {
  const ref = doc(db, 'documents', docId);
  await updateDoc(ref, { verification_status: status, rejection_note: note || null });

  const snap = await getDoc(ref);
  const data = snap.data()!;

  const studentQ = query(collection(db, 'documents'), where('student_id', '==', data.student_id));
  const allDocs = await getDocs(studentQ);
  const requiredDocs = allDocs.docs.filter(d => !d.data().is_optional);
  const allVerified = requiredDocs.length === 0 || requiredDocs.every(d => d.data().verification_status === 'disetujui');
  const anyRejected = requiredDocs.some(d => d.data().verification_status === 'ditolak');

  const studentRef = doc(db, 'students', data.student_id);
  if (allVerified) await updateDoc(studentRef, { pendaftaran_status: 'terverifikasi' });
  else if (anyRejected) await updateDoc(studentRef, { pendaftaran_status: 'belum_lengkap' });

  return { success: true };
}

export async function apiDeletePayment(paymentId: string) {
  await deleteDoc(doc(db, 'payments', paymentId));
  return { success: true };
}

export async function apiGetPayments(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'payments'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function apiCreatePayment(studentId: string, proofPath: string) {
  const q = query(collection(db, 'payments'), where('student_id', '==', studentId));
  const existing = await getDocs(q);

  const tariffSnap = await getDocs(collection(db, 'tariffs'));
  const pendaftaranTariff = tariffSnap.docs.find(d => d.data().component?.toLowerCase() === 'pendaftaran');
  const tariff = pendaftaranTariff || tariffSnap.docs[0];
  const amount = tariff?.data().amount || 250000;
  const payment_for = 'Pendaftaran';

  if (!existing.empty) {
    const ref = existing.docs[0].ref;
    await updateDoc(ref, { proof_file_path: proofPath, amount, payment_for, payment_status: 'pending', verified_at: null, verified_by: null });
    const snap = await getDoc(ref);
    return { success: true, id: ref.id, ...snap.data() };
  }

  const ref = await addDoc(collection(db, 'payments'), {
    student_id: studentId,
    proof_file_path: proofPath,
    amount,
    payment_for,
    payment_status: 'pending',
    verified_at: null,
    verified_by: null,
    createdAt: serverTimestamp(),
  });
  const snap = await getDoc(ref);
  return { success: true, id: ref.id, ...snap.data() };
}

export async function apiVerifyPayment(paymentId: string, status: string, officer?: string, note?: string) {
  const ref = doc(db, 'payments', paymentId);
  const updates: any = { payment_status: status, verified_by: officer || null };

  if (status === 'lunas' || status === 'ditolak_bayar') {
    updates.verified_at = new Date().toISOString();
  }

  await updateDoc(ref, updates);

  if (status === 'lunas' || status === 'ditolak_bayar') {
    const snap = await getDoc(ref);
    const data = snap.data()!;

    let studentName = data.student_id;
    const studentSnap = await getDoc(doc(db, 'students', data.student_id));
    if (studentSnap.exists()) {
      studentName = studentSnap.data().name || studentName;
    }

    const amount = data.amount || 0;
    const tariffSnap = await getDocs(collection(db, 'tariffs'));
    const firstTariff = tariffSnap.docs[0]?.data();
    const resolvedAmount = amount > 0 ? amount : (firstTariff?.amount || 250000);

    if (!data.amount && firstTariff?.amount) {
      await updateDoc(ref, { amount: firstTariff.amount });
    }

    await addDoc(collection(db, 'auditLogs'), {
      action: status === 'lunas' ? 'Pembayaran Diverifikasi' : 'Pembayaran Ditolak',
      student: studentName,
      student_id: data.student_id,
      amount: resolvedAmount,
      proof_file_path: data.proof_file_path || null,
      date: new Date().toISOString(),
      officer: officer || '',
      note: note || null,
      createdAt: serverTimestamp(),
    });
  }

  return { success: true };
}

export async function apiGetQuotas(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'quotas'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function apiCreateQuota(data: { program: string; max_quota: number; deadline: string }) {
  const ref = await addDoc(collection(db, 'quotas'), {
    ...data,
    current_count: 0,
    createdAt: serverTimestamp(),
  });
  const snap = await getDoc(ref);
  return { success: true, id: ref.id, ...snap.data() };
}

export async function apiUpdateQuota(id: string, data: any) {
  await updateDoc(doc(db, 'quotas', id), data);
  const snap = await getDoc(doc(db, 'quotas', id));
  return { success: true, id, ...snap.data() };
}

export async function apiDeleteQuota(id: string) {
  await deleteDoc(doc(db, 'quotas', id));
  return { success: true };
}

export async function apiUpdateQuotaCount(quotaId: string, delta: number) {
  const ref = doc(db, 'quotas', quotaId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const current = snap.data().current_count || 0;
    await updateDoc(ref, { current_count: Math.max(0, current + delta) });
  }
  return { success: true };
}

export async function apiGetTariffs(): Promise<any[]> {
  const snap = await getDocs(collection(db, 'tariffs'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function apiCreateTariff(data: any) {
  const ref = await addDoc(collection(db, 'tariffs'), { ...data, createdAt: serverTimestamp() });
  const snap = await getDoc(ref);
  return { success: true, id: ref.id, ...snap.data() };
}

export async function apiUpdateTariff(id: string, data: any) {
  await updateDoc(doc(db, 'tariffs', id), data);
  const snap = await getDoc(doc(db, 'tariffs', id));
  return { success: true, id, ...snap.data() };
}

export async function apiDeleteTariff(id: string) {
  await deleteDoc(doc(db, 'tariffs', id));
  return { success: true };
}

export async function apiGetAnnouncements(): Promise<any[]> {
  const q = query(collection(db, 'announcements'), orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function apiCreateAnnouncement(title: string, content: string) {
  const ref = await addDoc(collection(db, 'announcements'), {
    title,
    content,
    date: new Date().toISOString().split('T')[0],
    published: true,
    createdAt: serverTimestamp(),
  });
  const snap = await getDoc(ref);
  return { success: true, id: ref.id, ...snap.data() };
}

export async function apiUpdateAnnouncement(id: string, data: { title?: string; content?: string }) {
  const ref = doc(db, 'announcements', id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  const snap = await getDoc(ref);
  return { success: true, id, ...snap.data() };
}

export async function apiDeleteAnnouncement(id: string) {
  await deleteDoc(doc(db, 'announcements', id));
  return { success: true };
}

export async function apiGetAuditLogs(): Promise<any[]> {
  const q = query(collection(db, 'auditLogs'), orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function formatCurrency(amount: number): string {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
