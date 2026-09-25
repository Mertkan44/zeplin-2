# Zeplin Media — web sitesi

Next.js 16 (App Router) + Tailwind CSS 4 + framer-motion.

## Kurulum

```bash
npm install
npm run dev        # http://127.0.0.1:3000
npm run build      # yayın öncesi mutlaka çalıştır
npm run lint
```

> **Not:** Proje klasörü iCloud ile eşitlenen bir yerdeyse (ör. Masaüstü), iCloud `dosya 2.json` gibi kopyalar üretip `.next` ve `.git` klasörlerini bozabilir. Projeyi eşitlenmeyen bir klasörde tut (ör. `~/Projects`).

## Ortam değişkenleri

`.env.local` (yerel) ve Vercel → Settings → Environment Variables:

| Değişken | Ne için |
|---|---|
| `RESEND_API_KEY` | "Projeni Anlat" formunun e-posta göndermesi |
| `CONTACT_TO_EMAIL` | Form taleplerinin düşeceği adres |
| `CONTACT_FROM_EMAIL` | (Opsiyonel) Doğrulanmış gönderici. Yoksa `onboarding@resend.dev` |
| `NEXT_PUBLIC_SITE_URL` | (Opsiyonel) Canonical adres. Yoksa `https://www.zeplinmedia.com` |

Anahtar yoksa form sahte başarı göstermez; "gönderilemedi" mesajı ve WhatsApp alternatifi çıkar.

## İçerik nerede?

| Ne | Dosya |
|---|---|
| Projeler (vaka çalışmaları, galeri, videolar) | `src/data/projects.ts` |
| Hizmetler, gruplar, kart görselleri | `src/data/services.ts` |
| Bütün sayısal iddialar (metrikler) | `src/data/metrics.ts` |
| Proje notları (Hizmetler / Operasyonlar) | `src/components/ProjectNotes.tsx` |
| Telefon, WhatsApp, form seçenekleri | `src/lib/contact.ts` |
| Site adı, e-posta, sosyal hesaplar, SEO | `src/lib/seo.ts` |
| Menü / footer / ortak metinler (TR-EN) | `src/i18n/dictionaries/` |

- **Galeri** kendi verisi olmayan bir sayfa: `projects.ts`'teki fotoğraf ve videolardan otomatik oluşur. Bir projeye görsel eklemek galeriye de ekler.
- **Metrikler:** Kaynağı, dönemi ve tanımı bilinmeyen sayı yayında tutulmamalı (dosyanın başındaki nota bak).
- **Müşteri görüşü** yalnızca gerçek kişi / rol / marka ve yayın onayıyla eklenir. Ajansın kendi anlatımı "proje notu" olarak gösterilir.

### Yeni proje eklemek

1. Kapak ve galeri görsellerini `public/images/` altına koy (bkz. medya kuralları).
2. `src/data/projects.ts`'e kayıt ekle. `briefNeed`, iletişim formunda önceden seçilecek ihtiyaçtır (`BRIEF_NEEDS` değerlerinden biri).
3. Proje bir hizmeti kanıtlıyorsa `src/components/services/ServiceProof.tsx` içindeki eşleşmeye ekle.

### Yeni hizmet eklemek

`src/data/services.ts` → `services` listesine kayıt, `serviceTabs` içinde ilgili gruba kart. Sayfa otomatik oluşur (`/hizmetler/<slug>`), sitemap'e girer.

## Medya kuralları

- **Video:** Arşiv dosyasını siteye koyma; web sürümü üret ve `-web.mp4` adıyla kaydet:
  ```bash
  ffmpeg -i kaynak.mp4 -c:v libx264 -preset slow -crf 24 -maxrate 4M -bufsize 8M \
    -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart public/videos/ad-web.mp4
  ffmpeg -ss 1 -i kaynak.mp4 -frames:v 1 -vf scale=720:-2 -q:v 4 public/videos/posters/ad-poster.jpg
  ```
  Poster adı video adından türetilir (`ad-web.mp4` → `posters/ad-poster.jpg`).
- **Görsel:** WebP ya da JPEG, uzun kenar en fazla ~2000 px. Hizmet kartları 1600×1000.
  Hizmet görsellerini topluca eklemek için: `python3 scripts/import-service-images.py ~/Desktop/zeplin-gorseller`
- **Aynı adla dosya değiştirme:** `/images` ve `/videos` bir yıl `immutable` önbellekleniyor (`next.config.ts`). Değişen dosyaya **yeni ad** ver (ör. `-v2`), yoksa eski ziyaretçi eski dosyayı görür.
- Görsel üretim promptları: `docs/gorsel-promptlari.md`.

## Dil (TR / EN)

Türkçe kök adreste, İngilizce `/en` önekiyle planlandı. Altyapı `src/i18n/` altında; `ENABLED_LOCALES` içinde şimdilik yalnızca `tr` var. İngilizce sayfalar çevrilmeden `en` eklenmemeli; dil düğmesi ancak o zaman görünür.

## Yayın öncesi kontrol

- [ ] `npm run build` ve `npm run lint` hatasız
- [ ] Form: Vercel'de `RESEND_API_KEY` ve `CONTACT_TO_EMAIL` tanımlı, gerçek bir gönderim denendi
- [ ] Yeni medya `-web.mp4` / poster kuralına uygun, aynı adla dosya değiştirilmedi
- [ ] Metrik ve görüşlerin dayanağı var
- [ ] Mobilde (iPhone Safari, Android Chrome) menü, video ve iletişim akışı denendi
