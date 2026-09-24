/* ── Service Data Types ────────────────────────────────────────────── */

export interface ServiceFeature {
  title: string;
  desc: string;
}

export interface ServiceProcess {
  step: string;
  title: string;
  desc: string;
}

/** Hizmetler müşterinin satın aldığı biçimde gruplanır; id'ler /hizmetler?tab= değeridir. */
export type ServiceCategory = "foto-video" | "sosyal-icerik" | "marka-tasarim" | "web" | "ai-otomasyon";

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  "foto-video": "Fotoğraf & Video",
  "sosyal-icerik": "Sosyal Medya & İçerik",
  "marka-tasarim": "Marka & Tasarım",
  web: "Web & Yazılım",
  "ai-otomasyon": "AI & Otomasyon",
};

/** Eski sekme adresleri (paylaşılmış bağlantılar) yeni gruplara yönlenir. */
export const LEGACY_TAB_IDS: Record<string, ServiceCategory> = {
  tasarim: "marka-tasarim",
  icerik: "sosyal-icerik",
  video: "foto-video",
  otomasyon: "ai-otomasyon",
};

export interface ServiceData {
  slug: string;
  title: string;
  category: ServiceCategory;
  categoryLabel: string;
  shortDesc: string;
  longDesc: string;
  heroImage: string;
  features: ServiceFeature[];
  process: ServiceProcess[];
  relatedSlugs: string[];
  customPage?: "ai" | "video" | "chatbot" | "voice" | "software";
  /** Image overlay style */
  dark?: boolean;
}

/* ── Tab structure for /hizmetler listing page ────────────────────── */

export interface ServiceTab {
  id: string;
  label: string;
  cards: {
    slug: string;
    title: string;
    desc: string;
    img: string;
    dark: boolean;
  }[];
}

/* ── All Services ─────────────────────────────────────────────────── */

const serviceImages = {
  design: "/images/generated/service-design-system.webp",
  content: "/images/generated/service-content-studio.webp",
  video: "/images/generated/service-video-production.webp",
  ai: "/images/generated/service-ai-automation.webp",
  postDesign: "/images/generated/service-cards/service-card-post-design.webp",
  businessCard: "/images/generated/service-cards/service-card-business-card.webp",
  logoDesign: "/images/generated/service-cards/service-card-logo-design.webp",
  bannerPoster: "/images/generated/service-cards/service-card-banner-poster.webp",
  blogWriting: "/images/generated/service-cards/service-card-blog-writing.webp",
  socialCopy: "/images/generated/service-cards/service-card-social-copy.webp",
  emailMarketing: "/images/generated/service-cards/service-card-email-marketing.webp",
  scriptWriting: "/images/generated/service-cards/service-card-script-writing.webp",
  aiCallbot: "/images/generated/service-cards/service-card-ai-callbot.webp",
  workflowAutomation: "/images/generated/service-cards/service-card-workflow-automation.webp",
  crmIntegration: "/images/generated/service-cards/service-card-crm-integration.webp",
  videoReels: "/images/projects-babi-cover.webp",
  videoSpot: "/images/projects-ritim-jewellery-cover.webp",
  motionGraphics: "/images/generated/operations-command-center.webp",
  photography: "/images/projects-milo-gallery-3.jpg",
  website: "/images/services-digital-premium-optimized.webp",
  socialManagement: "/images/generated/service-content-studio.webp",
  adsManagement: "/images/generated/operations-command-center.webp",
} as const;

