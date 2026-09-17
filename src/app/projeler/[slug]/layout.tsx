import type { Metadata } from "next";
import { projects, getProjectBySlug } from "@/data/projects";
import {
  breadcrumbJsonLd,
  createPageMetadata,
  jsonLdScript,
  projectJsonLd,
  siteConfig,
} from "@/lib/seo";

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return createPageMetadata({
      title: "Proje Bulunamadı",
      description: siteConfig.shortDescription,
      path: `/projeler/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: `${project.name} Projesi`,
    description: `${project.client} için ${project.shortDesc}. ${project.solution}`,
    path: `/projeler/${project.slug}`,
    image: project.image,
  });
}

export default async function ProjectDetailLayout({ children, params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) return children;

  const structuredData = [
    breadcrumbJsonLd([
      { name: "Ana sayfa", path: "/" },
      { name: "Projeler", path: "/projeler" },
      { name: project.name, path: `/projeler/${project.slug}` },
    ]),
    projectJsonLd(project),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(structuredData)} />
      {children}
    </>
  );
}
