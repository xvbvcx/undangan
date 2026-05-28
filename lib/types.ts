export type TemplateTier = "free" | "premium";

export type TemplateAnimation = "soft" | "cinematic" | "editorial" | "royal";

// Distinct visual layout structure. Each maps to its own renderer component
// in components/renderers/. Adding a new layout = build a new renderer and
// add the slug here.
export type TemplateLayout =
  | "classic"
  | "floral"
  | "minimal"
  | "royal"
  | "cinematic"
  | "editorial"
  | "botanical"
  | "luxury";

// Display font bound to a template — controls the hero/heading typography.
export type TemplateFontFamily =
  | "cormorant"
  | "playfair"
  | "cinzel"
  | "italiana"
  | "bodoni"
  | "dancing";

// Cover gate style. Affects what the user sees before clicking "Buka Undangan".
export type TemplateCoverStyle =
  | "minimal"      // simple centered card
  | "ornament"     // ornament frame + names
  | "photo"        // full-bleed photo background
  | "split"        // split column with photo + names
  | "arch";        // arched window over background

// Ornament SVG style placed in corners / dividers of the invitation.
export type TemplateOrnament =
  | "rose"
  | "leaves"
  | "geometric"
  | "deco-frame"
  | "arch-frame"
  | "stars"
  | "wave";

export type TemplateMeta = {
  slug: string;
  name: string;
  tier: TemplateTier;
  category: string;
  description: string;
  palette: string;
  mood: string;
  animation: TemplateAnimation;
  accent: string;
  features: string[];
  layout: TemplateLayout;
  fontFamily: TemplateFontFamily;
  coverStyle: TemplateCoverStyle;
  ornament: TemplateOrnament;
  // Default backsound URL (relative to /public or absolute https). Admin can
  // override in the `template_music` table without touching code.
  music: string | null;
};

export type InvitationData = {
  groomName: string;
  groomNickname: string;
  brideName: string;
  brideNickname: string;
  groomFather: string;
  groomMother: string;
  brideFather: string;
  brideMother: string;
  quote: string;
  openingText: string;
  akadDate: string;
  akadTime: string;
  akadVenue: string;
  akadAddress: string;
  akadMaps: string;
  receptionDate: string;
  receptionTime: string;
  receptionVenue: string;
  receptionAddress: string;
  receptionMaps: string;
  storyTitle: string;
  story: string;
  giftBank: string;
  giftAccount: string;
  giftName: string;
  giftQris: string;
  themeColor: string;
  // Legacy field — kept optional for backward compatibility with rows created
  // before music management moved into the admin panel. Not exposed in the
  // builder anymore.
  musicUrl?: string;
};

export type PaymentStatus = "not_required" | "pending" | "paid" | "failed" | "expired";
export type PublishStatus = "draft" | "published" | "archived";
export type PackageType = "free" | "premium";

export type InvitationRecord = {
  id: string;
  user_id: string;
  slug: string;
  template_slug: string;
  template_tier: TemplateTier;
  package_type: PackageType;
  payment_status: PaymentStatus;
  status: PublishStatus;
  is_published: boolean;
  data: InvitationData;
  gallery_urls: string[];
  music_url: string | null;
  view_count: number;
  active_until: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderStatus = "pending" | "paid" | "failed" | "expired" | "refunded" | "cancelled";

export type OrderRecord = {
  id: string;
  user_id: string;
  invitation_id: string;
  amount: number;
  status: OrderStatus;
  payment_provider: string;
  reference_id: string;
  payment_url: string | null;
  raw_response: Record<string, unknown> | null;
  paid_at: string | null;
  expires_at: string | null;
  created_at: string;
};

export type ProfileRecord = {
  id: string;
  email: string | null;
  username: string | null;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
};

export type RsvpRecord = {
  id: string;
  invitation_id: string;
  guest_name: string;
  guest_slug: string | null;
  attendance: "hadir" | "tidak_hadir" | "ragu";
  guest_count: number;
  message: string | null;
  is_approved: boolean;
  created_at: string;
};

export type GuestbookRecord = {
  id: string;
  invitation_id: string;
  name: string;
  message: string;
  is_approved: boolean;
  created_at: string;
};

export type TemplateMusicRecord = {
  id: string;
  template_slug: string;
  music_url: string;
  label: string | null;
  updated_at: string;
};

export const emptyInvitationData: InvitationData = {
  groomName: "",
  groomNickname: "",
  brideName: "",
  brideNickname: "",
  groomFather: "",
  groomMother: "",
  brideFather: "",
  brideMother: "",
  quote: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri.",
  openingText: "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami.",
  akadDate: "",
  akadTime: "",
  akadVenue: "",
  akadAddress: "",
  akadMaps: "",
  receptionDate: "",
  receptionTime: "",
  receptionVenue: "",
  receptionAddress: "",
  receptionMaps: "",
  storyTitle: "Cerita Kami",
  story: "Kami bertemu, saling mengenal, dan percaya bahwa setiap langkah membawa kami menuju hari ini.",
  giftBank: "",
  giftAccount: "",
  giftName: "",
  giftQris: "",
  themeColor: "gold"
};
