"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ENABLED_LOCALES, LOCALE_LABELS, localizePath } from "./config";
import { useLocale, useT } from "./LocaleProvider";

/** Yalnızca birden fazla dil yayındaysa görünür (bkz. ENABLED_LOCALES). */
export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const pathname = usePathname() ?? "/";
  const current = useLocale();
  const t = useT();
  if (ENABLED_LOCALES.length < 2) return null;

  return (
    <nav aria-label={t.nav.language} className={`flex gap-1 ${className}`}>
      {ENABLED_LOCALES.map((locale) => (
        <Link
          key={locale}
          href={localizePath(pathname, locale)}
          hrefLang={locale}
          lang={locale}
          aria-current={locale === current ? "true" : undefined}
          className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
            locale === current ? "bg-white text-[#9D174D]" : "text-white/80 hover:bg-white/15 hover:text-white"
          }`}
        >
          {LOCALE_LABELS[locale]}
        </Link>
      ))}
    </nav>
  );
}
