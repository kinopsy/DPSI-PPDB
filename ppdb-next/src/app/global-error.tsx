'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Terjadi Kesalahan</h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>{error.message || 'Terjadi error yang tidak terduga'}</p>
            <button onClick={reset} style={{ padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: 'none', background: '#1E3A8A', color: 'white', cursor: 'pointer', fontWeight: 500 }}>
              Coba Lagi
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
