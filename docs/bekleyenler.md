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

---

# Bekleyenler — Hizmetler ve Projeler Detaylı Tasarım Çalışması (25.09.2026)

Kod tarafı uygulandı: Hizmetler (açılış + indeks + 5 bölüm + süreç + kapanış), Projeler (1 öne çıkan + 2 sütun, metin görselin dışında), proje detayında medya türüne göre düzen, kapak/odak/alan adı/sonraki proje düzeltmeleri, FirstScrollSnap kaldırıldı.

## İçerik (rapor bölüm 21)

| Ne | Nerede | Rapor |
|---|---|---|
| Beş hizmetin **fiili kapsamı**: gerçekten sunulan / sunulmayan alt hizmetler (ör. hesap yönetimi, reklam, bakım, barındırma) | `SERVICE_GROUPS` + `serviceTabs` (`src/data/services.ts`) | 9, 21 |
| Hizmet bazında **SSS** cevapları (tek seferlik/aylık çalışma, çekim yeri, revizyon, teklif için gerekenler) — cevaplar gerçek kurallara dayanmalı | Hizmetler sayfası Bölüm E + detaylar | 10-E, 11.2 |
| Proje başına **rol ve teslim kapsamı** (tasarım / çekim / kurgu / geliştirme / yönetim) | `projects.ts` → yeni `role`, `deliverables` | 14.1, 19.1 |
| **Foton** masaüstü + mobil ekran görüntüleri → kapak, "Canlı site" alanı, Web hizmeti görseli (şu an "geçici" etiketli) | `projects.ts`, `SERVICE_GROUPS.web` | 13.5 |
| **Pam** gerçek logo dosyası + renk/tipografi bilgisi (kimlik sunumu için) | Pam detay sayfası | 13.4 |
| **Babi** ek fotoğraf/video (yoksa kısa kayıt olarak kalır — şu an öyle) | `projects.ts` | 13.2 |
| **Milo** video posterleri için daha iyi kare seçimi (şu an 1. saniyeden) | `public/videos/posters/` | 13.1 |
| Ritim açıklamasındaki "geleneksel prodüksiyonun çok altında maliyet" iddiasının dayanağı ya da yeniden yazımı | `projects.ts` → ritim `solution` | 13.3 |
| Dönüş süresi vaadi ("bir iş günü içinde") gerçek mi? | Footer, form başarı metni | 21 |

## Karar (rapor bölüm 25)

- [ ] Ana ticari öncelik ve hizmet sırası (şu an: Fotoğraf & Video → Marka → Sosyal → Web → AI)
- [ ] AI & Otomasyon ana teklif mi, tamamlayıcı mı?
- [ ] Öne çıkan proje (şu an Milo; Ritim aday)
- [ ] Koyu tema korunacak mı? (iki sayfa açık tema için tasarlandı, koyu da çalışıyor)
- [ ] Birincil iletişim kanalı: form mu WhatsApp mı?

## Sonra (içerik gelince)

- [ ] Medya verisini nesneye çevirmek (`type`, `poster`, `focalPoint`, `alt`, oran) — bölüm 19.1
- [ ] Hizmet ↔ proje ilişkisini kimliklerle (`serviceIds`) tek kaynaktan yönetmek
- [ ] Proje detayında "ilgili işler" (en fazla 2, editoryal)
- [ ] 5 kişilik görev testi (bölüm 24.1)
