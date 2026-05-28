"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/Toast";

export function ResetPasswordForm() {
  const router = useRouter();
  const toast = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase puts the recovery token in the URL hash. Calling getSession
    // here forces the SDK to consume it before we let the user submit.
    const supabase = createClient();
    supabase.auth.getSession().finally(() => setReady(true));
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirm) {
      toast.push("Konfirmasi password tidak sama.", "error");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast.push(error.message, "error");
        return;
      }
      toast.push("Password berhasil diubah.", "success");
      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-card" onSubmit={onSubmit}>
      <span className="eyebrow">Reset password</span>
      <h1>Atur password baru</h1>
      <p>Pastikan password kamu kuat. Minimal 8 karakter.</p>
      <label>
        Password baru
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          disabled={!ready}
        />
      </label>
      <label>
        Konfirmasi password
        <input
          type="password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          disabled={!ready}
        />
      </label>
      <button className="button gold wide" disabled={loading || !ready}>
        {loading ? "Menyimpan..." : "Simpan password baru"}
      </button>
      <div className="muted center"><Link href="/login">Batal, kembali ke login</Link></div>
    </form>
  );
}
