"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/Toast";

export function ForgotPasswordForm() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/reset-password`
      });
      if (error) {
        toast.push(error.message, "error");
        return;
      }
      setSent(true);
      toast.push("Email reset password sudah dikirim.", "success");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="auth-card">
        <span className="eyebrow">Cek email kamu</span>
        <h1>Link reset terkirim.</h1>
        <p>Kalau email di atas terdaftar, kami sudah kirim link untuk atur ulang password. Cek folder inbox dan promosi.</p>
        <Link href="/login" className="button ghost wide">Kembali ke login</Link>
      </div>
    );
  }

  return (
    <form className="auth-card" onSubmit={onSubmit}>
      <span className="eyebrow">Lupa password</span>
      <h1>Reset password</h1>
      <p>Masukkan email yang kamu pakai untuk daftar. Kami akan kirim link reset.</p>
      <label>
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@domain.com"
          autoComplete="email"
        />
      </label>
      <button className="button gold wide" disabled={loading}>{loading ? "Mengirim..." : "Kirim link reset"}</button>
      <div className="muted center"><Link href="/login">Ingat passwordnya? Masuk</Link></div>
    </form>
  );
}
