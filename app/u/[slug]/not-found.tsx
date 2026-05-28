import Link from "next/link";

export default function InvitationNotFound() {
  return (
    <main className="status-page">
      <div className="status-card">
        <h1>Undangan tidak ditemukan.</h1>
        <p>Undangan mungkin belum publish, belum dibayar, atau masa aktifnya sudah habis.</p>
        <Link href="/" className="button gold">Beranda</Link>
      </div>
    </main>
  );
}
