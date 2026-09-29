"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import s from "@/app/hakkimizda/about.module.css";
import { getProjectBySlug } from "@/data/projects";
import { ABOUT, PRINCIPLES } from "@/data/about";
import { CLIENT_BRANDS, CLIENT_VIDEOS, type ClientVideo } from "@/data/clients";

/*
 * Hakkımızda hareket sahnesi — prototipteki (index.html) update / choreograph / choose / mode
 * mantığı aynen korunarak React'e taşındı. Görseller ve bağlantılar projects.ts'ten gelir.
 *   Reel:   235vh (mobil 180vh) bölüm; ilk %62 ilerlemede maske açılır.
 *   Üretim: 390vh (mobil 300vh) bölüm; 2. görsel %18–46, 3. görsel %58–86 aralığında yerleşir.
 *   Akış:   Ritim filminden dört kare, bölüm ekrandan geçerken farklı hızlarda kayar.
 * Reel'de sessiz showreel oynar (Milo + Ritim filmlerinden kesitler): yatay ekranda üçlü
 * kurgu, dikey ekranda tek kolon. Hareket azaltıldığında ya da bölüm görünmezken durur.
 * Geri kaydırma aynı dönüşümleri tersine uygular.
 */

const milo = getProjectBySlug("milo-restaurant")!;
const ritim = getProjectBySlug("ritim-jewellery")!;
const pam = getProjectBySlug("pam-akademi")!;

const MILO_IMG = milo.cover ?? milo.image; // yatay burger karesi
const RITIM_IMG = ritim.cover ?? ritim.image; // üç filmden kareler
const PAM_IMG = "/images/projects-pam-akademi-gallery-1.jpg"; // web sitesi duyurusu

const STAGES = [
  {
    kind: "FOTOĞRAF",
    step: "GÖRÜNTÜ",
    project: milo,
    service: "Menü fotoğrafçılığı",
    description: "Işık, kadraj ve ayrıntı. Ürünün karakterini tek bir kareye taşıyoruz.",
    img: MILO_IMG,
    alt: "Milo Restaurant menü fotoğrafı.",
  },
  {
    kind: "FİLM",
    step: "HAREKET",
    project: ritim,
    service: "Yapay zekâ destekli reklam filmi",
    description: "Görüntüye zaman ve duygu ekliyoruz. Farklı kareleri aynı hikâyede buluşturuyoruz.",
    img: RITIM_IMG,
    alt: "Ritim Jewellery için yapay zekâ destekli reklam filmlerinden kareler.",
  },
  {
    kind: "TASARIM & WEB",
    step: "KİMLİK",
    project: pam,
    service: "Marka kimliği ve dijital tasarım",
    description:
      "Kimliği dijitalde sürdürüyoruz. Markanın farklı temas noktalarını aynı görsel dilde bir araya getiriyoruz.",
    img: PAM_IMG,
    alt: "Pam Akademi web sitesi duyurusu ve marka tasarımı.",
  },
];

const WORDS = ["BİR KARE.", "BİR HİKÂYE.", "BİR BÜTÜN."];

/** Müzik gelene kadar sessiz. Yeniden üretmek için: scripts/build-showreel.sh */
const SHOWREEL = {
  wide: { src: "/videos/showreel-wide-web.mp4", poster: "/videos/posters/showreel-wide-poster.jpg" },
  tall: { src: "/videos/showreel-tall-web.mp4", poster: "/videos/posters/showreel-tall-poster.jpg" },
};

/** Ritim Jewellery reklam filminden (ritim-bitti) sırayla dört kare: 8., 14., 23. ve 26. saniye. */
const JOURNEY = [
  { step: "Eskiz", text: "Film, bir tasarımcının defterindeki sembollerle açılıyor.", depth: 16 },
  { step: "Vitrin", text: "Aynı hikâye bir ailenin önünde, mağaza vitrininde sürüyor.", depth: 56 },
  { step: "Ürün", text: "Defterdeki semboller artık altın bir kolyenin üzerinde.", depth: 28 },
  { step: "Duygu", text: "Film, takıyı taşıyan kişinin yüzünde kapanıyor.", depth: 72 },
].map((f, i) => ({ ...f, img: `/images/about/ritim-yolculuk-${i + 1}.webp` }));

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (x: number) => {
  x = clamp(x);
  return x * x * (3 - 2 * x);
};

