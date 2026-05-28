import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand-mark" aria-label="Nikah Kilat">
        <span className="brand-orb">NK</span>
        <span>
          <strong>Nikah Kilat</strong>
          <small>Undangan digital ultra eksklusif</small>
        </span>
      </Link>
      <nav className="top-nav">
        <Link href="/#template">Template</Link>
        <Link href="/#harga">Harga</Link>
        <Link href="/login">Masuk</Link>
        <Link href="/register" className="nav-cta">Daftar</Link>
      </nav>
    </header>
  );
}
