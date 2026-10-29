from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

assets = Path(__file__).resolve().parents[1] / 'src' / 'assets'
for size in (192, 512):
    im = Image.new('RGB', (size, size), '#344b3f')
    draw = ImageDraw.Draw(im)
    for ratio in (.21, .27):
        inset = int(size * ratio)
        draw.ellipse((inset, inset, size-inset, size-inset), outline='#6b8069', width=max(1, size//256))
    font = ImageFont.truetype('C:/Windows/Fonts/pala.ttf', int(size*.68))
    draw.text((size*.5, size*.46), 'a', font=font, fill='#eeeade', anchor='mm')
    im.save(assets / f'icon-{size}.png', optimize=True)
print('Ícones 192 e 512 gerados.')
