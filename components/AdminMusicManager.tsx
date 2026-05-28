"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import type { TemplateMeta, TemplateMusicRecord } from "@/lib/types";

type Override = Pick<TemplateMusicRecord, "template_slug" | "music_url" | "label" | "updated_at">;

const PRESET_AUDIO = [
  { value: "/audio/soft-wedding-chime.wav", label: "Soft Wedding Chime" },
  { value: "/audio/royal-opening-chime.wav", label: "Royal Opening Chime" },
  { value: "/audio/garden-love-chime.wav", label: "Garden Love Chime" }
];

export function AdminMusicManager({ templates }: { templates: TemplateMeta[] }) {
  const toast = useToast();
  const router = useRouter();

  const [overrides, setOverrides] = useState<Override[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const [templateSlug, setTemplateSlug] = useState(templates[0]?.slug ?? "");
  const [musicUrl, setMusicUrl] = useState("");
  const [label, setLabel] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { void load(); }, []);

  async function load() {
    setLoadingList(true);
    try {
      const response = await fetch("/api/admin/template-music");
      const json = await response.json().catch(() => ({}));
      if (response.ok && Array.isArray(json.overrides)) setOverrides(json.overrides);
    } finally {
      setLoadingList(false);
    }
  }

  // Map slug -> override for fast lookup when rendering the per-template grid.
  const overrideMap = useMemo(() => {
    const m = new Map<string, Override>();
    for (const o of overrides) m.set(o.template_slug, o);
    return m;
  }, [overrides]);

  async function uploadAudio(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const response = await fetch("/api/admin/audio", { method: "POST", body: fd });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.push(json.error || "Upload gagal.", "error");
        return;
      }
      setMusicUrl(json.url);
      if (!label) setLabel(file.name.replace(/\.[^.]+$/, ""));
      toast.push("Audio terupload.", "success");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!templateSlug || !musicUrl) {
      toast.push("Pilih template dan masukkan URL musik.", "error");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/template-music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateSlug, musicUrl, label })
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.push(json.error || "Gagal menyimpan.", "error");
        return;
      }
      toast.push("Override musik disimpan.", "success");
      setMusicUrl("");
      setLabel("");
      await load();
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  async function clearOverride(slug: string) {
    if (!window.confirm(`Hapus override musik untuk ${slug}?`)) return;
    const response = await fetch("/api/admin/template-music", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateSlug: slug })
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      toast.push(json.error || "Gagal menghapus.", "error");
      return;
    }
    toast.push("Override dihapus, kembali ke default template.", "success");
    await load();
  }

  return (
    <section className="admin-table-section">
      <h2>Manajemen musik template</h2>
      <p className="muted">Set backsound per template. Customer tidak bisa input musik sendiri — yang ditampilkan di undangan adalah override ini, atau musik default template kalau belum di-set.</p>

      <form className="admin-music-form" onSubmit={submit}>
        <label>
          Template
          <select value={templateSlug} onChange={(e) => setTemplateSlug(e.target.value)}>
            {templates.map((tpl) => (
              <option key={tpl.slug} value={tpl.slug}>{tpl.tier === "premium" ? "★ " : ""}{tpl.name} — {tpl.slug}</option>
            ))}
          </select>
        </label>
        <label>
          Music URL
          <input type="url" value={musicUrl} onChange={(e) => setMusicUrl(e.target.value)} placeholder="https://...mp3 atau /audio/..." pattern="(https?://.*|/audio/.*)" />
        </label>
        <label>
          Label (opsional)
          <input value={label} onChange={(e) => setLabel(e.target.value)} maxLength={120} placeholder="Soft Romantic Piano" />
        </label>
        <div className="admin-music-actions">
          <label className="button ghost upload-button">
            <input type="file" accept="audio/*" onChange={uploadAudio} disabled={uploading} />
            {uploading ? "Upload..." : "Upload audio"}
          </label>
          <div className="presets">
            {PRESET_AUDIO.map((preset) => (
              <button
                key={preset.value}
                type="button"
                className="button ghost mini"
                onClick={() => { setMusicUrl(preset.value); if (!label) setLabel(preset.label); }}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <button type="submit" className="button gold" disabled={submitting || uploading}>
            {submitting ? "Menyimpan..." : "Simpan override"}
          </button>
        </div>
      </form>

      {musicUrl ? (
        <div className="admin-music-preview">
          <span className="muted">Preview:</span>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio src={musicUrl} controls preload="metadata" />
        </div>
      ) : null}

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Template</th><th>Tier</th><th>Default</th><th>Override</th><th>Label</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {loadingList ? (
              <tr><td colSpan={6} className="muted">Memuat...</td></tr>
            ) : templates.map((tpl) => {
              const override = overrideMap.get(tpl.slug);
              return (
                <tr key={tpl.slug}>
                  <td>{tpl.name} <small className="muted">({tpl.slug})</small></td>
                  <td>{tpl.tier}</td>
                  <td><code className="muted">{tpl.music ?? "—"}</code></td>
                  <td>{override ? <code>{override.music_url}</code> : <span className="muted">default</span>}</td>
                  <td>{override?.label ?? "—"}</td>
                  <td>
                    {override ? (
                      <button type="button" className="button danger mini" onClick={() => clearOverride(tpl.slug)}>Hapus override</button>
                    ) : (
                      <button type="button" className="button ghost mini" onClick={() => { setTemplateSlug(tpl.slug); setMusicUrl(""); setLabel(""); }}>Pilih</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
