"use client";

/*
 * Özel Yazılım — çalışan örnek sistem.
 * Tamamen tarayıcıda, deterministik çalışır: sunucu, API ya da rastgele sayı yok.
 * Bütün geçişler tek reducer'da; "işleniyor" adımı kısa bir zamanlayıcıyla biter ve
 * senaryo değişince/sıfırlanınca temizlenir (eski sonucun yeni ekrana düşmemesi için).
 */

import Link from "next/link";
import { useEffect, useReducer, useRef, useState, type KeyboardEvent } from "react";
import {
  DEMO_ASSIGNEES,
  DEMO_CHECKS,
  DEMO_REVISION_NOTES,
  SCENARIOS,
  softwareContactHref,
  type DemoCheckId,
  type ScenarioId,
} from "@/data/software";
import {
  ActivityList,
  DemoChrome,
  Field,
  PaneTitle,
  RecordList,
  StatusBadge,
  type ActivityItem,
  type ListRow,
  type Tone,
} from "./ui";

/* ── Durum ────────────────────────────────────────────────────────── */

type Status = "idle" | "processing" | "awaiting-approval" | "revision-requested" | "completed";
type Pending = "convert" | "assign" | "approve" | "revise" | "complete";

interface State {
  scenario: ScenarioId;
  status: Status;
  pending: Pending | null;
  /** İşlem bitince dönülecek durum (işleniyor öncesi) */
  before: Status;
  seq: number;
  activity: ActivityItem[];
  error: string | null;
  announce: string;
  // A — talep
  recordNo: string | null;
  assignee: string | null;
  // B — portal
  previewOpen: boolean;
  revising: boolean;
  note: string | null;
  decision: "approved" | "revision" | null;
  // C — operasyon
  checks: Record<DemoCheckId, boolean>;
}

type Action =
  | { type: "scenario"; id: ScenarioId }
  | { type: "reset" }
  | { type: "finish" }
  | { type: "convert" }
  | { type: "assignee"; id: string }
  | { type: "assign" }
  | { type: "open-preview" }
  | { type: "approve" }
  | { type: "ask-revision" }
  | { type: "cancel-revision" }
  | { type: "note"; note: string }
  | { type: "send-revision" }
  | { type: "toggle"; id: DemoCheckId }
  | { type: "complete" };

const SEED: Record<ScenarioId, Omit<ActivityItem, "id">[]> = {
  "lead-flow": [{ label: "Web formundan yeni talep geldi: Atlas Atölye", kind: "info" }],
  "customer-portal": [{ label: "Sürüm 02 yüklendi, müşteri onayı bekleniyor", kind: "info" }],
  operations: [
    { label: "İş emri İE-207 oluşturuldu", kind: "info" },
    { label: "“İçerik alındı” işaretlendi", kind: "info" },
  ],
};

function initial(scenario: ScenarioId): State {
  const activity = SEED[scenario].map((a, i) => ({ ...a, id: `${scenario}-seed-${i}` }));
  return {
    scenario,
    status: "idle",
    pending: null,
    before: "idle",
    seq: activity.length,
    activity,
    error: null,
    announce: "",
    recordNo: null,
    assignee: null,
    previewOpen: false,
    revising: false,
    note: null,
    decision: null,
    checks: { content: true, output: false, review: false },
  };
}

function log(s: State, ...items: Omit<ActivityItem, "id">[]): Pick<State, "activity" | "seq"> {
  let seq = s.seq;
  const added = items.map((a) => ({ ...a, id: `${s.scenario}-${++seq}` }));
  return { activity: [...s.activity, ...added], seq };
}

const startProcessing = (s: State, pending: Pending): State => ({
  ...s,
  status: "processing",
  pending,
  before: s.status,
  error: null,
});

function missingChecks(checks: State["checks"]) {
  return DEMO_CHECKS.filter((c) => !checks[c.id]);
}

