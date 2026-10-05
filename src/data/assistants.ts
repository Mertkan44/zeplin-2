/**
 * Özel Yapay Zekâ Asistanları sayfasının içeriği (/hizmetler/yapay-zeka).
 *
 * Kurallar:
 * - Henüz yayında bir müşteri asistanı yok: bütün konuşmalar "örnek konuşma" olarak etiketlenir;
 *   işletme ve kişi adları kurmacadır.
 * - Onaylanmamış ticari vaat (süre, fiyat, "%100 doğru", "sınırsız") yazılmaz.
 * - Asistan sağlık / hukuk tavsiyesi vermez; emin olmadığında ekibe devreder (örneklerde de böyle).
 */

export type SectorId = "restoran" | "klinik" | "magaza";

export interface Line {
  from: "customer" | "assistant";
  text: string;
}

export interface Sector {
  id: SectorId;
  tab: string;
  business: string;
  chat: Line[];
  call: Line[];
  /** Konuşmaların sonunda panele düşen kayıtlar */
  records: { channel: "WhatsApp" | "Telefon"; title: string; detail: string; kind: "success" | "handoff" }[];
}

export const SECTORS: Sector[] = [
  {
    id: "restoran",
    tab: "Restoran",
    business: "Atlas Restoran",
    chat: [
      { from: "customer", text: "Merhaba, bu akşam 4 kişilik yer var mı?" },
      { from: "assistant", text: "Merhaba! Bu akşam 19.30 ve 21.00 için 4 kişilik masamız var. Hangisini ayırayım?" },
      { from: "customer", text: "19.30 olsun, bahçe tarafı olursa çok iyi olur." },
      { from: "assistant", text: "19.30, 4 kişi, bahçe tarafı. Rezervasyon hangi isimle olsun?" },
      { from: "customer", text: "Ayşe Yılmaz." },
      { from: "assistant", text: "Teşekkürler Ayşe Hanım, rezervasyonunuz oluşturuldu. Saatinden önce size hatırlatma göndereceğim." },
    ],
    call: [
      { from: "assistant", text: "Atlas Restoran, merhaba. Size nasıl yardımcı olabilirim?" },
      { from: "customer", text: "Cumartesi akşamı için iki kişilik yer ayırtmak istiyorum." },
      { from: "assistant", text: "Cumartesi için 20.00 ve 21.30 uygun. Hangisini tercih edersiniz?" },
      { from: "customer", text: "20.00 iyi." },
      { from: "assistant", text: "Cumartesi 20.00, iki kişi. Onayı kısa mesajla gönderiyorum. İyi akşamlar!" },
    ],
    records: [
      { channel: "WhatsApp", title: "Rezervasyon oluşturuldu", detail: "Bu akşam 19.30 · 4 kişi · bahçe", kind: "success" },
      { channel: "Telefon", title: "Rezervasyon oluşturuldu", detail: "Cumartesi 20.00 · 2 kişi", kind: "success" },
    ],
  },
  {
    id: "klinik",
    tab: "Klinik",
    business: "Ada Klinik",
    chat: [
      { from: "customer", text: "Merhaba, diş beyazlatma için randevu almak istiyorum." },
      { from: "assistant", text: "Merhaba! Ön görüşme için Perşembe 14.00 ya da Cuma 11.30 uygun. Hangisi size uyar?" },
      { from: "customer", text: "Cuma olsun." },
      { from: "assistant", text: "Cuma 11.30 için randevunuz oluşturuldu. İşlem ve ücret ayrıntısını hekimimiz görüşmede netleştirecek." },
    ],
    call: [
      { from: "assistant", text: "Ada Klinik, merhaba. Size nasıl yardımcı olabilirim?" },
      { from: "customer", text: "Dünkü işlemden sonra ağrım var, ne yapmam gerekiyor?" },
      { from: "assistant", text: "Bu konuda sizi hemen ekibimizden birine aktarıyorum; sizinle bir sağlık personelimiz görüşecek." },
    ],
    records: [
      { channel: "WhatsApp", title: "Randevu oluşturuldu", detail: "Cuma 11.30 · ön görüşme", kind: "success" },
      { channel: "Telefon", title: "Ekibe aktarıldı", detail: "İşlem sonrası şikâyet · öncelikli", kind: "handoff" },
    ],
  },
  {
    id: "magaza",
    tab: "Mağaza",
    business: "Liman Butik",
    chat: [
      { from: "customer", text: "Siparişim ne zaman gelir? Numarası 4821." },
      { from: "assistant", text: "4821 numaralı siparişiniz bugün kargoya verildi; yarın teslim edilmesi bekleniyor. Takip bağlantısını göndereyim mi?" },
      { from: "customer", text: "Evet lütfen." },
      { from: "assistant", text: "Gönderdim. Başka bir konuda yardımcı olabilir miyim?" },
    ],
    call: [
      { from: "assistant", text: "Liman Butik, merhaba. Size nasıl yardımcı olabilirim?" },
      { from: "customer", text: "Aldığım ceketin bedeni olmadı, değiştirebilir miyim?" },
      { from: "assistant", text: "Elbette. Değişim talebinizi açıyorum; adımları kısa mesajla gönderiyorum." },
    ],
    records: [
      { channel: "WhatsApp", title: "Kargo bilgisi paylaşıldı", detail: "Sipariş 4821 · takip bağlantısı", kind: "success" },
      { channel: "Telefon", title: "Değişim talebi açıldı", detail: "Ceket · beden değişimi", kind: "success" },
    ],
  },
];

