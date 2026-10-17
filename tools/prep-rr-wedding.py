"""Assets for the Rose Red detailed wedding invitation (26 Nov 2026).

python tools/prep-rr-wedding.py <out folder under public/>

Reads the Rose Red theme pages (public/engagement/_themes/rose-red/art) and the
couple's photos (invites/src/rr-wedding-26nov/1..7.jpg); writes <out>/assets/.
The theme files and the source photos are never modified.
"""
import shutil, sys
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
THEME = ROOT / "public/engagement/_themes/rose-red"
SRC = ROOT / "invites/src/rr-wedding-26nov"
OUT = ROOT / "public" / sys.argv[1] / "assets"
OUT.mkdir(parents=True, exist_ok=True)

# the designer's finished pages, used whole
for name in ["envelope", "couple-page", "date-page", "date-cover", "venue-page", "thanks-page", "corner-floral", "spark"]:
    shutil.copy2(THEME / "art" / f"{name}.webp", OUT / f"{name}.webp")
shutil.copy2(THEME / "audio/background.mp3", OUT / "music.mp3")

# the couple's photos
for i in "1234567":
    im = Image.open(SRC / f"{i}.jpg").convert("RGB")
    im.thumbnail((1000, 1400), Image.LANCZOS)
    im.save(OUT / f"photo-{i}.webp", "WEBP", quality=82, method=6)

# embossed damask for the sections between the pages: a seamless mirrored tile from the envelope
env = Image.open(THEME / "art/envelope.webp").convert("RGB")
t = env.crop((560, 280, 1000, 700))
t = ImageEnhance.Brightness(t).enhance(.78)
w, h = t.size
tile = Image.new("RGB", (w * 2, h * 2))
tile.paste(t, (0, 0)); tile.paste(ImageOps.mirror(t), (w, 0))
tile.paste(ImageOps.flip(t), (0, h)); tile.paste(ImageOps.flip(ImageOps.mirror(t)), (w, h))
tile = tile.resize((w, h), Image.LANCZOS)
tile.save(OUT / "damask.webp", "WEBP", quality=70, method=6)

# link preview: the sealed envelope, seal in the middle — says nothing about dates or names
W, H = 1200, 630
cw = env.width; ch = round(cw * H / W); cy = 1027
crop = env.crop((0, cy - ch // 2, cw, cy - ch // 2 + ch)).resize((W, H), Image.LANCZOS)
crop.save(OUT / "og.jpg", "JPEG", quality=86, optimize=True, progressive=True)
print("assets ->", OUT.relative_to(ROOT))
