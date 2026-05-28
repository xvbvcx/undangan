import Link from "next/link";

export default function PaymentCancelPage() {
  return <main className="status-page"><div className="status-card"><span className="warning-icon">!</span><h1>Pembayaran dibatalkan.</h1><p>Kamu masih bisa unlock premium dari dashboard kapan saja.</p><Link href="/dashboard" className="button gold">Kembali ke dashboard</Link></div></main>;
}
