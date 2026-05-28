import { z } from "zod";
import { isSafeExternalUrl, isValidSlug, slugReason } from "@/lib/sanitize";

const safeText = (max: number) =>
  z.string()
    .transform((value) => value.replace(/[\u0000-\u001F\u007F]/g, "").trim())
    .pipe(z.string().max(max));

const optionalSafeText = (max: number) =>
  z.string().optional().transform((value) => (value ?? "").replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, max));

const safeUrlField = z.string().optional().transform((value) => {
  if (!value) return "";
  return isSafeExternalUrl(value) ? value.trim() : "";
});

const optionalDate = z.string().optional().transform((value) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return value.trim().slice(0, 32);
});

// Customer-facing schema. `musicUrl` is intentionally omitted — music is now
// admin-managed per template. The schema uses `passthrough` so legacy rows
// that still carry `musicUrl` aren't rejected on edit.
export const invitationDataSchema = z.object({
  groomName: safeText(80),
  groomNickname: optionalSafeText(40),
  brideName: safeText(80),
  brideNickname: optionalSafeText(40),
  groomFather: optionalSafeText(80),
  groomMother: optionalSafeText(80),
  brideFather: optionalSafeText(80),
  brideMother: optionalSafeText(80),
  quote: optionalSafeText(600),
  openingText: optionalSafeText(800),
  akadDate: optionalDate,
  akadTime: optionalSafeText(40),
  akadVenue: optionalSafeText(160),
  akadAddress: optionalSafeText(280),
  akadMaps: safeUrlField,
  receptionDate: optionalDate,
  receptionTime: optionalSafeText(80),
  receptionVenue: optionalSafeText(160),
  receptionAddress: optionalSafeText(280),
  receptionMaps: safeUrlField,
  storyTitle: optionalSafeText(80),
  story: optionalSafeText(2000),
  giftBank: optionalSafeText(80),
  giftAccount: optionalSafeText(80),
  giftName: optionalSafeText(80),
  giftQris: safeUrlField,
  themeColor: optionalSafeText(24)
}).passthrough();

export const slugSchema = z.string().transform((value) => value.trim().toLowerCase()).superRefine((value, ctx) => {
  const reason = slugReason(value);
  if (reason) ctx.addIssue({ code: z.ZodIssueCode.custom, message: reason });
});

export const galleryUrlsSchema = z.array(
  z.string().refine((url) => {
    if (url.startsWith("/")) return true;
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
      return false;
    }
  }, "URL galeri tidak valid")
).max(8);

export const invitationCreateSchema = z.object({
  templateSlug: z.string().min(3).max(64),
  slug: slugSchema,
  data: invitationDataSchema,
  galleryUrls: galleryUrlsSchema.default([]),
  isPublished: z.boolean().default(true)
});

export const invitationUpdateSchema = z.object({
  slug: slugSchema,
  data: invitationDataSchema,
  galleryUrls: galleryUrlsSchema.default([]),
  isPublished: z.boolean().default(true)
});

export const rsvpSchema = z.object({
  invitationId: z.string().uuid(),
  name: safeText(120),
  attendance: z.enum(["hadir", "tidak_hadir", "ragu"]),
  guestCount: z.coerce.number().int().min(1).max(20).default(1),
  message: optionalSafeText(800),
  guestSlug: optionalSafeText(80)
});

export const guestbookSchema = z.object({
  invitationId: z.string().uuid(),
  name: safeText(120),
  message: safeText(800)
});

export const adminInvitationActionSchema = z.object({
  action: z.enum(["delete", "unpublish", "publish", "extend"]),
  invitationId: z.string().uuid(),
  days: z.coerce.number().int().min(1).max(365).optional()
});

export const adminOrderActionSchema = z.object({
  action: z.enum(["mark_paid", "mark_failed", "refund"]),
  orderId: z.string().uuid()
});

export const adminProfileActionSchema = z.object({
  action: z.enum(["promote", "demote"]),
  userId: z.string().uuid()
});

// Admin sets/clears music for a given template.
export const adminTemplateMusicSchema = z.object({
  templateSlug: z.string().min(3).max(64),
  musicUrl: z.string().max(500).refine((value) => {
    if (!value) return false;
    if (value.startsWith("/audio/")) return true;
    try {
      const parsed = new URL(value);
      return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
      return false;
    }
  }, "URL musik harus http(s) atau path /audio/..."),
  label: optionalSafeText(120)
});

export const adminTemplateMusicDeleteSchema = z.object({
  templateSlug: z.string().min(3).max(64)
});

export function reasonFromZod(error: z.ZodError): string {
  const issue = error.issues[0];
  if (!issue) return "Data tidak valid.";
  const path = issue.path.join(".");
  return path ? `${path}: ${issue.message}` : issue.message;
}

export { isValidSlug };
