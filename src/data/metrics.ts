/**
 * Sitedeki bütün sayısal iddialar bu dosyada.
 *
 * Bir sayıyı yayında tutmadan önce şunları bilmek gerekir:
 *   - Kaynak: hangi araç / hangi müşteri verisi
 *   - Dönem: hangi aralık (ör. 2025 ortalaması, son 6 ay)
 *   - Tanım: neyi sayıyor (tekil erişim mi, platform toplamı mı?)
 * Dayanağı olmayan bir sayıyı kaldırmak, belirsiz bir sayıyı tutmaktan daha
 * güven vericidir. Aşağıdaki değerler önceki sürümden taşındı; henüz
 * doğrulanmadılar (bkz. inceleme raporu madde 18).
 */

/* ── Ana sayfa · Referanslar yanındaki etki kartı ─────────────────── */
export const HOME_IMPACT_METRICS = [
  { to: 38, decimals: 0, suffix: "+", label: "aktif marka", desc: "tek ekip içinde strateji, içerik ve yayın akışı" },
  { to: 1.8, decimals: 1, suffix: "M+", label: "aylık erişim", desc: "organik ve reklamlı kampanyalarda birleşik görünürlük" },
  { to: 92, decimals: 0, suffix: "%", label: "teslim ritmi", desc: "revizyon, prodüksiyon ve yayın takvimlerinde disiplin" },
  { to: 4.7, decimals: 1, suffix: "x", label: "etkileşim artışı", desc: "markaya özel format testleri ve içerik ritmiyle" },
];

/* ── Hizmetler sayfası · üst şerit ────────────────────────────────── */
export const SERVICES_PAGE_METRICS = [
  { value: 38, suffix: "+", label: "Aktif Marka Operasyonu" },
  { value: 92, suffix: "%", label: "Zamanında Teslim" },
  { value: 4, suffix: ".7x", label: "Ortalama Etkileşim Artışı" },
  { value: 360, suffix: "°", label: "Üretim ve Operasyon" },
];

/* ── Hakkımızda · kayan şerit ─────────────────────────────────────── */
export const ABOUT_PAGE_METRICS = [
  { value: 38, suffix: "+", label: "Aktif Marka Operasyonu" },
  { value: 4, suffix: "", label: "Üretim Disiplini" },
  { value: 92, suffix: "%", label: "Zamanında Teslim Ritmi" },
  { value: 360, suffix: "°", label: "Dijital Bakış" },
];

/* ── Operasyonlar · üst şerit (operasyon alanı sayısı sayfada listeden hesaplanır) ── */
export const OPERATIONS_SUMMARY = {
  degrees: { value: 360, suffix: "°", label: "Dijital Operasyon" },
  monitoring: { value: 24, suffix: "/7", label: "Kesintisiz İzleme" },
  activeBrands: { value: 38, suffix: "+", label: "Aktif Marka" },
};

/* ── Operasyonlar · kart başına metrik (anahtar: kart başlığı) ────── */
export const OPERATIONS_CARD_METRICS: Record<string, { value: number; suffix: string; label: string }> = {
  "Sosyal Medya Yönetimi": { value: 1, suffix: ".8M+", label: "Aylık Erişim" },
  "İçerik Üretimi": { value: 500, suffix: "+", label: "Aylık İçerik" },
  "Dijital Reklam & Performans": { value: 4, suffix: "x", label: "Ort. ROAS" },
  "SEO & Analitik": { value: 180, suffix: "%", label: "Ort. Trafik Artışı" },
  "Yapay Zeka Entegrasyonu": { value: 7, suffix: "/24", label: "Kesintisiz Hizmet" },
  "Raporlama & Analiz": { value: 100, suffix: "%", label: "Şeffaf Veri" },
};

/* ── Yapay Zeka Hizmetleri sayfası ────────────────────────────────── */
export const AI_PAGE_METRICS = [
  { value: 95, suffix: "%", label: "Müşteri Memnuniyeti" },
  { value: 24, suffix: "/7", label: "Kesintisiz Hizmet" },
  { value: 60, suffix: "%", label: "Maliyet Tasarrufu" },
  { value: 3, suffix: "sn", label: "Ort. Yanıt Süresi" },
];

/* ── Akıllı Chatbot sayfası ───────────────────────────────────────── */
export const CHATBOT_PAGE_METRICS = [
  { value: "< 3sn", label: "Ort. Yanıt Süresi" },
  { value: "7/24", label: "Kesintisiz Hizmet" },
  { value: "%95", label: "Çözüm Oranı" },
  { value: "%60", label: "Ekip Yük Azalması" },
];

/* ── Sesli Asistan sayfası ────────────────────────────────────────── */
export const VOICE_PAGE_METRICS = [
  { value: "%97", label: "Ses Tanıma Doğruluğu" },
  { value: "< 1sn", label: "Yanıt Gecikmesi" },
  { value: "7/24", label: "Kesintisiz Hizmet" },
  { value: "%70", label: "Çağrı Yük Azalması" },
];
