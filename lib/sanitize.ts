// URL hardening helpers. Used to keep user-supplied URLs (Google Maps links,
// custom backsound URL, etc.) free from `javascript:` / `data:` scheme XSS.

const ALLOWED_URL_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);
const ALLOWED_AUDIO_PROTOCOLS = new Set(["http:", "https:"]);

export function isSafeExternalUrl(input: string | null | undefined): boolean {
  if (!input) return false;
  const trimmed = input.trim();
  if (!trimmed) return false;
  // Local app-relative URLs (e.g. /audio/xxx) are always safe.
  if (trimmed.startsWith("/")) return !trimmed.startsWith("//");
  try {
    const parsed = new URL(trimmed);
    return ALLOWED_URL_PROTOCOLS.has(parsed.protocol.toLowerCase());
  } catch {
    return false;
  }
}

export function safeUrl(input: string | null | undefined): string {
  if (!input) return "";
  return isSafeExternalUrl(input) ? input.trim() : "";
}

export function isSafeAudioUrl(input: string | null | undefined): boolean {
  if (!input) return false;
  const trimmed = input.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/audio/")) return true;
  try {
    const parsed = new URL(trimmed);
    return ALLOWED_AUDIO_PROTOCOLS.has(parsed.protocol.toLowerCase());
  } catch {
    return false;
  }
}

export function safeAudioUrl(input: string | null | undefined): string {
  if (!input) return "";
  return isSafeAudioUrl(input) ? input.trim() : "";
}

// Removes control characters and trims. Use for plain text fields persisted as JSON.
export function sanitizeText(input: string | null | undefined, maxLength = 500): string {
  if (!input) return "";
  return input
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

// Slug helpers — stricter than the client-side `makeSlug` and used as the
// authoritative validator at the API boundary.
const SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]{1,62}[a-z0-9])?$/;
const RESERVED_SLUGS = new Set([
  "admin", "api", "auth", "buat", "create", "dashboard", "edit", "forgot",
  "invitation", "invitations", "login", "logout", "media", "my", "new",
  "order", "orders", "owner", "payment", "preview", "register", "reset",
  "rsvp", "settings", "share", "sign-in", "sign-up", "signin", "signup",
  "templates", "template", "u", "user", "users", "well-known"
]);

export function isValidSlug(slug: string): boolean {
  if (!slug) return false;
  if (RESERVED_SLUGS.has(slug)) return false;
  if (slug.length < 3 || slug.length > 64) return false;
  return SLUG_REGEX.test(slug);
}

export function slugReason(slug: string): string | null {
  if (!slug || slug.length < 3) return "Slug minimal 3 karakter.";
  if (slug.length > 64) return "Slug maksimal 64 karakter.";
  if (!SLUG_REGEX.test(slug)) return "Slug hanya boleh huruf kecil, angka, dan tanda hubung.";
  if (RESERVED_SLUGS.has(slug)) return "Slug ini dipakai sistem. Pilih yang lain.";
  return null;
}
