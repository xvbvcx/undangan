"use client";

import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="status-page">
      <div className="status-card">
        <span className="warning-icon">!</span>
        <h1>Ada yang error.</h1>
        <p>Mohon maaf, ada gangguan. Coba refresh halaman atau kembali ke beranda.</p>
        {error?.digest ? <p className="muted">Kode: {error.digest}</p> : null}
        <div className="card-actions">
          <button type="button" className="button gold" onClick={reset}>Coba lagi</button>
          <Link href="/" className="button ghost">Beranda</Link>
        </div>
      </div>
    </main>
  );
}