export const services: ServiceData[] = [
  /* ── Tasarım ──────────────────────────────────────────────────── */
  {
    slug: "post-tasarimi",
    title: "Post Tasarımı",
    category: "marka-tasarim",
    categoryLabel: CATEGORY_LABELS["marka-tasarim"],
    shortDesc: "Sosyal medya için dikkat çekici görseller",
    longDesc:
      "Markanızın sosyal medya akışını rastgele görsellerden çıkarıp, kampanya hedefi olan bir tasarım sistemine dönüştürüyoruz. Her post; mesaj, hiyerarşi, ritim ve platform davranışı düşünülerek hazırlanır.",
    heroImage: serviceImages.postDesign,
    dark: true,
    features: [
      { title: "Platform Optimizasyonu", desc: "Instagram, Facebook, LinkedIn ve X için optimize edilmiş boyut ve formatlar" },
      { title: "Marka Tutarlılığı", desc: "Renk paleti, tipografi ve görsel dilinize uygun tasarımlar" },
      { title: "A/B Test Varyantları", desc: "Farklı görsel ve metin kombinasyonlarıyla test edilebilir tasarımlar" },
      { title: "Hızlı Revizyon", desc: "Geri bildirimlerinize 24 saat içinde revizyon" },
    ],
    process: [
      { step: "01", title: "Brief", desc: "Hedef kitle ve mesajınızı anlıyoruz" },
      { step: "02", title: "Konsept", desc: "Görsel yön ve tema belirliyoruz" },
      { step: "03", title: "Tasarım", desc: "Platformlara uygun görseller üretiyoruz" },
      { step: "04", title: "Revizyon & Teslimat", desc: "Son düzenlemeler ve dosya teslimi" },
    ],
    relatedSlugs: ["kartvizit-tasarimi", "logo-tasarimi", "banner-afis"],
  },
  {
    slug: "kartvizit-tasarimi",
    title: "Kartvizit Tasarımı",
    category: "marka-tasarim",
    categoryLabel: CATEGORY_LABELS["marka-tasarim"],
    shortDesc: "Profesyonel ve akılda kalıcı kartvizitler",
    longDesc:
      "Kartviziti yalnızca iletişim bilgisi taşıyan bir yüzey olarak değil, markanın elden ele dolaşan ilk temas noktası olarak ele alıyoruz. Baskıya hazır, rafine ve marka diliyle tutarlı tasarımlar üretiriz.",
    heroImage: serviceImages.businessCard,
    dark: false,
    features: [
      { title: "Özel Kesim & Lak", desc: "Kabartma, folyo ve özel kesim seçenekleri" },
      { title: "Çift Taraflı Tasarım", desc: "Ön ve arka yüz uyumlu tasarım" },
      { title: "Baskıya Hazır Dosya", desc: "CMYK, yüksek çözünürlük, baskı payı dahil" },
      { title: "Dijital Kartvizit", desc: "QR kodlu dijital paylaşım seçeneği" },
    ],
    process: [
      { step: "01", title: "Brief", desc: "Markanız ve ihtiyaçlarınız" },
      { step: "02", title: "Tasarım", desc: "3 farklı konsept önerisi" },
      { step: "03", title: "Revizyon", desc: "Seçilen konseptte ince ayar" },
      { step: "04", title: "Teslimat", desc: "Baskıya hazır dosya teslimi" },
    ],
    relatedSlugs: ["post-tasarimi", "logo-tasarimi", "banner-afis"],
  },
  {
    slug: "logo-tasarimi",
    title: "Logo Tasarımı",
    category: "marka-tasarim",
    categoryLabel: CATEGORY_LABELS["marka-tasarim"],
    shortDesc: "Markanızı tanımlayan özgün logolar",
    longDesc:
      "Markanızın karakterini tek bakışta anlatan, ölçeklenebilir ve uzun ömürlü logo sistemleri tasarlıyoruz. Sadece işaret değil; kullanım, renk, tipografi ve uygulama mantığını da birlikte kuruyoruz.",
    heroImage: serviceImages.logoDesign,
    dark: false,
    features: [
      { title: "Araştırma & Analiz", desc: "Sektör ve rakip analizi ile özgün yön belirleme" },
      { title: "Çoklu Konsept", desc: "En az 3 farklı logo konsepti sunumu" },
      { title: "Marka Kılavuzu", desc: "Logo kullanım kuralları ve renk kodları" },
      { title: "Tüm Formatlar", desc: "SVG, PNG, PDF — her ortam için hazır" },
    ],
    process: [
      { step: "01", title: "Keşif", desc: "Markanızın hikayesini dinliyoruz" },
      { step: "02", title: "Eskiz", desc: "El çizimi ve dijital eskizler" },
      { step: "03", title: "Tasarım", desc: "Seçilen yönde detaylı çalışma" },
      { step: "04", title: "Finalize", desc: "Marka kılavuzu ve dosya teslimi" },
    ],
    relatedSlugs: ["kartvizit-tasarimi", "post-tasarimi", "banner-afis"],
  },
  {
    slug: "banner-afis",
    title: "Banner & Afiş",
    category: "marka-tasarim",
    categoryLabel: CATEGORY_LABELS["marka-tasarim"],
    shortDesc: "Dijital ve basılı reklam görselleri",
    longDesc:
      "Dijital reklamdan fiziksel afişe kadar kampanya mesajını doğru formatta taşıyan görseller hazırlıyoruz. Tek bir ana fikri; ekran, mecra ve ölçüye göre tutarlı varyasyonlara dönüştürürüz.",
    heroImage: serviceImages.bannerPoster,
    dark: true,
    features: [
      { title: "Dijital Banner", desc: "Google Display, Facebook ve Instagram reklam görselleri" },
      { title: "Basılı Afiş", desc: "Billboard, roll-up ve broşür tasarımları" },
      { title: "Responsive Tasarım", desc: "Her ekran boyutuna uygun adaptasyon" },
      { title: "Kampanya Seti", desc: "Tutarlı görsel dille komple kampanya paketi" },
    ],
    process: [
      { step: "01", title: "Brief", desc: "Kampanya hedefleri ve mesaj" },
      { step: "02", title: "Konsept", desc: "Görsel yön ve layout" },
      { step: "03", title: "Üretim", desc: "Tüm boyutlarda tasarım üretimi" },
      { step: "04", title: "Teslimat", desc: "Platforma uygun format ve boyutlar" },
    ],
    relatedSlugs: ["post-tasarimi", "logo-tasarimi", "kartvizit-tasarimi"],
  },

  /* ── İçerik ───────────────────────────────────────────────────── */
  {
    slug: "blog-yazilari",
    title: "Blog Yazıları",
    category: "sosyal-icerik",
    categoryLabel: CATEGORY_LABELS["sosyal-icerik"],
    shortDesc: "SEO uyumlu, değer katan blog içerikleri",
    longDesc:
      "Markanızın uzmanlığını görünür kılan, arama niyetiyle uyumlu ve okunabilir blog içerikleri üretiyoruz. Konu araştırmasından yayın planına kadar içerik hattını sakin bir sistemle yönetiriz.",
    heroImage: serviceImages.blogWriting,
    dark: true,
    features: [
      { title: "SEO Optimizasyonu", desc: "Anahtar kelime araştırması ve on-page SEO" },
      { title: "İçerik Takvimi", desc: "Düzenli yayın planı ve konu stratejisi" },
      { title: "Sektörel Uzmanlık", desc: "Araştırmaya dayalı, derinlikli içerikler" },
      { title: "Analitik Takip", desc: "Performans ölçümü ve optimizasyon" },
    ],
    process: [
      { step: "01", title: "Strateji", desc: "Anahtar kelime ve konu planlaması" },
      { step: "02", title: "Yazım", desc: "SEO uyumlu içerik üretimi" },
      { step: "03", title: "Düzenleme", desc: "Editöryal kontrol ve optimizasyon" },
      { step: "04", title: "Yayın", desc: "İçerik yayını ve performans takibi" },
    ],
    relatedSlugs: ["sosyal-medya-metni", "e-posta-pazarlama", "senaryo-script"],
  },
  {
    slug: "sosyal-medya-metni",
    title: "Sosyal Medya Metni",
    category: "sosyal-icerik",
    categoryLabel: CATEGORY_LABELS["sosyal-icerik"],
    shortDesc: "Etkileşim odaklı caption ve copyler",
    longDesc:
      "Sosyal medya metinlerini yalnızca caption olarak değil, markanın günlük konuşma ritmi olarak ele alıyoruz. Platform diline, kampanya amacına ve görsel hiyerarşiye göre kısa ama etkili metinler yazarız.",
    heroImage: serviceImages.socialCopy,
    dark: false,
    features: [
      { title: "Platform Dili", desc: "Instagram, X, LinkedIn — her platforma özel ton" },
      { title: "Hashtag Stratejisi", desc: "Erişimi artıran hashtag araştırması" },
      { title: "CTA Optimizasyonu", desc: "Dönüşüm sağlayan çağrı metinleri" },
      { title: "Marka Sesi", desc: "Tutarlı marka kişiliği ve ton" },
    ],
    process: [
      { step: "01", title: "Analiz", desc: "Mevcut performans ve rakip analizi" },
      { step: "02", title: "Strateji", desc: "İçerik pillars ve ton belirleme" },
      { step: "03", title: "Yazım", desc: "Aylık içerik paketi üretimi" },
      { step: "04", title: "Optimizasyon", desc: "Performansa göre ince ayar" },
    ],
    relatedSlugs: ["blog-yazilari", "e-posta-pazarlama", "senaryo-script"],
  },
  {
    slug: "e-posta-pazarlama",
    title: "E-posta Pazarlama",
    category: "sosyal-icerik",
    categoryLabel: CATEGORY_LABELS["sosyal-icerik"],
    shortDesc: "Dönüşüm sağlayan e-posta kampanyaları",
    longDesc:
      "E-posta akışlarını tek seferlik duyurular yerine, müşteri yolculuğunu besleyen düzenli temaslara dönüştürüyoruz. Segment, konu satırı, içerik ve tasarımı birlikte optimize ederiz.",
    heroImage: serviceImages.emailMarketing,
    dark: true,
    features: [
      { title: "Şablon Tasarımı", desc: "Responsive ve marka uyumlu e-posta şablonları" },
      { title: "Otomasyon Akışları", desc: "Hoş geldin, terk edilmiş sepet, re-engagement" },
      { title: "Segmentasyon", desc: "Hedef kitle segmentasyonu ile kişiselleştirme" },
      { title: "A/B Test", desc: "Konu satırı, CTA ve içerik testleri" },
    ],
    process: [
      { step: "01", title: "Strateji", desc: "Hedefler ve segmentasyon planı" },
      { step: "02", title: "Tasarım & Yazım", desc: "Şablon ve içerik üretimi" },
      { step: "03", title: "Test & Gönderim", desc: "A/B test ve zamanlama optimizasyonu" },
      { step: "04", title: "Analiz", desc: "Performans raporu ve iyileştirme" },
    ],
    relatedSlugs: ["blog-yazilari", "sosyal-medya-metni", "senaryo-script"],
  },
  {
    slug: "senaryo-script",
    title: "Senaryo & Script",
    category: "sosyal-icerik",
    categoryLabel: CATEGORY_LABELS["sosyal-icerik"],
    shortDesc: "Video ve reklam senaryoları",
    longDesc:
      "Video, reklam ve sesli içerikler için izleyiciyi ilk saniyede yakalayan senaryo akışları kuruyoruz. Mesajı netleştirir, sahne ritmini planlar ve prodüksiyona hazır metinler teslim ederiz.",
    heroImage: serviceImages.scriptWriting,
    dark: false,
    features: [
      { title: "Video Senaryosu", desc: "Tanıtım filmi ve reklam spotu senaryoları" },
      { title: "Kısa Form", desc: "Reels, Shorts ve TikTok scriptleri" },
      { title: "Storyboard", desc: "Sahne sahne görsel planlaması" },
      { title: "Seslendirme Metni", desc: "Voiceover ve podcast scriptleri" },
    ],
    process: [
      { step: "01", title: "Brief", desc: "Mesaj, hedef kitle ve format" },
      { step: "02", title: "Taslak", desc: "İlk senaryo taslağı" },
      { step: "03", title: "Revizyon", desc: "Geri bildirimle ince ayar" },
      { step: "04", title: "Final", desc: "Prodüksiyona hazır senaryo" },
    ],
    relatedSlugs: ["blog-yazilari", "sosyal-medya-metni", "e-posta-pazarlama"],
  },

  /* ── Video (özel sayfa) ───────────────────────────────────────── */
  {
    slug: "video-produksiyon",
    title: "Video Prodüksiyon",
    category: "foto-video",
    categoryLabel: CATEGORY_LABELS["foto-video"],
    shortDesc: "Profesyonel video prodüksiyon hizmetleri",
    longDesc:
      "Tanıtım filmlerinden reels içeriklerine kadar video üretimini fikir, senaryo, çekim ve kurgu hattında tek ekip gibi yönetiyoruz. Her kareyi yayınlanacağı platformun temposuna göre planlarız.",
    heroImage: serviceImages.video,
    dark: true,
    customPage: "video",
    features: [
      { title: "Tanıtım Filmi", desc: "Markanızı anlatan profesyonel prodüksiyon" },
      { title: "Reels & Shorts", desc: "Viral kısa video içerikleri" },
      { title: "Reklam Spotu", desc: "Dijital platformlar için reklam videoları" },
      { title: "Motion Graphics", desc: "Animasyon ve hareketli grafikler" },
    ],
    process: [
      { step: "01", title: "Script", desc: "Senaryo ve storyboard hazırlığı" },
      { step: "02", title: "Pre-prod", desc: "Ekip, lokasyon ve ekipman planlaması" },
      { step: "03", title: "Çekim", desc: "Profesyonel set ve çekim günü" },
      { step: "04", title: "Post-prod", desc: "Kurgu, renk ve ses düzenleme" },
      { step: "05", title: "Teslimat", desc: "Platform uyumlu final dosyalar" },
    ],
    relatedSlugs: ["post-tasarimi", "senaryo-script", "banner-afis"],
  },

  /* ── Otomasyon AI Alt Hizmetler ──────────────────────────────── */
  {
    slug: "akilli-chatbot",
    title: "Akıllı Chatbot",
    category: "ai-otomasyon",
    categoryLabel: CATEGORY_LABELS["ai-otomasyon"],
    customPage: "chatbot",
    shortDesc: "7/24 yapay zeka destekli müşteri iletişimi",
    longDesc:
      "WhatsApp ve web kanallarınıza entegre edilen chatbot, müşterilerinizin her sorusunu anında yanıtlar. Öğrenen yapısıyla zamanla daha akıllı hale gelir ve ekibinizin iletişim yükünü ciddi ölçüde azaltır.",
    heroImage: serviceImages.ai,
    dark: true,
    features: [
      { title: "WhatsApp Entegrasyonu", desc: "WhatsApp Business API ile doğrudan entegrasyon ve 7/24 otomatik yanıt" },
      { title: "Doğal Dil Anlama", desc: "Müşteri mesajlarını bağlamına göre anlayan ve öğrenen AI motoru" },
      { title: "Çoklu Kanal Desteği", desc: "Web sitesi, WhatsApp ve sosyal medya kanallarında tek yönetim paneli" },
      { title: "Canlı Temsilciye Aktarım", desc: "Gerektiğinde insan desteğine sorunsuz geçiş ve konuşma geçmişi aktarımı" },
    ],
    process: [
      { step: "01", title: "Analiz", desc: "Müşteri iletişim akışlarınızı inceliyoruz" },
      { step: "02", title: "Senaryo", desc: "Chatbot diyalog akışları ve yanıt senaryoları" },
      { step: "03", title: "Geliştirme", desc: "AI motoru ve kanal entegrasyonu" },
      { step: "04", title: "Test", desc: "Kapsamlı test ve ince ayar süreci" },
      { step: "05", title: "Canlıya Alma", desc: "Yayına alım ve sürekli performans izleme" },
    ],
    relatedSlugs: ["sesli-asistan", "ozel-yazilim", "yapay-zeka"],
  },
  {
    slug: "sesli-asistan",
    title: "Sesli Asistan",
    category: "ai-otomasyon",
    categoryLabel: CATEGORY_LABELS["ai-otomasyon"],
    customPage: "voice",
    shortDesc: "Telefon görüşmelerinde akıllı rezervasyon ve yönlendirme",
    longDesc:
      "Restoranlar, klinikler ve işletmeler için telefon görüşmelerini yöneten sesli AI sistemi. Rezervasyon alır, soruları yanıtlar ve müşterilerinizle doğal bir şekilde konuşur — 7/24 kesintisiz.",
    heroImage: serviceImages.aiCallbot,
    dark: false,
    features: [
      { title: "Türkçe Ses Tanıma", desc: "Yüksek doğrulukla çalışan Türkçe ses tanıma ve anlama motoru" },
      { title: "Doğal Konuşma Akışı", desc: "İnsan gibi konuşan, bağlamı takip eden yapay zeka diyalog sistemi" },
      { title: "Rezervasyon Yönetimi", desc: "Otomatik rezervasyon alma ve takvim entegrasyonu" },
      { title: "IVR Entegrasyonu", desc: "Mevcut telefon ve PBX sisteminizle uyumlu entegrasyon" },
    ],
    process: [
      { step: "01", title: "Süreç Analizi", desc: "Telefon akışlarınızı ve ihtiyaçlarınızı anlıyoruz" },
      { step: "02", title: "Senaryo Tasarımı", desc: "Konuşma akışları ve yönlendirme senaryoları" },
      { step: "03", title: "Geliştirme", desc: "Sesli AI sistemi geliştirme ve entegrasyon" },
      { step: "04", title: "Test", desc: "Gerçek çağrılarla kapsamlı test süreci" },
      { step: "05", title: "Canlıya Alma", desc: "Yayına alım ve performans optimizasyonu" },
    ],
    relatedSlugs: ["akilli-chatbot", "ozel-yazilim", "yapay-zeka"],
  },
  {
    slug: "ozel-yazilim",
    title: "Özel Yazılım",
    category: "web",
    categoryLabel: CATEGORY_LABELS["web"],
    customPage: "software",
    shortDesc: "Tüm AI kanallarını tek merkezde birleştiren platform",
    longDesc:
      "Chatbot ve sesli asistanı tek bir akıllı sistemde birleştiren özel yazılım platformu. İşletmenizin tüm iletişim süreçlerini yönetir, raporlar ve optimize eder — size sadece sonuçları sunar.",
    heroImage: serviceImages.workflowAutomation,
    dark: true,
    features: [
      { title: "Merkezi Yönetim Paneli", desc: "Tüm AI kanallarını ve konuşmalarını tek ekrandan yönetme" },
      { title: "Gerçek Zamanlı Raporlama", desc: "Anlık performans metrikleri, dönüşüm oranları ve dashboard" },
      { title: "Özel Entegrasyon", desc: "CRM, ERP ve mevcut yazılımlarınızla tam entegrasyon" },
      { title: "Ölçeklenebilir Mimari", desc: "İşletmeniz büyüdükçe otomatik genişleyen sistem altyapısı" },
    ],
    process: [
      { step: "01", title: "İhtiyaç Analizi", desc: "Mevcut sistemlerinizi ve boşlukları inceliyoruz" },
      { step: "02", title: "Mimari Tasarım", desc: "Özel yazılım mimarisi ve entegrasyon planı" },
      { step: "03", title: "Geliştirme", desc: "Agile süreçlerle iteratif geliştirme ve testler" },
      { step: "04", title: "Entegrasyon", desc: "Mevcut sistemlere sorunsuz entegrasyon" },
      { step: "05", title: "Canlıya Alma", desc: "Eğitim, dokümantasyon ve sürekli destek" },
    ],
    relatedSlugs: ["akilli-chatbot", "sesli-asistan", "yapay-zeka"],
  },

  /* ── Otomasyon (özel sayfa) ───────────────────────────────────── */
  {
    slug: "yapay-zeka",
    title: "Yapay Zeka Hizmetleri",
    category: "ai-otomasyon",
    categoryLabel: CATEGORY_LABELS["ai-otomasyon"],
    shortDesc: "AI destekli otomasyon çözümleri",
    longDesc:
      "Chatbot, callbot ve otomasyon akışlarını markanızın günlük operasyonuna sade ama güçlü bir katman olarak yerleştiriyoruz. Müşteri desteği, CRM, raporlama ve tekrar eden süreçleri tek bir akışta bağlarız.",
    heroImage: serviceImages.ai,
    dark: true,
    customPage: "ai",
    features: [
      { title: "AI Chatbot", desc: "7/24 akıllı müşteri destek sistemi" },
      { title: "AI Callbot", desc: "Sesli yanıt ve yönlendirme otomasyonu" },
      { title: "İş Akışı Otomasyonu", desc: "Tekrarlayan süreçlerin otomasyonu" },
      { title: "CRM Entegrasyonu", desc: "Mevcut sistemlerinizle entegrasyon" },
    ],
    process: [
      { step: "01", title: "Analiz", desc: "Mevcut süreçlerinizi inceliyoruz" },
      { step: "02", title: "Tasarım", desc: "AI çözüm mimarisini kuruyoruz" },
      { step: "03", title: "Geliştirme", desc: "Sistemi geliştirip entegre ediyoruz" },
      { step: "04", title: "Test", desc: "Kapsamlı test ve optimizasyon" },
      { step: "05", title: "Canlı", desc: "Sistemi devreye alıp izliyoruz" },
    ],
    relatedSlugs: ["e-posta-pazarlama", "blog-yazilari", "post-tasarimi"],
  },
  /* ── Yeni: Fotoğraf, Sosyal Medya Yönetimi, Reklam, Web ─────────── */
  {
    slug: "fotograf-cekimi",
    title: "Fotoğraf Çekimi",
    category: "foto-video",
    categoryLabel: CATEGORY_LABELS["foto-video"],
    shortDesc: "Ürün, menü ve mekân fotoğrafçılığı",
    longDesc:
      "Ürününüzü, menünüzü ve mekânınızı sosyal medya, web sitesi ve basılı işlerde kullanılabilecek bir görsel arşive dönüştürüyoruz. Işık, kadraj ve stil, markanın geri kalan görsel diliyle birlikte planlanır.",
    heroImage: serviceImages.photography,
    dark: true,
    features: [
      { title: "Ürün & Menü Çekimi", desc: "Stüdyo veya mekânda, kullanım yerine göre planlanmış ürün kareleri" },
      { title: "Mekân & Atmosfer", desc: "İç mekân, ekip ve misafir deneyimini anlatan kareler" },
      { title: "Platforma Göre Kadraj", desc: "Aynı çekimden dikey, kare ve yatay kullanım için alternatifler" },
      { title: "Renk & Rötuş", desc: "Seçilen karelerde marka tonuna uygun renk düzenleme ve rötuş" },
    ],
    process: [
      { step: "01", title: "Brief", desc: "Kullanım yeri, kare listesi ve stil referansları" },
      { step: "02", title: "Planlama", desc: "Çekim günü, ışık, dekor ve ürün hazırlığı" },
      { step: "03", title: "Çekim", desc: "Mekânda veya stüdyoda çekim" },
      { step: "04", title: "Seçim & Rötuş", desc: "Birlikte seçim, renk ve rötuş" },
      { step: "05", title: "Teslimat", desc: "Web ve baskı için hazır dosyalar" },
    ],
    relatedSlugs: ["video-produksiyon", "sosyal-medya-yonetimi", "post-tasarimi"],
  },
  {
    slug: "sosyal-medya-yonetimi",
    title: "Sosyal Medya Yönetimi",
    category: "sosyal-icerik",
    categoryLabel: CATEGORY_LABELS["sosyal-icerik"],
    shortDesc: "Planlama, üretim ve yayını tek ekipte toplayan hesap yönetimi",
    longDesc:
      "Aylık içerik planından çekim, tasarım, metin ve yayına kadar sosyal medya hesaplarınızı tek bir ekip olarak yönetiyoruz. Ne paylaşılacağını birlikte planlar, onayınızdan sonra yayınlar ve ay sonunda neyin işe yaradığını birlikte değerlendiririz.",
    heroImage: serviceImages.socialManagement,
    dark: true,
    features: [
      { title: "Aylık İçerik Planı", desc: "Kampanya, dönem ve ürün takvimine göre hazırlanan paylaşım planı" },
      { title: "Üretim", desc: "Post, reels, story ve metinlerin tek görsel dilde üretimi" },
      { title: "Onay & Yayın", desc: "Paylaşımlar onayınızdan sonra planlanan saatte yayında" },
      { title: "Aylık Değerlendirme", desc: "Hangi içeriğin işe yaradığını gösteren sade rapor ve sonraki ay önerileri" },
    ],
    process: [
      { step: "01", title: "Tanışma", desc: "Hedefler, hedef kitle ve mevcut hesapların incelenmesi" },
      { step: "02", title: "Plan", desc: "Aylık içerik takvimi ve konsept" },
      { step: "03", title: "Üretim", desc: "Çekim, tasarım ve metin" },
      { step: "04", title: "Yayın", desc: "Onaylanan içeriklerin paylaşımı" },
      { step: "05", title: "Değerlendirme", desc: "Ay sonu rapor ve iyileştirme" },
    ],
    relatedSlugs: ["reklam-yonetimi", "post-tasarimi", "sosyal-medya-metni"],
  },
  {
    slug: "reklam-yonetimi",
    title: "Reklam Yönetimi",
    category: "sosyal-icerik",
    categoryLabel: CATEGORY_LABELS["sosyal-icerik"],
    shortDesc: "Meta ve Google reklamlarının kurulumu, yönetimi ve raporlanması",
    longDesc:
      "Reklam bütçenizi hedefe göre kurgulanmış kampanyalara dönüştürüyoruz. Hedef kitle, kreatif ve bütçe dağılımını birlikte planlar; kampanya süresince performansı izleyip düzenli olarak iyileştiririz.",
    heroImage: serviceImages.adsManagement,
    dark: true,
    features: [
      { title: "Kampanya Kurulumu", desc: "Hedefe uygun kampanya yapısı, hedef kitle ve ölçüm kurulumu" },
      { title: "Reklam Kreatifleri", desc: "Platforma ve hedefe göre görsel, video ve metin varyasyonları" },
      { title: "Bütçe Yönetimi", desc: "Bütçenin performansa göre kampanyalar arasında dağıtılması" },
      { title: "Raporlama", desc: "Harcama ve sonuçları anlaşılır biçimde gösteren düzenli rapor" },
    ],
    process: [
      { step: "01", title: "Hedef", desc: "Satış, mesaj, ziyaret veya bilinirlik hedefinin netleşmesi" },
      { step: "02", title: "Kurulum", desc: "Hesap, ölçüm ve hedef kitle kurulumu" },
      { step: "03", title: "Kreatif", desc: "Test edilecek reklam varyasyonlarının üretimi" },
      { step: "04", title: "Yayın & İzleme", desc: "Kampanyanın takibi ve düzenli iyileştirme" },
      { step: "05", title: "Rapor", desc: "Sonuçların ve sonraki adımların paylaşılması" },
    ],
    relatedSlugs: ["sosyal-medya-yonetimi", "video-produksiyon", "banner-afis"],
  },
  {
    slug: "kurumsal-web-sitesi",
    title: "Kurumsal Web Sitesi",
    category: "web",
    categoryLabel: CATEGORY_LABELS.web,
    shortDesc: "Tasarımdan yayına, mobil uyumlu kurumsal web sitesi",
    longDesc:
      "Markanızı, hizmetlerinizi ve ürünlerinizi net anlatan, mobilde rahat kullanılan ve arama motorlarında bulunabilen bir web sitesi tasarlayıp geliştiriyoruz. Yayından sonra içerikleri güncelleyebilmeniz için gereken yapıyı da birlikte kuruyoruz.",
    heroImage: serviceImages.website,
    dark: true,
    features: [
      { title: "UI/UX Tasarım", desc: "Ziyaretçinin aradığını hızlı bulduğu sayfa yapısı ve arayüz" },
      { title: "Mobil Uyum", desc: "Telefon, tablet ve masaüstünde aynı özenle çalışan tasarım" },
      { title: "SEO Altyapısı", desc: "Metadata, site haritası ve hız gibi teknik temeller" },
      { title: "İletişim & Form", desc: "Talep formu, WhatsApp ve harita gibi iletişim bağlantıları" },
    ],
    process: [
      { step: "01", title: "Keşif", desc: "Hedefler, içerik envanteri ve referanslar" },
      { step: "02", title: "Site Haritası", desc: "Sayfa yapısı ve içerik planı" },
      { step: "03", title: "Tasarım", desc: "Masaüstü ve mobil arayüz tasarımı" },
      { step: "04", title: "Geliştirme", desc: "Kodlama, içerik girişi ve testler" },
      { step: "05", title: "Yayın", desc: "Alan adı, yayın ve teslim sonrası destek" },
    ],
    relatedSlugs: ["ozel-yazilim", "logo-tasarimi", "akilli-chatbot"],
  },
];

