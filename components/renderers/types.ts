import type { InvitationData, InvitationRecord, TemplateMeta } from "@/lib/types";

// Shared props shape for every layout component. The invitation may be a
// partial record (preview data uses dummy fixtures), but `data` is always
// pre-filled with defaults by the parent renderer so layouts can dereference
// fields without null-checks.
export type LayoutProps = {
  invitation: Partial<InvitationRecord> & { id?: string };
  template: TemplateMeta;
  data: InvitationData;
  preview?: boolean;
  guestName?: string;
  guestSlug?: string;
  musicUrl: string | null;
  opened: boolean;
  onOpen: () => void;
};
