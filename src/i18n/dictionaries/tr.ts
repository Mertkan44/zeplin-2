/** Ortak arayüz metinleri (menü, footer, iletişim). Sayfa içerikleri ayrı taşınacak. */
export const tr = {
  nav: {
    home: "ana sayfa",
    services: "hizmetler",
    projects: "projeler",
    about: "hakkımızda",
    mainMenu: "Ana menü",
    mobileNav: "Mobil navigasyon",
    openMenu: "Menüyü aç",
    closeMenu: "Menüyü kapat",
    whatsappCta: "WhatsApp'tan Yaz",
    skipToContent: "İçeriğe geç",
    language: "Dil",
  },
  footer: {
    headline: "Burası daha",
    headlineEm: "başlangıç.",
    lead: "Yeni projen için bize yaz; ihtiyacını okuyup bir iş günü içinde dönelim.",
    briefCta: "Projeni Anlat",
    pages: "Sayfalar",
    contact: "İletişim",
    social: "Sosyal",
    location: "İstanbul, Türkiye",
    cookies: "Çerez Politikası",
    privacy: "Gizlilik Politikası",
    footerMenu: "Alt menü",
    links: {
      home: "Ana sayfa",
      services: "Hizmetler",
      projects: "Projeler",
      gallery: "Galeri",
      operations: "Operasyonlar",
      about: "Hakkımızda",
      contact: "İletişim",
    },
  },
  cta: {
    eyebrow: "iletişim",
    title: "Projenizi konuşalım.",
    lead: "İhtiyaçlarınıza özel çözüm önerisi için bizimle iletişime geçin.",
    brief: "Projeni Anlat",
    whatsapp: "WhatsApp",
  },
  whatsapp: {
    general: "Merhaba Zeplin Media, web sitenizden ulaşıyorum. Projem hakkında konuşmak istiyorum.",
    service: (name: string) => `Merhaba Zeplin Media, ${name} hakkında bilgi almak istiyorum.`,
    project: (name: string) =>
      `Merhaba Zeplin Media, sitenizde ${name} projesini gördüm. Benzer bir iş için konuşmak istiyorum.`,
  },
};

export type Dictionary = typeof tr;
