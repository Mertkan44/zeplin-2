export interface ProjectData {
  slug: string;
  name: string;
  client: string;
  year: string;
  image: string;
  imagePosition?: string;
  tags: string[];
  variant?: "image" | "website";
  websiteUrl?: string;
  shortDesc: string;
  challenge: string;
  solution: string;
  services: string[];
  gallery: string[];
}

export const projects: ProjectData[] = [
  {
    slug: "milo-restaurant",
    name: "Milo Restaurant",
    client: "Milo Restaurant",
    year: "2024",
    image: "/images/projects-milo-cover.webp",
    imagePosition: "center 46%",
    tags: ["Menü Çekimi", "Reels", "Fotoğraf"],
    shortDesc: "Menü, Reels ve Fotoğraf Çekimi",
    challenge:
      "Milo Restaurant, yeni menüsünü ve ambiyansını dijital platformlarda doğru biçimde yansıtacak profesyonel görsel içeriklere ihtiyaç duyuyordu. Mevcut görseller markanın kalite anlayışını yeterince ifade etmiyordu.",
    solution:
      "Restoranın atmosferini ve mutfağını en iyi şekilde yansıtan stüdyo kalitesinde menü fotoğrafları çektik. Sosyal medya için dinamik Reels içerikleri ürettik ve tüm görsel dili markanın kimliğiyle uyumlu hale getirdik.",
    services: ["Menü Fotoğrafçılığı", "Reels Prodüksiyon", "Ürün Çekimi", "Sosyal Medya İçeriği"],
    gallery: [
      "/videos/milo-kokteyl.mp4",
      "/videos/milo-smash.mp4",
      "/images/projects-milo-gallery-1.jpg",
      "/images/projects-milo-gallery-2.jpg",
      "/images/projects-milo-gallery-3.jpg",
      "/images/projects-milo-gallery-4.jpg",
      "/images/projects-milo-gallery-5.jpg",
    ],
  },
  {
    slug: "babi-restaurant",
    name: "Babi Restaurant",
    client: "Babi Restaurant",
    year: "2024",
    image: "/images/projects-babi-cover.webp",
    imagePosition: "center 45%",
    tags: ["Fotoğraf", "Video", "Restaurant"],
    shortDesc: "Fotoğraf ve Video Çekimi",
    challenge:
      "Babi Restaurant, butik ve sıcak konseptini dijital ortamda yansıtacak, misafirlerin deneyimini hissettiren görsel içerikler istiyordu. Mekânın özgün atmosferini ve yemeğin kalitesini aynı anda aktarmak gerekiyordu.",
    solution:
      "Restoranın içini, yemeklerini ve misafir deneyimini belgeleyen kapsamlı bir fotoğraf ve video çekimi gerçekleştirdik. Cinematic video içerikler ile sosyal medyada marka hikâyesini etkili biçimde anlattık.",
    services: ["Mekân Fotoğrafçılığı", "Video Prodüksiyon", "Yemek Fotoğrafçılığı", "Kurgu & Renk"],
    gallery: [
      "/images/projects-babi-cover.webp",
    ],
  },
  {
    slug: "ritim-jewellery",
    name: "Ritim Jewellery",
    client: "Ritim Jewellery",
    year: "2024",
    image: "/images/projects-ritim-jewellery-cover.webp",
    imagePosition: "center 58%",
    tags: ["Yapay Zeka", "Reklam Filmi", "Jewellery"],
    shortDesc: "Yapay Zeka Reklam Filmi",
    challenge:
      "Ritim Jewellery, lüks takı koleksiyonunu tanıtmak için bütçe dostu ama yüksek prodüksiyon değerine sahip bir reklam filmi ihtiyacı duyuyordu. Geleneksel prodüksiyon maliyetleri markanın bütçesini aşıyordu.",
    solution:
      "Yapay zeka destekli görsel üretim teknolojilerini kullanarak koleksiyonun özünü yansıtan sinematik bir reklam filmi ürettik. AI araçları sayesinde lüks markalara yakışır bir estetik, geleneksel prodüksiyonun çok altında bir maliyetle elde edildi.",
    services: ["AI Video Prodüksiyon", "Senaryo", "Ses Tasarımı", "Renk Gradıng"],
    gallery: [
      "/videos/ritim-anneler-gunu.mp4",
      "/videos/ritim-bitti.mp4",
      "/videos/ritim-kisa1.mp4",
    ],
  },
  {
    slug: "pam-akademi",
    name: "Pam Akademi",
    client: "Pam Akademi",
    year: "2024",
    image: "/images/projects-pam-akademi-cover.webp",
    imagePosition: "center 62%",
    tags: ["Kimlik İnşası", "Web Sitesi", "Sosyal Medya"],
    shortDesc: "Kimlik İnşası, Web Sitesi ve Sosyal Medya Tasarımları",
    challenge:
      "Pam Akademi, yeni bir eğitim platformu olarak sıfırdan güçlü bir marka kimliği oluşturması ve bunu tutarlı biçimde tüm dijital kanallara yansıtması gerekiyordu.",
    solution:
      "Logo ve renk paletinden web sitesi tasarımına, sosyal medya şablonlarına kadar bütüncül bir marka kimliği oluşturduk. Kurumsal web sitesini ve sosyal medya görsel sistemini baştan sona tasarlayıp geliştirdik.",
    services: ["Marka Kimliği", "Logo Tasarımı", "Web Sitesi Tasarımı", "Sosyal Medya Tasarımı"],
    gallery: [
      "/images/projects-pam-akademi-gallery-1.jpg",
      "/images/projects-pam-akademi-gallery-2.jpg",
      "/images/projects-pam-akademi-gallery-3.jpg",
      "/images/projects-pam-akademi-gallery-4.jpg",
      "/images/projects-pam-akademi-gallery-5.jpg",
      "/images/projects-pam-akademi-gallery-6.jpg",
      "/images/projects-pam-akademi-gallery-7.jpg",
    ],
  },
  {
    slug: "foton-saglik-cozumleri",
    name: "Foton Sağlık Çözümleri",
    client: "Foton Sağlık Çözümleri",
    year: "2024",
    image: "/images/projects-foton-medical-cover.webp",
    imagePosition: "center",
    tags: ["Web Sitesi", "UI/UX", "Kurumsal"],
    variant: "website",
    websiteUrl: "https://www.fotonsc.com",
    shortDesc: "Kurumsal Web Sitesi Tasarımı ve Geliştirme",
    challenge:
      "Foton Sağlık Çözümleri, sağlık teknolojileri alanında güven veren ve kurumsal kimliğini yansıtan, kullanımı kolay bir web sitesine ihtiyaç duyuyordu. Mevcut dijital varlıkları sektördeki konumlarını yeterince ifade etmiyordu.",
    solution:
      "Sektöre özgü güven unsurlarını ön plana çıkaran, modern ve temiz bir UI/UX tasarımı oluşturduk. Tüm hizmetleri ve ürünleri net biçimde sergileyen, mobil uyumlu kurumsal web sitesini tasarlayıp geliştirdik.",
    services: ["UI/UX Tasarım", "Web Geliştirme", "Kurumsal Kimlik", "SEO Altyapısı"],
    gallery: [
      "/images/projects-foton-medical-cover.webp",
    ],
  },
];

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return projects.find((p) => p.slug === slug);
}
