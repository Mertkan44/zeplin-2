"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";

const STUCK_SELECTOR =
  '[style*="opacity:0.16"],[style*="opacity: 0.16"],[style*="opacity:0.12"],[style*="opacity: 0.12"]';

/** Kaydırma/yerleşim bu kadar süre durulunca bakılır (ms). */
const SETTLE_DELAY = 180;
/** Ekranda takılı öğe kaldıkça tekrar aralığı (ms). */
const RETRY_DELAY = 400;

/**
 * Güvenlik ağı: çok hızlı kaydırmada framer-motion'ın whileInView gözlemcisi
 * tetiklenmezse bölüm soluk başlangıç opaklığında (0.12/0.16) kalabiliyor.
 *
 * Eski sürüm 400 ms'de bir tüm sayfayı süresiz tarıyordu. Bu sürüm yalnızca
 * kaydırma durduğunda, rota değiştiğinde ya da sayfa yüksekliği değiştiğinde
 * uyanır; ekranda takılı öğe kaldığı sürece kısa aralıkla tekrar eder
 * (yeniden render stili geri yazabilir), kalmayınca tamamen durur.
 */
function useRevealRescue() {
  const pathname = usePathname();

  useEffect(() => {
    let timer = 0;

    const sweep = () => {
      const vh = window.innerHeight;
      let fixed = 0;
      document.querySelectorAll<HTMLElement>(STUCK_SELECTOR).forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top >= vh || rect.bottom <= 0) return;
        el.style.transition =
          "opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)";
        el.style.opacity = "1";
        el.style.transform = "none";
        fixed++;
      });
      if (fixed > 0) timer = window.setTimeout(sweep, RETRY_DELAY);
    };

    const schedule = (delay = SETTLE_DELAY) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(sweep, delay);
    };
    const onScroll = () => schedule();

    // Yerleşim değişimleri (geç yüklenen bölüm, görsel) öğeyi kaydırmasız
    // ekrana sokabilir: sayfa yüksekliği değişince de bak.
    const resizeObserver = new ResizeObserver(() => schedule());
    resizeObserver.observe(document.body);

    schedule(1200); // rota değişiminde giriş animasyonlarına fırsat tanı
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);
}

/**
 * Site geneli hareket ayarı + takılı reveal güvenlik ağı.
 * reducedMotion="user": azaltılmış hareket tercihinde framer-motion
 * kayma/ölçek dönüşümlerini atlar, yalnızca opaklık geçişi kalır.
 */
export default function ScrollRevealRescue({ children }: { children?: React.ReactNode }) {
  useRevealRescue();
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
