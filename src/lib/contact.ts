/** Tek iletişim kaynağı: numara, WhatsApp bağlantısı ve hizmet listesi burada tutulur. */
export const WHATSAPP_NUMBER = "905459407690";

/** Bağlamlı WhatsApp bağlantısı. Mesaj, kullanıcının düzenleyebileceği bir başlangıç metnidir. */
export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function whatsappForService(serviceName: string) {
  return whatsappUrl(`Merhaba Zeplin Media, ${serviceName} hakkında bilgi almak istiyorum.`);
}

export const BRIEF_NEEDS = [
  "Fotoğraf & Video",
  "Sosyal Medya & İçerik",
  "Marka & Tasarım",
  "Web Sitesi",
  "AI & Otomasyon",
  "Henüz emin değilim",
] as const;

export const BRIEF_BUDGETS = [
  "Belirtmek istemiyorum",
  "25.000 ₺ altı",
  "25.000 – 75.000 ₺",
  "75.000 – 150.000 ₺",
  "150.000 ₺ üzeri",
] as const;
