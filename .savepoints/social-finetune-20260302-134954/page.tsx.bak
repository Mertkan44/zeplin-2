import HeroBanner from "@/components/HeroBanner";
import BentoGrid from "@/components/BentoGrid";
import ServiceCircleDiagram from "@/components/ServiceCircleDiagram";
import ServiceCarousel from "@/components/ServiceCarousel";


const blocks = [
  {
    title: "hizmetlerimiz",
    description: "dijital strateji, sosyal medya yönetimi, içerik üretimi ve marka danışmanlığı.",
    items: ["Sosyal Medya Yönetimi", "İçerik Üretimi", "Marka Danışmanlığı", "Dijital Strateji"],
    backgroundImage: "/images/dag.png",
    href: "/hizmetler",
  },
  {
    title: "projelerimiz",
    description: "markaların dijital dönüşüm hikayelerini birlikte yazıyoruz.",
    items: ["UI/UX Tasarım", "Web Geliştirme", "AI İçerik", "Video Prodüksiyon"],
    href: "/projeler",
    projects: [
      { name: "Marka X Lansmanı", image: "/images/dag.png" },
      { name: "E-Ticaret Rebrand", image: "/images/dag.png" },
      { name: "Sosyal Medya Kampanya", image: "/images/dag.png" },
      { name: "Video Prodüksiyon", image: "/images/dag.png" },
      { name: "AI İçerik Projesi", image: "/images/dag.png" },
    ],
  },
  {
    title: "hakkımızda",
    description: "yaratıcı çözümlerle markaların dijital dünyada fark yaratmasını sağlıyoruz.",
    items: [],
    backgroundImage: "/images/dag.png",
    socials: [
      { name: "Instagram", url: "https://www.instagram.com/zeplin.media/" },
      { name: "LinkedIn", url: "https://www.linkedin.com/company/zeplin-media/" },
      { name: "WhatsApp", url: "https://wa.me/905459407690" },
    ],
  },
];

export default function Home() {
  return (
    <main>
      <HeroBanner />

      <BentoGrid blocks={blocks} />

      <ServiceCircleDiagram />
      <ServiceCarousel />
    </main>
  );
}