/* ── Helpers ──────────────────────────────────────────────────────── */

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return services.find((s) => s.slug === slug);
}

export function getRelatedServices(slugs: string[]): ServiceData[] {
  return slugs.map((s) => services.find((svc) => svc.slug === s)).filter(Boolean) as ServiceData[];
}


/* ── Tab structure for /hizmetler listing ─────────────────────────── */

export const serviceTabs: ServiceTab[] = [
  {
    id: "foto-video",
    label: CATEGORY_LABELS["foto-video"],
    cards: [
      { slug: "video-produksiyon", title: "Tanıtım Filmi", desc: "Markanızı sinematik bir dille anlatan prodüksiyon", img: serviceImages.video, dark: true },
      { slug: "video-produksiyon", title: "Reels & Shorts", desc: "Kısa format için hızlı, ritimli ve güçlü içerikler", img: serviceImages.videoReels, dark: false },
      { slug: "video-produksiyon", title: "Reklam Filmi", desc: "Dijital platformlara uygun reklam videoları", img: serviceImages.videoSpot, dark: true },
      { slug: "fotograf-cekimi", title: "Fotoğraf Çekimi", desc: "Ürün, menü ve mekân fotoğrafçılığı", img: serviceImages.photography, dark: true },
    ],
  },
  {
    id: "sosyal-icerik",
    label: CATEGORY_LABELS["sosyal-icerik"],
    cards: [
      { slug: "sosyal-medya-yonetimi", title: "Sosyal Medya Yönetimi", desc: "Planlama, üretim ve yayın tek ekipte", img: serviceImages.socialManagement, dark: true },
      { slug: "reklam-yonetimi", title: "Reklam Yönetimi", desc: "Meta ve Google reklamlarının kurulumu ve yönetimi", img: serviceImages.adsManagement, dark: true },
      { slug: "sosyal-medya-metni", title: "Sosyal Medya Metni", desc: "Platform ritmine uygun caption ve kampanya metinleri", img: serviceImages.socialCopy, dark: false },
      { slug: "senaryo-script", title: "Senaryo & Script", desc: "Video ve reklam fikirlerini prodüksiyona hazır metne çevirme", img: serviceImages.scriptWriting, dark: false },
      { slug: "blog-yazilari", title: "Blog Yazıları", desc: "Arama niyetiyle uyumlu, değer katan içerikler", img: serviceImages.blogWriting, dark: true },
      { slug: "e-posta-pazarlama", title: "E-posta Pazarlama", desc: "Segmentli ve ölçülebilir e-posta akışları", img: serviceImages.emailMarketing, dark: true },
    ],
  },
  {
    id: "marka-tasarim",
    label: CATEGORY_LABELS["marka-tasarim"],
    cards: [
      { slug: "logo-tasarimi", title: "Logo & Kimlik", desc: "Markanızı taşıyacak ölçeklenebilir görsel kimlik", img: serviceImages.logoDesign, dark: false },
      { slug: "post-tasarimi", title: "Post Tasarımı", desc: "Sosyal medya için sistemli ve dikkat çeken görseller", img: serviceImages.postDesign, dark: true },
      { slug: "banner-afis", title: "Banner & Afiş", desc: "Dijital ve basılı kampanyalar için güçlü görseller", img: serviceImages.bannerPoster, dark: true },
      { slug: "kartvizit-tasarimi", title: "Kartvizit Tasarımı", desc: "İlk temas için rafine ve baskıya hazır kimlik parçaları", img: serviceImages.businessCard, dark: false },
    ],
  },
  {
    id: "web",
    label: CATEGORY_LABELS.web,
    cards: [
      { slug: "kurumsal-web-sitesi", title: "Kurumsal Web Sitesi", desc: "Tasarımdan yayına, mobil uyumlu kurumsal site", img: serviceImages.website, dark: true },
      { slug: "ozel-yazilim", title: "Özel Yazılım & Entegrasyon", desc: "Panel, raporlama ve mevcut sistemlerle entegrasyon", img: serviceImages.crmIntegration, dark: false },
    ],
  },
  {
    id: "ai-otomasyon",
    label: CATEGORY_LABELS["ai-otomasyon"],
    cards: [
      { slug: "akilli-chatbot", title: "AI Chatbot", desc: "Web ve WhatsApp için akıllı müşteri destek sistemi", img: serviceImages.ai, dark: true },
      { slug: "sesli-asistan", title: "AI Callbot", desc: "Sesli yanıt ve yönlendirme otomasyonu", img: serviceImages.aiCallbot, dark: false },
      { slug: "yapay-zeka", title: "İş Akışı Otomasyonu", desc: "Tekrarlayan süreçleri birbirine bağlayan otomasyon", img: serviceImages.workflowAutomation, dark: true },
      { slug: "ozel-yazilim", title: "CRM Entegrasyonu", desc: "Mevcut sistemlerinizle temiz veri akışı", img: serviceImages.crmIntegration, dark: false },
    ],
  },
];
