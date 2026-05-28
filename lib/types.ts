export type TemplateTier = "free" | "premium";

export type TemplateMeta = {
  slug: string;
  name: string;
  tier: TemplateTier;
  category: string;
  description: string;
  palette: string;
  mood: string;
  animation: "soft" | "cinematic" | "editorial" | "royal";
  accent: string;
  features: string[];
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
  musicUrl: string;
  themeColor: string;
};

export type InvitationRecord = {
  id: string;
  user_id: string;
  slug: string;
  template_slug: string;
  template_tier: TemplateTier;
  package_type: "free" | "premium";
  payment_status: "not_required" | "pending" | "paid" | "failed" | "expired";
  status: "draft" | "published" | "archived";
  is_published: boolean;
  data: InvitationData;
  gallery_urls: string[];
  music_url: string | null;
  active_until: string | null;
  created_at: string;
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
  musicUrl: "/audio/soft-wedding-chime.wav",
  themeColor: "gold"
};
