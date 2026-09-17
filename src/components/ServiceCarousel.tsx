"use client";

import Image from "next/image";
import { useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SepetCard from "@/components/SepetCard";

/* ─── Data ────────────────────────────────────────────────────────────────── */

const services = [
  {
    id: "marka-yonetimi",
    emoji: "📊",
    topLine: "marka",
    bottomLine: "yönetimi",
    desc: "Sosyal medya yönetimi, Growth stratejisi, Viral içerik planı",
    price: 3000,
    unit: "aylık",
  },
  {
    id: "fotograf-cekimi",
    emoji: "📸",
    topLine: "fotoğraf",
    bottomLine: "çekimi",
    desc: "Profesyonel fotoğraf çekimi, yapay zeka ile ölçeklendirilmiş",
    price: 2500,
    unit: "paket",
  },
  {
    id: "reels-cekimi",
    emoji: "▶️",
    topLine: "reels",
    bottomLine: "çekimi",
    desc: "Profesyonel reels çekimi, yapay zeka ile ölçeklendirilmiş",
    price: 1500,
    unit: "adet",
  },
  {
    id: "akilli-chatbot",
    emoji: "🤖",
    topLine: "akıllı",
    bottomLine: "chatbot",
    desc: "WhatsApp & web entegrasyonlu AI destekli müşteri asistanı",
    price: 4000,
    unit: "aylık",
  },
  {
    id: "sosyal-medya",
    emoji: "✨",
    topLine: "sosyal medya",
    bottomLine: "tasarımı",
    desc: "İçerik tasarımı, post ve story şablonları, marka kiti",
    price: 3000,
    unit: "aylık",
  },
];

type Service = (typeof services)[number];
type DroppedServiceItem = {
  service: Service;
  quantity: number;
};
const DRAG_SERVICE_MIME = "application/x-zeplin-service";
const serviceById = new Map<string, Service>(
  services.map((service) => [service.id, service]),
);

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function wrap(i: number, len: number) {
  return ((i % len) + len) % len;
}

function formatPrice(n: number) {
  return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatTl(n: number) {
  return `${Math.round(n).toLocaleString("tr-TR")}TL`;
}

/* ─── Component ───────────────────────────────────────────────────────────── */

export default function ServiceCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [droppedServices, setDroppedServices] = useState<DroppedServiceItem[]>([]);
  const [isDropZoneActive, setIsDropZoneActive] = useState(false);

  const len = services.length;
  const prev = wrap(activeIndex - 1, len);
  const next = wrap(activeIndex + 1, len);

  const go = useCallback(
    (dir: -1 | 1) => setActiveIndex((i) => wrap(i + dir, len)),
    [len],
  );

  /* pointer swipe */
  const pointerX = useRef<number | null>(null);
  const onDown = (e: React.PointerEvent) => {
    pointerX.current = e.clientX;
  };
  const onUp = (e: React.PointerEvent) => {
    if (pointerX.current === null) return;
    const dx = e.clientX - pointerX.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    pointerX.current = null;
  };

  /* keyboard */
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };

  /* slot config: [index, translateX, scale, opacity, blur, zIndex] */
  const slots: [number, string, string, string, string, number][] = [
    [prev, "-440px", "0.75", "0.35", "blur-[2px]", 1],
    [activeIndex, "0px", "1", "1", "", 10],
    [next, "440px", "0.75", "0.35", "blur-[2px]", 1],
  ];

  const addServiceToDropZone = useCallback((serviceId: string) => {
    const service = serviceById.get(serviceId);
    if (!service) return;

    setDroppedServices((prev) => {
      const existingIndex = prev.findIndex((item) => item.service.id === service.id);
      if (existingIndex === -1) {
        return [...prev, { service, quantity: 1 }];
      }

      const next = [...prev];
      next[existingIndex] = {
        ...next[existingIndex],
        quantity: next[existingIndex].quantity + 1,
      };
      return next;
    });
  }, []);

  const changeDroppedServiceQuantity = useCallback((serviceId: string, delta: number) => {
    setDroppedServices((prev) => {
      const existingIndex = prev.findIndex((item) => item.service.id === serviceId);
      if (existingIndex === -1) return prev;

      const next = [...prev];
      const nextQuantity = next[existingIndex].quantity + delta;
      if (nextQuantity <= 0) {
        next.splice(existingIndex, 1);
        return next;
      }

      next[existingIndex] = {
        ...next[existingIndex],
        quantity: nextQuantity,
      };
      return next;
    });
  }, []);

  const handleCardDragStart = (
    serviceId: string,
    e: React.DragEvent<HTMLDivElement>,
  ) => {
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData(DRAG_SERVICE_MIME, serviceId);
    setIsDropZoneActive(true);
  };

  const handleCardDragEnd = () => {
    setIsDropZoneActive(false);
  };

  const handleDropZoneDragOver = (e: React.DragEvent<HTMLElement>) => {
    if (!Array.from(e.dataTransfer.types).includes(DRAG_SERVICE_MIME)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    if (!isDropZoneActive) setIsDropZoneActive(true);
  };

  const handleDropZoneDragLeave = () => {
    setIsDropZoneActive(false);
  };

  const handleDropZoneDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    const serviceId = e.dataTransfer.getData(DRAG_SERVICE_MIME);
    if (!serviceId) return;

    addServiceToDropZone(serviceId);
    setIsDropZoneActive(false);
  };

  const araToplam = droppedServices.reduce(
    (sum, item) => sum + item.service.price * item.quantity,
    0,
  );
  const kdv = araToplam * 0.2;
  const genelToplam = araToplam + kdv;

  return (
    <section className="relative isolate overflow-hidden px-4 py-20">
      {/* Title */}
      <div className="mb-14 text-center">
        <h2
          className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-5xl"
          style={{ fontFamily: 'var(--font-jost), sans-serif' }}
        >
          Kendi Paketini Oluştur
        </h2>
        <p
          className="mx-auto mt-3 max-w-md text-base font-light text-zinc-500 dark:text-white/40"
          style={{ fontFamily: 'var(--font-jost), sans-serif' }}
        >
          ihtiyacına uygun hizmetleri seç, paketini kendin oluştur
        </p>
      </div>

      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-white to-transparent dark:from-[#0a0a0a]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-white to-transparent dark:from-[#0a0a0a]" />

      {/* Carousel */}
      <div
        className="relative mx-auto flex min-h-[280px] max-w-[1100px] items-center justify-center"
        onPointerDown={onDown}
        onPointerUp={onUp}
        onKeyDown={onKey}
        tabIndex={0}
        role="region"
        aria-label="Hizmet carousel"
      >
        {slots.map(([idx, tx, sc, op, blur, z]) => {
          const s = services[idx];
          const isActive = idx === activeIndex;

          const cardContent = (
            <SepetCard
              topLine={s.topLine}
              bottomLine={s.bottomLine}
              ctaLeft="detayları incele"
              ctaRight={`${formatPrice(s.price)} TL`}
            />
          );

          return (
            <div
              key={s.id + "-" + idx}
              className={`absolute w-[420px] transition-all duration-300 ease-out ${blur} ${!isActive ? "pointer-events-none" : ""
                } md:block ${!isActive ? "hidden" : ""} ${isActive ? "cursor-grab active:cursor-grabbing" : ""
                }`}
              style={{
                transform: `translateX(${tx}) scale(${sc})`,
                opacity: op,
                zIndex: z,
              }}
              draggable={isActive}
              onDragStart={isActive ? (e) => handleCardDragStart(s.id, e) : undefined}
              onDragEnd={isActive ? handleCardDragEnd : undefined}
            >
              {cardContent}
            </div>
          );
        })}

        {/* Left arrow */}
        <button
          onClick={() => go(-1)}
          className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white/60 text-zinc-500 transition-colors hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          aria-label="Önceki"
        >
          ‹
        </button>

        {/* Right arrow */}
        <button
          onClick={() => go(1)}
          className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white/60 text-zinc-500 transition-colors hover:bg-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          aria-label="Sonraki"
        >
          ›
        </button>
      </div>

      <div className="pointer-events-none relative mx-auto mt-8 w-full max-w-[1380px] px-2 sm:mt-10">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#ea7fb6]/85 to-transparent dark:via-[#ff78c5]/75" />
        <div className="mx-auto mt-[2px] h-[16px] w-[68%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(235,127,182,0.25)_0%,rgba(235,127,182,0)_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,120,197,0.28)_0%,rgba(255,120,197,0)_74%)]" />
      </div>

      <div className="relative mx-auto mt-6 grid w-full max-w-[1380px] grid-cols-1 gap-5 px-2 sm:mt-8 lg:mt-10 lg:grid-cols-[minmax(0,1.36fr)_minmax(0,1fr)] lg:items-start">
        <div className="pointer-events-none absolute -inset-x-16 -inset-y-10 z-0">
          <div className="absolute -left-[8%] top-[26%] h-[36vw] w-[36vw] max-h-[460px] max-w-[460px] rounded-full bg-pink-300/18 blur-3xl dark:bg-fuchsia-500/20" />
          <div className="absolute -right-[10%] bottom-[4%] h-[32vw] w-[32vw] max-h-[420px] max-w-[420px] rounded-full bg-rose-300/14 blur-3xl dark:bg-pink-500/18" />
          <div className="absolute left-[14%] top-[18%] h-[14vw] w-[14vw] max-h-[220px] max-w-[220px] rounded-full bg-pink-200/12 blur-2xl dark:bg-fuchsia-300/12" />
          <div className="absolute right-[15%] bottom-[14%] h-[13vw] w-[13vw] max-h-[210px] max-w-[210px] rounded-full bg-rose-200/12 blur-2xl dark:bg-pink-300/12" />
        </div>

        <section
          className="relative z-10 mx-auto w-full max-w-[900px] overflow-hidden lg:max-w-none"
          aria-label="Sürükleme alanı"
          onDragOver={handleDropZoneDragOver}
          onDragLeave={handleDropZoneDragLeave}
          onDrop={handleDropZoneDrop}
        >
          <Image
            src="/sepet-v2/sol-bg-tight.png"
            alt="Sürükleme alanı"
            width={1285}
            height={1186}
            className="block h-auto w-full"
            loading="lazy"
          />

          <div
            className={`pointer-events-none absolute inset-[5.5%] rounded-[18px] border-2 border-dashed transition-all duration-150 ${isDropZoneActive
                ? "border-pink-400/70 bg-pink-100/40 dark:border-pink-300/70 dark:bg-pink-500/10"
                : "border-transparent bg-transparent"
              }`}
          />

          {droppedServices.length > 0 && (
            <div className="absolute inset-x-[5.5%] inset-y-[8%] overflow-y-auto pr-2">
              <motion.div layout className="space-y-2.5 sm:space-y-3" initial={false}>
                <AnimatePresence initial={false}>
                  {droppedServices.map((item) => (
                    <motion.article
                      key={item.service.id}
                      layout
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      className="rounded-[14px] bg-white/15 px-2 py-2 dark:bg-black/10 sm:px-2.5"
                      aria-label={`${item.service.topLine} ${item.service.bottomLine} mini kartı`}
                    >
                      <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[minmax(220px,300px)_auto_minmax(180px,1fr)] sm:items-center sm:gap-3">
                        <div className="relative w-full max-w-[300px]">
                          <Image
                            src="/sepet-v2/sol-kart-tight.png"
                            alt=""
                            width={538}
                            height={217}
                            className="block h-auto w-full"
                            loading="lazy"
                          />

                          <Image
                            src="/sepet-v2/ikon bg.png"
                            alt=""
                            width={94}
                            height={92}
                            className="pointer-events-none absolute left-[7%] top-1/2 w-[17%] -translate-y-1/2"
                            loading="lazy"
                          />
                          <Image
                            src="/sepet-v2/ikon ufak.png"
                            alt=""
                            width={46}
                            height={50}
                            className="pointer-events-none absolute left-[10.8%] top-1/2 w-[8.8%] -translate-y-1/2"
                            loading="lazy"
                          />

                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.28, delay: 0.05 }}
                            className="pointer-events-none absolute left-[31%] top-1/2 min-w-0 -translate-y-1/2"
                          >
                            <p className="truncate text-[18px] font-light leading-none tracking-tight text-[#c797ac] sm:text-[22px]">
                              {item.service.topLine}
                            </p>
                            <p className="truncate text-[20px] font-semibold leading-none tracking-tight text-[#c59aae] sm:text-[24px]">
                              {item.service.bottomLine}
                            </p>
                          </motion.div>
                        </div>

                        <div className="flex items-center gap-1.5 sm:justify-center">
                          <button
                            type="button"
                            onClick={() => changeDroppedServiceQuantity(item.service.id, -1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#c59aae]/70 bg-white/75 text-[18px] font-semibold leading-none text-[#c59aae] transition hover:bg-white dark:bg-white/10 dark:hover:bg-white/20"
                            aria-label={`${item.service.topLine} ${item.service.bottomLine} adet azalt`}
                          >
                            -
                          </button>

                          <p className="min-w-[84px] text-center text-[16px] font-medium italic text-[#c797ac] sm:text-[18px]">
                            adet{" "}
                            <AnimatePresence mode="wait" initial={false}>
                              <motion.span
                                key={item.quantity}
                                className="inline-block min-w-[16px] not-italic font-semibold"
                                initial={{ opacity: 0, y: 4, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -4, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                              >
                                {item.quantity}
                              </motion.span>
                            </AnimatePresence>
                          </p>

                          <button
                            type="button"
                            onClick={() => changeDroppedServiceQuantity(item.service.id, 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#c59aae]/70 bg-white/75 text-[18px] font-semibold leading-none text-[#c59aae] transition hover:bg-white dark:bg-white/10 dark:hover:bg-white/20"
                            aria-label={`${item.service.topLine} ${item.service.bottomLine} adet artır`}
                          >
                            +
                          </button>
                        </div>

                        <motion.p
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.09 }}
                          className="max-w-[300px] text-[13px] leading-relaxed text-[#c797ac] sm:justify-self-end sm:text-right sm:text-[17px] sm:leading-[1.35]"
                        >
                          {item.service.topLine} {item.service.bottomLine} için{" "}
                          {item.service.desc.toLowerCase()}.
                        </motion.p>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          )}

          {droppedServices.length === 0 && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-base font-semibold tracking-wide text-zinc-600 dark:text-zinc-300 sm:text-lg">
                Buraya sürükle
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:text-base">
                Kartları alana bırak
              </p>
            </div>
          )}
        </section>

        <section
          className="relative z-10 mx-auto w-full max-w-[520px] overflow-hidden lg:mx-0 lg:w-full lg:max-w-none"
          aria-label="Sepet alanı"
        >
          <Image
            src="/sepet-v2/sag-bg-yeni-tight.png"
            alt="Sepet alanı"
            width={929}
            height={1166}
            className="block h-auto w-full"
            loading="lazy"
          />

          <div className="absolute inset-[8%] flex min-h-0 flex-col">
            <motion.h3
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="-mt-6 shrink-0 text-[42px] font-bold leading-none tracking-tight text-[#c59aae] sm:text-[54px]"
            >
              sepetim
            </motion.h3>

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {droppedServices.map((item, index) => (
                  <motion.div
                    key={`cart-${item.service.id}`}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.26, delay: index * 0.03 }}
                    className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] gap-4"
                  >
                    <div>
                      <p className="text-[21px] font-semibold leading-[1.08] text-[#c59aae]">
                        {item.service.topLine} {item.service.bottomLine}
                      </p>
                      <p className="text-[15px] font-light leading-[1.15] text-[#c59aae]/95">
                        ({item.quantity} {item.service.unit})
                      </p>
                    </div>
                    <motion.p
                      key={`${item.service.id}-${item.quantity}`}
                      initial={{ opacity: 0.5, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[24px] font-medium leading-none text-[#c59aae]"
                    >
                      {formatTl(item.service.price * item.quantity)}
                    </motion.p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="shrink-0">
              <Image
                src="/sepet-v2/ilk-ayrac.png"
                alt=""
                width={456}
                height={5}
                className="mt-3 h-auto w-[60%]"
                loading="lazy"
              />

              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 space-y-1.5"
              >
                <div className="grid grid-cols-[1fr_auto] items-end">
                  <p className="text-[24px] font-medium text-[#c59aae]">Ara Toplam</p>
                  <p className="text-[27px] font-medium leading-none text-[#c59aae]">{formatTl(araToplam)}</p>
                </div>
                <div className="grid grid-cols-[1fr_auto] items-end">
                  <p className="text-[23px] font-light text-[#c59aae]">KDV (%20)</p>
                  <p className="text-[25px] font-light leading-none text-[#c59aae]">{formatTl(kdv)}</p>
                </div>
              </motion.div>

              <Image
                src="/sepet-v2/ikinci-ayrac.png"
                alt=""
                width={456}
                height={7}
                className="mt-3 h-auto w-[60%]"
                loading="lazy"
              />

              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.34, delay: 0.05 }}
                className="mt-3 grid grid-cols-[1fr_auto] items-end"
              >
                <p className="text-[28px] font-semibold text-[#c59aae]">Genel Toplam</p>
                <p className="text-[29px] font-semibold leading-none text-[#c59aae]">{formatTl(genelToplam)}</p>
              </motion.div>

              <div className="mt-3 flex justify-end">
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.18 }}
                  className="w-fit rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(37,211,102,0.35)]"
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                    boxShadow: "0 12px 30px rgba(37,211,102,0.45)",
                  }}
                  whileTap={{ scale: 0.96, y: 0 }}
                >
                  <motion.span
                    animate={{ opacity: [1, 0.86, 1], x: [0, 1, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    className="block whitespace-nowrap"
                  >
                    WhatsApp&apos;tan iletişim kur
                  </motion.span>
                </motion.button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
