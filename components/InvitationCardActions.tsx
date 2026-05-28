"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import type { InvitationRecord } from "@/lib/types";

export function InvitationCardActions({ invitation }: { invitation: InvitationRecord }) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState<"" | "delete" | "extend" | "share">("");

  async function remove() {
    if (typeof window !== "undefined" && !window.confirm("Yakin hapus undangan ini? Aksi tidak bisa dibatalkan.")) return;
    setBusy("delete");
    try {
      const response = await fetch(`/api/invitations/${invitation.id}`, { method: "DELETE" });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.push(json.error || "Gagal menghapus.", "error");
        return;
      }
      toast.push(json.archived ? "Undangan diarsipkan." : "Undangan dihapus.", "success");
      router.refresh();
    } finally {
      setBusy("");
    }
  }

  async function extend() {
    setBusy("extend");
    try {
      const response = await fetch(`/api/invitations/${invitation.id}/extend`, { method: "POST" });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.push(json.error || "Gagal extend.", "error");
        return;
      }
      if (json.paymentUrl) {
        window.location.href = json.paymentUrl;
        return;
      }
      toast.push("Masa aktif diperpanjang 30 hari.", "success");
      router.refresh();
    } finally {
      setBusy("");
    }
  }

  function share() {
    setBusy("share");
    const siteUrl = typeof window !== "undefined" ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL ?? "");
    const url = `${siteUrl}/u/${invitation.slug}`;
    navigator.clipboard.writeText(url).then(
      () => toast.push("Link disalin.", "success"),
      () => toast.push("Gagal menyalin.", "error")
    );
    setBusy("");
  }

  return (
    <div className="card-actions">
      <Link href={`/edit/${invitation.id}`} className="button ghost">Edit</Link>
      <Link href={`/u/${invitation.slug}`} className="button dark">Lihat</Link>
      <button type="button" className="button ghost" onClick={share} disabled={busy === "share"}>Salin link</button>
      <button type="button" className="button ghost" onClick={extend} disabled={busy === "extend"}>
        {busy === "extend" ? "Memproses..." : "Perpanjang 30 hari"}
      </button>
      <button type="button" className="button danger" onClick={remove} disabled={busy === "delete"}>
        {busy === "delete" ? "Menghapus..." : "Hapus"}
      </button>
    </div>
  );
}
