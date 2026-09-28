/**
 * Birlikte çalışılan markalar ve gerçek müşteri videoları.
 * Ana sayfa (BrandMarquee, VideoTestimonials) ve Hakkımızda aynı listeyi kullanır.
 */

export interface ClientBrand {
  name: string;
  logo?: string;
}

export const CLIENT_BRANDS: ClientBrand[] = [
  { name: "Gentleman", logo: "/brand-logos/gentleman-logo.webp" },
  { name: "Hisar", logo: "/brand-logos/hisar-logo.webp" },
  { name: "Kadıköy Sin", logo: "/brand-logos/kadikoy-sin-logo.webp" },
  { name: "Master", logo: "/brand-logos/master-logo.webp" },
  { name: "Mertcan Ağca", logo: "/brand-logos/mertcan-agca-logo.webp" },
  { name: "Pam Akademi", logo: "/brand-logos/pam-akademi-logo.webp" },
  { name: "Babi İstanbul", logo: "/brand-logos/babi-logo.webp" },
  { name: "Ritim Jewellery", logo: "/brand-logos/ritim-logo.webp" },
  { name: "Foton Sağlık Çözümleri", logo: "/brand-logos/foton-logo.svg" },
];

export interface ClientVideo {
  id: string;
  videoSrc: string;
  posterSrc: string;
  brandName: string;
  personName: string;
  personRole: string;
}

export const CLIENT_VIDEOS: ClientVideo[] = [
  {
    id: "emma",
    videoSrc: "/videos/emma-web.mp4",
    posterSrc: "/videos/posters/emma-poster.jpg",
    brandName: "Emma Hanım",
    personName: "Referans Video",
    personRole: "Eren Kozan Premium Cut",
  },
  {
    id: "oguz-abi",
    videoSrc: "/videos/oguz-abi-web.mp4",
    posterSrc: "/videos/posters/oguz-abi-poster.jpg",
    brandName: "Oğuz Bey",
    personName: "Referans Video",
    personRole: "Cherry Plus",
  },
];
