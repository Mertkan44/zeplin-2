/**
 * Özel Yazılım sayfasının içeriği ve demo verisi
 * (şartname: zeplin-ozel-yazilim-tasarim-ve-uygulama-plani.md).
 *
 * Kurallar:
 * - Demo kayıtları kurmacadır; gerçek müşteri, kişi ya da veri değildir.
 * - Onaylanmamış ticari vaat (süre, fiyat, "ücretsiz", "sınırsız", garanti) yazılmaz.
 * - URL'de yalnızca aşağıdaki izinli kimlikler taşınır; serbest metin taşınmaz.
 */

/* ── Hizmet kimliği (iletişim formu eşlemesi) ─────────────────────── */

export const CUSTOM_SOFTWARE_SERVICE_ID = "custom-software";
export const CUSTOM_SOFTWARE_NEED = "Özel Yazılım";

/* ── Demo senaryoları ─────────────────────────────────────────────── */

export type ScenarioId = "lead-flow" | "customer-portal" | "operations";

export interface DemoListRecord {
  id: string;
  title: string;
  source: string;
  status: string;
}

export interface Scenario {
  id: ScenarioId;
  tab: string;
  /** Panel dışındaki kısa açıklama: hangi iş problemini anlatıyor? */
  problem: string;
  capability: string;
  /** Listede seçili duran ana kayıt + iki sabit, işlevsiz örnek kayıt */
  main: DemoListRecord;
  others: DemoListRecord[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: "lead-flow",
    tab: "Talep ve teklif takibi",
    problem: "Talepler e-posta ve mesajlarda kalıyor; kimin ilgilendiği belli değil.",
    capability: "Dağınık bir talebi, sorumlusu ve durumu belli bir kayda dönüştürür.",
    main: { id: "atlas", title: "Atlas Atölye — 20 ürün için çekim ve teklif talebi", source: "Web formu", status: "Yeni" },
    others: [
      { id: "kuzey", title: "Kuzey Kafe — menü fotoğrafları", source: "E-posta", status: "Atandı" },
      { id: "liman", title: "Liman Butik — kampanya görselleri", source: "WhatsApp", status: "Teklif hazırlanıyor" },
    ],
  },
  {
    id: "customer-portal",
    tab: "Müşteri onay portalı",
    problem: "Dosyalar, revizyonlar ve kararlar farklı yerlerde dağılıyor.",
    capability: "Teslim, onay ve revizyon sürecini tek yerde izlenebilir kılar.",
    main: { id: "home-v2", title: "Örnek proje — ana sayfa tasarımı, sürüm 02", source: "Tasarım ekibi", status: "Onay bekliyor" },
    others: [
      { id: "logo-v3", title: "Örnek proje — logo revizyonu, sürüm 03", source: "Tasarım ekibi", status: "Onaylandı" },
      { id: "product-v1", title: "Örnek proje — ürün sayfası, sürüm 01", source: "Tasarım ekibi", status: "Taslak" },
    ],
  },
  {
    id: "operations",
    tab: "Operasyon ve görev akışı",
    problem: "İşler kontrol edilmeden kapanıyor; eksikler sonradan fark ediliyor.",
    capability: "İş kurallarını uygular: koşullar tamamlanmadan iş kapanmaz.",
    main: { id: "ie-207", title: "İş emri İE-207 — ürün görsellerinin hazırlanması", source: "Operasyon", status: "Devam ediyor" },
    others: [
      { id: "ie-205", title: "İş emri İE-205 — katalog düzeni", source: "Operasyon", status: "Tamamlandı" },
      { id: "ie-208", title: "İş emri İE-208 — sosyal medya kesitleri", source: "Operasyon", status: "Planlandı" },
    ],
  },
];

/** Senaryo A: atanabilecek kurmaca sorumlular */
export const DEMO_ASSIGNEES = [
  { id: "deniz", name: "Deniz", team: "Prodüksiyon" },
  { id: "ece", name: "Ece", team: "Satış" },
] as const;

/** Senaryo B: revizyon için hazır notlar (serbest metin girişi gerekmez) */
export const DEMO_REVISION_NOTES = [
  "Ana görseli daha büyük kullanalım.",
  "Başlık metnini kısaltalım.",
  "İletişim düğmesi daha görünür olsun.",
] as const;