export default function AboutMotion() {
  const reelRef = useRef<HTMLElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const approachRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const journeyRef = useRef<HTMLElement>(null);
  const journeyFrameRefs = useRef<(HTMLElement | null)[]>([]);
  const reelVideoRef = useRef<HTMLVideoElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const reelVisibleRef = useRef(false);
  const reelPausedRef = useRef(false);
  const [reelPaused, setReelPaused] = useState(false);

  const [stage, setStage] = useState(0);
  const stageRef = useRef(0);
  const [reduced, setReduced] = useState(false);
  const reducedRef = useRef(false);

  /** Showreel yalnızca görünürken, hareket açıkken ve kullanıcı durdurmamışken oynar. */
  const syncReel = useCallback(() => {
    const video = reelVideoRef.current;
    if (!video || !video.getAttribute("src")) return;
    if (reelVisibleRef.current && !reducedRef.current && !reelPausedRef.current) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, []);

  const toggleReel = () => {
    reelPausedRef.current = !reelPausedRef.current;
    setReelPaused(reelPausedRef.current);
    syncReel();
  };

  /** choose(n): aktif sahne bilgisini değiştirir. */
  const choose = useCallback((n: number) => {
    if (n === stageRef.current) return;
    stageRef.current = n;
    setStage(n);
  }, []);

  /** choreograph(p): üç proje görselini ilerlemeye göre sürekli dönüştürür. */
  const choreograph = useCallback(
    (p: number) => {
      const process = processRef.current;
      const images = imageRefs.current;
      if (!process || images.length < 3 || images.some((el) => !el)) return;
      const first = smooth((p - 0.18) / 0.28);
      const second = smooth((p - 0.58) / 0.28);
      images[0]!.style.transform = `translate3d(${-12 * first - 6 * second}%,${-5 * first}%,0) rotate(${-7 * first}deg) scale(${1 - 0.1 * first - 0.04 * second})`;
      images[1]!.style.transform = `translate3d(${18 * (1 - first) - 9 * second}%,${115 * (1 - first) - 4 * second}%,0) rotate(${10 * (1 - first) - 6 * second}deg) scale(${1 - 0.08 * second})`;
      images[2]!.style.transform = `translate3d(${115 * (1 - second)}%,${10 * (1 - second)}%,0) rotate(${12 * (1 - second)}deg)`;
      images.forEach((el, i) => {
        el!.style.visibility = i === 0 || (i === 1 && p > 0.18) || (i === 2 && p > 0.58) ? "visible" : "hidden";
      });
      process.style.setProperty("--heading-shift", `${-12 * first + 12 * second}px`);
      choose(p < 0.37 ? 0 : p < 0.77 ? 1 : 2);
    },
    [choose],
  );

  /** update(): kaydırma ilerlemesini hesaplar. */
  const update = useCallback(() => {
    if (reducedRef.current) return;
    const reel = reelRef.current;
    const approach = approachRef.current;
    const process = processRef.current;
    if (!reel || !approach || !process) return;
    const vh = window.innerHeight;

    const r = reel.getBoundingClientRect();
    const p = clamp(-r.top / Math.max(1, reel.offsetHeight - vh));
    const expand = clamp(p / 0.62);
    // Başlangıçta yalnızca ortadaki dikey kesit görünür (yuvarlak köşeli kart), sonra üçlüye açılır.
    const sticky = reel.firstElementChild as HTMLElement;
    const sw = sticky.clientWidth;
    const sh = sticky.clientHeight;
    const panel = sw > sh ? Math.max(sw, (sh * 16) / 9) * 1.08 * (608 / 1920) : sw * 0.76;
    const side0 = Math.max(0, (sw - panel) / 2 + 2);
    const top0 = Math.max(sh * (sw > sh ? 0.1 : 0.14), 92); // üst menünün altında kalsın
    reel.style.setProperty("--reel-inset", `${top0 * (1 - expand)}px`);
    reel.style.setProperty("--reel-side", `${side0 * (1 - expand)}px`);
    reel.style.setProperty("--reel-radius", `${28 * (1 - expand)}px`);
    reel.style.setProperty("--reel-zoom", String(1.08 - 0.08 * expand));
    reel.style.setProperty("--reel-opacity", String(clamp((p - 0.27) / 0.23)));
    reel.style.setProperty("--reel-y", `${(1 - clamp((p - 0.27) / 0.35)) * 50}px`);
    if (kickerRef.current) kickerRef.current.style.opacity = String(1 - clamp(p / 0.25));
    const reelVisible = r.bottom > -200 && r.top < vh + 200;
    if (reelVisible !== reelVisibleRef.current) {
      reelVisibleRef.current = reelVisible;
      syncReel();
    }

    const a = approach.getBoundingClientRect();
    const ap = clamp((vh * 0.8 - a.top) / (vh * 0.65));
    wordRefs.current.forEach((w, i) => w?.classList.toggle(s.lit, ap > i * 0.26));

    const pr = process.getBoundingClientRect();
    const pp = clamp(-pr.top / Math.max(1, process.offsetHeight - vh));
    choreograph(pp);
    stepRefs.current.forEach((el, i) => el?.style.setProperty("--fill", `${clamp(pp * 3 - i) * 100}%`));

    const journey = journeyRef.current;
    if (journey) {
      const j = journey.getBoundingClientRect();
      const jp = clamp((vh - j.top) / (vh + j.height));
      journeyFrameRefs.current.forEach((el, i) =>
        el?.style.setProperty("--shift", `${(0.5 - jp) * JOURNEY[i].depth}px`),
      );
    }
  }, [choreograph, syncReel]);

  /** mode(value): hareket azaltma tercihini uygular. */
  const mode = useCallback(
    (value: boolean) => {
      reducedRef.current = value;
      setReduced(value);
      if (value) {
        stepRefs.current.forEach((el) => el?.style.setProperty("--fill", "0%"));
        wordRefs.current.forEach((w) => w?.classList.add(s.lit));
        journeyFrameRefs.current.forEach((el) => el?.style.setProperty("--shift", "0px"));
        heroVideoRef.current?.pause();
      } else {
        void heroVideoRef.current?.play().catch(() => {});
        requestAnimationFrame(update);
      }
      syncReel();
    },
    [update, syncReel],
  );

  useEffect(() => {
    let queued = false;
    const schedule = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        update();
      });
    };
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMedia = (e: MediaQueryListEvent) => mode(e.matches);
    // İlk tercih bir sonraki karede uygulanır (efekt gövdesinde state güncellenmez).
    const initial = requestAnimationFrame(() => mode(media.matches));
    media.addEventListener("change", onMedia);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(initial);
      media.removeEventListener("change", onMedia);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [mode, update]);

  // Showreel kaynağı ekran yönüne göre seçilir; görünürlük update() içinde izlenir.
  useEffect(() => {
    const video = reelVideoRef.current;
    if (!video) return;
    const landscape = window.matchMedia("(orientation: landscape)");
    const pick = () => {
      const variant = landscape.matches ? SHOWREEL.wide : SHOWREEL.tall;
      if (video.getAttribute("src") === variant.src) return;
      video.poster = variant.poster;
      video.src = variant.src;
      syncReel();
    };
    pick();
    landscape.addEventListener("change", pick);
    return () => landscape.removeEventListener("change", pick);
  }, [syncReel]);

  const goToStage = (i: number) => {
    if (reducedRef.current) {
      choose(i);
      return;
    }
    const process = processRef.current;
    if (!process) return;
    const start = process.getBoundingClientRect().top + window.scrollY;
    const length = Math.max(1, process.offsetHeight - window.innerHeight);
    window.scrollTo({ top: start + length * [0.08, 0.5, 0.93][i], behavior: "smooth" });
  };

  const current = STAGES[stage];
  const hasStory = ABOUT.story.length > 0;

  return (
    <div className={`${s.root} ${reduced ? s.motionOff : ""}`}>
      <button type="button" className={s.mode} aria-pressed={reduced} onClick={() => mode(!reducedRef.current)}>
        {reduced ? "Hareketi aç" : "Hareketi azalt"}
      </button>

      {/* ── Açılış ─────────────────────────────────────── */}
      <section className={`${s.hero} ${s.wrap}`} aria-labelledby="hero-title">
        <div className={s.heroMeta}>
          <p className={s.label}>Zeplin&apos;in arkasında</p>
          <p className={s.label}>
            Fotoğraf · Film
            <br />
            Tasarım · Web
          </p>
        </div>
        <h1 id="hero-title">
          <span className={s.line}>FİKRİ</span>
          <span className={s.line}>GÖRÜNÜR</span>
          <span className={`${s.line} ${s.heroLast}`}>
            <span>
              KILARIZ<span className={s.pink}>.</span>
            </span>
            <span className={s.heroThumb} aria-hidden="true">
              <video
                ref={heroVideoRef}
                src="/videos/hero-loop-web.mp4"
                poster="/videos/posters/hero-loop-poster.jpg"
                muted
                loop
                playsInline
                preload="auto"
              />
            </span>
          </span>
        </h1>
        <div className={s.heroBottom}>
          <a className={s.scroll} href="#bakis">
            <span aria-hidden="true">↓</span>Biraz daha yakından.
          </a>
          <p>
            Fotoğraf, film, tasarım ve web.
            <br />
            Markanızın anlatacaklarını birlikte şekillendiriyoruz.
          </p>
        </div>
      </section>

      {/* ── Reel ───────────────────────────────────────── */}
      <section ref={reelRef} className={s.reel} id="bakis" aria-label="Film ve fotoğraf çalışmalarımızdan bir kesit">
        <div className={s.reelSticky}>
          <p ref={kickerRef} className={`${s.reelKicker} ${s.label}`}>
            01 / Bakış açımız
          </p>
          <div className={s.reelImg}>
            {/* Video yüklenene kadar (ve hareket kapalıyken) ekran yönüne uygun kare görünür. */}
            <Image src={SHOWREEL.wide.poster} alt="" fill sizes="100vw" className={`object-cover ${s.posterWide}`} />
            <Image src={SHOWREEL.tall.poster} alt="" fill sizes="100vw" className={`object-cover ${s.posterTall}`} />
            <video ref={reelVideoRef} className={s.reelVideo} muted loop playsInline preload="none" aria-hidden="true" />
          </div>
          <h2 className={s.reelTitle}>
            HER İŞİN
            <br />
            BİR BAKIŞI VAR.
          </h2>
          <div className={s.reelFoot}>
            <div>
              <p>
                {milo.name} · {ritim.name}
                <br />
                <span className={s.small}>Film ve fotoğraf çalışmalarından kesitler</span>
              </p>
              <button type="button" className={s.reelToggle} aria-pressed={reelPaused} onClick={toggleReel}>
                {reelPaused ? "Oynat" : "Durdur"}
              </button>
            </div>
            <p className={s.label}>
              Fikirden
              <br />
              görünen hâline.
            </p>
          </div>
        </div>
      </section>

      {/* ── Yaklaşım ───────────────────────────────────── */}
      <section ref={approachRef} className={`${s.approach} ${s.wrap}`} id="yaklasim" aria-labelledby="approach-title">
        <div className={s.sectionTop}>
          <p className={s.label}>02 / Yaklaşımımız</p>
          <p className={s.label}>Aynı markanın farklı yüzleri.</p>
        </div>
        <div className={s.approachGrid}>
          <h2 id="approach-title">
            {WORDS.map((w, i) => (
              <span
                key={w}
                ref={(el) => {
                  wordRefs.current[i] = el;
                }}
                className={`${s.word} ${i === 0 ? s.lit : ""}`}
              >
                {w}
              </span>
            ))}
          </h2>
          <div className={s.approachCopy}>
            <p>Bir fotoğrafın, bir filmin ve bir web sayfasının aynı markayı anlatmasını önemsiyoruz.</p>
            <p className={s.secondary}>
              Bu yüzden işe yalnızca nasıl görüneceğini düşünerek başlamıyoruz. Nerede kullanılacağını, kime
              ulaşacağını ve diğer parçalarla nasıl bir araya geleceğini de konuşuyoruz.
            </p>
            <div className={s.discipline} aria-label="Üretim alanları">
              <span>Fotoğraf</span>
              <span>Film</span>
              <span>Marka &amp; tasarım</span>
              <span>Web</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Üretim ─────────────────────────────────────── */}
      <section ref={processRef} className={s.process} id="uretim" aria-labelledby="process-title">
        <div className={`${s.processSticky} ${s.wrap}`}>
          <div className={s.processTop}>
            <p className={s.label}>03 / Üretimin farklı yüzleri</p>
            <p className={s.label} aria-live="polite">
              0{stage + 1} — 03
            </p>
          </div>
          <div className={s.processBody}>
            <div className={s.processLeft}>
              <h2 id="process-title">
                <span>BAKIŞTAN</span>
                <span className={s.pink}>BÜTÜNE.</span>
              </h2>
              <p className={s.processDescription}>{current.description}</p>
            </div>
            <div>
              <div className={s.stageVisual}>
                {STAGES.map((st, i) => (
                  <div
                    key={st.kind}
                    ref={(el) => {
                      imageRefs.current[i] = el;
                    }}
                    className={`${s.stageImg} ${i === stage ? s.active : ""}`}
                    data-stage={i}
                    aria-hidden={i !== stage}
                  >
                    <Image
                      src={st.img}
                      alt={st.alt}
                      fill
                      sizes="(min-width: 760px) 50vw, 100vw"
                      className={i === 0 ? "object-cover" : "object-contain"}
                    />
                  </div>
                ))}
                <p className={s.mark}>{current.kind}</p>
              </div>
              <div className={s.stageCaption}>
                <Link href={`/projeler/${current.project.slug}`} className="underline-offset-4 hover:underline">
                  {current.project.name}
                </Link>
                <span>{current.service}</span>
              </div>
            </div>
          </div>
          <div className={s.processSteps} aria-label="Üretim örneği seç">
            {STAGES.map((st, i) => (
              <button
                key={st.step}
                type="button"
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className={`${s.step} ${i === stage ? s.active : ""}`}
                aria-pressed={i === stage}
                onClick={() => goToStage(i)}
              >
                <b>0{i + 1}</b>
                <span>
                  {st.step} <span aria-hidden="true">↗</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bir filmin akışı (Ritim) ─────────────────────── */}
      <section ref={journeyRef} className={`${s.journey} ${s.wrap}`} aria-labelledby="journey-title">
        <div className={s.sectionTop}>
          <p className={s.label}>04 / Bir filmin akışı</p>
          <p className={s.label}>{ritim.name}</p>
        </div>
        <div className={s.journeyHead}>
          <h2 id="journey-title">
            <span>ESKİZDEN</span>
            <span className={s.pink}>VİTRİNE.</span>
          </h2>
          <div>
            <p>
              Ritim Jewellery için hazırladığımız yapay zekâ destekli reklam filminde bir kolyenin hikâyesini otuz
              saniyede anlattık. Defterdeki semboller, filmin sonunda vitrindeki kolyeye dönüşüyor.
            </p>
            <Link href={`/projeler/${ritim.slug}`} className={s.journeyLink}>
              Filmleri izle <span className={s.arr} aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <ol className={s.journeyFrames}>
          {JOURNEY.map((f, i) => (
            <li
              key={f.step}
              ref={(el) => {
                journeyFrameRefs.current[i] = el;
              }}
              className={s.journeyFrame}
            >
              <figure>
                <div className={s.journeyImg}>
                  <Image src={f.img} alt={`Ritim Jewellery filminden kare: ${f.step.toLowerCase()}.`} fill sizes="(min-width: 760px) 22vw, 45vw" className="object-cover" />
                </div>
                <figcaption>
                  <span className={s.num}>0{i + 1}</span>
                  <b>{f.step}</b>
                  <span>{f.text}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Birlikte çalıştıklarımız ─────────────────────── */}
      <section className={`${s.voices} ${s.wrap}`} aria-labelledby="voices-title">
        <div className={s.sectionTop}>
          <p className={s.label}>05 / Birlikte çalıştıklarımız</p>
          <p className={s.label}>Kendi anlatımlarıyla</p>
        </div>
        <div className={s.voicesGrid}>
          <div className={s.voicesCopy}>
            <h2 id="voices-title">
              <span>BİZİ BİR DE</span>
              <span className={s.pink}>ONLARDAN</span>
              <span>DİNLEYİN.</span>
            </h2>
            <p>Birlikte çalıştığımız işletmelerden iki kısa değerlendirme.</p>
          </div>
          <VoiceVideos videos={CLIENT_VIDEOS} />
        </div>
        <div className={s.brands}>
          <p className={s.label}>Birlikte çalıştığımız markalar</p>
          <ul>
            {CLIENT_BRANDS.map((b) => (
              <li key={b.name} title={b.name}>
                {b.logo ? (
                  <Image src={b.logo} alt={b.name} width={120} height={60} className={s.brandLogo} />
                ) : (
                  <span>{b.name}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Birlikte çalışırken ─────────────────────────── */}
      <section className={`${s.principles} ${s.wrap}`} aria-labelledby="principles-title">
        <p className={s.label} id="principles-title">
          06 / Birlikte çalışırken
        </p>
        {PRINCIPLES.map((p, i) => (
          <article key={p.title} className={s.principle}>
            <p className={s.num}>0{i + 1}</p>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </article>
        ))}
      </section>

      {/* ── Hikâye ve insanlar: yalnızca gerçek bilgi girildiğinde ── */}
      {(hasStory || ABOUT.people.length > 0) && (
        <section className={`${s.story} ${s.wrap}`} aria-labelledby="story-title">
          <div className={s.sectionTop}>
            <p className={s.label}>07 / Hikâyemiz</p>
            <p className={s.label}>İşi kim yapıyor?</p>
          </div>
          {hasStory && (
            <div className={s.storyGrid}>
              <h2 id="story-title">Zeplin nasıl başladı?</h2>
              <div>
                {ABOUT.story.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
                {ABOUT.workModel && <p>{ABOUT.workModel}</p>}
              </div>
            </div>
          )}
          {ABOUT.people.length > 0 && (
            <ul className={s.people}>
              {ABOUT.people.map((person) => (
                <li key={person.name} className={s.person}>
                  {person.photo && (
                    <div className={s.portrait}>
                      <Image src={person.photo} alt={person.name} fill sizes="320px" className="object-cover" />
                    </div>
                  )}
                  <h3>{person.name}</h3>
                  <p className={s.pink}>{person.role}</p>
                  <p>{person.responsibility}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* ── Seçili işler ───────────────────────────────── */}
      <section className={`${s.projects} ${s.wrap}`} id="isler" aria-labelledby="work-title">
        <div className={s.projectsHead}>
          <h2 id="work-title">
            <span>SÖZÜ</span>
            <span>İŞLERE BIRAKALIM.</span>
          </h2>
          <Link href="/projeler">
            Tüm projeler <span className={s.arr} aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className={s.projectGrid}>
          {[
            { project: milo, img: MILO_IMG, alt: "Milo Restaurant burger fotoğrafı.", sub: "Menü fotoğrafçılığı & Reels" },
            { project: ritim, img: RITIM_IMG, alt: "Ritim Jewellery reklam filmlerinden üç kare.", sub: ritim.cardSummary },
          ].map(({ project, img, alt, sub }) => (
            <Link key={project.slug} className={s.project} href={`/projeler/${project.slug}`}>
              <figure className={s.projectPhoto}>
                <Image src={img} alt={alt} fill sizes="(min-width: 760px) 50vw, 100vw" className="object-cover" />
              </figure>
              <div className={s.projectCaption}>
                <div>
                  <h3>{project.name}</h3>
                  <p>{sub}</p>
                </div>
                <span className={s.arr} aria-hidden="true">
                  ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}

/** Müşteri videoları: kapak görünür, tıklanınca sesli ve kontrollü oynar; biri başlayınca diğeri durur. */
function VoiceVideos({ videos }: { videos: ClientVideo[] }) {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [started, setStarted] = useState<string[]>([]);

  const start = (i: number) => {
    setStarted((ids) => (ids.includes(videos[i].id) ? ids : [...ids, videos[i].id]));
    void refs.current[i]?.play().catch(() => {});
  };

  return (
    <div className={s.voiceList}>
      {videos.map((v, i) => {
        const isStarted = started.includes(v.id);
        return (
          <figure key={v.id} className={s.voice}>
            <div className={`${s.voiceMedia} ${isStarted ? s.voiceStarted : ""}`}>
              <video
                ref={(el) => {
                  refs.current[i] = el;
                }}
                src={v.videoSrc}
                poster={v.posterSrc}
                preload="none"
                playsInline
                controls={isStarted}
                onPlay={() => refs.current.forEach((other, j) => j !== i && other?.pause())}
              />
              {!isStarted && (
                <button type="button" className={s.voiceCover} onClick={() => start(i)} aria-label={`${v.brandName} videosunu izle`}>
                  <span className={s.voicePlay} aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M8 5.14v13.72a1 1 0 001.5.86l11-6.86a1 1 0 000-1.72l-11-6.86A1 1 0 008 5.14z" />
                    </svg>
                  </span>
                </button>
              )}
            </div>
            <figcaption>
              <b>{v.brandName}</b>
              <span>{v.personRole}</span>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
