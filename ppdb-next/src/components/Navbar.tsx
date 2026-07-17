'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

function SchoolLogo({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <img src="/logo.png" alt="Logo Sekolah" style={{ width: size, height: size, borderRadius: 8, objectFit: 'contain', background: 'white', padding: 2 }} />
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLogged = !!user;
  const showBeranda = !isLogged || user?.role === 'panitia';

  const getDashboardLink = () => {
    if (!user) return '/auth/login';
    return `/${user.role}/dashboard`;
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href={isLogged ? getDashboardLink() : '/'} className="flex items-center gap-2.5">
          <SchoolLogo size={32} />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800 leading-tight tracking-tight">SD Muhammadiyah Karangkajen</span>
            <span className="text-[10px] text-slate-400 font-medium leading-tight">PPDB Online</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {showBeranda && (
            <Link href="/" className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${pathname === '/' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
              Beranda
            </Link>
          )}
          <Link href="/pengumuman" className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${pathname === '/pengumuman' ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
            Pengumuman
          </Link>
          {user ? (
            <div className="flex items-center gap-2 ml-2">
              <Link href={getDashboardLink()} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all">
                Dashboard
              </Link>
              <button onClick={logout} className="px-4 py-2 text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors rounded-xl hover:bg-slate-50">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link href="/auth/login" className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium transition-all rounded-xl hover:bg-slate-50">
                Login
              </Link>
              <Link href="/auth/register" className="btn btn-primary btn-sm">
                Daftar
              </Link>
            </div>
          )}
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors">
          {menuOpen ? (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5l10 10M15 5l-10 10" /></svg>
          ) : (
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h14M3 5h14M3 15h14" /></svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 px-4 py-4 space-y-1 bg-white">
          {showBeranda && (
            <Link href="/" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">Beranda</Link>
          )}
          <Link href="/pengumuman" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">Pengumuman</Link>
          {user ? (
            <>
              <Link href={getDashboardLink()} onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-deep-blue bg-deep-blue/5">Dashboard</Link>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="block w-full text-left px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-600 hover:bg-slate-50">Logout</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">Login</Link>
              <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-deep-blue bg-deep-blue/5">Daftar</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
