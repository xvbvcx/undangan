"use client";

import { ChangeEvent, useState } from "react";

export function PhotoUploader({ urls, onChange }: { urls: string[]; onChange: (urls: string[]) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    if (urls.length + files.length > 8) {
      setError("Maksimal 8 foto per undangan.");
      return;
    }
    setLoading(true);
    setError("");
    const uploaded: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await response.json();
      if (!response.ok) {
        setError(json.error || "Upload gagal");
        break;
      }
      uploaded.push(json.url);
    }
    onChange([...urls, ...uploaded].slice(0, 8));
    setLoading(false);
    event.target.value = "";
  }

  return (
    <div className="uploader">
      <div className="photo-grid">
        {urls.map((url, index) => (
          <div key={url} className="photo-tile">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Foto ${index + 1}`} />
            <button type="button" onClick={() => onChange(urls.filter((item) => item !== url))}>Hapus</button>
          </div>
        ))}
        {urls.length < 8 ? (
          <label className="upload-tile">
            <input type="file" accept="image/*" multiple onChange={upload} disabled={loading} />
            <span>{loading ? "Upload..." : "+ Upload foto"}</span>
            <small>{urls.length}/8</small>
          </label>
        ) : null}
      </div>
      {error ? <div className="alert">{error}</div> : null}
    </div>
  );
}
