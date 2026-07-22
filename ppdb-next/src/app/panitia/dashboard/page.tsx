'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function PanitiaDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      router.replace(user?.role === 'panitia' ? '/panitia/verifikasi-berkas' : '/auth/login');
    }
  }, [user, loading, router]);

  return null;
}
