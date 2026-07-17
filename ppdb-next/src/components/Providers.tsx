'use client';

import { AuthProvider } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProvider>
  );
}
