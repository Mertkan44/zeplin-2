import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Chatbot ve sesli asistan tek sayfada birleşti; paylaşılmış eski adresler ilgili bölüme gider.
  async redirects() {
    return [
      { source: "/hizmetler/akilli-chatbot", destination: "/hizmetler/yapay-zeka#chatbot", permanent: true },
      { source: "/hizmetler/sesli-asistan", destination: "/hizmetler/yapay-zeka#callbot", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*.(webp|avif|png|jpg|jpeg|svg|mp4)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
