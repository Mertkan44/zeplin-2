"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import s from "@/app/hakkimizda/about.module.css";
import { getProjectBySlug } from "@/data/projects";
import { ABOUT, PRINCIPLES } from "@/data/about";
import { whatsappUrl } from "@/lib/contact";
import { siteConfig } from "@/lib/seo";

/*
 * Hakkımızda hareket sahnesi — prototipteki (index.html) update / choreograph / choose / mode
 * mantığı aynen korunarak React'e taşındı. Görseller ve bağlantılar projects.ts'ten gelir.
 *   Reel:   235vh (mobil 180vh) bölüm; ilk %62 ilerlemede maske açılır.
 *   Üretim: 390vh (mobil 300vh) bölüm; 2. görsel %18–46, 3. görsel %58–86 aralığında yerleşir.
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

  const [stage, setStage] = useState(0);
  const stageRef = useRef(0);
  const [reduced, setReduced] = useState(false);
  const reducedRef = useRef(false);

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
      process.style.setProperty("--frame-turn", `${-7 * first + 14 * second}deg`);
      process.style.setProperty("--frame-alpha", String(1 - 0.6 * first + 0.6 * second));
      process.style.setProperty("--ghost-x", `${-p * 100}px`);
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
    reel.style.setProperty("--reel-inset", `${17 * (1 - expand)}%`);
    reel.style.setProperty("--reel-side", `${25 * (1 - expand)}%`);
    reel.style.setProperty("--reel-zoom", String(1.08 - 0.08 * expand));
    reel.style.setProperty("--reel-opacity", String(clamp((p - 0.27) / 0.23)));
    reel.style.setProperty("--reel-y", `${(1 - clamp((p - 0.27) / 0.35)) * 50}px`);
    if (kickerRef.current) kickerRef.current.style.opacity = String(1 - clamp(p / 0.25));

    const a = approach.getBoundingClientRect();
    const ap = clamp((vh * 0.8 - a.top) / (vh * 0.65));
    wordRefs.current.forEach((w, i) => w?.classList.toggle(s.lit, ap > i * 0.26));

    const pr = process.getBoundingClientRect();
    const pp = clamp(-pr.top / Math.max(1, process.offsetHeight - vh));
    choreograph(pp);
    stepRefs.current.forEach((el, i) => el?.style.setProperty("--fill", `${clamp(pp * 3 - i) * 100}%`));
  }, [choreograph]);

  /** mode(value): hareket azaltma tercihini uygular. */
  const mode = useCallback(
    (value: boolean) => {
      reducedRef.current = value;
      setReduced(value);
      if (value) {
        stepRefs.current.forEach((el) => el?.style.setProperty("--fill", "0%"));
        wordRefs.current.forEach((w) => w?.classList.add(s.lit));
      } else {
        requestAnimationFrame(update);
      }
    },
    [update],
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
    const initial = requestAnimationFrame(() => (media.matches ? mode(true) : schedule()));
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
          <span className={`${s.line} ${s.outline}`}>GÖRÜNÜR</span>
          <span className={`${s.line} ${s.heroLast}`}>
            KILARIZ
            <span className={s.heroThumb} aria-hidden="true">
              <Image src={MILO_IMG} alt="" fill sizes="270px" className="object-cover" priority />
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
      <section ref={reelRef} className={s.reel} id="bakis" aria-label={`${milo.name} çalışmasına yakından bakış`}>
        <div className={s.reelSticky}>
          <p ref={kickerRef} className={`${s.reelKicker} ${s.label}`}>
            01 / Bakış açımız
          </p>
          <div className={s.reelImg}>
            <Image
              src={MILO_IMG}
              alt="Milo Restaurant için hazırlanan menü fotoğrafı: ikiye kesilmiş burger."
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <h2 className={s.reelTitle}>
            HER İŞİN
            <br />
            BİR BAKIŞI VAR.
          </h2>
          <div className={s.reelFoot}>
            <p>
              {milo.name}
              <br />
              <span className={s.small}>Menü fotoğrafçılığı</span>
            </p>
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

      {/* ── Birlikte çalışırken ─────────────────────────── */}
      <section className={`${s.principles} ${s.wrap}`} aria-labelledby="principles-title">
        <p className={s.label} id="principles-title">
          04 / Birlikte çalışırken
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
            <p className={s.label}>05 / Hikâyemiz</p>
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

      {/* ── Kapanış ────────────────────────────────────── */}
      <section className={`${s.closing} ${s.wrap}`} id="tanisalim" aria-labelledby="closing-title" data-footer-under="pink">
        <p className={s.label}>Sıradaki hikâyeyi birlikte üretelim.</p>
        <h2 id="closing-title">
          <span>AKLINIZDA</span>
          <span>NE VAR?</span>
        </h2>
        <div className={s.closingLinks}>
          <a
            href={whatsappUrl("Merhaba Zeplin, Hakkımızda sayfanızı okudum; projemi konuşmak istiyorum.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Projenizi konuşalım <span className={s.arr} aria-hidden="true">↗</span>
          </a>
          <a href={`mailto:${siteConfig.email}`}>
            E-posta gönder <span className={s.arr} aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </div>
  );
}
