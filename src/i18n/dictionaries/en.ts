import type { Dictionary } from "./tr";

/** İngilizce ortak arayüz metinleri. ENABLED_LOCALES'e "en" eklenene kadar yayında görünmez. */
export const en: Dictionary = {
  nav: {
    home: "home",
    services: "services",
    projects: "work",
    about: "about",
    mainMenu: "Main menu",
    mobileNav: "Mobile navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    whatsappCta: "Message us on WhatsApp",
    skipToContent: "Skip to content",
    language: "Language",
  },
  footer: {
    headline: "This is only the",
    headlineEm: "beginning.",
    lead: "Tell us about your project; we'll read your brief and get back to you within one business day.",
    briefCta: "Start a project",
    pages: "Pages",
    contact: "Contact",
    social: "Social",
    location: "Istanbul, Türkiye",
    cookies: "Cookie Policy",
    privacy: "Privacy Policy",
    footerMenu: "Footer menu",
    links: {
      home: "Home",
      services: "Services",
      projects: "Work",
      gallery: "Gallery",
      operations: "Operations",
      about: "About",
      contact: "Contact",
    },
  },
  cta: {
    eyebrow: "contact",
    title: "Let's talk about your project.",
    lead: "Get in touch for a proposal tailored to what you need.",
    brief: "Start a project",
    whatsapp: "WhatsApp",
  },
  whatsapp: {
    general: "Hello Zeplin Media, I'm reaching out from your website. I'd like to talk about my project.",
    service: (name: string) => `Hello Zeplin Media, I'd like to learn more about ${name}.`,
    project: (name: string) =>
      `Hello Zeplin Media, I saw the ${name} project on your website and would like to talk about something similar.`,
  },
};