/** Senaryo C: tamamlanma koşulları */
export const DEMO_CHECKS = [
  { id: "content", label: "İçerik alındı" },
  { id: "output", label: "Çıktı hazır" },
  { id: "review", label: "Sorumlu kontrolü yapıldı" },
] as const;
export type DemoCheckId = (typeof DEMO_CHECKS)[number]["id"];

/* ── Çözüm alanları ───────────────────────────────────────────────── */

export const SOLUTIONS: {
  id: string;
  title: string;
  problem: string;
  solution: string;
  outputs: string[];
  scenario?: ScenarioId;
}[] = [
  {
    id: "operasyon",
    title: "İş ve operasyon uygulamaları",
    problem: "İşler mesajlarda kalıyor, kimin ne yapacağı belirsizleşiyor.",
    solution: "Görevleri, onayları ve durumu tek bir iş akışında topluyoruz; kurallarınız sistemin içinde çalışıyor.",
    outputs: ["Görev ve iş emri takibi", "Onay adımları", "Durum ve sorumlu görünümü"],
    scenario: "operations",
  },
  {
    id: "portal",
    title: "Müşteri ve ekip portalları",
    problem: "Dosyalar, revizyonlar ve kararlar farklı yerlerde.",
    solution: "Müşterinizin ya da ekibinizin teslimleri görüp karar verebildiği, rolüne göre şekillenen bir alan kuruyoruz.",
    outputs: ["Dosya ve sürüm paylaşımı", "Onay ve revizyon geçmişi", "Rol bazlı görünüm"],
    scenario: "customer-portal",
  },
  {
    id: "entegrasyon",
    title: "Entegrasyon ve otomasyon",
    problem: "Aynı bilgiyi birden fazla araca tekrar tekrar giriyorsunuz.",
    solution: "Kullandığınız araçların erişim imkânlarını inceliyor, uygun olanlar arasında kontrollü veri aktarımı kuruyoruz.",
    outputs: ["Formdan kayda otomatik aktarım", "Araçlar arası eşitleme", "Hata ve onay kontrol noktaları"],
    scenario: "lead-flow",
  },
  {
    id: "ilk-surum",
    title: "Yeni bir ürünün ilk sürümü",
    problem: "Fikir net ama nereden başlanacağı ve ilk sürümde ne olacağı belli değil.",
    solution: "Önceliklendirip kapsamı daraltıyor, tıklanabilir prototiple doğruluyor ve kullanıma açılabilecek ilk sürümü geliştiriyoruz.",
    outputs: ["Kapsam ve öncelik listesi", "Tıklanabilir prototip", "Kullanılabilir ilk sürüm"],
  },
];

/* ── Süreç ────────────────────────────────────────────────────────── */

export const PROCESS = [
  {
    step: "01",
    title: "Kapsam",
    work: "İş akışınızı, kullanıcıları, mevcut araçları ve öncelikleri birlikte anlıyoruz.",
    output: "Kısa kapsam, sınırlar ve açık sorular",
    decision: "İlk sürümde ne var, ne yok?",
  },
  {
    step: "02",
    title: "Akış ve tasarım",
    work: "Temel ekranları ve kritik işlemleri tasarlıyoruz.",
    output: "Ekran akışı ve tıklanabilir prototip",
    decision: "İşleyiş doğru mu?",
  },
  {
    step: "03",
    title: "Geliştirme ve test",
    work: "Onaylanan kapsamı geliştiriyor, hata yollarını deniyoruz.",
    output: "İnceleyebileceğiniz çalışan sürüm",
    decision: "Kabul kriterleri karşılandı mı?",
  },
  {
    step: "04",
    title: "Teslim ve devam",
    work: "Yayını, erişimleri ve kullanıma geçişi planlıyoruz.",
    output: "Kararlaştırılan dokümantasyon ve teslim listesi",
    decision: "Bakım ve sonraki sürüm nasıl yürüyecek?",
  },
];

/* ── Teslim kapsamı (politikalar teklif aşamasında yazılı netleşir) ─ */

