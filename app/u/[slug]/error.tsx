"use client";

import Link from "next/link";

export default function InvitationError() {
  return (
    <main className="status-page">
      <div className="status-card">
        <h1>Undangan tidak bisa dibuka.</h1>
        <p>Mungkin link sudah tidak aktif atau ada gangguan sementara.</p>
        <Link href="/" className="button gold">Beranda</Link>
      </div>
    </main>
  );
}
