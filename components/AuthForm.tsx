"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/Toast";

type Mode = "login" | "register";

const SAFE_NEXT_REGEX = /^\/(?!\/)[A-Za-z0-9_\-/?=&%.#]*$/;

function safeNext(value: string | null): string {
  if (!value) return "/dashboard";
  return SAFE_NEXT_REGEX.test(value) ? value : "/dashboard";
}

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams?.get("next") ?? null);
  const toast = useToast();

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

    try {
      const result = mode === "register"
        ? await supabase.auth.signUp({ email, password, options: { data: { username } } })
        : await supabase.auth.signInWithPassword({ email, password });

      if (result.error) {
        setMessage(result.error.message);
        toast.push(result.error.message, "error");
        return;
      }
      toast.push(mode === "register" ? "Akun berhasil dibuat." : "Berhasil masuk.", "success");
      router.push(next);
      router.refresh();
    } catch (err) {
      const fallback = err instanceof Error ? err.message : "Terjadi kesalahan jaringan.";
      setMessage(fallback);
      toast.push(fallback, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-card" onSubmit={onSubmit}>
      <span className="eyebrow">{mode === "register" ? "Buat akun" : "Masuk akun"}</span>
      <h1>{mode === "register" ? "Daftar Nikah Kilat" : "Masuk ke dashboard"}</h1>
      <p>
        {mode === "register"
          ? "Email, username, dan password. Username akan diatur otomatis kalau bentrok."
          : "Kelola undangan, edit data, dan unlock premium dari dashboard."}
      </p>
      {mode === "register" ? (
        <label>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            maxLength={32}
            pattern="[A-Za-z0-9_\-]+"
            placeholder="contoh: raka_nadia"
            autoComplete="username"
          />
        </label>
      ) : null}
      <label>
        Email
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          placeholder="email@domain.com"
          autoComplete={mode === "register" ? "email" : "username"}
          inputMode="email"
        />
      </label>
      <label>
        Password
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          type="password"
          minLength={8}
          placeholder="Minimal 8 karakter"
          autoComplete={mode === "register" ? "new-password" : "current-password"}
        />
      </label>
      {message ? <div className="alert" role="alert">{message}</div> : null}
      <button className="button gold wide" disabled={loading}>
        {loading ? "Memproses..." : mode === "register" ? "Daftar sekarang" : "Masuk"}
      </button>
      <div className="muted center auth-links">
        {mode === "register" ? (
          <>Sudah punya akun? <Link href={`/login${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`}>Masuk</Link></>
        ) : (
          <>
            <Link href="/forgot-password" className="muted">Lupa password?</Link>
            <span className="dot">•</span>
            Belum punya akun? <Link href={`/register${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`}>Daftar</Link>
          </>
        )}
      </div>
    </form>
  );
}
