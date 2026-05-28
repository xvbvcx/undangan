import Link from "next/link";

export default function PaymentSuccessPage() {
  return <main className="status-page"><div className="status-card"><span className="success-icon">✓</span><h1>Pembayaran diproses.</h1><p>Jika notifikasi iPaymu sudah diterima, undangan premium akan otomatis unlock.</p><Link href="/dashboard" className="button gold">Kembali ke dashboard</Link></div></main>;
}
