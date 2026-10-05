/*
 * /hizmetler/ozel-yazilim — "İşinize uyan yazılım."
 * Şartname: zeplin-ozel-yazilim-tasarim-ve-uygulama-plani.md
 *
 * Sunucu bileşeni: açıklama, vaka, süreç ve SSS okunabilir HTML olarak gelir.
 * Yalnızca demo (SoftwareDemo) ve ihtiyaç seçimi (SoftwareBrief) istemcide çalışır.
 * Demo kayıtları kurmacadır ve her yerde öyle etiketlenir.
 */

import Link from "next/link";
import { getRelatedServices, type ServiceData } from "@/data/services";
import { DELIVERY, FAQ, PROCESS, SCENARIOS, SOLUTIONS, softwareContactHref } from "@/data/software";
import { RelatedServices } from "./RelatedServices";
import SoftwareDemo from "./software/SoftwareDemo";
import SoftwareBrief from "./software/SoftwareBrief";
import WorkflowStory from "./software/WorkflowStory";
import { ActivityList, DemoChrome, Field, PaneTitle, RecordList, StatusBadge } from "./software/ui";

const wrap = "mx-auto w-full max-w-[1240px] px-5 md:px-12";
const eyebrow = "text-[13px] font-semibold uppercase tracking-[0.16em] text-[#DB2777] dark:text-[#F472B6]";
const h2 = "mt-4 text-[clamp(32px,4.2vw,54px)] font-semibold leading-[1.06] tracking-[-0.035em] text-[#171719] dark:text-white";
const lead = "mt-5 max-w-[60ch] text-[17px] leading-[1.65] text-[#62616B] dark:text-white/65 md:text-[18px]";
const rule = "border-[#DAD8DF] dark:border-white/10";

