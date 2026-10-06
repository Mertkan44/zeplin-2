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
      { from: "customer", text: "Merhaba, cumartesi akşamı için iki kişilik yer ayırtmak istiyorum." },
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
      { from: "customer", text: "Merhaba, dünkü işlemden sonra ağrım var. Ne yapmam gerekiyor?" },
      { from: "assistant", text: "Geçmiş olsun. Sizi hemen ekibimizden birine aktarıyorum; bir sağlık personelimiz sizinle görüşecek." },
    ],
    records: [
      { channel: "WhatsApp", title: "Randevu oluşturuldu", detail: "Cuma 11.30 · ön görüşme", kind: "success" },
      { channel: "Telefon", title: "İşlem sonrası ağrı", detail: "Öncelikli · sağlık personeline aktarıldı", kind: "handoff" },
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
      { from: "customer", text: "Merhaba, aldığım ceketin bedeni olmadı. Değiştirebilir miyim?" },
      { from: "assistant", text: "Elbette. Değişim talebinizi açıyorum; adımları kısa mesajla gönderiyorum." },
    ],
    records: [
      { channel: "WhatsApp", title: "Kargo bilgisi paylaşıldı", detail: "Sipariş 4821 · takip bağlantısı", kind: "success" },
      { channel: "Telefon", title: "Değişim talebi açıldı", detail: "Ceket · beden değişimi", kind: "success" },
    ],
  },
];

/** Telefon görüşmesi sesleri: /audio/calls/<sektör>-<satır>.mp3 (asistan: Defne sesi) */
export const callAudio = (sector: SectorId, line: number) => `/audio/calls/${sector}-${line}.mp3`;

/* ── Yazarak deneme: hazır seçeneklerle dallanan sohbet (öngösterim) ─ */

export interface ChatRecord {
  title: string;
  detail: string;
  kind: "success" | "handoff" | "info";
}
export interface ChatNode {
  bot: string[];
  options: { label: string; next: string }[];
  record?: ChatRecord;
}
export type ChatFlow = Record<string, ChatNode>;

const AGAIN = (start: string) => [{ label: "Başka bir sorum var", next: start }];

