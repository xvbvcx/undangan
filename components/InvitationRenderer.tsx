"use client";

import { useEffect, useMemo, useState } from "react";
import type { InvitationData, InvitationRecord, TemplateMeta } from "@/lib/types";
import { emptyInvitationData } from "@/lib/types";
import { safeAudioUrl } from "@/lib/sanitize";
import { ClassicLayout } from "@/components/renderers/ClassicLayout";
import { FloralLayout } from "@/components/renderers/FloralLayout";
import { MinimalLayout } from "@/components/renderers/MinimalLayout";
import { RoyalLayout } from "@/components/renderers/RoyalLayout";
import { CinematicLayout } from "@/components/renderers/CinematicLayout";
import { EditorialLayout } from "@/components/renderers/EditorialLayout";
import type { LayoutProps } from "@/components/renderers/types";

type Props = {
  invitation: Partial<InvitationRecord> & { id?: string };
  template: TemplateMeta;
  preview?: boolean;
  guestName?: string;
  guestSlug?: string;
  // Optional admin-managed music override resolved server-side. Falls back to
  // the template's default music when null/undefined.
  musicOverride?: string | null;
};

function fillInvitationData(raw: Partial<InvitationData> | undefined | null): InvitationData {
  return { ...emptyInvitationData, ...(raw ?? {}) };
}

// Maps template.layout -> layout component. Adding a new layout = create a
// component in components/renderers/, register it here, add palette/font
// CSS in globals.css, and ship it.
function LayoutDispatcher(props: LayoutProps) {
  switch (props.template.layout) {
    case "classic":   return <ClassicLayout {...props} />;
    case "floral":    return <FloralLayout {...props} />;
    case "botanical": return <FloralLayout {...props} />;
    case "minimal":   return <MinimalLayout {...props} />;
    case "royal":     return <RoyalLayout {...props} />;
    case "luxury":    return <RoyalLayout {...props} />;
    case "cinematic": return <CinematicLayout {...props} />;
    case "editorial": return <EditorialLayout {...props} />;
    default:          return <ClassicLayout {...props} />;
  }
}

export function InvitationRenderer({ invitation, template, preview = false, guestName, guestSlug, musicOverride }: Props) {
  const data = useMemo(() => fillInvitationData(invitation.data), [invitation.data]);
  const [opened, setOpened] = useState(false);

  // Resolve music in priority order: admin override -> template default ->
  // legacy musicUrl saved on the invitation -> nothing.
  const musicUrl = useMemo(() => {
    const candidate = musicOverride ?? template.music ?? data.musicUrl ?? null;
    return safeAudioUrl(candidate);
  }, [musicOverride, template.music, data.musicUrl]);

  // Persist gate state per-invitation so refresh doesn't kick the guest back.
  useEffect(() => {
    if (preview || !invitation.id) return;
    if (typeof window === "undefined") return;
    const key = `invite-opened:${invitation.id}`;
    if (window.sessionStorage.getItem(key) === "1") setOpened(true);
  }, [invitation.id, preview]);

  useEffect(() => {
    if (!opened || preview || !invitation.id) return;
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(`invite-opened:${invitation.id}`, "1");
  }, [opened, invitation.id, preview]);

  // Bump the view counter exactly once per gate open.
  useEffect(() => {
    if (!opened || preview || !invitation.id) return;
    void fetch("/api/page-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invitationId: invitation.id, guestSlug })
    }).catch(() => {});
  }, [opened, invitation.id, preview, guestSlug]);

  const safeGuestName = useMemo(() => (guestName ?? "").trim().slice(0, 80), [guestName]);
  const layoutClass = `invite-page invite-${template.tier === "premium" ? "premium" : "free"} layout-${template.layout} font-${template.fontFamily} cover-${template.coverStyle} ornament-${template.ornament} palette-${template.palette} animation-${template.animation}`;

  return (
    <div className={layoutClass} style={{ "--accent": template.accent } as React.CSSProperties}>
      <LayoutDispatcher
        invitation={invitation}
        template={template}
        data={data}
        preview={preview}
        guestName={safeGuestName || undefined}
        guestSlug={guestSlug}
        musicUrl={musicUrl || null}
        opened={opened}
        onOpen={() => setOpened(true)}
      />
    </div>
  );
}
