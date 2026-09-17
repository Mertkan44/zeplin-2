import type { Metadata } from "next";
import type { ProjectData } from "@/data/projects";
import type { ServiceData } from "@/data/services";

export const siteConfig = {
  name: "Zeplin Media",
  legalName: "Zeplin Media Dijital Ajans",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.zeplinmedia.com",
  locale: "tr_TR",
  language: "tr",
  description:
    "Zeplin Media; sosyal medya yönetimi, içerik üretimi, web geliştirme, marka danışmanlığı, video prodüksiyon ve yapay zeka otomasyonları sunan İstanbul merkezli dijital ajanstır.",
  shortDescription:
    "İstanbul merkezli profesyonel dijital ajans: sosyal medya, içerik, web, video, marka ve yapay zeka otomasyonu.",
  email: "info@zeplinmedia.com",
  phone: "+90 545 940 76 90",
  address: {
    locality: "İstanbul",
    region: "İstanbul",
    country: "TR",
    street: "Levent",
  },
  logo: "/zeplin-logo.png",
  ogImage: "/images/hero-crt-forest-optimized.webp",
  social: {
    instagram: "https://www.instagram.com/zeplin.media/",
    linkedin: "https://www.linkedin.com/company/zeplin-media/",
    whatsapp: "https://wa.me/905459407690",
  },
  keywords: [
    "Zeplin Media",
    "dijital ajans",
    "İstanbul dijital ajans",
    "sosyal medya yönetimi",
    "içerik üretimi",
    "web geliştirme",
    "marka danışmanlığı",
    "video prodüksiyon",
    "yapay zeka otomasyonu",
    "AI chatbot",
  ],
} as const;

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  return new URL(path, siteConfig.url).toString();
}

export function normalizePath(path = "/") {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export function toPlainText(value: string, maxLength = 170) {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;

  const clipped = text.slice(0, maxLength - 1);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > 80 ? lastSpace : clipped.length).trim()}…`;
}

export function createPageMetadata({
  title,
  description,
  path,
  image = siteConfig.ogImage,
  type = "website",
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const pathname = normalizePath(path);
  const canonical = absoluteUrl(pathname);
  const normalizedDescription = toPlainText(description);

  return {
    title,
    description: normalizedDescription,
    alternates: {
      canonical: pathname,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      title,
      description: normalizedDescription,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [
        {
          url: absoluteUrl(image),
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} dijital ajans`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: normalizedDescription,
      images: [absoluteUrl(image)],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.logo),
    image: absoluteUrl(siteConfig.logo),
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: siteConfig.phone,
        email: siteConfig.email,
        areaServed: "TR",
        availableLanguage: ["tr", "en"],
      },
    ],
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.linkedin,
      siteConfig.social.whatsapp,
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: siteConfig.language,
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
  };
}

export function professionalServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.url}/#professional-service`,
    name: siteConfig.name,
    url: siteConfig.url,
    image: absoluteUrl(siteConfig.logo),
    priceRange: "$$",
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
    areaServed: [
      { "@type": "Country", name: "Türkiye" },
      { "@type": "AdministrativeArea", name: "İstanbul" },
    ],
    serviceType: [
      "Sosyal medya yönetimi",
      "İçerik üretimi",
      "Web geliştirme",
      "Marka danışmanlığı",
      "Video prodüksiyon",
      "Yapay zeka otomasyonu",
    ],
  };
}

export function serviceJsonLd(service: ServiceData) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(`/hizmetler/${service.slug}`)}#service`,
    name: service.title,
    serviceType: service.categoryLabel,
    description: toPlainText(service.longDesc, 260),
    image: absoluteUrl(service.heroImage),
    url: absoluteUrl(`/hizmetler/${service.slug}`),
    provider: {
      "@id": `${siteConfig.url}/#organization`,
    },
    areaServed: {
      "@type": "Country",
      name: "Türkiye",
    },
  };
}

export function projectJsonLd(project: ProjectData) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${absoluteUrl(`/projeler/${project.slug}`)}#case-study`,
    name: `${project.name} - Zeplin Media Projesi`,
    headline: project.shortDesc,
    description: toPlainText(`${project.challenge} ${project.solution}`, 300),
    image: absoluteUrl(project.image),
    url: absoluteUrl(`/projeler/${project.slug}`),
    datePublished: `${project.year}-01-01`,
    creator: {
      "@id": `${siteConfig.url}/#organization`,
    },
    about: project.services,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function jsonLdScript(data: unknown) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}