export const CHAT_FLOWS: Record<SectorId, ChatFlow> = {
  restoran: {
    start: {
      bot: ["Merhaba, Atlas Restoran'a hoş geldiniz! Size nasıl yardımcı olabilirim?"],
      options: [
        { label: "Bu akşam yer var mı?", next: "rez" },
        { label: "Menüde vegan seçenek var mı?", next: "vegan" },
        { label: "Adresiniz nerede?", next: "adres" },
        { label: "Bir yetkiliyle görüşmek istiyorum", next: "insan" },
      ],
    },
    menu: {
      bot: ["Başka nasıl yardımcı olabilirim?"],
      options: [
        { label: "Bu akşam yer var mı?", next: "rez" },
        { label: "Menüde vegan seçenek var mı?", next: "vegan" },
        { label: "Adresiniz nerede?", next: "adres" },
        { label: "Bir yetkiliyle görüşmek istiyorum", next: "insan" },
      ],
    },
    rez: {
      bot: ["Bu akşam için 19.30 ve 21.00'de masamız var. Hangisini ayırayım?"],
      options: [
        { label: "19.30 · 4 kişi", next: "rez-1930" },
        { label: "21.00 · 2 kişi", next: "rez-2100" },
      ],
    },
    "rez-1930": {
      bot: ["Harika! Bu akşam 19.30 için 4 kişilik masanız ayrıldı.", "Saatinden önce size hatırlatma göndereceğim. Afiyet olsun!"],
      options: AGAIN("menu"),
      record: { title: "Rezervasyon oluşturuldu", detail: "Bu akşam 19.30 · 4 kişi", kind: "success" },
    },
    "rez-2100": {
      bot: ["Harika! Bu akşam 21.00 için 2 kişilik masanız ayrıldı.", "Saatinden önce size hatırlatma göndereceğim. Afiyet olsun!"],
      options: AGAIN("menu"),
      record: { title: "Rezervasyon oluşturuldu", detail: "Bu akşam 21.00 · 2 kişi", kind: "success" },
    },
    vegan: {
      bot: ["Evet! Menümüzde vegan ana yemekler ve tatlılar var. Menüyü göndereyim mi?"],
      options: [
        { label: "Evet, gönder", next: "vegan-menu" },
        { label: "Rezervasyon yapalım", next: "rez" },
      ],
    },
    "vegan-menu": {
      bot: ["Menümüzü gönderdim 📎 Vegan seçenekler yeşil yaprakla işaretli."],
      options: AGAIN("menu"),
      record: { title: "Menü paylaşıldı", detail: "Vegan seçenekler soruldu", kind: "info" },
    },
    adres: {
      bot: ["Örnek Sokak No: 12'deyiz. Konumu gönderdim 📍 Akşamları sokağın başında vale var."],
      options: AGAIN("menu"),
      record: { title: "Konum paylaşıldı", detail: "Adres soruldu", kind: "info" },
    },
    insan: {
      bot: ["Elbette. Sizi ekibimizden birine aktarıyorum; en kısa sürede buradan size yazacaklar."],
      options: AGAIN("menu"),
      record: { title: "Yetkili talebi", detail: "Müşteri bir çalışanla görüşmek istedi", kind: "handoff" },
    },
  },
  klinik: {
    start: {
      bot: ["Merhaba, Ada Klinik'e hoş geldiniz. Size nasıl yardımcı olabilirim?"],
      options: [
        { label: "Randevu almak istiyorum", next: "randevu" },
        { label: "Çalışma saatleriniz neler?", next: "saat" },
        { label: "İşlem ücretleri ne kadar?", next: "ucret" },
        { label: "Ağrım var, ne yapmalıyım?", next: "agri" },
      ],
    },
    menu: {
      bot: ["Başka nasıl yardımcı olabilirim?"],
      options: [
        { label: "Randevu almak istiyorum", next: "randevu" },
        { label: "Çalışma saatleriniz neler?", next: "saat" },
        { label: "İşlem ücretleri ne kadar?", next: "ucret" },
        { label: "Ağrım var, ne yapmalıyım?", next: "agri" },
      ],
    },
    randevu: {
      bot: ["Ön görüşme için Perşembe 14.00 ya da Cuma 11.30 uygun. Hangisi size uyar?"],
      options: [
        { label: "Perşembe 14.00", next: "rnd-per" },
        { label: "Cuma 11.30", next: "rnd-cuma" },
      ],
    },
    "rnd-per": {
      bot: ["Perşembe 14.00 için randevunuz oluşturuldu.", "Bir gün önce size hatırlatma göndereceğim."],
      options: AGAIN("menu"),
      record: { title: "Randevu oluşturuldu", detail: "Perşembe 14.00 · ön görüşme", kind: "success" },
    },
    "rnd-cuma": {
      bot: ["Cuma 11.30 için randevunuz oluşturuldu.", "Bir gün önce size hatırlatma göndereceğim."],
      options: AGAIN("menu"),
      record: { title: "Randevu oluşturuldu", detail: "Cuma 11.30 · ön görüşme", kind: "success" },
    },
    saat: {
      bot: ["Hafta içi 09.00–19.00, cumartesi 10.00–16.00 arası açığız. Pazar kapalıyız."],
      options: AGAIN("menu"),
    },
    ucret: {
      bot: ["Ücret, yapılacak işleme ve muayene sonucuna göre değişiyor; hekimimiz ön görüşmede netleştiriyor.", "Size bir ön görüşme randevusu ayarlayayım mı?"],
      options: [
        { label: "Evet, randevu alalım", next: "randevu" },
        { label: "Şimdilik hayır", next: "menu" },
      ],
    },
    agri: {
      bot: ["Geçmiş olsun. Bu konuda bir sağlık personelimizin sizinle görüşmesi gerekiyor; sizi hemen ekibe aktarıyorum."],
      options: AGAIN("menu"),
      record: { title: "İşlem sonrası şikâyet", detail: "Öncelikli · sağlık personeline aktarıldı", kind: "handoff" },
    },
  },
  magaza: {
    start: {
      bot: ["Merhaba, Liman Butik'e hoş geldiniz. Size nasıl yardımcı olabilirim?"],
      options: [
        { label: "Siparişim nerede?", next: "siparis" },
        { label: "Değişim yapmak istiyorum", next: "degisim" },
        { label: "Bu ceketin M bedeni var mı?", next: "beden" },
        { label: "Bir yetkiliyle görüşmek istiyorum", next: "insan" },
      ],
    },
    menu: {
      bot: ["Başka nasıl yardımcı olabilirim?"],
      options: [
        { label: "Siparişim nerede?", next: "siparis" },
        { label: "Değişim yapmak istiyorum", next: "degisim" },
        { label: "Bu ceketin M bedeni var mı?", next: "beden" },
        { label: "Bir yetkiliyle görüşmek istiyorum", next: "insan" },
      ],
    },
    siparis: {
      bot: ["Hangi siparişiniz? Son siparişlerinizi listeledim."],
      options: [{ label: "#4821 · 2 ürün", next: "sip-ok" }],
    },
    "sip-ok": {
      bot: ["4821 numaralı siparişiniz bugün kargoya verildi; yarın teslim edilmesi bekleniyor.", "Takip bağlantısını gönderdim 📦"],
      options: AGAIN("menu"),
      record: { title: "Kargo bilgisi paylaşıldı", detail: "Sipariş 4821 · takip bağlantısı", kind: "success" },
    },
    degisim: {
      bot: ["Ürünü teslimden sonraki 14 gün içinde değiştirebilirsiniz. Değişim talebi açayım mı?"],
      options: [
        { label: "Evet, açalım", next: "deg-ok" },
        { label: "Şimdilik hayır", next: "menu" },
      ],
    },
    "deg-ok": {
      bot: ["Değişim talebiniz açıldı; adımları kısa mesajla gönderdim."],
      options: AGAIN("menu"),
      record: { title: "Değişim talebi açıldı", detail: "Beden değişimi", kind: "success" },
    },
    beden: {
      bot: ["M beden şu an tükendi 😕 Gelince size haber vereyim mi?"],
      options: [
        { label: "Evet, haber ver", next: "beden-ok" },
        { label: "L bedene bakalım", next: "beden-l" },
      ],
    },
    "beden-ok": {
      bot: ["Tamamdır! M beden gelir gelmez size buradan yazacağım."],
      options: AGAIN("menu"),
      record: { title: "Stok bildirimi kuruldu", detail: "Ceket · M beden", kind: "info" },
    },
    "beden-l": {
      bot: ["L beden stokta var. Sepete eklemeniz için bağlantıyı gönderdim 🛍️"],
      options: AGAIN("menu"),
      record: { title: "Ürün bağlantısı paylaşıldı", detail: "Ceket · L beden", kind: "info" },
    },
    insan: {
      bot: ["Elbette. Sizi ekibimizden birine aktarıyorum; en kısa sürede buradan size yazacaklar."],
      options: AGAIN("menu"),
      record: { title: "Yetkili talebi", detail: "Müşteri bir çalışanla görüşmek istedi", kind: "handoff" },
    },
  },
};

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
