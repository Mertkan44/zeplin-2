import type { Metadata } from "next";
import GalleryGrid, { type GalleryTile } from "@/components/GalleryGrid";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Galeri",
  description: "Zeplin Media üretim, tasarım, web, video ve sosyal medya çalışmalarından seçili görsel akış.",
  path: "/galeri",
  image: "/images/projects-milo-gallery-3.jpg",
});

const galleryTiles: GalleryTile[] = [
  {
    id: "tile-1",
    title: "Milo Restaurant",
    description: "Menü çekimi, reels üretimi ve sosyal medya görselleri için sıcak, iştah açan bir içerik hattı.",
    image: "/images/projects-milo-cover.webp",
    radiusProfile: "24px",
    speed: 0.4,
    width: 340,
    colors: {
      light: { from: "#FCA5D8", to: "#EC4899", accent: "rgba(251,113,133,0.45)" },
      dark: { from: "#6E1C4A", to: "#BE185D", accent: "rgba(244,114,182,0.32)" },
    },
  },
  {
    id: "tile-2",
    title: "Babi Restaurant",
    description: "Mekan atmosferini ve servis ritmini taşıyan fotoğraf ve video çekimi.",
    image: "/images/projects-babi-cover.webp",
    radiusProfile: "24px",
    speed: 0.9,
    width: 460,
    colors: {
      light: { from: "#F472B6", to: "#DB2777", accent: "rgba(255,255,255,0.22)" },
      dark: { from: "#541434", to: "#9D174D", accent: "rgba(251,207,232,0.18)" },
    },
  },
  {
    id: "tile-3",
    title: "Foton Sağlık Çözümleri",
    description: "Medikal teknoloji markası için temiz, güven veren ve kurumsal web deneyimi.",
    image: "/images/projects-foton-medical-cover.webp",
    radiusProfile: "24px",
    speed: 0.5,
    width: 300,
    colors: {
      light: { from: "#FB7185", to: "#E11D48", accent: "rgba(251,146,60,0.35)" },
      dark: { from: "#5F1A2E", to: "#9F1239", accent: "rgba(251,113,133,0.24)" },
    },
  },
  {
    id: "tile-4",
    title: "Ritim Jewellery",
    description: "Yapay zeka reklam filmi için lüks, rafine ve sinematik görsel dünya.",
    image: "/images/projects-ritim-jewellery-cover.webp",
    radiusProfile: "24px",
    speed: 1.1,
    width: 380,
    colors: {
      light: { from: "#FBCFE8", to: "#F472B6", accent: "rgba(219,39,119,0.38)" },
      dark: { from: "#4A1434", to: "#831843", accent: "rgba(244,114,182,0.24)" },
    },
  },
  {
    id: "tile-5",
    title: "Pam Akademi",
    description: "Kimlik inşası, takvim, web sitesi ve sosyal medya tasarımlarını bir araya getiren bütüncül çalışma.",
    image: "/images/projects-pam-akademi-cover.webp",
    radiusProfile: "24px",
    speed: 0.3,
    width: 420,
    colors: {
      light: { from: "#FDA4AF", to: "#FB7185", accent: "rgba(255,255,255,0.24)" },
      dark: { from: "#612038", to: "#9F1239", accent: "rgba(255,241,242,0.15)" },
    },
  },
  {
    id: "tile-6",
    title: "Milo Restaurant",
    description: "Menü çekiminden bir kare — ışık ve dokunun ön planda olduğu ürün fotoğrafçılığı.",
    image: "/images/projects-milo-gallery-2.jpg",
    radiusProfile: "24px",
    speed: 0.8,
    width: 320,
    colors: {
      light: { from: "#F9A8D4", to: "#EC4899", accent: "rgba(255,255,255,0.2)" },
      dark: { from: "#5B1A40", to: "#A21CAF", accent: "rgba(244,114,182,0.2)" },
    },
  },
  {
    id: "tile-7",
    title: "Pam Akademi",
    description: "Kütüphane Kulübü sosyal medya görseli — marka maskotu ve tipografik kimlik.",
    image: "/images/projects-pam-akademi-gallery-2.jpg",
    radiusProfile: "24px",
    speed: 0.6,
    width: 340,
    colors: {
      light: { from: "#F472B6", to: "#BE185D", accent: "rgba(255,255,255,0.18)" },
      dark: { from: "#4A1531", to: "#831843", accent: "rgba(244,114,182,0.2)" },
    },
  },
  {
    id: "tile-8",
    title: "Milo Restaurant",
    description: "Servis anından bir kare — atmosferi ve sunumu birlikte anlatan içerik üretimi.",
    image: "/images/projects-milo-gallery-4.jpg",
    radiusProfile: "24px",
    speed: 1.0,
    width: 400,
    colors: {
      light: { from: "#FDA4AF", to: "#EC4899", accent: "rgba(244,114,182,0.3)" },
      dark: { from: "#5F2137", to: "#BE185D", accent: "rgba(251,113,133,0.2)" },
    },
  },
  {
    id: "tile-9",
    title: "Pam Akademi",
    description: "Bursluluk & Kabul Sınavı kampanya afişi — kampanya bazlı sosyal medya üretimi.",
    image: "/images/projects-pam-akademi-gallery-5.jpg",
    radiusProfile: "24px",
    speed: 0.4,
    width: 300,
    colors: {
      light: { from: "#FBCFE8", to: "#F43F5E", accent: "rgba(253,186,116,0.28)" },
      dark: { from: "#4B162C", to: "#9F1239", accent: "rgba(251,146,60,0.14)" },
    },
  },
  {
    id: "tile-10",
    title: "Milo Restaurant",
    description: "Menü fotoğrafçılığından bir diğer üretim — sıcak ve iştah açan bir görsel dil.",
    image: "/images/projects-milo-gallery-1.jpg",
    radiusProfile: "24px",
    speed: 0.7,
    width: 360,
    colors: {
      light: { from: "#FB7185", to: "#DB2777", accent: "rgba(255,255,255,0.18)" },
      dark: { from: "#651D38", to: "#BE185D", accent: "rgba(255,255,255,0.12)" },
    },
  },
  {
    id: "tile-11",
    title: "Pam Akademi",
    description: "Web sitesi lansman duyurusu — kimlikten dijitale uzanan bütüncül üretim.",
    image: "/images/projects-pam-akademi-gallery-1.jpg",
    radiusProfile: "24px",
    speed: 1.0,
    width: 300,
    colors: {
      light: { from: "#F9A8D4", to: "#FB7185", accent: "rgba(255,255,255,0.2)" },
      dark: { from: "#58223A", to: "#A21CAF", accent: "rgba(244,114,182,0.2)" },
    },
  },
];

export default function GaleriPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white pt-28 text-zinc-950 dark:bg-[#0a0a0a] dark:text-white md:pt-32">
      <section
        className="relative mx-auto mb-8 flex min-h-[420px] max-w-[1200px] overflow-hidden rounded-[28px] bg-cover bg-center px-6 py-12 md:mb-12 md:min-h-[520px] md:px-12 md:py-16"
        style={{ backgroundImage: "url('/images/projects-milo-gallery-3.jpg')" }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0.86)_0%,rgba(10,10,10,0.54)_46%,rgba(10,10,10,0.16)_100%)]" />
        <div className="relative mt-auto max-w-[620px]">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#F472B6]">
            seçili işler
          </p>
          <h1 className="text-[42px] font-bold leading-[0.98] tracking-[-0.04em] text-white md:text-[72px]">
            Galeri
          </h1>
          <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.75] text-white/64 md:text-[17px]">
            Fotoğraf, video, web, sosyal medya ve kimlik çalışmalarından seçili parçaları tek akışta topladık.
          </p>
        </div>
      </section>
      <GalleryGrid tiles={galleryTiles} />
    </main>
  );
}
