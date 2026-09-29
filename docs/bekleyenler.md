# Bekleyenler — Tasarım ve İşlevsellik İncelemesi (24.09.2026)

Dal: `revize/asama-a` (yerelde, push edilmedi). Raporun kod tarafı tamamlandı; aşağıdakiler içerik, karar ya da dış hesap bekliyor.

## Senden gelecek içerik

| # | Ne | Nereye gidecek | Rapor maddesi |
|---|---|---|---|
| 1 | 11 hizmet görseli (`docs/gorsel-promptlari.md`) → `~/Desktop/zeplin-gorseller/` | `python3 scripts/import-service-images.py` ile kartlara + AI bandı kolajı | 15 |
| 2 | Foton sitesi ekran görüntüleri (masaüstü + mobil) | Kurumsal Web kartı, Foton proje sayfası, galeri | 17 |
| 3 | Metriklerin gerçek değerleri (kaynak, dönem, tanım) ya da kaldırma kararı | `src/data/metrics.ts` | 18 |
| 4 | Hakkımızda: gerçek isimler, roller, ekip / çekim fotoğrafları | `src/data/about.ts` (aşağıdaki Hakkımızda bölümü) | 20 |
| 5 | Babi projesi için 4-6 fotoğraf | `src/data/projects.ts` → galeri | 17 |
| 6 | Gerçek müşteri görüşleri (isim, rol, marka, yayın onayı) | Proje notlarından ayrı bölüm | 19 |
| 7 | Hizmet kapsamı bilgileri: revizyon sınırı, tipik takvim, teslim listesi | Hizmet detay sayfaları | 15 |
| 8 | Proje yılları doğru mu? (beşi de 2024) | `src/data/projects.ts` | 17, 28 |
| 9 | Form bütçe aralıkları uygun mu? | `src/lib/contact.ts` → `BRIEF_BUDGETS` | 16 |

## Senden gelecek karar / hesap

- [ ] **Resend API anahtarı** → Vercel: `RESEND_API_KEY`, `CONTACT_TO_EMAIL=smertkan33@gmail.com` (form e-postası)
- [ ] **Vercel Analytics** eklensin mi? (madde 29; çerezsiz, ücretsiz katman)
- [x] ~~Orijinal videolar~~ → `~/Movies/Zeplin Orijinal Videolar` (334 MB, 7 dosya, sağlaması doğrulandı); depodan çıkarıldı, `.gitignore` yeniden eklenmesini engelliyor (29.09.2026). Not: altısı `master` geçmişinde hâlâ var, `ritim-bitti.mp4` bu dalın geçmişinde; geçmiş yeniden yazılmadı.
- [x] ~~Proje klasörü iCloud dışına~~ → `~/Projects/zeplin-2-revize` (28.09.2026)
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

---

# Bekleyenler — Hakkımızda (29.09.2026)

Sayfa hareket prototipinden uyarlandı; ardından eklenenler: sessiz **showreel** (Milo + Ritim kesitleri, `scripts/build-showreel.sh`), **Bir filmin akışı** (Ritim filminden 4 kare), **Birlikte çalıştıklarımız** (2 müşteri videosu + 9 marka logosu, ana sayfayla ortak `src/data/clients.ts`). Hikâye ve ekip bölümü `src/data/about.ts` dolunca kendiliğinden görünür.

## Senden gelecek cevaplar

| # | Soru | Nereye |
|---|---|---|
| 1 | **Çalışma modeli**: kurucu odaklı mı, çekirdek ekip + proje bazlı uzman mı, tam ekip mi? | `ABOUT.workModel` |
| 2 | **Kişiler**: isim, rol, somut sorumluluk (35–60 kelime), varsa profil bağlantısı | `ABOUT.people` |
| 3 | **Kuruluş hikâyesi**: ne zaman, neden, ilk iş (120–180 kelime, gerçek olaylar) | `ABOUT.story` |
| 4 | **Kurucu notu** için 3 soru: Neden bu işi yapıyorsun? Bir işte neye "tamam" dersin? Müşteri seninle çalışınca neyi fark etmeli? | `ABOUT.founderNote` |
| 5 | **Portre ve set fotoğrafları** (gerçek; 4:5 portre, çekimden kareler + kısa açıklama) | `ABOUT.people[].photo`, `ABOUT.productionPhotos`, `ABOUT.heroPhoto` |
| 6 | **"Zeplin" adının hikâyesi** (varsa) | Hikâye bölümü |
| 7 | **Üç çalışma ilkesi** gerçek kural olarak onaylanıyor mu? (Önce doğru soru / Parçaları birlikte / Süreci açık tutmak) | `PRINCIPLES` |
| 8 | **Showreel müziği** (lisanslı parça ya da kendi müziğiniz). Gelene kadar sessiz; gelince sese ayrı düğme eklenir | `scripts/build-showreel.sh` |
| 9 | **Kamera arkası** (Milo çekimi, set, ışık hazırlığı) fotoğraf / kısa video | Showreel + `productionPhotos` |
| 10 | Müşteri videolarındaki kişilerin **tam adı ve unvanı** yayınlanabilir mi? (şu an "Emma Hanım", "Oğuz Bey") | `src/data/clients.ts` |