function reducer(s: State, a: Action): State {
  if (a.type === "scenario") return a.id === s.scenario ? s : initial(a.id);
  if (a.type === "reset") return { ...initial(s.scenario), announce: "Demo başlangıç durumuna döndü." };
  // İşlem sürerken gelen her eylem yok sayılır: çift tıklama ikinci kayıt oluşturmaz.
  if (s.status === "processing" && a.type !== "finish") return s;

  switch (a.type) {
    /* A — talep ve teklif takibi */
    case "convert":
      if (s.scenario !== "lead-flow" || s.recordNo) return s;
      return startProcessing(s, "convert");
    case "assignee":
      if (s.scenario !== "lead-flow" || s.status !== "awaiting-approval") return s;
      return { ...s, assignee: a.id, error: null };
    case "assign":
      if (s.scenario !== "lead-flow" || s.status !== "awaiting-approval") return s;
      if (!s.assignee) return { ...s, error: "Önce bir sorumlu seçin.", announce: "Önce bir sorumlu seçin." };
      return startProcessing(s, "assign");

    /* B — müşteri onay portalı */
    case "open-preview":
      if (s.scenario !== "customer-portal" || s.status !== "idle") return s;
      return {
        ...s,
        previewOpen: true,
        status: "awaiting-approval",
        ...log(s, { label: "Önizleme açıldı", kind: "info" }),
        announce: "Önizleme açıldı. Onaylayabilir ya da revizyon isteyebilirsiniz.",
      };
    case "approve":
      if (s.scenario !== "customer-portal" || s.status !== "awaiting-approval") return s;
      return startProcessing({ ...s, revising: false }, "approve");
    case "ask-revision":
      if (s.scenario !== "customer-portal" || s.status !== "awaiting-approval") return s;
      return { ...s, revising: true, error: null };
    case "cancel-revision":
      return { ...s, revising: false, note: null, error: null };
    case "note":
      return { ...s, note: a.note, error: null };
    case "send-revision":
      if (s.scenario !== "customer-portal" || !s.revising) return s;
      if (!s.note) return { ...s, error: "Bir revizyon notu seçin.", announce: "Bir revizyon notu seçin." };
      return startProcessing(s, "revise");

    /* C — operasyon ve görev akışı */
    case "toggle": {
      if (s.scenario !== "operations" || s.status === "completed") return s;
      const on = !s.checks[a.id];
      const checks = { ...s.checks, [a.id]: on };
      const label = DEMO_CHECKS.find((c) => c.id === a.id)!.label;
      // Hata gösteriliyorsa eksik listesi güncel kalır; eksik kalmadıysa temizlenir.
      const missing = missingChecks(checks);
      const error = s.error ? (missing.length ? missingText(missing) : null) : null;
      return {
        ...s,
        checks,
        error,
        ...log(s, { label: on ? `“${label}” işaretlendi` : `“${label}” işareti kaldırıldı`, kind: "info" }),
        announce: on ? `${label} işaretlendi.` : `${label} işareti kaldırıldı.`,
      };
    }
    case "complete": {
      if (s.scenario !== "operations" || s.status === "completed") return s;
      const missing = missingChecks(s.checks);
      if (missing.length) {
        const msg = missingText(missing);
        return { ...s, error: msg, ...log(s, { label: "Tamamlama engellendi: eksik koşul var", kind: "attention" }), announce: msg };
      }
      return startProcessing(s, "complete");
    }

    /* İşlem sonucu */
    case "finish": {
      if (s.status !== "processing") return s;
      const done = { ...s, pending: null };
      switch (s.pending) {
        case "convert":
          return {
            ...done,
            status: "awaiting-approval",
            recordNo: "TLP-1024",
            ...log(s, { label: "Talep kayda dönüştürüldü: TLP-1024", kind: "success" }, { label: "Durum: İnceleniyor", kind: "info" }),
            announce: "Talep TLP-1024 numaralı kayda dönüştürüldü. Şimdi bir sorumlu seçin.",
          };
        case "assign": {
          const who = DEMO_ASSIGNEES.find((p) => p.id === s.assignee)!;
          return {
            ...done,
            status: "completed",
            ...log(
              s,
              { label: `${who.name} (${who.team}) sorumlu olarak atandı`, kind: "success" },
              { label: "Kayıt takip listesine eklendi", kind: "info" },
            ),
            announce: `${who.name} sorumlu olarak atandı. Kayıt takip listesinde.`,
          };
        }
        case "approve":
          return {
            ...done,
            status: "completed",
            decision: "approved",
            ...log(s, { label: "Sürüm 02 onaylandı", kind: "success" }, { label: "Teslim dosyaları hazırlanabilir", kind: "info" }),
            announce: "Sürüm 02 onaylandı.",
          };
        case "revise":
          return {
            ...done,
            status: "revision-requested",
            decision: "revision",
            revising: false,
            ...log(
              s,
              { label: `Revizyon istendi: “${s.note}”`, kind: "attention" },
              { label: "Tasarım ekibine iletildi, sürüm 03 bekleniyor", kind: "info" },
            ),
            announce: "Revizyon istendi. Durum: revizyon bekliyor.",
          };
        case "complete":
          return {
            ...done,
            status: "completed",
            ...log(s, { label: "İE-207 tamamlandı", kind: "success" }, { label: "Teslim kaydı oluşturuldu", kind: "info" }),
            announce: "İş emri İE-207 tamamlandı.",
          };
        default:
          return { ...done, status: s.before };
      }
    }
    default:
      return s;
  }
}