export const DELIVERY = [
  { topic: "Kaynak kod ve erişimler", detail: "Hangi kodun, hesabın ve erişimin hangi koşulla size devredileceği." },
  { topic: "Barındırma ve alan adı", detail: "Sunucu ve alan adının kimin hesabında, kimin sorumluluğunda olacağı." },
  { topic: "Üçüncü taraf servisler", detail: "Lisans ve kullanım ücretlerinin proje bedelinden ayrı tutulması." },
  { topic: "Bakım", detail: "Hata düzeltme, izleme ve yeni özellik geliştirmenin birbirinden ayrımı." },
  { topic: "Veri", detail: "Taşıma, dışa aktarma, yedekleme ve sorumlulukların kapsamı." },
  { topic: "Dokümantasyon", detail: "Kullanıcı ve teknik teslimlerden hangilerinin dahil olduğu." },
];

/* ── SSS (taslak; ticari onay gerektirir) ─────────────────────────── */

export const FAQ = [
  {
    q: "Hazır bir araç mı, özel yazılım mı gerekli?",
    a: "Önce ihtiyacınızın mevcut bir araçla çözülüp çözülemediğine bakarız. Özel iş kuralları, birden fazla sistem ya da size özgü bir kullanıcı deneyimi gerektiğinde özel geliştirme kapsamını değerlendiririz.",
  },
  {
    q: "Ne tür bir projeyle gelebilirim?",
    a: "Takip etmek istediğiniz işi, kullanıcıları ve bugün kullandığınız araçları anlatmanız başlangıç için yeterli. Teknik şartnameyi baştan hazırlamış olmanız gerekmez.",
  },
  {
    q: "Mevcut yazılımlarımla bağlantı kurulabilir mi?",
    a: "İlgili sistemin API, erişim ve veri paylaşımı imkânlarına bağlıdır. Uygulanabilirliği kapsam aşamasında değerlendiririz.",
  },
  {
    q: "Yapay zekâ kullanmak zorunda mıyız?",
    a: "Hayır. Yapay zekâ, ihtiyaca göre eklenebilecek bir bileşendir. Form, kayıt, onay ve raporlama gibi süreçler her zaman yapay zekâ gerektirmez. Gerektiğinde chatbot ya da sesli asistan gibi bileşenleri aynı sisteme bağlayabiliriz.",
  },
  {
    q: "Maliyet ve süre nasıl belirlenir?",
    a: "Kullanıcı rolleri, ekran sayısı, iş kuralları, entegrasyonlar ve veri taşıma ihtiyacı kapsamı belirler. Önce temel sürümü tanımlar, ardından plan ve teklifi buna göre hazırlarız.",
  },
  {
    q: "Teslimden sonra değişiklik isteyebilir miyim?",
    a: "Evet; yeni ihtiyaçlar ayrıca kapsamlandırılır. Bakım, hata düzeltme ve yeni özellik geliştirme koşullarını teklif aşamasında birbirinden ayırırız.",
  },
  {
    q: "Kaynak kod ve hesaplar kime ait olur?",
    a: "Teslim edilecek kod, erişimler, üçüncü taraf lisanslar ve kullanım hakları sözleşmede açıkça yazılır. Bu kapsamı teklif aşamasında sizinle birlikte netleştiririz.",
  },
  {
    q: "Mevcut verilerim taşınabilir mi?",
    a: "Verinin biçimi, miktarı, kalitesi ve erişim koşulları incelenerek karar verilir. Taşıma ayrı bir iş kalemi olabilir.",
  },
];

/* ── Brief: üç adımlı seçim ───────────────────────────────────────── */

