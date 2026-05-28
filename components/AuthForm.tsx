"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = createClient();

    const result = mode === "register"
      ? await supabase.auth.signUp({ email, password, options: { data: { username } } })
      : await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (result.error) {
      setMessage(result.error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form className="auth-card" onSubmit={onSubmit}>
      <span className="eyebrow">{mode === "register" ? "Buat akun" : "Masuk akun"}</span>
      <h1>{mode === "register" ? "Daftar Nikah Kilat" : "Masuk ke dashboard"}</h1>
      <p>{mode === "register" ? "Email, username, password. Tanpa konfirmasi email jika Confirm Email Supabase dimatikan." : "Kelola undangan, edit data, dan unlock premium dari dashboard."}</p>
      {mode === "register" ? (
        <label>Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} placeholder="contoh: raka_nadia" />
        </label>
      ) : null}
      <label>Email
        <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="email@domain.com" />
      </label>
      <label>Password
        <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" minLength={6} placeholder="Minimal 6 karakter" />
      </label>
      {message ? <div className="alert">{message}</div> : null}
      <button className="button gold wide" disabled={loading}>{loading ? "Memproses..." : mode === "register" ? "Daftar sekarang" : "Masuk"}</button>
      <div className="muted center">
        {mode === "register" ? <>Sudah punya akun? <Link href="/login">Masuk</Link></> : <>Belum punya akun? <Link href="/register">Daftar</Link></>}
      </div>
    </form>
  );
}
