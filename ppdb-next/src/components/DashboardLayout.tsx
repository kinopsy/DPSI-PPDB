'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-deep-blue border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-400 text-sm font-medium">Memuat...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 md:ml-[260px]">
        <header className="bg-white border-b border-slate-200/60 px-4 h-14 flex items-center md:hidden sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 hover:bg-slate-100 rounded-xl transition-colors">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h14M3 5h14M3 15h14" /></svg>
          </button>
          <span className="text-base font-bold text-slate-800 ml-2">SD Muhammadiyah Karangkajen</span>
        </header>

        <header className="hidden md:flex bg-white border-b border-slate-200/60 px-8 h-16 items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Logo SD Muhammadiyah Karangkajen"
              width={40}
              height={40}
              priority
              className="w-10 h-10 rounded-xl object-contain bg-white p-1 shadow-lg shadow-[#1D20DA]/20"
            />
            <div>
              <h1 className="text-sm font-semibold text-slate-800 capitalize">Panel {user.role}</h1>
              <p className="text-xs text-slate-400">SD Muhammadiyah Karangkajen</p>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
