/** Dil altyapısı. Türkçe kök adreste (/hizmetler), İngilizce /en önekiyle (/en/hizmetler). */
export const LOCALES = ["tr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "tr";

/**
 * Yayında görünen diller. Bir dil buraya ancak sayfaları gerçekten çevrildiğinde
 * eklenir; aksi halde dil düğmesi yarım çevrilmiş sayfalara götürür.
 */
export const ENABLED_LOCALES: readonly Locale[] = ["tr"];

export const LOCALE_LABELS: Record<Locale, string> = { tr: "TR", en: "EN" };
export const HTML_LANG: Record<Locale, string> = { tr: "tr", en: "en" };

export function localeFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : DEFAULT_LOCALE;
}

/** Yolu hedef dile çevirir: ("/hizmetler", "en") → "/en/hizmetler" */
export function localizePath(pathname: string, locale: Locale): string {
  const bare = localeFromPath(pathname) === "en" ? pathname.replace(/^\/en(?=\/|$)/, "") || "/" : pathname;
  if (locale === DEFAULT_LOCALE) return bare;
  return bare === "/" ? "/en" : `/en${bare}`;
}
