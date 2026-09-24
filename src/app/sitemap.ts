import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { absoluteUrl } from "@/lib/seo";

const staticRoutes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/hizmetler", priority: 0.95, changeFrequency: "weekly" as const },
  { path: "/projeler", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/operasyonlar", priority: 0.85, changeFrequency: "monthly" as const },
  { path: "/hakkimizda", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/galeri", priority: 0.75, changeFrequency: "monthly" as const },
  { path: "/iletisim", priority: 0.8, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  /* lastModified bilerek verilmiyor: her yayında "bugün" yazmak arama
     motorlarına yanlış bir güncellik sinyali veriyordu. Gerçek içerik
     değişiklik tarihleri veri modeline eklenince buraya bağlanabilir. */
  const uniqueServices = Array.from(new Map(services.map((service) => [service.slug, service])).values());

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route.path),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...uniqueServices.map((service) => ({
      url: absoluteUrl(`/hizmetler/${service.slug}`),
      changeFrequency: "monthly" as const,
      priority: service.customPage ? 0.86 : 0.78,
      images: [absoluteUrl(service.heroImage)],
    })),
    ...projects.map((project) => ({
      url: absoluteUrl(`/projeler/${project.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.76,
      images: [absoluteUrl(project.image)],
    })),
  ];
}
