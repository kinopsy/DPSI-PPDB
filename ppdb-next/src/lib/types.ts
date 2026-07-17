export type UserRole = 'pendaftar' | 'panitia' | 'bendahara' | 'kepsek';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface Student {
  id: string;
  user_id: string | null;
  nisn: string;
  name: string;
  nik: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  jenis_kelamin: string;
  agama: string;
  alamat: string;
  telepon: string;
  asal_sekolah: string;
  pendaftaran_status: string;
}

export interface Document {
  id: string;
  student_id: string;
  file_type: string;
  file_path: string;
  verification_status: string;
  rejection_note: string | null;
}

export interface Payment {
  id: string;
  student_id: string;
  proof_file_path: string;
  payment_status: string;
  verified_at: string | null;
}

export interface Quota {
  id: string;
  program: string;
  max_quota: number;
  current_count: number;
  deadline: string;
}

export interface Tariff {
  id: string;
  component: string;
  amount: number;
  description: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  published: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  student: string;
  amount: string;
  date: string;
  officer: string;
}

export interface AppData {
  users: User[];
  students: Student[];
  documents: Document[];
  payments: Payment[];
  quotas: Quota[];
  tariffs: Tariff[];
  announcements: Announcement[];
  auditLogs: AuditLog[];
}
