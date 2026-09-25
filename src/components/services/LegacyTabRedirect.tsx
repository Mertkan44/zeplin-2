"use client";

import { useEffect } from "react";
import { LEGACY_TAB_IDS, SERVICE_GROUPS } from "@/data/services";

/**
 * Eski sekme adresleri (/hizmetler?tab=otomasyon, ?tab=web …) paylaşılmış olabilir.
 * Sayfa artık sekme değil bölüm kullanıyor: parametreyi ilgili bölüme (#id) çevirir.
 */
export default function LegacyTabRedirect() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const raw = url.searchParams.get("tab");
    if (!raw) return;
    const id = LEGACY_TAB_IDS[raw] ?? raw;
    url.searchParams.delete("tab");
    if (SERVICE_GROUPS.some((g) => g.id === id)) url.hash = id;
    window.history.replaceState(null, "", url);
    document.getElementById(id)?.scrollIntoView();
  }, []);
  return null;
}
