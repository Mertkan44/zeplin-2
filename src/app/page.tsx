import type { Metadata } from "next";
import HeroStage from "@/components/HeroStage";
import BentoGrid from "@/components/BentoGrid";
import HomeScrollReset from "@/components/HomeScrollReset";
import HomeServices from "@/components/HomeServices";
import HomeProcess from "@/components/HomeProcess";
import dynamic from "next/dynamic";
import { projects } from "@/data/projects";
import { createPageMetadata, siteConfig } from "@/lib/seo";
import { whatsappUrl } from "@/lib/contact";
import { CLIENT_BRANDS, CLIENT_VIDEOS } from "@/data/clients";

export const metadata: Metadata = createPageMetadata({
  title: "Zeplin Media | İstanbul Dijital Ajans",
  description: siteConfig.description,
  path: "/",
});

const ServiceCircleDiagram = dynamic(() => import("@/components/ServiceCircleDiagram"));
const VideoTestimonials = dynamic(() => import("@/components/VideoTestimonials"));
const BrandMarquee = dynamic(() => import("@/components/BrandMarquee"));
const SocialBoardingPass = dynamic(() => import("@/components/SocialBoardingPass"));



const blocks = [
  {
    title: "projelerimiz",
    description: "markaların dijital dönüşüm hikayelerini birlikte yazıyoruz.",
    items: ["UI/UX Tasarım", "Web Geliştirme", "AI İçerik", "Video Prodüksiyon"],
    href: "/projeler",
    projects: [
      ...projects.map((p) => ({
        slug: p.slug,
        name: p.name,
        description: p.shortDesc,
        image: p.image,
        imagePosition: p.imagePosition,
        tags: p.tags,
        variant: p.variant,
        year: p.year,
        client: p.client,
      })),
    ],
  },
  {
    title: "hakkımızda",
    description: "yaratıcı çözümlerle markaların dijital dünyada fark yaratmasını sağlıyoruz.",
    items: [],
    backgroundImage: "/images/dag-optimized.webp",
    socials: [
      { name: "Instagram", url: "https://www.instagram.com/zeplin.media/" },
      { name: "LinkedIn", url: "https://www.linkedin.com/company/zeplin-media/" },
      { name: "WhatsApp", url: whatsappUrl("Merhaba Zeplin Media, web sitenizden ulaşıyorum.") },
    ],
  },
];

export default function Home() {
  return (
    <main>
      <HomeScrollReset />

      <HeroStage />

      {/* Menü bu noktaya gelince beliriyor — hero'nun sticky pinlemesi
          bittiği, bir sonraki bölümün başladığı tam sınır. Bkz. Navbar.tsx */}
      <div id="hero-nav-sentinel" aria-hidden="true" />

      {/* Ziyaretçinin sırasıyla sorduğu sorular: kim güveniyor → işler iyi mi →
          ihtiyacımı karşılıyor mu → başlayınca ne olacak → deneyim nasıl →
          başka neler var → diğer kanallar. Bkz. docs inceleme, madde 14. */}
      <BrandMarquee
        brands={CLIENT_BRANDS}
      />

      <BentoGrid blocks={[blocks[0]]} sectionId="home-first-section" />

      <HomeServices />

      <HomeProcess />

      <VideoTestimonials testimonials={CLIENT_VIDEOS} />

      <ServiceCircleDiagram />

      {/* Üstteki koyu hizmet çemberiyle arasında nefes payı: iki koyu blok birbirine değmesin. */}
      <section className="px-5 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SocialBoardingPass socials={blocks[1].socials ?? []} />
        </div>
      </section>
    </main>
  );
}
