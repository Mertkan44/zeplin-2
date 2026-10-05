/*
 * Özel Yazılım demosunun ortak arayüz parçaları. Etkileşim içermez; hem sunucuda
 * render edilen açılış önizlemesi hem de istemcideki çalışan demo kullanır.
 * Durum hiçbir yerde yalnızca renkle anlatılmaz: her rozet ikon + metin taşır.
 */

import type { ReactNode } from "react";

export type Tone = "neutral" | "progress" | "accent" | "success" | "attention";

const TONE_CLS: Record<Tone, string> = {
  neutral: "border-white/15 bg-white/[0.06] text-[#D6D5DE]",
  progress: "border-sky-300/30 bg-sky-300/10 text-sky-200",
  accent: "border-[#F472B6]/35 bg-[#DB2777]/15 text-[#F9A8D4]",
  success: "border-emerald-300/35 bg-emerald-400/10 text-emerald-200",
  attention: "border-amber-300/40 bg-amber-300/10 text-amber-200",
};

export function ToneIcon({ tone, className = "" }: { tone: Tone; className?: string }) {
  const common = { width: 12, height: 12, viewBox: "0 0 12 12", "aria-hidden": true, className } as const;
  if (tone === "success")
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 6.2 5 8.6l4.5-5" />
      </svg>
    );
  if (tone === "attention")
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <path d="M6 2.5v4.2M6 9.2v.3" />
      </svg>
    );
  if (tone === "progress")
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="6" cy="6" r="4" />
        <path d="M6 2a4 4 0 0 1 0 8z" fill="currentColor" stroke="none" />
      </svg>
    );
  if (tone === "accent")
    return (
      <svg {...common} fill="currentColor">
        <circle cx="6" cy="6" r="3" />
      </svg>
    );
  return (
    <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="6" cy="6" r="3.2" />
    </svg>
  );
}

export function StatusBadge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[12px] font-medium leading-none ${TONE_CLS[tone]}`}
    >
      <ToneIcon tone={tone} />
      {children}
    </span>
  );
}

/** Koyu demo çerçevesi: üst çubuk + sabit "örnek veri" etiketi */
export function DemoChrome({
  title,
  label = "İnteraktif demo · örnek veriler",
  actions,
  children,
}: {
  title: string;
  label?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[#3B3946] bg-[#111116] text-[#F4F4F6] shadow-[0_30px_80px_rgba(17,17,22,0.28)]">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[#3B3946] bg-[#16161D] px-4 py-3 md:px-5">
        <span className="flex items-center gap-2 text-[13px] font-semibold text-white">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-[#DB2777] text-[11px] font-bold">Z</span>
          {title}
        </span>
        <span className="rounded-full border border-[#F472B6]/40 bg-[#DB2777]/10 px-2.5 py-1 text-[12px] font-medium text-[#F9A8D4]">
          {label}
        </span>
        {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export function PaneTitle({ children, count }: { children: ReactNode; count?: number }) {
  return (
    <p className="mb-3 flex items-center justify-between text-[12px] font-semibold uppercase tracking-[0.14em] text-[#B5B4C0]">
      <span>{children}</span>
      {count !== undefined && <span className="tabular-nums tracking-normal text-[#8E8D99]">{count}</span>}
    </p>
  );
}

export interface ListRow {
  id: string;
  title: string;
  source: string;
  status: string;
  tone: Tone;
  selected?: boolean;
}

/** Gelen kayıtlar listesi. Satırlar bilinçli olarak tıklanamaz (işlevsiz düğme yok). */
export function RecordList({ rows }: { rows: ListRow[] }) {
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li
          key={r.id}
          aria-current={r.selected ? "true" : undefined}
          className={`rounded-xl border px-3.5 py-3 ${
            r.selected ? "border-[#DB2777]/60 bg-[#DB2777]/[0.08]" : "border-[#3B3946] bg-[#1C1C24]"
          }`}
        >
          <p className={`text-[14px] leading-snug ${r.selected ? "font-semibold text-white" : "text-[#D6D5DE]"}`}>{r.title}</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[12px] text-[#8E8D99]">{r.source}</span>
            <StatusBadge tone={r.tone}>{r.status}</StatusBadge>
          </div>
        </li>
      ))}
    </ul>
  );
}

export interface ActivityItem {
  id: string;
  label: string;
  kind: "info" | "success" | "attention";
}

const KIND_TONE: Record<ActivityItem["kind"], Tone> = { info: "neutral", success: "success", attention: "attention" };
const KIND_TEXT: Record<ActivityItem["kind"], string> = {
  info: "text-[#D6D5DE]",
  success: "text-emerald-200",
  attention: "text-amber-200",
};

/** İşlem geçmişi: en yeni üstte */
export function ActivityList({ items }: { items: ActivityItem[] }) {
  return (
    <ol className="space-y-3">
      {[...items].reverse().map((a, i) => (
        <li key={a.id} className="flex gap-3">
          <span
            className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
              TONE_CLS[KIND_TONE[a.kind]]
            } ${i === 0 ? "" : "opacity-70"}`}
          >
            <ToneIcon tone={KIND_TONE[a.kind]} />
          </span>
          <span className={`text-[13.5px] leading-snug ${KIND_TEXT[a.kind]} ${i === 0 ? "" : "opacity-75"}`}>{a.label}</span>
        </li>
      ))}
    </ol>
  );
}

/** Kayıt bilgisi satırı (etiket : değer) */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-[#3B3946]/70 py-2.5 text-[14px] last:border-b-0">
      <span className="text-[#8E8D99]">{label}</span>
      <span className="text-right font-medium text-[#F4F4F6]">{children}</span>
    </div>
  );
}
