'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const NAV_ITEMS: Record<string, { label: string; href: string; icon: string }[]> = {
  pendaftar: [
    { label: 'Dashboard', href: '/pendaftar/dashboard', icon: '🏠' },
    { label: 'Biodata', href: '/pendaftar/biodata', icon: '👤' },
    { label: 'Dokumen', href: '/pendaftar/dokumen', icon: '📄' },
    { label: 'Pembayaran', href: '/pendaftar/pembayaran', icon: '💳' },
    { label: 'Status', href: '/pendaftar/status', icon: '📊' },
  ],
  panitia: [
    { label: 'Dashboard', href: '/panitia/dashboard', icon: '🏠' },
    { label: 'Verifikasi Berkas', href: '/panitia/verifikasi-berkas', icon: '✅' },
    { label: 'Kuota Dinamis', href: '/panitia/kuota-dinamis', icon: '📋' },
    { label: 'Kelulusan', href: '/panitia/kelulusan', icon: '🎓' },
    { label: 'Pengumuman', href: '/panitia/pengumuman', icon: '✍️' },
  ],
  bendahara: [
    { label: 'Dashboard', href: '/bendahara/dashboard', icon: '🏠' },
    { label: 'Verifikasi Pembayaran', href: '/bendahara/verifikasi-pembayaran', icon: '💳' },
    { label: 'Tarif Biaya', href: '/bendahara/tarif-biaya', icon: '💲' },
    { label: 'Audit Log', href: '/bendahara/audit-log', icon: '📝' },
  ],
  kepsek: [
    { label: 'Dashboard', href: '/kepsek/dashboard', icon: '🏠' },
  ],
};

const BOTTOM_LINKS: { label: string; href: string; icon: string; roles?: string[] }[] = [
  { label: 'Pengumuman', href: '/pengumuman', icon: '📢' },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) return null;

  const items = NAV_ITEMS[user.role] || [];
  const visibleBottomLinks = BOTTOM_LINKS.filter(l => !l.roles || l.roles.includes(user.role));

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden" onClick={onClose} />
      )}

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 shadow-lg shadow-[#1D20DA]/30" />
              <div>
                <div className="text-sm font-bold text-white leading-tight">SD Muhammadiyah Karangkajen</div>
                <div className="text-[10px] text-white/40 font-medium">PPDB Online</div>
              </div>
            </div>
            <button onClick={onClose} className="md:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white/80">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" /></svg>
            </button>
          </div>
          <div className="inline-block bg-white/10 text-white/60 text-[11px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider">
            {user.role}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {visibleBottomLinks.length > 0 && (
          <div className="px-3 pb-1">
            <div className="border-t border-white/5 pt-2 mt-1">
              {visibleBottomLinks.map((item) => (
                <Link key={item.href} href={item.href} className="sidebar-link" onClick={onClose}>
                  <span className="text-base w-5 text-center">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1D20DA] to-[#4B50E8] flex items-center justify-center text-sm font-bold shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user.name}</div>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push('/'); onClose(); }}
            className="w-full flex items-center gap-2 text-sm text-white/30 hover:text-white/80 hover:bg-white/5 rounded-xl px-3 py-2.5 transition-all mt-1"
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5.25 12.75h-3a.75.75 0 01-.75-.75V3a.75.75 0 01.75-.75h3m4.5-1.5H15a.75.75 0 01.75.75v9a.75.75 0 01-.75.75h-5.25m-4.5 0V3h4.5v8.25" /><path d="M9.75 7.5l3-3m0 0l3 3m-3-3v7.5" /></svg>
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
