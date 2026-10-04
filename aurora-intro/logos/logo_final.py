"""Le logo Aurora « Écran », version finale : formes pleines, sans traits ni masques.

Grille de 256. Le cadre est un anneau en rectangle arrondi (extérieur 16→240 × 32→220, rayon 54 ;
intérieur 40→216 × 56→196, rayon 30), d'un seul chemin en evenodd. Le soleil est le disque
(128, 200, r 58) coupé au bord intérieur bas de l'écran (y 196) : il se lève sur le bas du cadre.
Le nom est la police du projet (Familjen Grotesk, graisse 600), mise en forme avec son crénage et
l'interlettrage de l'app (−0,03 em), puis convertie en contours.
"""
import io, math, pathlib, sys
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ICI = pathlib.Path(__file__).parent
BLANC, NUIT = '#f2f0ff', '#0a0a0e'
VIOLET, ROSE = '#9d5cff', '#ff6cab'

def rect_arrondi(x0, y0, x1, y1, r, sens=1):
    """Un rectangle arrondi en un sous-chemin ; sens -1 : tracé à l'envers (pour un trou)."""
    if sens > 0:
        return (f'M{x0 + r} {y0}H{x1 - r}A{r} {r} 0 0 1 {x1} {y0 + r}V{y1 - r}A{r} {r} 0 0 1 {x1 - r} {y1}'
                f'H{x0 + r}A{r} {r} 0 0 1 {x0} {y1 - r}V{y0 + r}A{r} {r} 0 0 1 {x0 + r} {y0}Z')
    return (f'M{x0 + r} {y0}A{r} {r} 0 0 0 {x0} {y0 + r}V{y1 - r}A{r} {r} 0 0 0 {x0 + r} {y1}'
            f'H{x1 - r}A{r} {r} 0 0 0 {x1} {y1 - r}V{y0 + r}A{r} {r} 0 0 0 {x1 - r} {y0}Z')

CADRE = rect_arrondi(16, 32, 240, 220, 54) + rect_arrondi(40, 56, 216, 196, 30, -1)
_dx = math.sqrt(58 ** 2 - 4 ** 2)
SOLEIL = f'M{128 - _dx:.2f} 196A58 58 0 0 1 {128 + _dx:.2f} 196Z'

def marque(encre=BLANC, soleil=None, pid='a'):
    """Le contenu SVG de la marque. soleil : None = dégradé, sinon une couleur unie."""
    defs, fill = '', soleil
    if soleil is None:
        defs = (f'<defs><linearGradient id="{pid}-soleil" gradientUnits="userSpaceOnUse" x1="0" y1="196" x2="0" y2="142">'
                f'<stop offset="0" stop-color="{VIOLET}"/><stop offset="1" stop-color="{ROSE}"/></linearGradient></defs>')
        fill = f'url(#{pid}-soleil)'
    return defs + f'<path fill="{encre}" fill-rule="evenodd" d="{CADRE}"/><path fill="{fill}" d="{SOLEIL}"/>'

def svg(contenu, vb='0 0 256 256', titre='Aurora', w=None, h=None):
    taille = f' width="{w}" height="{h}"' if w else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}"{taille} role="img" aria-labelledby="titre">'
            f'<title id="titre">{titre}</title>{contenu}</svg>\n')

def tuile(clair=False, pid='t', echelle=.64, rayon=58, cote=256):
    """L'icône d'app : un carré arrondi, et la marque au centre (64 %)."""
    if clair:
        fond = f'<rect width="{cote}" height="{cote}" rx="{rayon}" fill="#f6f4ff"/>'
    else:
        fond = (f'<defs><linearGradient id="{pid}-fond" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1640"/>'
                f'<stop offset="1" stop-color="{NUIT}"/></linearGradient></defs><rect width="{cote}" height="{cote}" rx="{rayon}" fill="url(#{pid}-fond)"/>')
    m = (cote - 256 * echelle) / 2
    return fond + f'<g transform="translate({m:.2f} {m:.2f}) scale({echelle})">{marque(NUIT if clair else BLANC, None, pid)}</g>'

def nom_en_contours(x_depart, ligne_de_base, hauteur_capitale, couleur):
    """« Aurora » dans la police du projet, en contours, posé sur la ligne de base."""
    data = (ICI / 'familjen-600.ttf').read_bytes()
    police = TTFont(io.BytesIO(data))
    upem = police['head'].unitsPerEm
    cap = police['OS/2'].sCapHeight
    k = hauteur_capitale / cap
    face = hb.Face(data); font = hb.Font(face)
    b = hb.Buffer(); b.add_str('Aurora'); b.guess_segment_properties()
    hb.shape(font, b, {'kern': True})
    ordre, glyphes = police.getGlyphOrder(), police.getGlyphSet()
    x, chemins = 0, []
    for i, (info, pos) in enumerate(zip(b.glyph_infos, b.glyph_positions)):
        stylo = SVGPathPen(glyphes)
        glyphes[ordre[info.codepoint]].draw(TransformPen(stylo, (k, 0, 0, -k, x_depart + (x + pos.x_offset) * k, ligne_de_base)))
        chemins.append(stylo.getCommands())
        x += pos.x_advance - .03 * upem
    largeur = (x + .03 * upem) * k
    return f'<path fill="{couleur}" d="{" ".join(chemins)}"/>', largeur

