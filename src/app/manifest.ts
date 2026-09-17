import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Zeplin Media - Dijital Ajans",
    short_name: "Zeplin",
    description: siteConfig.shortDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fff1f7",
    theme_color: "#db2777",
    lang: "tr",
    categories: ["business", "productivity", "marketing"],
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/zeplin-logo.png",
        sizes: "200x230",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
