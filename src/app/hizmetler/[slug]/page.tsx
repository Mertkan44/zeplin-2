import { notFound } from "next/navigation";
import { services, getServiceBySlug } from "@/data/services";
import { ServiceDetailTemplate } from "@/components/services/ServiceDetailTemplate";
import { AIServicePage } from "@/components/services/AIServicePage";
import { VideoServicePage } from "@/components/services/VideoServicePage";
import { ChatbotServicePage } from "@/components/services/ChatbotServicePage";
import { VoiceServicePage } from "@/components/services/VoiceServicePage";
import { SoftwareServicePage } from "@/components/services/SoftwareServicePage";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  jsonLdScript,
  serviceJsonLd,
  siteConfig,
} from "@/lib/seo";

import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return services
    .filter((s) => !s.slug.startsWith("__"))
    .map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) {
    return createPageMetadata({
      title: "Hizmet Bulunamadı",
      description: siteConfig.shortDescription,
      path: `/hizmetler/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: `${service.title} Hizmeti`,
    description: `${service.shortDesc}. ${service.longDesc}`,
    path: `/hizmetler/${service.slug}`,
    image: service.heroImage,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

  const structuredData = [
    breadcrumbJsonLd([
      { name: "Ana sayfa", path: "/" },
      { name: "Hizmetler", path: "/hizmetler" },
      { name: service.title, path: `/hizmetler/${service.slug}` },
    ]),
    serviceJsonLd(service),
  ];

  const content =
    service.customPage === "chatbot" ? (
      <ChatbotServicePage service={service} />
    ) : service.customPage === "voice" ? (
      <VoiceServicePage service={service} />
    ) : service.customPage === "software" ? (
      <SoftwareServicePage service={service} />
    ) : service.customPage === "ai" ? (
      <AIServicePage service={service} />
    ) : service.customPage === "video" ? (
      <VideoServicePage service={service} />
    ) : (
      <ServiceDetailTemplate service={service} />
    );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(structuredData)} />
      {content}
    </>
  );
}
