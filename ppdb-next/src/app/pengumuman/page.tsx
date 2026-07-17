'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiGetAnnouncements } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export default function PengumumanPage() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    apiGetAnnouncements().then(setAnnouncements);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <section className="bg-deep-blue text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-white/10 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            Informasi Terbaru
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Pengumuman PPDB</h1>
          <p className="text-white/70 text-lg">Ikuti perkembangan terbaru penerimaan siswa baru</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {announcements.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="text-5xl mb-4">📢</div>
            <p className="text-slate-500 text-lg">Belum ada pengumuman</p>
          </div>
        ) : (
          <div className="space-y-6">
            {announcements.map((ann) => (
              <div key={ann.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-1.5 bg-gradient-to-r from-deep-blue to-deep-blue-light" />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-deep-blue/10 flex items-center justify-center text-lg">
                        📢
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">{ann.title}</h3>
                        <p className="text-sm text-slate-400 mt-0.5">{ann.date}</p>
                      </div>
                    </div>
                    <span className="bg-deep-blue/10 text-deep-blue text-xs font-semibold px-3 py-1 rounded-full">Published</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed ml-13">{ann.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="bg-slate-900 text-white py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto text-center text-sm text-slate-400">
          &copy; 2026 SD Muhammadiyah Karangkajen. Hak Cipta Dilindungi.
        </div>
      </footer>
    </div>
  );
}
