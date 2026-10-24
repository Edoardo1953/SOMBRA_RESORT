import os
from PIL import Image, ImageDraw

os.makedirs('brand_assets', exist_ok=True)

# 1. Create SVG Symbol
svg_symbol = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A" />
      <stop offset="30%" stop-color="#D97706" />
      <stop offset="70%" stop-color="#B45309" />
      <stop offset="100%" stop-color="#78350F" />
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399" />
      <stop offset="50%" stop-color="#059669" />
      <stop offset="100%" stop-color="#064E3B" />
    </linearGradient>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
  </defs>
  <rect width="500" height="500" rx="100" fill="url(#bgGrad)"/>
  <circle cx="250" cy="250" r="210" fill="none" stroke="url(#goldGrad)" stroke-width="4" stroke-dasharray="6 4" opacity="0.6"/>
  <circle cx="250" cy="250" r="190" fill="none" stroke="url(#goldGrad)" stroke-width="2" opacity="0.9"/>
  
  <g transform="translate(250, 230)">
    <circle cx="0" cy="-10" r="42" fill="url(#goldGrad)" opacity="0.9" />
    <path d="M -120 40 Q 0 10 120 40" fill="none" stroke="url(#emeraldGrad)" stroke-width="5" stroke-linecap="round"/>
    <path d="M -90 60 Q 0 35 90 60" fill="none" stroke="url(#emeraldGrad)" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
    <path d="M -60 78 Q 0 58 60 78" fill="none" stroke="url(#emeraldGrad)" stroke-width="3" stroke-linecap="round" opacity="0.6"/>

    <path d="M 0 30 Q -40 -40 -110 -20 Q -60 -70 0 -50" fill="url(#emeraldGrad)"/>
    <path d="M 0 30 Q -30 -70 -70 -100 Q -25 -110 0 -60" fill="url(#emeraldGrad)"/>
    <path d="M 0 30 Q 0 -90 0 -125 Q 15 -90 0 -50" fill="url(#goldGrad)"/>
    <path d="M 0 30 Q 30 -70 70 -100 Q 25 -110 0 -60" fill="url(#emeraldGrad)"/>
    <path d="M 0 30 Q 40 -40 110 -20 Q 60 -70 0 -50" fill="url(#emeraldGrad)"/>
  </g>

  <text x="250" y="415" font-family="'Cinzel', 'Playfair Display', 'Georgia', serif" font-size="42" font-weight="700" fill="url(#goldGrad)" text-anchor="middle" letter-spacing="6">SOMBRA RESORT</text>
  <text x="250" y="440" font-family="'Inter', sans-serif" font-size="14" font-weight="500" fill="#94A3B8" text-anchor="middle" letter-spacing="4">LUXEMBOURG • BRÉSIL</text>
</svg>"""

with open('brand_assets/sombra_resort_symbol.svg', 'w', encoding='utf-8') as f:
    f.write(svg_symbol)

# 2. Create Horizontal SVG Logo
svg_horizontal = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 240" width="100%" height="100%">
  <defs>
    <linearGradient id="goldH" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A" />
      <stop offset="40%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#92400E" />
    </linearGradient>
    <linearGradient id="emeraldH" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
  </defs>
  <g transform="translate(30, 20)">
    <circle cx="100" cy="100" r="90" fill="#0F172A" stroke="url(#goldH)" stroke-width="2.5"/>
    <circle cx="100" cy="100" r="78" fill="none" stroke="url(#goldH)" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.7"/>
    <g transform="translate(100, 95) scale(0.65)">
      <circle cx="0" cy="-10" r="35" fill="url(#goldH)" opacity="0.9" />
      <path d="M -100 35 Q 0 10 100 35" fill="none" stroke="url(#emeraldH)" stroke-width="5" stroke-linecap="round"/>
      <path d="M 0 25 Q -35 -35 -90 -15 Q -50 -60 0 -45" fill="url(#emeraldH)"/>
      <path d="M 0 25 Q -25 -60 -60 -85 Q -20 -95 0 -50" fill="url(#emeraldH)"/>
      <path d="M 0 25 Q 0 -80 0 -110 Q 15 -80 0 -45" fill="url(#goldH)"/>
      <path d="M 0 25 Q 25 -60 60 -85 Q 20 -95 0 -50" fill="url(#emeraldH)"/>
      <path d="M 0 25 Q 35 -35 90 -15 Q 50 -60 0 -45" fill="url(#emeraldH)"/>
    </g>
  </g>
  <text x="260" y="105" font-family="'Cinzel', 'Playfair Display', 'Georgia', serif" font-size="50" font-weight="700" fill="url(#goldH)" letter-spacing="6">SOMBRA RESORT</text>
  <text x="262" y="145" font-family="'Inter', sans-serif" font-size="18" font-weight="600" fill="#34D399" letter-spacing="4">S.à r.l. • LUXEMBOURG</text>
  <text x="262" y="175" font-family="'Inter', sans-serif" font-size="14" font-weight="400" fill="#94A3B8" letter-spacing="2">HOLDING DE PARTICIPATIONS • FILIALE BRÉSIL (100%)</text>
</svg>"""

with open('brand_assets/sombra_resort_horizontal.svg', 'w', encoding='utf-8') as f:
    f.write(svg_horizontal)

# 3. Create raster icons (PNG & ICO) using Pillow
img = Image.new('RGBA', (512, 512), (15, 23, 42, 255))
draw = ImageDraw.Draw(img)

# Outer circle gold
draw.ellipse([30, 30, 482, 482], outline=(217, 119, 6, 255), width=8)
draw.ellipse([50, 50, 462, 462], outline=(253, 230, 138, 200), width=3)
# Central Sun
draw.ellipse([210, 140, 302, 232], fill=(245, 158, 11, 255))
# Palm fronds
draw.polygon([(256, 260), (140, 200), (180, 150)], fill=(5, 150, 105, 255))
draw.polygon([(256, 260), (372, 200), (332, 150)], fill=(5, 150, 105, 255))
draw.polygon([(256, 260), (190, 140), (230, 100)], fill=(16, 185, 129, 255))
draw.polygon([(256, 260), (322, 140), (282, 100)], fill=(16, 185, 129, 255))
draw.polygon([(256, 260), (240, 110), (256, 70), (272, 110)], fill=(217, 119, 6, 255))
# Water wave
draw.arc([130, 260, 382, 330], start=0, end=180, fill=(16, 185, 129, 255), width=8)
draw.arc([160, 290, 352, 350], start=0, end=180, fill=(5, 150, 105, 255), width=6)

img.save('brand_assets/sombra_resort_symbol_cropped.png', format='PNG')
img.save('brand_assets/apple-touch-icon.png', format='PNG')

fav16 = img.resize((16, 16), Image.Resampling.LANCZOS)
fav32 = img.resize((32, 32), Image.Resampling.LANCZOS)
fav48 = img.resize((48, 48), Image.Resampling.LANCZOS)
fav16.save('brand_assets/favicon-16x16.png')
fav32.save('brand_assets/favicon-32x32.png')
fav48.save('brand_assets/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])

print('Brand assets successfully generated!')
