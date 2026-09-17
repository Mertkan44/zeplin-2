import type { Metadata, Viewport } from "next";
import { Jost, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import ScrollRevealRescue from "@/components/ScrollRevealRescue";
import {
  jsonLdScript,
  organizationJsonLd,
  professionalServiceJsonLd,
  siteConfig,
  websiteJsonLd,
} from "@/lib/seo";

const jost = Jost({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jost",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: "Zeplin Media | İstanbul Dijital Ajans",
    template: "%s | Zeplin Media",
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "Dijital Ajans",
  classification: "Marketing, Creative Agency, Web Development, Artificial Intelligence",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Zeplin Media | İstanbul Dijital Ajans",
    description: siteConfig.shortDescription,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Zeplin Media dijital ajans vitrini",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zeplin Media | İstanbul Dijital Ajans",
    description: siteConfig.shortDescription,
    images: [siteConfig.ogImage],
  },
  robots: {
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
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff1f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://use.typekit.net" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="" />
        <link
          rel="preload"
          as="image"
          href="/images/hero-crt-forest-optimized.webp"
          fetchPriority="high"
        />
        <link rel="stylesheet" href="https://use.typekit.net/ryi5mzw.css" />
        <link rel="stylesheet" href="https://use.typekit.net/fad1vyk.css" />
        <link rel="stylesheet" href="https://use.typekit.net/psq5rwo.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript([
            organizationJsonLd(),
            websiteJsonLd(),
            professionalServiceJsonLd(),
          ])}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark";document.documentElement.classList.toggle("dark",d);document.documentElement.dataset.theme=d?"dark":"light"}catch(e){document.documentElement.classList.remove("dark");document.documentElement.dataset.theme="light"}})()`,
          }}
        />
      </head>
      <body className={`${jost.variable} ${instrumentSerif.variable} font-sans antialiased`}>
        <ThemeProvider>
          <Navbar />
          {children}
          <Footer />
          <ScrollRevealRescue />
        </ThemeProvider>
      </body>
    </html>
  );
}