function missingText(missing: readonly { label: string }[]) {
  const names = missing.map((m) => `“${m.label}”`).join(" ve ");
  return `Tamamlanamadı: ${names} henüz işaretli değil.`;
}

/* ── Seçili kaydın listede görünen durumu ─────────────────────────── */

function mainStatus(s: State): { label: string; tone: Tone } {
  if (s.scenario === "lead-flow") {
    if (s.status === "completed") return { label: "Atandı", tone: "accent" };
    if (s.recordNo) return { label: "İnceleniyor", tone: "progress" };
    return { label: "Yeni", tone: "neutral" };
  }
  if (s.scenario === "customer-portal") {
    if (s.decision === "approved") return { label: "Onaylandı", tone: "success" };
    if (s.decision === "revision") return { label: "Revizyon bekliyor", tone: "attention" };
    return { label: "Onay bekliyor", tone: "progress" };
  }
  if (s.status === "completed") return { label: "Tamamlandı", tone: "success" };
  return { label: "Devam ediyor", tone: "progress" };
}

const OTHER_TONE: Record<string, Tone> = {
  Atandı: "accent",
  "Teklif hazırlanıyor": "progress",
  Onaylandı: "success",
  Taslak: "neutral",
  Tamamlandı: "success",
  Planlandı: "neutral",
};

/* ── Bileşen ──────────────────────────────────────────────────────── */

const PROCESSING_MS = 420;

