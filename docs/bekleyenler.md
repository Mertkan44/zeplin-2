# Bekleyenler — Tasarım ve İşlevsellik İncelemesi (24.09.2026)

Dal: `revize/asama-a` (yerelde, push edilmedi). Raporun kod tarafı tamamlandı; aşağıdakiler içerik, karar ya da dış hesap bekliyor.

## Senden gelecek içerik

| # | Ne | Nereye gidecek | Rapor maddesi |
|---|---|---|---|
| 1 | 11 hizmet görseli (`docs/gorsel-promptlari.md`) → `~/Desktop/zeplin-gorseller/` | `python3 scripts/import-service-images.py` ile kartlara + AI bandı kolajı | 15 |
| 2 | Foton sitesi ekran görüntüleri (masaüstü + mobil) | Kurumsal Web kartı, Foton proje sayfası, galeri | 17 |
| 3 | Metriklerin gerçek değerleri (kaynak, dönem, tanım) ya da kaldırma kararı | `src/data/metrics.ts` | 18 |
| 4 | Hakkımızda: gerçek isimler, roller, ekip / çekim fotoğrafları | `src/app/hakkimizda/page.tsx` (şu anki stüdyo görseli AI) | 20 |
| 5 | Babi projesi için 4-6 fotoğraf | `src/data/projects.ts` → galeri | 17 |
| 6 | Gerçek müşteri görüşleri (isim, rol, marka, yayın onayı) | Proje notlarından ayrı bölüm | 19 |
| 7 | Hizmet kapsamı bilgileri: revizyon sınırı, tipik takvim, teslim listesi | Hizmet detay sayfaları | 15 |
| 8 | Proje yılları doğru mu? (beşi de 2024) | `src/data/projects.ts` | 17, 28 |
| 9 | Form bütçe aralıkları uygun mu? | `src/lib/contact.ts` → `BRIEF_BUDGETS` | 16 |

## Senden gelecek karar / hesap

- [ ] **Resend API anahtarı** → Vercel: `RESEND_API_KEY`, `CONTACT_TO_EMAIL=smertkan33@gmail.com` (form e-postası)
- [ ] **Vercel Analytics** eklensin mi? (madde 29; çerezsiz, ücretsiz katman)
- [ ] **Orijinal videolar** (~340 MB, `public/videos/*.mp4` — `-web` olmayanlar) silinsin mi? Site kullanmıyor.
- [ ] **Proje klasörü iCloud dışına** taşınsın mı? (Masaüstü eşitlemesi `.next` / `.git` içinde kopya dosyalar üretiyor)
- [ ] **Push + Vercel önizleme** ne zaman?
- [ ] Reklam Yönetimi: Meta + Google doğru mu, TikTok vb. var mı?

## Sonra yapılacak (içerik oturunca)

- [ ] **İngilizce çeviri** (madde 02): altyapı hazır (`src/i18n`), sayfa metinleri çevrilip `ENABLED_LOCALES`'e `en` eklenecek
- [ ] **Vaka çalışmaları** (madde 17): restoran çekimi, Ritim AI filmi, Foton sitesi — problem / rol / kapsam / süre / sonuç
- [ ] **Aşama D** (madde 29 ve kalite): gerçek cihazda test (iPhone Safari, Android Chrome), Lighthouse, erişilebilirlik taraması, form uçtan uca testi
- [ ] Gizlilik / çerez metinlerini form + analitik kararına göre güncelleme (madde 28)

## Rapora göre durum

Tamamlandı: 01, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12, 13, 14, 16, 19, 21, 22, 23, 24, 25, 26, 27, 28, 30
Kısmen (içerik bekliyor): 02 (EN altyapısı), 15, 17, 18, 20
Karar bekliyor: 29
