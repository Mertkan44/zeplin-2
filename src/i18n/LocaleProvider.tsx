"use client";

import { createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { localeFromPath, type Locale } from "./config";
import { tr, type Dictionary } from "./dictionaries/tr";
import { en } from "./dictionaries/en";

const DICTIONARIES: Record<Locale, Dictionary> = { tr, en };

const LocaleContext = createContext<Locale>("tr");

/** Dili adresten belirler (/en/... → en); hangi yönlendirme yöntemi seçilirse seçilsin çalışır. */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = localeFromPath(usePathname() ?? "/");
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useT(): Dictionary {
  return DICTIONARIES[useContext(LocaleContext)];
}
