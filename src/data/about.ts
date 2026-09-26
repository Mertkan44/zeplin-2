/**
 * Hakkımızda sayfasının içeriği (tasarım çalışması: Hakkımızda, bölüm 10 ve 23).
 *
 * Boş bırakılan alanlar sayfada HİÇ görünmez; yer tutucu metin yayımlanmaz.
 * Hikâye, kişiler ve üretim fotoğrafları yalnızca gerçek ve onaylı bilgiyle doldurulur:
 * uydurma kuruluş olayı, isimsiz unvan alıntısı ya da temsili ofis görseli kullanılmaz.
 */

export interface AboutPerson {
  name: string;
  role: string;
  /** Somut sorumluluk: hangi üretim/ilişkiden sorumlu, projeye hangi aşamada dahil oluyor (35–60 kelime). */
  responsibility: string;
  /** Gerçek portre (4:5). Yoksa kart portresiz gösterilir; hayalî portre üretilmez. */
  photo?: string;
  profileUrl?: string;
}

export interface AboutPhoto {
  src: string;
  /** Doğrulanabilir açıklama, ör. "Milo çekiminde ışık hazırlığı." */
  caption: string;
  alt: string;
}

export interface AboutContent {
  /** Açılış yanındaki gerçek üretim / insan karesi. */
  heroPhoto?: AboutPhoto;
  /** Kuruluş hikâyesi paragrafları (toplam ~120–180 kelime). */
  story: string[];
  /** Çalışma modeli: kurucu odaklı / çekirdek ekip + proje bazlı uzman / tam ekip — gerçek olan tek paragraf. */
  workModel?: string;
  /** Kurucu notu (80–120 kelime, kişinin onayıyla) — `people[0]` imzasıyla gösterilir. */
  founderNote?: string;
  people: AboutPerson[];
  productionPhotos: AboutPhoto[];
}

export const ABOUT: AboutContent = {
  story: [],
  people: [],
  productionPhotos: [],
};

/** Hikâye henüz yokken gösterilen kısa yaklaşım metni (mevcut sayfadan, ekip yapısı iddiası çıkarılarak). */
export const APPROACH_FALLBACK = [
  "Fotoğraf ve video çekiminden sosyal medya tasarımına, kurumsal web sitelerinden yapay zekâ destekli akışlara kadar her işte aynı soruya bakıyoruz: Bu marka daha net, daha tutarlı ve daha güçlü nasıl görünür?",
  "Bir işi yalnızca güzel göstermekle yetinmiyor; nerede yayınlanacağını, diğer içeriklerle nasıl yan yana duracağını ve nasıl sürdürüleceğini de baştan düşünüyoruz.",
];

/**
 * Çalışma ilkeleri (rapor 20.7 adayları). Gerçek operasyon kuralı olarak onaylanmalı;
 * "her zaman", "asla gecikmez", "sınırsız" gibi kesin vaat eklenmez.
 */
export const PRINCIPLES = [
  {
    title: "Önce ne yapacağımızı netleştiririz.",
    body: "Amaç, kapsam ve teslim beklentisi belli olduğunda üretim daha anlamlı ilerler. Çalışmaya başlarken hangi problemi çözeceğimizi ve hangi çıktılara ihtiyaç olduğunu birlikte tanımlarız.",
  },
  {
    title: "Parçaların birlikte çalışmasına bakarız.",
    body: "Fotoğrafın, tasarımın ve dijital uygulamanın aynı markayı anlatmasını önemseriz. Bir görseli değerlendirirken nerede kullanılacağını ve diğer içeriklerle nasıl yan yana geleceğini de düşünürüz.",
    projectSlug: "pam-akademi",
  },
  {
    title: "Kararları ve sorumlulukları açık tutarız.",
    body: "Geri bildirimin kimden geleceğini, hangi aşamada karar verileceğini ve neyin teslim edileceğini anlaşılır kılmayı amaçlarız. Her projeye aynı hazır kapsamı dayatmak yerine ihtiyacı baştan konuşuruz.",
  },
];

/** Gövdeden gerçek işe geçiş: en fazla iki proje, sayfayla ilişkisini anlatan tek cümleyle. */
export const ABOUT_RELATED_WORK = [
  {
    slug: "pam-akademi",
    why: "Kimlik, web ve sosyal medya uygulamalarını aynı görsel dilde birleştirdiğimiz çalışma.",
  },
  {
    slug: "milo-restaurant",
    why: "Menü çekimi, Reels ve sosyal medya görsellerini tek bir üretim hattında topladığımız iş.",
  },
];