export function SoftwareServicePage({ service }: { service: ServiceData }) {
  const related = getRelatedServices(service.relatedSlugs);
  const lead0 = SCENARIOS[0];

  return (
    <main className="min-h-screen bg-[#F7F6F3] text-[#171719] dark:bg-[#0F0F12] dark:text-white">
      {/* ── 1 · Açılış ─────────────────────────────────────────────── */}
      <section aria-labelledby="software-title" className="pb-16 pt-28 md:pb-24 md:pt-40">
        <div className={wrap}>
          <nav aria-label="Breadcrumb" className="text-[14px] text-[#62616B] dark:text-white/55">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="underline-offset-4 hover:text-[#171719] hover:underline dark:hover:text-white">Ana sayfa</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/hizmetler" className="underline-offset-4 hover:text-[#171719] hover:underline dark:hover:text-white">Hizmetler</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-medium text-[#171719] dark:text-white">{service.title}</li>
            </ol>
          </nav>

          <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16">
            <div>
              <p className={eyebrow}>Özel yazılım &amp; iş uygulamaları</p>
              <h1
                id="software-title"
                className="mt-5 text-[clamp(44px,7.6vw,104px)] font-semibold leading-[1.02] tracking-[-0.05em] text-[#171719] dark:text-white"
              >
                İşinize uyan yazılım<span className="text-[#DB2777]">.</span>
              </h1>
            </div>
            <div className="lg:pb-3">
              <p className="max-w-[46ch] text-[18px] leading-[1.6] text-[#3A3942] dark:text-white/75 md:text-[20px]">
                Dağınık araçları, tekrar eden işleri ve size uymayan süreçleri; ekibinizin kullanabileceği bir sisteme dönüştürelim.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#brief"
                  className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-[#DB2777] px-7 text-[16px] font-semibold text-white transition-colors hover:bg-[#BE185D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DB2777]"
                >
                  Yazılım ihtiyacını anlat <span aria-hidden="true">→</span>
                </a>
                <a
                  href="#demo"
                  className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-[#171719] px-7 text-[16px] font-semibold text-[#171719] transition-colors hover:bg-[#171719] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DB2777] dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-[#171719]"
                >
                  Örnek sistemi dene
                </a>
              </div>
              <p className="mt-6 text-[14px] text-[#62616B] dark:text-white/55">
                İş uygulamaları · Müşteri portalları · Entegrasyonlar · İlk ürün sürümleri
              </p>
            </div>
          </div>

          {/* Açılış önizlemesi: demo verisinden statik görünüm (aşağıdaki çalışan demoyla aynı dil) */}
          <figure className="mt-12 md:mt-16">
            <div aria-hidden="true">
              <DemoChrome title="Örnek iş paneli" label="Örnek arayüz · örnek veriler">
                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.5fr)_minmax(220px,0.9fr)] lg:grid-cols-[minmax(230px,0.85fr)_minmax(0,1.5fr)_minmax(230px,0.9fr)]">
                  <div className="hidden border-r border-[#3B3946] p-5 lg:block">
                    <PaneTitle count={3}>Gelen kayıtlar</PaneTitle>
                    <RecordList
                      rows={[
                        { ...lead0.main, status: "İnceleniyor", tone: "progress", selected: true },
                        { ...lead0.others[0], tone: "accent" },
                        { ...lead0.others[1], tone: "progress" },
                      ]}
                    />
                  </div>
                  <div className="p-5 md:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#B5B4C0]">Seçili kayıt</p>
                        <p className="mt-1.5 text-[18px] font-semibold leading-snug text-white md:text-[20px]">{lead0.main.title}</p>
                      </div>
                      <StatusBadge tone="progress">İnceleniyor</StatusBadge>
                    </div>
                    <div className="mt-5">
                      <Field label="Kaynak">Web formu</Field>
                      <Field label="Kayıt no">TLP-1024</Field>
                      <Field label="Sorumlu">Atama bekliyor</Field>
                      <Field label="Sonraki adım">Sorumlu onayı</Field>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-xl border border-[#DB2777] bg-[#DB2777]/10 px-3.5 py-2.5 text-[14px] text-white">
                        <span className="font-semibold">Deniz</span> <span className="text-[#8E8D99]">· Prodüksiyon</span>
                      </span>
                      <span className="rounded-xl border border-[#3B3946] px-3.5 py-2.5 text-[14px] text-[#D6D5DE]">
                        <span className="font-semibold">Ece</span> <span className="text-[#8E8D99]">· Satış</span>
                      </span>
                    </div>
                  </div>
                  <div className="hidden border-l border-[#3B3946] p-5 md:block">
                    <PaneTitle count={3}>İşlem geçmişi</PaneTitle>
                    <ActivityList
                      items={[
                        { id: "p1", label: "Web formundan yeni talep geldi: Atlas Atölye", kind: "info" },
                        { id: "p2", label: "Talep kayda dönüştürüldü: TLP-1024", kind: "success" },
                        { id: "p3", label: "Durum: İnceleniyor", kind: "info" },
                      ]}
                    />
                  </div>
                </div>
              </DemoChrome>
            </div>
            <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[14px] text-[#62616B] dark:text-white/55">
              <span>Örnek bir talep takip ekranı. Kayıtlar kurmacadır.</span>
              <a href="#demo" className="font-semibold text-[#171719] underline-offset-4 hover:underline dark:text-white">
                Bu akışı aşağıda kendiniz deneyin ↓
              </a>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── İmza sahne: dağınık bilgiden ortak kayda (yalnızca geniş ekranda hareketli) ── */}
      <WorkflowStory />

      {/* ── 2 · Çalışan demo ───────────────────────────────────────── */}
      <section id="demo" aria-labelledby="demo-title" className={`scroll-mt-24 border-t ${rule} py-20 md:py-28`}>
        {/* "Örnek akışı dene" bağlantılarının hedefleri (JS yokken de çalışan çapalar) */}
        {SCENARIOS.map((x) => (
          <span key={x.id} id={`demo-${x.id}`} className="block scroll-mt-24" aria-hidden="true" />
        ))}
        <div className={wrap}>
          <div className="mb-10 grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div>
              <p className={eyebrow}>Örnek sistemi dene</p>
              <h2 id="demo-title" className={h2}>
                Bir talebin sisteme dönüşmesini görün.
              </h2>
            </div>
            <p className="max-w-[46ch] text-[17px] leading-[1.65] text-[#62616B] dark:text-white/65 lg:pb-2">
              Bir senaryo seçin. Talebi işleyin, onay adımını tamamlayın ve sonucu takip edin.
            </p>
          </div>
          <SoftwareDemo />
        </div>
      </section>

      {/* ── 3 · Çözüm alanları ─────────────────────────────────────── */}
      <section aria-labelledby="solutions-title" className={`border-t ${rule} py-20 md:py-28`}>
        <div className={wrap}>
          <p className={eyebrow}>Neler geliştiriyoruz</p>
          <h2 id="solutions-title" className={h2}>
            Sistem, yaptığınız işe göre şekillensin.
          </h2>
          <p className={lead}>Hazır bir paketi işinize uydurmak yerine, işinizin nasıl yürüdüğünden yola çıkıyoruz.</p>

          <ol className="mt-12 md:mt-16">
            {SOLUTIONS.map((x, i) => (
              <li key={x.id} className={`grid gap-6 border-t ${rule} py-10 md:grid-cols-[72px_minmax(0,1.25fr)_minmax(0,1fr)] md:gap-10 md:py-12`}>
                <span className="text-[15px] font-semibold tabular-nums text-[#DB2777]">0{i + 1}</span>
                <div>
                  <h3 className="text-[clamp(26px,2.6vw,34px)] font-semibold leading-[1.12] tracking-[-0.025em]">{x.title}</h3>
                  <p className="mt-4 text-[17px] italic leading-[1.6] text-[#62616B] dark:text-white/60">“{x.problem}”</p>
                  <p className="mt-3 max-w-[56ch] text-[17px] leading-[1.65] text-[#3A3942] dark:text-white/80">{x.solution}</p>
                  {x.scenario ? (
                    <a
                      href={`#demo-${x.scenario}`}
                      className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-[15px] font-semibold text-[#171719] underline decoration-[#DB2777] decoration-2 underline-offset-[6px] hover:text-[#DB2777] dark:text-white"
                    >
                      Örnek akışı dene <span aria-hidden="true">↑</span>
                    </a>
                  ) : (
                    <a
                      href="#brief"
                      className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-[15px] font-semibold text-[#171719] underline decoration-[#DB2777] decoration-2 underline-offset-[6px] hover:text-[#DB2777] dark:text-white"
                    >
                      İlk sürümü planlayalım <span aria-hidden="true">↓</span>
                    </a>
                  )}
                </div>
                <div className="self-start rounded-2xl border border-[#DAD8DF] bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#62616B] dark:text-white/50">Örnek çıktılar</p>
                  <ul className="mt-3 space-y-2.5">
                    {x.outputs.map((o) => (
                      <li key={o} className="flex items-center gap-3 text-[15.5px]">
                        <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#FCE7F3] text-[13px] font-bold text-[#BE185D] dark:bg-[#DB2777]/20 dark:text-[#F9A8D4]">
                          ✓
                        </span>
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>

          <div className={`mt-2 rounded-2xl border ${rule} bg-white/60 px-5 py-5 dark:bg-white/[0.03] md:flex md:items-center md:justify-between md:gap-8 md:px-7`}>
            <p className="max-w-[62ch] text-[16px] leading-[1.6] text-[#3A3942] dark:text-white/75">
              <strong className="font-semibold text-[#171719] dark:text-white">Yapay zekâ bir zorunluluk değil, bir bileşen.</strong>{" "}
              Gerektiğinde chatbot ya da sesli asistan gibi parçaları aynı sisteme bağlayabiliriz.
            </p>
            <div className="mt-3 flex shrink-0 gap-5 text-[15px] font-semibold md:mt-0">
              <Link href="/hizmetler/akilli-chatbot" className="underline-offset-4 hover:underline">Akıllı Chatbot →</Link>
              <Link href="/hizmetler/sesli-asistan" className="underline-offset-4 hover:underline">Sesli Asistan →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 · Örnek bir çözümün içi (konsept) ────────────────────── */}
      <section aria-labelledby="concept-title" className="bg-[#111116] py-20 text-white md:py-28">
        <div className={wrap}>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
            <div>
              <span className="inline-flex rounded-full border border-[#F472B6]/40 bg-[#DB2777]/10 px-3 py-1.5 text-[13px] font-semibold text-[#F9A8D4]">
                Konsept demo · gerçek müşteri projesi değildir
              </span>
              <h2 id="concept-title" className="mt-5 text-[clamp(32px,4.2vw,54px)] font-semibold leading-[1.06] tracking-[-0.035em]">
                Örnek bir çözümün içi.
              </h2>
              <p className="mt-5 max-w-[52ch] text-[17px] leading-[1.65] text-[#B5B4C0] md:text-[18px]">
                Bir prodüksiyon stüdyosu düşünün: talepler WhatsApp ve e-postada, iş takibi tablolarda, müşteri onayları mesajlarda. Yukarıdaki üç
                senaryo, bu stüdyo için tasarlanmış tek bir sistemin üç parçasıdır.
              </p>
            </div>
            <dl className="divide-y divide-[#3B3946] border-y border-[#3B3946]">
              {[
                ["Kullanıcılar", "Satış talepleri karşılar, prodüksiyon iş emirlerini yürütür, müşteri teslimleri onaylar. Herkes kendi rolünün ekranını görür."],
                ["Ekranlar", "Talepler · İş emirleri · Müşteri onay alanı."],
                ["İş kuralları", "Her kaydın bir sorumlusu olur. Koşullar tamamlanmadan iş emri kapanmaz. Müşteri onayı olmadan teslim tamamlanmış sayılmaz."],
                ["Bağlantılar", "Web formundan gelen talep kayda dönüşür. Onaylanan iş, erişim imkânı varsa kullanılan muhasebe ya da CRM aracına aktarılır."],
                ["İlk sürümde yok", "Ödeme alma, muhasebe ve mobil uygulama. Bunlar ihtiyaç doğrulanınca sonraki sürümlere bırakılır."],
              ].map(([k, v]) => (
                <div key={k} className="grid gap-2 py-5 sm:grid-cols-[150px_1fr] sm:gap-6">
                  <dt className="text-[14px] font-semibold uppercase tracking-[0.12em] text-[#F9A8D4]">{k}</dt>
                  <dd className="text-[16.5px] leading-[1.6] text-[#E4E3EA]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ── 5 · Mevcut araçlarla birlikte ──────────────────────────── */}
      <section aria-labelledby="tools-title" className="py-20 md:py-28">
        <div className={wrap}>
          <p className={eyebrow}>Mevcut araçlarla birlikte</p>
          <h2 id="tools-title" className={h2}>
            Her şeyi değiştirmeden başlayabiliriz.
          </h2>
          <p className={lead}>Mevcut araçlarınızı ve veri akışınızı inceler, hangi parçaların birlikte çalışabileceğini belirleriz.</p>

          <ol className="mt-12 grid gap-3 md:grid-cols-4 md:gap-0">
            {[
              { k: "Giriş", v: "Web formu", d: "Talep, form ya da mesajla gelir." },
              { k: "Uygulama", v: "Kayıt ve iş akışı", d: "Geliştirilen sistem kaydı oluşturur." },
              { k: "Kontrol", v: "Sorumlu onayı", d: "Bir insan onaylar; hata burada yakalanır." },
              { k: "Hedef", v: "Kullandığınız CRM ya da muhasebe aracı", d: "Uygunsa veri oraya aktarılır." },
            ].map((n, i, all) => (
              <li key={n.k} className="relative md:pr-8">
                <div
                  className={`h-full rounded-2xl border p-5 ${
                    i === 1
                      ? "border-[#DB2777] bg-[#FCE7F3] dark:bg-[#DB2777]/15"
                      : i === 2
                        ? "border-amber-400/60 bg-amber-50 dark:bg-amber-300/10"
                        : "border-[#DAD8DF] bg-white dark:border-white/10 dark:bg-white/[0.04]"
                  }`}
                >
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#62616B] dark:text-white/55">
                    {i + 1} · {n.k}
                  </p>
                  <p className="mt-2 text-[18px] font-semibold leading-snug">{n.v}</p>
                  <p className="mt-2 text-[15px] leading-[1.55] text-[#62616B] dark:text-white/60">{n.d}</p>
                </div>
                {i < all.length - 1 && (
                  <span aria-hidden="true" className="absolute right-1.5 top-1/2 hidden -translate-y-1/2 text-[22px] text-[#DB2777] md:block">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>

          <details className={`group mt-8 rounded-2xl border ${rule} bg-white px-5 dark:bg-white/[0.04] md:px-7`}>
            <summary className="flex min-h-[60px] cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
              Entegrasyon için neye bakıyoruz?
              <span aria-hidden="true" className="text-[22px] text-[#DB2777] transition-transform group-open:rotate-45">+</span>
            </summary>
            <ul className="grid gap-x-10 gap-y-3 pb-6 text-[16px] leading-[1.6] text-[#3A3942] dark:text-white/75 md:grid-cols-2">
              <li><strong className="font-semibold text-[#171719] dark:text-white">API ve erişim:</strong> İlgili sistem dışarıdan veri alıp veriyor mu, hangi yetkiyle?</li>
              <li><strong className="font-semibold text-[#171719] dark:text-white">Veri alanları:</strong> Hangi bilgi nereye, hangi biçimde aktarılacak?</li>
              <li><strong className="font-semibold text-[#171719] dark:text-white">İzinler:</strong> Kim neyi görebilir, kim neyi değiştirebilir?</li>
              <li><strong className="font-semibold text-[#171719] dark:text-white">Hata durumları:</strong> Aktarım başarısız olursa ne olur, kim haberdar edilir?</li>
              <li><strong className="font-semibold text-[#171719] dark:text-white">Üçüncü taraf ücretler:</strong> Kullanılan servislerin lisans ve kullanım bedelleri.</li>
            </ul>
          </details>
        </div>
      </section>

      {/* ── 6 · Süreç ──────────────────────────────────────────────── */}
      <section aria-labelledby="process-title" className={`border-t ${rule} py-20 md:py-28`}>
        <div className={wrap}>
          <p className={eyebrow}>Nasıl geliştiriyoruz</p>
          <h2 id="process-title" className={h2}>
            İlk görüşmeden kullanılabilir sürüme.
          </h2>
          <p className={lead}>Her aşamanın sonunda ne göreceğinizi ve hangi kararı birlikte vereceğimizi baştan biliyorsunuz.</p>

          <div className="mt-12">
            <div className={`hidden grid-cols-[200px_1.2fr_1fr_1fr] gap-8 border-b ${rule} pb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#62616B] dark:text-white/50 lg:grid`}>
              <span>Aşama</span>
              <span>Yapılan iş</span>
              <span>Göreceğiniz çıktı</span>
              <span>Karar noktası</span>
            </div>
            <ol>
              {PROCESS.map((p) => (
                <li key={p.step} className={`grid gap-3 border-b ${rule} py-7 lg:grid-cols-[200px_1.2fr_1fr_1fr] lg:gap-8`}>
                  <p className="flex items-baseline gap-3">
                    <span className="text-[15px] font-semibold tabular-nums text-[#DB2777]">{p.step}</span>
                    <span className="text-[22px] font-semibold tracking-[-0.02em]">{p.title}</span>
                  </p>
                  <p className="text-[16.5px] leading-[1.6] text-[#3A3942] dark:text-white/75">{p.work}</p>
                  <p className="text-[16.5px] leading-[1.6]">
                    <span className="mr-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#62616B] dark:text-white/50 lg:hidden">Çıktı:</span>
                    {p.output}
                  </p>
                  <p className="text-[16.5px] italic leading-[1.6] text-[#62616B] dark:text-white/60">
                    <span className="mr-2 not-italic text-[13px] font-semibold uppercase tracking-[0.12em] lg:hidden">Karar:</span>
                    {p.decision}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <p className="mt-6 text-[15px] text-[#62616B] dark:text-white/55">
            Aşamaların süresi gerçek kapsama göre belirlenir; tahmini takvimi kapsam aşamasının sonunda paylaşırız.
          </p>
        </div>
      </section>

      {/* ── 7 · Teslim ve devamı ───────────────────────────────────── */}
      <section aria-labelledby="delivery-title" className={`border-t ${rule} py-20 md:py-28`}>
        <div className={`${wrap} grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-20`}>
          <div>
            <p className={eyebrow}>Teslim ve devamı</p>
            <h2 id="delivery-title" className={h2}>
              Yalnızca ekranları değil, teslim kapsamını da netleştirelim.
            </h2>
            <p className={lead}>Aşağıdaki başlıkları teklif aşamasında sizinle birlikte yazılı olarak netleştiririz.</p>
          </div>
          <dl className={`divide-y ${rule} border-y ${rule} divide-[#DAD8DF] dark:divide-white/10`}>
            {DELIVERY.map((d) => (
              <div key={d.topic} className="grid gap-1.5 py-5 sm:grid-cols-[210px_1fr] sm:gap-6">
                <dt className="text-[17px] font-semibold">{d.topic}</dt>
                <dd className="text-[16.5px] leading-[1.6] text-[#3A3942] dark:text-white/70">{d.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── 8 · SSS ────────────────────────────────────────────────── */}
      <section aria-labelledby="faq-title" className={`border-t ${rule} py-20 md:py-28`}>
        <div className={`${wrap} grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20`}>
          <div>
            <p className={eyebrow}>Sık sorulanlar</p>
            <h2 id="faq-title" className={h2}>
              Aklınızdaki sorular.
            </h2>
          </div>
          <div className={`border-t ${rule}`}>
            {FAQ.map((f) => (
              <details key={f.q} className={`group border-b ${rule}`}>
                <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-6 py-4 text-[18px] font-semibold leading-snug [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden="true" className="text-[24px] font-normal text-[#DB2777] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-[64ch] pb-6 text-[16.5px] leading-[1.65] text-[#3A3942] dark:text-white/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9 · İhtiyaç brief'i ────────────────────────────────────── */}
      <section id="brief" aria-labelledby="brief-title" className="scroll-mt-24 bg-[#FCE7F3]/60 py-20 dark:bg-[#DB2777]/[0.06] md:py-28">
        <div className={`${wrap} grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16`}>
          <div>
            <p className={eyebrow}>Nereden başlayalım?</p>
            <h2 id="brief-title" className={h2}>
              Başlamak için işinizi anlatmanız yeterli.
            </h2>
            <p className={lead}>
              Üç kısa seçimle ihtiyacınızı özetleyelim; özet iletişim formuna taşınır ve dilediğiniz gibi düzenlersiniz. Teknik şartname gerekmez.
            </p>
            <Link
              href={softwareContactHref()}
              className="mt-7 inline-flex min-h-[48px] items-center gap-2 text-[16px] font-semibold text-[#171719] underline decoration-[#DB2777] decoration-2 underline-offset-[6px] hover:text-[#DB2777] dark:text-white"
            >
              Ya da doğrudan projenizi anlatın →
            </Link>
          </div>
          <SoftwareBrief />
        </div>
      </section>

      <RelatedServices services={related} />
    </main>
  );
}
