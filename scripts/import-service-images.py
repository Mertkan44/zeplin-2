"""Masaüstü/zeplin-gorseller klasöründeki görselleri hizmet kartlarına yerleştirir.

- Her dosyayı 1600x1000 (1.6:1) orta kırpar, WebP'ye çevirir → public/images/services/
- src/data/services.ts içindeki serviceImages eşlemesini günceller
- Bulunamayan dosyaları listeler; mevcut görsele dokunmaz

Kullanım: python3 scripts/import-service-images.py [kaynak_klasör]
"""

import re
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / "Desktop" / "zeplin-gorseller"
OUT = ROOT / "public" / "images" / "services"
DATA = ROOT / "src" / "data" / "services.ts"

# dosya adı (uzantısız) → serviceImages anahtarı
MAPPING = {
    "reklam-yonetimi": "adsManagement",
    "sosyal-medya-metni": "socialCopy",
    "senaryo-script": "scriptWriting",
    "blog-yazilari": "blogWriting",
    "e-posta-pazarlama": "emailMarketing",
    "kartvizit": "businessCard",
    "ozel-yazilim": "software",
    "ai-chatbot": "ai",
    "ai-callbot": "aiCallbot",
    "is-akisi": "workflowAutomation",
    "crm": "crmIntegration",
}

TARGET_W, TARGET_H = 1600, 1000


def cover_crop(im: Image.Image) -> Image.Image:
    scale = max(TARGET_W / im.width, TARGET_H / im.height)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    left = (im.width - TARGET_W) // 2
    top = (im.height - TARGET_H) // 2
    return im.crop((left, top, left + TARGET_W, top + TARGET_H))


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    data = DATA.read_text()
    missing = []
    for name, key in MAPPING.items():
        src = next((p for p in SRC.glob(f"{name}.*") if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}), None)
        if not src:
            missing.append(name)
            continue
        out = OUT / f"{name}.webp"
        cover_crop(Image.open(src).convert("RGB")).save(out, "WEBP", quality=82)
        path = f"/images/services/{name}.webp"
        pattern = re.compile(rf'(\n  {key}: )"[^"]*"')
        if pattern.search(data):
            data = pattern.sub(rf'\1"{path}"', data)
        else:
            data = data.replace("} as const;", f'  {key}: "{path}",\n}} as const;', 1)
        print(f"✓ {src.name} → {path} ({out.stat().st_size // 1024} KB)")
    # AI bandı: chatbot + callbot + özel yazılım görsellerinden yan yana kolaj
    parts = [OUT / f"{n}.webp" for n in ("ai-chatbot", "ai-callbot", "ozel-yazilim")]
    if all(p.exists() for p in parts):
        slice_w = TARGET_W // 3
        band = Image.new("RGB", (TARGET_W, TARGET_H), (22, 8, 18))
        for i, part in enumerate(parts):
            im = Image.open(part).convert("RGB")
            scale = TARGET_H / im.height
            im = im.resize((round(im.width * scale), TARGET_H), Image.LANCZOS)
            left = (im.width - slice_w) // 2
            band.paste(im.crop((left, 0, left + slice_w, TARGET_H)), (i * slice_w + (4 if i else 0), 0))
        band_path = OUT / "ai-bant.webp"
        band.save(band_path, "WEBP", quality=82)
        data = re.sub(r'(\n  aiBand: )"[^"]*"', r'\1"/images/services/ai-bant.webp"', data)
        print(f"✓ AI bandı kolajı → /images/services/ai-bant.webp")

    DATA.write_text(data)
    if missing:
        print("Bulunamadı:", ", ".join(missing))


if __name__ == "__main__":
    main()