/* ── Ses ve üslup ─────────────────────────────────────────────────── */

export type ToneId = "samimi" | "resmi";

export const TONES: { id: ToneId; label: string; greeting: string }[] = [
  {
    id: "samimi",
    label: "Samimi",
    greeting: "Atlas Restoran, merhaba! Bu akşam için yer mi ayırtalım, yoksa menüyle ilgili merak ettiğiniz bir şey mi var?",
  },
  {
    id: "resmi",
    label: "Resmî",
    greeting: "İyi günler, Atlas Restoran'ı aradığınız için teşekkür ederiz. Rezervasyon ya da menümüzle ilgili size nasıl yardımcı olabilirim?",
  },
];

/** Ses örnekleri: /audio/voices/<id>-<ton>.mp3 (scripts/ veya docs/bekleyenler.md'ye bakın) */
export const VOICES = [
  { id: "defne", name: "Defne", trait: "Sıcak ve samimi", gender: "Kadın sesi" },
  { id: "selin", name: "Selin", trait: "Sakin ve güven veren", gender: "Kadın sesi" },
  { id: "kaan", name: "Kaan", trait: "Güler yüzlü, sohbet havasında", gender: "Erkek sesi" },
  { id: "ozan", name: "Ozan", trait: "Net ve profesyonel", gender: "Erkek sesi" },
] as const;
export type VoiceId = (typeof VOICES)[number]["id"];

/* ── Neler üstlenir ───────────────────────────────────────────────── */

export const CAPABILITIES = [
  { title: "Rezervasyon ve randevu", desc: "Uygun saatleri sunar, kaydı oluşturur, hatırlatma gönderir." },
  { title: "Sık sorulan sorular", desc: "Çalışma saatleri, adres, menü, ürün ve hizmet bilgileri." },
  { title: "Sipariş ve talep takibi", desc: "Sisteminize erişim varsa sipariş, kargo ya da talep durumunu söyler." },
  { title: "Mesai dışı yanıt", desc: "Gece ya da yoğun saatte gelen mesajı ve aramayı cevapsız bırakmaz." },
  { title: "Ekibe devretme", desc: "Emin olmadığı ya da insan gerektiren konuşmayı ekibinize aktarır." },
  { title: "Kayıt ve özet", desc: "Her konuşma panele düşer: kim, ne istedi, ne yapıldı." },
];

/* ── Güven ve sınırlar (yayın öncesi onay gerekir) ────────────────── */