const btnPrimary =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#DB2777] px-5 text-[14px] font-semibold text-white transition-colors hover:bg-[#BE185D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F472B6] disabled:cursor-not-allowed disabled:opacity-60";
const btnSecondary =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[#4A4857] px-5 text-[14px] font-semibold text-[#F4F4F6] transition-colors hover:border-[#B5B4C0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F472B6] disabled:cursor-not-allowed disabled:opacity-60";

export default function SoftwareDemo() {
  const [s, dispatch] = useReducer(reducer, "lead-flow", initial);
  const [historyOpen, setHistoryOpen] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scenario = SCENARIOS.find((x) => x.id === s.scenario)!;
  const busy = s.status === "processing";

  // İşleniyor → kısa süre sonra sonuç. Durum değişince (senaryo/sıfırla) zamanlayıcı temizlenir.
  useEffect(() => {
    if (s.status !== "processing") return;
    const t = window.setTimeout(() => dispatch({ type: "finish" }), PROCESSING_MS);
    return () => window.clearTimeout(t);
  }, [s.status, s.pending]);

  // Sayfadaki "Örnek akışı dene" bağlantıları (#demo-<senaryo>) ilgili senaryoyu açar.
  useEffect(() => {
    const apply = () => {
      const id = window.location.hash.replace("#demo-", "") as ScenarioId;
      if (SCENARIOS.some((x) => x.id === id)) dispatch({ type: "scenario", id });
    };
    const frame = requestAnimationFrame(apply);
    window.addEventListener("hashchange", apply);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", apply);
    };
  }, []);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = SCENARIOS.length - 1;
    const next =
      e.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : e.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    dispatch({ type: "scenario", id: SCENARIOS[next].id });
    tabRefs.current[next]?.focus();
  };

  const status = mainStatus(s);
  const rows: ListRow[] = [
    { ...scenario.main, status: status.label, tone: status.tone, selected: true },
    ...scenario.others.map((o) => ({ ...o, tone: OTHER_TONE[o.status] ?? "neutral" })),
  ];
  const latest = s.activity[s.activity.length - 1];

  return (
    <div>
      {/* Senaryo sekmeleri (WAI-ARIA tabs: ok tuşları, Home/End) */}
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div role="tablist" aria-label="Örnek senaryolar" className="flex min-w-max gap-2">
          {SCENARIOS.map((x, i) => {
            const selected = x.id === s.scenario;
            return (
              <button
                key={x.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`demo-tab-${x.id}`}
                aria-selected={selected}
                aria-controls="demo-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => dispatch({ type: "scenario", id: x.id })}
                onKeyDown={(e) => onTabKey(e, i)}
                className={`min-h-[44px] rounded-full border px-4 text-[14px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DB2777] ${
                  selected
                    ? "border-[#171719] bg-[#171719] text-white dark:border-white dark:bg-white dark:text-[#171719]"
                    : "border-[#DAD8DF] bg-white text-[#3A3942] hover:border-[#171719] dark:border-white/15 dark:bg-white/5 dark:text-white/80 dark:hover:border-white/50"
                }`}
              >
                <span className="mr-2 tabular-nums text-[#DB2777]">0{i + 1}</span>
                {x.tab}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-5 max-w-[62ch] text-[16px] leading-7 text-[#62616B] dark:text-white/65">
        <strong className="font-semibold text-[#171719] dark:text-white">{scenario.problem}</strong> {scenario.capability}
      </p>

      <div id="demo-panel" role="tabpanel" aria-labelledby={`demo-tab-${s.scenario}`} className="mt-6">
        <DemoChrome
          title="Örnek iş paneli"
          actions={
            <button type="button" onClick={() => dispatch({ type: "reset" })} className={`${btnSecondary} min-h-[36px] px-4 text-[13px]`}>
              Sıfırla
            </button>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(230px,0.85fr)_minmax(0,1.5fr)_minmax(230px,0.9fr)]">
            {/* 1 · Gelen kayıtlar */}
            <section aria-label="Gelen kayıtlar" className="hidden border-r border-[#3B3946] p-4 lg:block xl:p-5">
              <PaneTitle count={rows.length}>Gelen kayıtlar</PaneTitle>
              <RecordList rows={rows} />
            </section>

            {/* 2 · Seçili kayıt */}
            <section aria-label="Seçili kayıt" className="p-4 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#B5B4C0]">Seçili kayıt</p>
                  <h3 className="mt-1.5 text-[18px] font-semibold leading-snug text-white md:text-[20px]">{scenario.main.title}</h3>
                </div>
                <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
              </div>

              <div className="mt-5">
                {s.scenario === "lead-flow" && <LeadFlow s={s} dispatch={dispatch} busy={busy} />}
                {s.scenario === "customer-portal" && <Portal s={s} dispatch={dispatch} busy={busy} />}
                {s.scenario === "operations" && <Operations s={s} dispatch={dispatch} busy={busy} />}
              </div>
            </section>

            {/* 3 · İşlem geçmişi (mobilde açılır; son kayıt hep görünür) */}
            <section aria-label="İşlem geçmişi" className="border-t border-[#3B3946] p-4 lg:border-l lg:border-t-0 xl:p-5">
              <div className="flex items-center justify-between lg:hidden">
                <p className="min-w-0 truncate text-[13.5px] text-[#D6D5DE]">
                  <span className="text-[#8E8D99]">Son işlem: </span>
                  {latest?.label}
                </p>
                <button
                  type="button"
                  aria-expanded={historyOpen}
                  aria-controls="demo-history"
                  onClick={() => setHistoryOpen((v) => !v)}
                  className="ml-3 min-h-[44px] shrink-0 text-[13px] font-semibold text-[#F9A8D4] underline-offset-4 hover:underline"
                >
                  {historyOpen ? "Geçmişi gizle" : `Geçmiş (${s.activity.length})`}
                </button>
              </div>
              <div id="demo-history" className={`${historyOpen ? "mt-4 block" : "hidden"} lg:block`}>
                <PaneTitle count={s.activity.length}>İşlem geçmişi</PaneTitle>
                <ActivityList items={s.activity} />
              </div>
            </section>
          </div>
        </DemoChrome>
      </div>

      <p aria-live="polite" className="sr-only">
        {s.announce}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14px] text-[#62616B] dark:text-white/60">
          Kayıtlar ve kişiler kurmacadır; demo hiçbir gerçek sisteme bağlanmaz, e-posta ya da teklif göndermez.
        </p>
        <Link
          href={softwareContactHref({ scenario: s.scenario })}
          className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-full bg-[#171719] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#DB2777] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DB2777] dark:bg-white dark:text-[#171719] dark:hover:bg-[#F9A8D4]"
        >
          Benzer bir sistem istiyorum <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

/* ── Senaryo panelleri ────────────────────────────────────────────── */

type PaneProps = { s: State; dispatch: (a: Action) => void; busy: boolean };

function ErrorNote({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} role="alert" className="mt-3 flex items-start gap-2 rounded-xl border border-amber-300/40 bg-amber-300/10 px-3.5 py-3 text-[14px] text-amber-100">
      <span aria-hidden="true" className="font-bold">!</span>
      {children}
    </p>
  );
}

function Result({ tone, title, next }: { tone: "success" | "attention"; title: string; next: string }) {
  const cls =
    tone === "success"
      ? "border-emerald-300/35 bg-emerald-400/10 text-emerald-100"
      : "border-amber-300/40 bg-amber-300/10 text-amber-100";
  return (
    <div className={`mt-5 rounded-2xl border px-4 py-4 ${cls}`}>
      <p className="flex items-center gap-2 text-[15px] font-semibold">
        <span aria-hidden="true">{tone === "success" ? "✓" : "↺"}</span>
        {title}
      </p>
      <p className="mt-1.5 text-[14px] opacity-85">{next}</p>
    </div>
  );
}

function LeadFlow({ s, dispatch, busy }: PaneProps) {
  const who = DEMO_ASSIGNEES.find((p) => p.id === s.assignee);
  return (
    <div>
      <blockquote className="rounded-2xl border border-[#3B3946] bg-[#1C1C24] px-4 py-4 text-[14.5px] leading-relaxed text-[#E4E3EA]">
        “Merhaba, 20 ürünümüz için e-ticaret çekimi ve fiyat teklifi almak istiyoruz. Teslim için hedefimiz ay sonu.”
      </blockquote>
      <div className="mt-4">
        <Field label="Kaynak">Web formu</Field>
        <Field label="Kayıt no">{s.recordNo ?? "—"}</Field>
        <Field label="Sorumlu">{s.status === "completed" && who ? `${who.name} · ${who.team}` : "—"}</Field>
      </div>

      {!s.recordNo && (
        <button type="button" className={`${btnPrimary} mt-5`} onClick={() => dispatch({ type: "convert" })} disabled={busy} aria-busy={busy}>
          {busy ? "Kayda dönüştürülüyor…" : "Talebi kayda dönüştür"}
        </button>
      )}

      {s.recordNo && s.status !== "completed" && (
        <fieldset className="mt-5" aria-describedby={s.error ? "assign-error" : undefined}>
          <legend className="text-[14px] font-semibold text-white">Sorumlu seçin</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {DEMO_ASSIGNEES.map((p) => (
              <label
                key={p.id}
                className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-[14px] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#F472B6] ${
                  s.assignee === p.id ? "border-[#DB2777] bg-[#DB2777]/10 text-white" : "border-[#3B3946] text-[#D6D5DE] hover:border-[#8E8D99]"
                }`}
              >
                <input
                  type="radio"
                  name="demo-assignee"
                  value={p.id}
                  checked={s.assignee === p.id}
                  onChange={() => dispatch({ type: "assignee", id: p.id })}
                  disabled={busy}
                  className="h-4 w-4 accent-[#DB2777]"
                />
                <span>
                  <span className="font-semibold">{p.name}</span> <span className="text-[#8E8D99]">· {p.team}</span>
                </span>
              </label>
            ))}
          </div>
          {s.error && <ErrorNote id="assign-error">{s.error}</ErrorNote>}
          <button type="button" className={`${btnPrimary} mt-4`} onClick={() => dispatch({ type: "assign" })} disabled={busy} aria-busy={busy}>
            {busy ? "Atanıyor…" : "Atamayı onayla"}
          </button>
        </fieldset>
      )}

      {s.status === "completed" && (
        <Result tone="success" title="Kayıt takip listesine eklendi." next="Sonraki adım: teklif taslağı hazırlanır. Bu demoda teklif ya da e-posta gönderilmez." />
      )}
    </div>
  );
}

function PagePreview({ large }: { large?: boolean }) {
  return (
    <div aria-hidden="true" className={`overflow-hidden rounded-xl border border-[#3B3946] bg-[#F7F6F3] ${large ? "p-4" : "p-2.5"}`}>
      <div className="flex items-center justify-between">
        <span className={`rounded bg-[#171719] ${large ? "h-2.5 w-14" : "h-1.5 w-8"}`} />
        <span className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`rounded bg-[#C9C7CF] ${large ? "h-2 w-8" : "h-1 w-4"}`} />
          ))}
        </span>
      </div>
      <div className={`grid grid-cols-[1.1fr_1fr] items-center gap-3 ${large ? "mt-5" : "mt-2.5"}`}>
        <div className="space-y-1.5">
          <span className={`block rounded bg-[#171719] ${large ? "h-4 w-[90%]" : "h-2 w-[90%]"}`} />
          <span className={`block rounded bg-[#171719] ${large ? "h-4 w-[65%]" : "h-2 w-[65%]"}`} />
          <span className={`block rounded bg-[#A9A7B0] ${large ? "mt-3 h-2 w-[80%]" : "mt-1.5 h-1 w-[80%]"}`} />
          <span className={`block rounded-full bg-[#DB2777] ${large ? "mt-4 h-6 w-24" : "mt-2 h-3 w-12"}`} />
        </div>
        <div className={`rounded-lg bg-[linear-gradient(135deg,#F9A8D4,#DB2777_60%,#9D174D)] ${large ? "h-28" : "h-12"}`} />
      </div>
    </div>
  );
}

function Portal({ s, dispatch, busy }: PaneProps) {
  return (
    <div>
      {!s.previewOpen ? (
        <div className="grid items-center gap-4 sm:grid-cols-[180px_1fr]">
          <PagePreview />
          <div>
            <Field label="Teslim">Ana sayfa tasarımı</Field>
            <Field label="Sürüm">02</Field>
            <button type="button" className={`${btnPrimary} mt-4`} onClick={() => dispatch({ type: "open-preview" })}>
              Önizlemeyi aç
            </button>
          </div>
        </div>
      ) : (
        <PagePreview large />
      )}

      {s.status === "awaiting-approval" && !s.revising && (
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" className={btnPrimary} onClick={() => dispatch({ type: "approve" })} disabled={busy} aria-busy={busy}>
            {busy ? "Kaydediliyor…" : "Onayla"}
          </button>
          <button type="button" className={btnSecondary} onClick={() => dispatch({ type: "ask-revision" })} disabled={busy}>
            Revizyon iste
          </button>
        </div>
      )}

      {s.revising && (
        <fieldset className="mt-5" aria-describedby={s.error ? "note-error" : undefined}>
          <legend className="text-[14px] font-semibold text-white">Revizyon notu seçin</legend>
          <div className="mt-3 space-y-2">
            {DEMO_REVISION_NOTES.map((n) => (
              <label
                key={n}
                className={`flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-[14px] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#F472B6] ${
                  s.note === n ? "border-amber-300/60 bg-amber-300/10 text-white" : "border-[#3B3946] text-[#D6D5DE] hover:border-[#8E8D99]"
                }`}
              >
                <input
                  type="radio"
                  name="demo-note"
                  value={n}
                  checked={s.note === n}
                  onChange={() => dispatch({ type: "note", note: n })}
                  disabled={busy}
                  className="h-4 w-4 accent-amber-400"
                />
                {n}
              </label>
            ))}
          </div>
          {s.error && <ErrorNote id="note-error">{s.error}</ErrorNote>}
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className={btnPrimary} onClick={() => dispatch({ type: "send-revision" })} disabled={busy} aria-busy={busy}>
              {busy ? "Gönderiliyor…" : "Revizyonu ilet"}
            </button>
            <button type="button" className={btnSecondary} onClick={() => dispatch({ type: "cancel-revision" })} disabled={busy}>
              Vazgeç
            </button>
          </div>
        </fieldset>
      )}

      {s.decision === "approved" && (
        <Result tone="success" title="Sürüm 02 onaylandı." next="Sonraki adım: teslim dosyaları hazırlanır ve müşteri alanında paylaşılır." />
      )}
      {s.decision === "revision" && (
        <Result tone="attention" title={`Revizyon bekliyor: “${s.note}”`} next="Sonraki adım: sürüm 03 yüklenince kayıt yeniden onaya düşer." />
      )}
    </div>
  );
}

function Operations({ s, dispatch, busy }: PaneProps) {
  const done = s.status === "completed";
  const missing = missingChecks(s.checks).map((c) => c.id);
  return (
    <div>
      <fieldset aria-describedby={s.error ? "ops-error" : undefined}>
        <legend className="text-[14px] font-semibold text-white">Tamamlama koşulları</legend>
        <div className="mt-3 space-y-2">
          {DEMO_CHECKS.map((c) => {
            const flagged = !!s.error && missing.includes(c.id);
            return (
              <label
                key={c.id}
                className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-[14.5px] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#F472B6] ${
                  s.checks[c.id]
                    ? "border-emerald-300/40 bg-emerald-400/[0.07] text-white"
                    : flagged
                      ? "border-amber-300/60 bg-amber-300/[0.07] text-white"
                      : "border-[#3B3946] text-[#D6D5DE] hover:border-[#8E8D99]"
                } ${done ? "cursor-default" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={s.checks[c.id]}
                  onChange={() => dispatch({ type: "toggle", id: c.id })}
                  disabled={busy || done}
                  aria-invalid={flagged || undefined}
                  className="h-4 w-4 accent-emerald-400"
                />
                <span className="flex-1">{c.label}</span>
                {flagged && <span className="text-[12px] font-semibold text-amber-200">Eksik</span>}
              </label>
            );
          })}
        </div>
      </fieldset>

      {s.error && <ErrorNote id="ops-error">{s.error}</ErrorNote>}

      {!done && (
        <button type="button" className={`${btnPrimary} mt-5`} onClick={() => dispatch({ type: "complete" })} disabled={busy} aria-busy={busy}>
          {busy ? "Tamamlanıyor…" : "İşi tamamla"}
        </button>
      )}

      {done && <Result tone="success" title="İE-207 tamamlandı." next="Teslim kaydı oluşturuldu. Koşullar tamamlanmadan iş kapanamazdı." />}
    </div>
  );
}