export const BRIEF_STEPS = [
  {
    key: "need",
    question: "Neyi kolaylaştırmak istiyorsunuz?",
    options: [
      { id: "lead-tracking", label: "Talep / müşteri takibi", phrase: "talep ve müşteri takibini tek yerde toplamak" },
      { id: "operations", label: "Ekip / operasyon yönetimi", phrase: "ekip ve operasyon işlerini düzenli yürütmek" },
      { id: "portal", label: "Müşteri portalı", phrase: "müşterilerinizle teslim ve onay sürecini tek alanda yürütmek" },
      { id: "integration", label: "Mevcut araçları bağlamak", phrase: "kullandığınız araçları birbirine bağlamak" },
      { id: "first-version", label: "Yeni bir ürünün ilk sürümü", phrase: "yeni bir ürünün ilk sürümünü planlamak" },
      { id: "unsure", label: "Henüz emin değilim", phrase: "ihtiyacınızı birlikte netleştirmek" },
    ],
  },
  {
    key: "current",
    question: "Bugün nasıl yürütüyorsunuz?",
    options: [
      { id: "sheets", label: "Excel / tablolar", phrase: "bugün kullandığınız tabloları" },
      { id: "messages", label: "E-posta / mesajlaşma", phrase: "bugün kullandığınız e-posta ve mesajlaşma akışını" },
      { id: "existing-software", label: "Hazır bir yazılım", phrase: "kullandığınız hazır yazılımı" },
      { id: "many-tools", label: "Birden fazla araç", phrase: "birlikte kullandığınız araçları" },
      { id: "not-started", label: "Henüz başlamadık", phrase: null },
    ],
  },
  {
    key: "priority",
    question: "Önce hangi sonuç önemli?",
    options: [
      { id: "less-repetition", label: "Tekrar eden işleri azaltmak", phrase: "tekrar eden işleri azaltmak" },
      { id: "clear-status", label: "Durumu daha net takip etmek", phrase: "durumu daha net takip etmek" },
      { id: "customer-experience", label: "Müşteriye daha iyi deneyim sunmak", phrase: "müşterinize daha iyi bir deneyim sunmak" },
      { id: "launch", label: "İlk sürümü kullanıma açmak", phrase: "ilk sürümü kullanıma açmak" },
    ],
  },
] as const;

export type BriefKey = (typeof BRIEF_STEPS)[number]["key"];
export type BriefSelection = Partial<Record<BriefKey, string>>;

function optionOf(key: BriefKey, id: string | undefined) {
  if (!id) return undefined;
  const step = BRIEF_STEPS.find((s) => s.key === key)!;
  return (step.options as readonly { id: string; label: string; phrase: string | null }[]).find((o) => o.id === id);
}

/** Seçimlerden okunabilir özet. Kesin çözüm, fiyat ya da tarih vaat etmez. */
export function softwareBriefSummary(sel: BriefSelection & { scenario?: string }): string {
  const need = optionOf("need", sel.need);
  const current = optionOf("current", sel.current);
  const priority = optionOf("priority", sel.priority);
  const scenario = SCENARIOS.find((s) => s.id === sel.scenario);

  const parts: string[] = [];
  if (need) {
    let first = need.phrase ? `${need.phrase.charAt(0).toUpperCase()}${need.phrase.slice(1)}` : need.label;
    if (current?.phrase) first += `; ${current.phrase} birlikte incelemek`;
    else if (current?.id === "not-started") first += "; henüz bir düzen kurulmamış";
    parts.push(`${first} istiyorsunuz.`);
  }
  if (priority?.phrase) parts.push(`Önceliğiniz: ${priority.phrase}.`);
  if (scenario) parts.push(`İlgilendiğiniz örnek: ${scenario.tab.toLowerCase()}.`);
  return parts.join(" ");
}

/** İletişim formuna geçiş adresi: yalnızca izinli kimlikler. */
export function softwareContactHref(sel: BriefSelection & { scenario?: ScenarioId } = {}): string {
  const params = new URLSearchParams({ service: CUSTOM_SOFTWARE_SERVICE_ID });
  for (const key of ["need", "current", "priority"] as const) {
    if (optionOf(key, sel[key])) params.set(key, sel[key]!);
  }
  if (sel.scenario && SCENARIOS.some((s) => s.id === sel.scenario)) params.set("scenario", sel.scenario);
  return `/iletisim?${params.toString()}`;
}

/** İletişim sayfası: gelen parametreleri doğrular, bilinmeyenleri yok sayar. */
export function parseSoftwareParams(params: Record<string, string | undefined>) {
  const sel: BriefSelection & { scenario?: ScenarioId } = {};
  for (const key of ["need", "current", "priority"] as const) {
    if (optionOf(key, params[key])) sel[key] = params[key];
  }
  const scenario = SCENARIOS.find((s) => s.id === params.scenario);
  if (scenario) sel.scenario = scenario.id;
  return sel;
}

/** WhatsApp için sabit, kısa başlangıç mesajı (serbest metin eklenmez). */
export function softwareWhatsappMessage(needId?: string): string {
  const need = optionOf("need", needId);
  const area = need && need.id !== "unsure" ? ` İlgilendiğim alan: ${need.label.toLowerCase()}.` : "";
  return `Merhaba Zeplin, özel yazılım ihtiyacım hakkında görüşmek istiyorum.${area}`;
}
