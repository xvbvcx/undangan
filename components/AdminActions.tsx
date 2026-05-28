"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import type { InvitationRecord, OrderRecord, ProfileRecord } from "@/lib/types";

async function callJson(endpoint: string, body: Record<string, unknown>) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const json = await response.json().catch(() => ({}));
  return { ok: response.ok, json } as const;
}

export function AdminInvitationActions({ invitation }: { invitation: InvitationRecord }) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState<string | null>(null);

  async function run(action: "delete" | "publish" | "unpublish" | "extend") {
    if (action === "delete" && !window.confirm(`Hapus undangan ${invitation.slug}?`)) return;
    setBusy(action);
    try {
      const { ok, json } = await callJson("/api/admin/invitations", {
        action,
        invitationId: invitation.id,
        days: action === "extend" ? 30 : undefined
      });
      if (!ok) { toast.push(json.error || "Gagal menjalankan aksi.", "error"); return; }
      toast.push(`Aksi ${action} sukses.`, "success");
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="admin-action-row">
      <button type="button" className="button ghost mini" onClick={() => run(invitation.is_published ? "unpublish" : "publish")} disabled={busy != null}>
        {invitation.is_published ? "Unpublish" : "Publish"}
      </button>
      <button type="button" className="button ghost mini" onClick={() => run("extend")} disabled={busy != null}>+30 hari</button>
      <button type="button" className="button danger mini" onClick={() => run("delete")} disabled={busy != null}>Hapus</button>
    </div>
  );
}

export function AdminOrderActions({ order }: { order: OrderRecord }) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState<string | null>(null);

  async function run(action: "mark_paid" | "mark_failed" | "refund") {
    if (action === "refund" && !window.confirm("Yakin refund order ini?")) return;
    setBusy(action);
    try {
      const { ok, json } = await callJson("/api/admin/orders", { action, orderId: order.id });
      if (!ok) { toast.push(json.error || "Gagal menjalankan aksi.", "error"); return; }
      toast.push(`Aksi ${action} sukses.`, "success");
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="admin-action-row">
      {order.status !== "paid" ? (
        <button type="button" className="button gold mini" onClick={() => run("mark_paid")} disabled={busy != null}>Tandai paid</button>
      ) : null}
      {order.status !== "failed" ? (
        <button type="button" className="button ghost mini" onClick={() => run("mark_failed")} disabled={busy != null}>Tandai gagal</button>
      ) : null}
      {order.status === "paid" ? (
        <button type="button" className="button danger mini" onClick={() => run("refund")} disabled={busy != null}>Refund</button>
      ) : null}
    </div>
  );
}

export function AdminProfileActions({ profile, currentUserId }: { profile: ProfileRecord; currentUserId: string }) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function run(action: "promote" | "demote") {
    if (action === "demote" && profile.id === currentUserId) {
      toast.push("Tidak bisa demote diri sendiri.", "error");
      return;
    }
    setBusy(true);
    try {
      const { ok, json } = await callJson("/api/admin/profiles", { action, userId: profile.id });
      if (!ok) { toast.push(json.error || "Gagal menjalankan aksi.", "error"); return; }
      toast.push(`Role: ${json.role}.`, "success");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-action-row">
      {profile.role === "admin" ? (
        <button type="button" className="button ghost mini" onClick={() => run("demote")} disabled={busy}>Demote</button>
      ) : (
        <button type="button" className="button gold mini" onClick={() => run("promote")} disabled={busy}>Promote</button>
      )}
    </div>
  );
}
