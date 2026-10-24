import os, shutil
from PIL import Image, ImageOps, ImageEnhance

# 1. Copy all files from uploads/loghi to brand_assets
os.makedirs('brand_assets', exist_ok=True)
for f in os.listdir('uploads/loghi'):
    src = os.path.join('uploads/loghi', f)
    dst = os.path.join('brand_assets', f)
    shutil.copy2(src, dst)
    print(f"Copied {f} to brand_assets")

# 2. Use the official ICO for favicon.ico
shutil.copy2('uploads/loghi/Logo-Sombra-palma.ico.ico', 'brand_assets/favicon.ico')
print("Updated brand_assets/favicon.ico with Logo-Sombra-palma.ico.ico")

# 3. Create brand_assets/sombra_resort_symbol_cropped.png from the official palm
# 'Sombra blu trasparente.png' (1080x1080, RGBA, bbox=(70, 192, 1011, 889))
orig_im = Image.open('uploads/loghi/Sombra blu trasparente.png').convert('RGBA')
bbox = orig_im.getbbox()
cropped_palm = orig_im.crop(bbox)

# Create a luxury circular badge with subtle white/gold background so the iconic blue palm stands out crisp on dark navy background
badge_size = 512
badge = Image.new('RGBA', (badge_size, badge_size), (0, 0, 0, 0))

# Make a luxury circle: soft white/light pearl circular base with subtle gold ring
from PIL import ImageDraw
draw = ImageDraw.Draw(badge)
# Draw outer ring
draw.ellipse([8, 8, badge_size-8, badge_size-8], fill=(248, 250, 252, 255), outline=(217, 119, 6, 255), width=8)
draw.ellipse([18, 18, badge_size-18, badge_size-18], outline=(253, 230, 138, 200), width=4)

# Resize cropped palm to fit inside badge nicely (e.g. 360x360)
aspect = cropped_palm.width / cropped_palm.height
target_h = 360
target_w = int(target_h * aspect)
if target_w > 400:
    target_w = 400
    target_h = int(target_w / aspect)

resized_palm = cropped_palm.resize((target_w, target_h), Image.Resampling.LANCZOS)
paste_x = (badge_size - target_w) // 2
paste_y = (badge_size - target_h) // 2

badge.paste(resized_palm, (paste_x, paste_y), resized_palm)
badge.save('brand_assets/sombra_resort_symbol_cropped.png', format='PNG')
badge.save('brand_assets/apple-touch-icon.png', format='PNG')
print("Generated brand_assets/sombra_resort_symbol_cropped.png with official Sombra palm!")

# Also generate a transparent version of the palm without circle:
transparent_palm_square = Image.new('RGBA', (badge_size, badge_size), (0, 0, 0, 0))
transparent_palm_square.paste(resized_palm, (paste_x, paste_y), resized_palm)
transparent_palm_square.save('brand_assets/sombra_palma_transparent.png', format='PNG')

# Also generate a gold variant of the palm for dark backgrounds
gold_palm = Image.new('RGBA', resized_palm.size, (0, 0, 0, 0))
for x in range(resized_palm.width):
    for y in range(resized_palm.height):
        r, g, b, a = resized_palm.getpixel((x, y))
        if a > 10:
            # Gold color: #f59e0b / #d97706
            gold_palm.putpixel((x, y), (245, 158, 11, a))
gold_palm_square = Image.new('RGBA', (badge_size, badge_size), (0, 0, 0, 0))
gold_palm_square.paste(gold_palm, (paste_x, paste_y), gold_palm)
gold_palm_square.save('brand_assets/sombra_palma_gold.png', format='PNG')

print("All brand assets generated successfully with the official Sombra palm!")