export const PRINCIPLES = [
  {
    title: "Bilmediğini uydurmaz.",
    desc: "Yalnızca sizin tanımladığınız bilgilerle yanıt verir; emin olmadığında soruyu ekibinize aktarır.",
  },
  {
    title: "Tavsiye vermemesi gereken yerde vermez.",
    desc: "Sağlık, hukuk ya da finans gibi konularda yönlendirme yapar, uzman görüşünün yerine geçmez.",
  },
  {
    title: "Veriyi birlikte belirleriz.",
    desc: "Hangi bilginin kaydedileceğine, ne kadar saklanacağına ve kimin göreceğine KVKK çerçevesinde birlikte karar veririz.",
  },
];

/* ── Kanallar ─────────────────────────────────────────────────────── */

export const CHANNELS = [
  {
    id: "chatbot",
    name: "Chatbot",
    where: "WhatsApp · web sitesi",
    lead: "Yazan müşteriye saniyeler içinde, markanızın diliyle yanıt verir.",
    points: [
      "WhatsApp Business hesabınıza ve web sitenize bağlanır",
      "Bağlantı, görsel ve konum paylaşabilir",
      "Konuşmayı istediğiniz anda ekibinize devreder",
    ],
    note: "WhatsApp bağlantısı için WhatsApp Business API hesabı gerekir; kurulumunda birlikte ilerleriz.",
  },
  {
    id: "callbot",
    name: "Callbot",
    where: "Telefon hattınız",
    lead: "Arayan müşteriyi seçtiğiniz sesle karşılar, konuşarak işini çözer.",
    points: [
      "Rezervasyon, randevu ve sık sorulan sorular",
      "Onayı kısa mesajla gönderebilir",
      "Gerektiğinde aramayı ekibinize aktarır",
    ],
    note: "Mevcut hattınızla nasıl çalışacağı operatörünüze ve santralinize göre kapsam aşamasında netleşir.",
  },
];

/* ── SSS (taslak; ticari onay gerektirir) ─────────────────────────── */

export const FAQ = [
  {
    q: "Asistan yanlış bir şey söylerse ne olur?",
    a: "Asistanı yalnızca sizin onayladığınız bilgilerle kurarız ve yayından önce örnek konuşmalarla birlikte deneriz. Emin olmadığı durumda cevap uydurmak yerine konuşmayı ekibinize aktarır; yayından sonra da konuşmalara bakarak düzeltiriz.",
  },
  {
    q: "Telefon numaramı değiştirmem gerekir mi?",
    a: "Çoğu durumda mevcut hattınız üzerinden yönlendirmeyle çalışır. Operatörünüze ve santralinize göre en uygun yolu kapsam aşamasında birlikte belirleriz.",
  },
  {
    q: "WhatsApp için ne gerekiyor?",
    a: "WhatsApp Business API hesabı ve Meta onayı gerekir. Hesabın açılması ve bağlanması sürecinde size yol gösteririz.",
  },
  {
    q: "Sesini ve konuşma tarzını seçebilir miyim?",
    a: "Evet. Farklı sesleri dinleyip seçebilir, üslubunu (samimi ya da resmî) ve kullanacağı ifadeleri markanıza göre belirleyebilirsiniz.",
  },
  {
    q: "Hangi dillerde konuşur?",
    a: "Türkçe ile başlarız; ihtiyacınıza göre İngilizce gibi başka diller eklenebilir.",
  },
  {
    q: "Maliyet nasıl belirlenir?",
    a: "Kanal sayısı, konuşma hacmi, senaryoların kapsamı ve bağlanacak sistemler belirler. Telefon dakikası ve WhatsApp mesaj ücretleri gibi üçüncü taraf kullanım bedelleri ayrıca hesaplanır; teklifte ayrı kalemler olarak gösteririz.",
  },
  {
    q: "Konuşmalar nerede saklanıyor?",
    a: "Hangi bilginin kaydedileceğine, ne kadar saklanacağına ve kimlerin erişeceğine KVKK çerçevesinde birlikte karar veririz.",
  },
];
