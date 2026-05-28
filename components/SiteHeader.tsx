import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const supabase = await createClient();
  let userEmail: string | null = null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    userEmail = user?.email ?? null;
  } catch {
    // Render unauthenticated state when env vars are missing.
  }

  return (
    <header className="site-header">
      <Link href="/" className="brand-mark" aria-label="Nikah Kilat">
        <span className="brand-orb">NK</span>
        <span>
          <strong>Nikah Kilat</strong>
          <small>Undangan digital ultra eksklusif</small>
        </span>
      </Link>
      <nav className="top-nav" aria-label="Navigasi utama">
        <Link href="/templates-page">Template</Link>
        <Link href="/#harga">Harga</Link>
        {userEmail ? (
          <Link href="/dashboard" className="nav-cta">Dashboard</Link>
        ) : (
          <>
            <Link href="/login">Masuk</Link>
            <Link href="/register" className="nav-cta">Daftar</Link>
          </>
        )}
      </nav>
    </header>
  );
}