def horizontal(encre=BLANC, pid='h'):
    """Le logo et le nom côte à côte : capitales à 1/1,45 de la hauteur du cadre, centrées sur lui."""
    cap = 188 / 1.45
    base = 126 + cap / 2
    nom, largeur = nom_en_contours(240 + .36 * cap, base, cap, encre)
    w = math.ceil(240 + .36 * cap + largeur + 16)
    return svg(marque(encre, None, pid) + nom, f'0 0 {w} 256', 'Aurora'), w

if __name__ == '__main__':
    out = pathlib.Path(sys.argv[1])
    (out / 'logo').mkdir(parents=True, exist_ok=True)
    L = out / 'logo'
    (L / 'aurora-ecran.svg').write_text(svg(marque(BLANC, None, 'c'), titre='Aurora'))
    (L / 'aurora-ecran-clair.svg').write_text(svg(marque(NUIT, None, 'k'), titre='Aurora, sur fond clair'))
    (L / 'aurora-ecran-aplat.svg').write_text(svg(marque(BLANC, ROSE), titre='Aurora, couleurs unies'))
    (L / 'aurora-ecran-blanc.svg').write_text(svg(marque(BLANC, BLANC), titre='Aurora, blanc'))
    (L / 'aurora-ecran-noir.svg').write_text(svg(marque(NUIT, NUIT), titre='Aurora, noir'))
    h, _ = horizontal(BLANC, 'h')
    (L / 'aurora-horizontal.svg').write_text(h)
    h, _ = horizontal(NUIT, 'hk')
    (L / 'aurora-horizontal-clair.svg').write_text(h)
    (L / 'favicon.svg').write_text(svg(tuile(False, 'f'), titre='Aurora'))
    (L / 'icone.svg').write_text(svg(tuile(False, 'i'), titre='Aurora'))
    (L / 'icone-claire.svg').write_text(svg(tuile(True, 'ic'), titre='Aurora'))
    # macOS : le carré arrondi fait 824 sur une toile de 1024 (grille d'Apple), sans fond autour.
    mac = f'<g transform="translate(100 100) scale({824 / 256})">{tuile(False, "m")}</g>'
    (L / 'icone-macos.svg').write_text(svg(mac, '0 0 1024 1024', 'Aurora'))
    # iOS : carré plein (le système arrondit lui-même), et les calques pour Icon Composer.
    ios_fond = (f'<defs><linearGradient id="ios-fond" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1640"/>'
                f'<stop offset="1" stop-color="{NUIT}"/></linearGradient></defs><rect width="1024" height="1024" fill="url(#ios-fond)"/>')
    pose = f'translate({(1024 - 256 * 2.56) / 2} {(1024 - 256 * 2.56) / 2}) scale(2.56)'
    (L / 'ios').mkdir(exist_ok=True)
    (L / 'ios' / 'icone-ios.svg').write_text(svg(ios_fond + f'<g transform="{pose}">{marque(BLANC, None, "ios")}</g>', '0 0 1024 1024'))
    (L / 'ios' / 'calque-fond.svg').write_text(svg(ios_fond, '0 0 1024 1024', 'Aurora, fond'))
    (L / 'ios' / 'calque-cadre.svg').write_text(svg(f'<g transform="{pose}"><path fill="{BLANC}" fill-rule="evenodd" d="{CADRE}"/></g>', '0 0 1024 1024', 'Aurora, cadre'))
    (L / 'ios' / 'calque-soleil.svg').write_text(svg(
        f'<defs><linearGradient id="cs" gradientUnits="userSpaceOnUse" x1="0" y1="196" x2="0" y2="142"><stop offset="0" stop-color="{VIOLET}"/><stop offset="1" stop-color="{ROSE}"/></linearGradient></defs>'
        f'<g transform="{pose}"><path fill="url(#cs)" d="{SOLEIL}"/></g>', '0 0 1024 1024', 'Aurora, soleil'))
    # Android : icône adaptative (toile de 108 dp, zone sûre de 66 dp au centre) et version monochrome.
    (L / 'android').mkdir(exist_ok=True)
    pose_a = f'translate({(108 - 256 * .25) / 2} {(108 - 256 * .25) / 2}) scale(.25)'
    (L / 'android' / 'premier-plan.svg').write_text(svg(f'<g transform="{pose_a}">{marque(BLANC, None, "and")}</g>', '0 0 108 108', 'Aurora, premier plan'))
    (L / 'android' / 'monochrome.svg').write_text(svg(f'<g transform="{pose_a}">{marque("#000", "#000")}</g>', '0 0 108 108', 'Aurora, monochrome'))
    (L / 'android' / 'arriere-plan.svg').write_text(svg(
        '<defs><linearGradient id="af" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1640"/><stop offset="1" stop-color="#0a0a0e"/></linearGradient></defs>'
        '<rect width="108" height="108" fill="url(#af)"/>', '0 0 108 108', 'Aurora, arrière-plan'))
    print('ok')
