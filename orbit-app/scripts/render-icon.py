"""Rasterize project/assets/orbit-app-icon.svg -> assets/icon.png (1024x1024).

The source SVG is simple geometry, so we redraw it with Pillow at 4x supersample
and downscale with LANCZOS for crisp antialiased edges. iOS masks the icon to a
squircle, so we fill the full square with the background colour (no transparency).
"""
from PIL import Image, ImageDraw

OUT_SIZE = 1024
SS = 4                      # supersample factor
R = OUT_SIZE * SS
SCALE = R / 120.0           # SVG is authored in a 120x120 viewBox

BG = (27, 26, 23)          # #1B1A17
RING = (250, 248, 244)     # #FAF8F4
PLANET_A = (226, 97, 58)   # #E2613A
PLANET_B = (46, 115, 216)  # #2E73D8
CORE = (87, 78, 226)       # #574EE2


def s(v):
    return v * SCALE


def bbox(cx, cy, rx, ry):
    return [s(cx - rx), s(cy - ry), s(cx + rx), s(cy + ry)]


# Opaque background (full square; iOS rounds the corners itself).
base = Image.new("RGBA", (R, R), (*BG, 255))

# Rotated orbit group (SVG: rotate(-24 60 60) == 24deg counter-clockwise).
layer = Image.new("RGBA", (R, R), (0, 0, 0, 0))
d = ImageDraw.Draw(layer)
d.ellipse(bbox(60, 60, 42, 19), outline=(*RING, 229), width=round(s(5)))  # opacity 0.9
d.ellipse(bbox(102, 60, 9, 9), fill=(*PLANET_A, 255))
d.ellipse(bbox(20, 58, 5, 5), fill=(*PLANET_B, 255))
layer = layer.rotate(24, resample=Image.BICUBIC, center=(R / 2, R / 2))
base.alpha_composite(layer)

# Centre core (outside the rotated group in the SVG).
ImageDraw.Draw(base).ellipse(bbox(60, 60, 15, 15), fill=(*CORE, 255))

icon = base.convert("RGB").resize((OUT_SIZE, OUT_SIZE), Image.LANCZOS)
icon.save("assets/icon.png")
print("wrote assets/icon.png", icon.size)
