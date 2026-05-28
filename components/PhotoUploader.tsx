"use client";

import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import { useToast } from "@/components/Toast";

const MAX_PHOTOS = 8;

export function PhotoUploader({ urls, onChange }: { urls: string[]; onChange: (urls: string[]) => void }) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const remaining = Math.max(0, MAX_PHOTOS - urls.length);
    if (files.length > remaining) {
      toast.push(`Maksimal ${MAX_PHOTOS} foto, sisa ${remaining}.`, "error");
      if (remaining === 0) {
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
    }

    const slice = files.slice(0, remaining);
    setLoading(true);
    setProgress({ done: 0, total: slice.length });
    const uploaded: string[] = [];

    for (const file of slice) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const response = await fetch("/api/upload", { method: "POST", body: formData });
        const json = await response.json().catch(() => ({}));
        if (!response.ok) {
          toast.push(json.error || "Upload gagal.", "error");
          break;
        }
        uploaded.push(json.url);
      } catch {
        toast.push("Network error saat upload.", "error");
        break;
      } finally {
        setProgress((p) => ({ ...p, done: p.done + 1 }));
      }
    }

    if (uploaded.length) {
      onChange([...urls, ...uploaded].slice(0, MAX_PHOTOS));
      toast.push(`${uploaded.length} foto terupload.`, "success");
    }
    setLoading(false);
    setProgress({ done: 0, total: 0 });
    if (inputRef.current) inputRef.current.value = "";
  }

  async function remove(url: string) {
    if (typeof window !== "undefined" && !window.confirm("Hapus foto ini?")) return;
    onChange(urls.filter((item) => item !== url));
    // Best-effort delete from storage. Even if it fails, we already removed
    // the URL from the form state so the user keeps moving.
    fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    }).catch(() => {});
  }

  return (
    <div className="uploader">
      <div className="photo-grid">
        {urls.map((url, index) => (
          <div key={url} className="photo-tile">
            <Image
              src={url}
              alt={`Foto ${index + 1}`}
              width={320}
              height={320}
              sizes="(max-width: 520px) 50vw, 25vw"
              className="photo-image"
              loading="lazy"
            />
            <button type="button" onClick={() => remove(url)} aria-label={`Hapus foto ${index + 1}`}>Hapus</button>
          </div>
        ))}
        {urls.length < MAX_PHOTOS ? (
          <label className="upload-tile">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              multiple
              onChange={upload}
              disabled={loading}
            />
            <span>{loading ? `Upload ${progress.done}/${progress.total}...` : "+ Upload foto"}</span>
            <small>{urls.length}/{MAX_PHOTOS}</small>
          </label>
        ) : null}
      </div>
      <p className="muted">Format JPEG/PNG/WebP/HEIC, max 8MB. Otomatis dikompres ke WebP.</p>
    </div>
  );
}
