'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fadeIn" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5l8 8M13 5l-8 8" /></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Toast({ message, type = 'success', onClose }: { message: string; type?: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`} style={{ transform: 'translateY(0)', opacity: 1 }}>
      <div className="flex items-center gap-2">
        {type === 'success' ? '✓' : '✕'} {message}
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    terverifikasi: { label: 'Terverifikasi', className: 'badge-success' },
    menunggu_verifikasi: { label: 'Menunggu', className: 'badge-warning' },
    lulus: { label: 'Lulus', className: 'badge-success' },
    belum_lengkap: { label: 'Belum Lengkap', className: 'badge-error' },
    disetujui: { label: 'Disetujui', className: 'badge-success' },
    menunggu: { label: 'Menunggu', className: 'badge-warning' },
    ditolak: { label: 'Ditolak', className: 'badge-error' },
    lunas: { label: 'Lunas', className: 'badge-success' },
    pending: { label: 'Pending', className: 'badge-warning' },
    ditolak_bayar: { label: 'Ditolak', className: 'badge-error' },
  };
  const info = map[status] || { label: status, className: 'badge-info' };
  return <span className={`badge ${info.className}`}>{info.label}</span>;
}

export function FileUpload({ accept, maxSizeMB = 2, onFile }: { accept: string; maxSizeMB?: number; onFile: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Ukuran file maksimal ${maxSizeMB}MB`);
      return;
    }
    onFile(file);
  };

  return (
    <div>
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
      <button type="button" onClick={() => inputRef.current?.click()} className="btn btn-outline btn-sm">
        Pilih File
      </button>
      {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
    </div>
  );
}
