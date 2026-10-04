"""Les pistes de logo Aurora, en SVG sur une grille de 256.

Chaque piste est une fonction (encre, mono) -> contenu SVG (sans la balise <svg>) :
- encre : la couleur des parties « neutres » (blanc sur fond sombre, encre sur fond clair) ;
- mono : une couleur unique pour toute la marque, ou None pour la version en couleurs.
Les couleurs de la marque : bleu #4ea8f5, violet #9d5cff, rose #ff6cab.
"""
BLEU, VIOLET, ROSE = '#4ea8f5', '#9d5cff', '#ff6cab'
BLANC, NUIT = '#f2f0ff', '#0a0a0e'


def degrade(id_, x1=24, y1=232, x2=232, y2=24, arrets=((0, BLEU), (.5, VIOLET), (1, ROSE))):
    stops = ''.join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in arrets)
    return f'<linearGradient id="{id_}" gradientUnits="userSpaceOnUse" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}">{stops}</linearGradient>'


def actuel(encre, mono, p):
    """Le Λ d'aujourd'hui, pour comparer (trait de 5 sur un cadre de 39 : ici 34 sur 256)."""
    c = mono or f'url(#{p}g)'
    d = '' if mono else f'<defs>{degrade(p + "g", 40, 214, 216, 40)}</defs>'
    return d + f'<path d="M48 214 L128 34 L208 214" fill="none" stroke="{c}" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/>'


def arche(encre, mono, p):
    """Un A en arche d'aurore, traversé par l'horizon."""
    c = mono or f'url(#{p}g)'
    h = mono or encre
    d = '' if mono else f'<defs>{degrade(p + "g", 48, 216, 208, 48)}</defs>'
    return d + (f'<path fill="{c}" d="M48 216 V128 A80 80 0 0 1 208 128 V216 H168 V128 A40 40 0 0 0 88 128 V216 Z"/>'
                f'<rect x="30" y="152" width="196" height="26" rx="13" fill="{h}"/>')


def vague(encre, mono, p):
    """Un A plein dont la barre est une vague d'aurore qui le traverse."""
    jambes = mono or encre
    c = mono or f'url(#{p}g)'
    d = f'<defs><mask id="{p}m" maskUnits="userSpaceOnUse" x="0" y="0" width="256" height="256"><rect width="256" height="256" fill="#fff"/>' \
        f'<path d="M26 168 C 66 138, 104 142, 128 162 S 192 186, 230 154" fill="none" stroke="#000" stroke-width="58" stroke-linecap="round"/></mask>' \
        + ('' if mono else degrade(p + 'g', 26, 0, 230, 0, ((0, BLEU), (.5, VIOLET), (1, ROSE)))) + '</defs>'
    return d + (f'<path mask="url(#{p}m)" fill="{jambes}" d="M104 32 H152 L248 224 H200 L128 80 L56 224 H8 Z"/>'
                f'<path d="M26 168 C 66 138, 104 142, 128 162 S 192 186, 230 154" fill="none" stroke="{c}" stroke-width="34" stroke-linecap="round"/>')


def strates(encre, mono, p):
    """Les trois traits du A en trois voiles de lumière, plus claires là où elles se croisent."""
    L = 'M64 214 L128 46'
    R = 'M192 214 L128 46'
    B = 'M86 160 H170'
    if mono:
        return (f'<g fill="none" stroke="{mono}" stroke-linecap="round"><path d="{L}" stroke-width="46"/><path d="{R}" stroke-width="46"/>'
                f'<path d="{B}" stroke-width="36"/></g>')
    trait = lambda d, c, w, extra='': f'<path d="{d}" fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round"{extra}/>'
    # clipPath n'accepte que la géométrie remplie : on passe par des contours épais approchés en polygones.
    def bande(x1, y1, x2, y2, w):
        import math
        dx, dy = x2 - x1, y2 - y1
        l = math.hypot(dx, dy)
        nx, ny = -dy / l * w / 2, dx / l * w / 2
        return f'M{x1+nx:.1f} {y1+ny:.1f} L{x2+nx:.1f} {y2+ny:.1f} L{x2-nx:.1f} {y2-ny:.1f} L{x1-nx:.1f} {y1-ny:.1f} Z'
    zl = bande(64, 214, 128, 46, 46) + ' M64 214 m-23 0 a23 23 0 1 0 46 0 a23 23 0 1 0 -46 0 M128 46 m-23 0 a23 23 0 1 0 46 0 a23 23 0 1 0 -46 0'
    zr = bande(192, 214, 128, 46, 46) + ' M192 214 m-23 0 a23 23 0 1 0 46 0 a23 23 0 1 0 -46 0'
    defs = f'<defs><clipPath id="{p}cl"><path d="{zl}"/></clipPath><clipPath id="{p}cr"><path d="{zr}"/></clipPath></defs>'
    return defs + (trait(L, BLEU, 46) + trait(R, ROSE, 46) + trait(B, VIOLET, 36)
                   + f'<g clip-path="url(#{p}cl)">' + trait(R, '#ffcdfb', 46) + trait(B, '#bbc7ff', 36) + '</g>'
                   + f'<g clip-path="url(#{p}cr)">' + trait(B, '#ffa1ff', 36) + '</g>')


def lueur(encre, mono, p):
    """Le a minuscule d'aurora, avec une lueur dans sa panse."""
    lettre = mono or encre
    a = (f'<circle cx="118" cy="128" r="58" fill="none" stroke="{lettre}" stroke-width="40"/>'
         f'<rect x="156" y="50" width="40" height="156" fill="{lettre}"/>')
    if mono:
        return a
    d = (f'<defs><radialGradient id="{p}r" cx="118" cy="128" r="30" gradientUnits="userSpaceOnUse">'
         f'<stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="{ROSE}"/><stop offset=".75" stop-color="{VIOLET}"/><stop offset="1" stop-color="{BLEU}"/></radialGradient></defs>')
    return d + a + f'<circle cx="118" cy="128" r="26" fill="url(#{p}r)"/>'


def lever(encre, mono, p):
    """L'aube : un soleil qui se lève sur l'horizon, et deux arcs de lumière, ou deux ondes."""
    s, a1, a2, h = (mono,) * 4 if mono else (ROSE, VIOLET, BLEU, encre)
    return (f'<path d="M80 176 A48 48 0 0 1 176 176 Z" fill="{s}"/>'
            f'<path d="M53 176 A75 75 0 0 1 203 176" fill="none" stroke="{a1}" stroke-width="18"/>'
            f'<path d="M17 176 A111 111 0 0 1 239 176" fill="none" stroke="{a2}" stroke-width="18"/>'
            f'<rect x="8" y="174" width="240" height="24" rx="12" fill="{h}"/>')


def voiles(encre, mono, p):
    """Trois voiles d'aurore boréale, plus vives en bas, qui s'effacent en montant."""
    chemins = ['M78 204 C 70 168, 92 132, 82 92', 'M128 214 C 118 168, 142 112, 128 44', 'M178 204 C 170 172, 190 140, 180 108']
    if mono:
        return ''.join(f'<path d="{c}" fill="none" stroke="{mono}" stroke-width="38" stroke-linecap="round"/>' for c in chemins)
    cols = [BLEU, VIOLET, ROSE]
    d = '<defs>' + ''.join(degrade(f'{p}v{i}', 0, 220, 0, 40, ((0, c), (.55, c), (1, BLANC))) for i, c in enumerate(cols)) + '</defs>'
    return d + ''.join(f'<path d="{c}" fill="none" stroke="url(#{p}v{i})" stroke-width="38" stroke-linecap="round"/>' for i, c in enumerate(chemins))


def lecture(encre, mono, p):
    """Le bouton lecture, fendu d'une vague d'aurore."""
    c = mono or f'url(#{p}g)'
    d = (f'<defs><mask id="{p}m" maskUnits="userSpaceOnUse" x="0" y="0" width="256" height="256"><rect width="256" height="256" fill="#fff"/>'
         f'<path d="M30 150 C 80 110, 124 176, 236 116" fill="none" stroke="#000" stroke-width="16" stroke-linecap="round"/></mask>'
         + ('' if mono else degrade(p + 'g', 72, 220, 228, 36)) + '</defs>')
    return d + f'<path mask="url(#{p}m)" d="M86 52 L86 204 L218 128 Z" fill="{c}" stroke="{c}" stroke-width="34" stroke-linejoin="round"/>'


def fenetre(encre, mono, p):
    """Un écran, et une aurore dedans."""
    e = mono or encre
    c = mono or f'url(#{p}g)'
    d = '' if mono else f'<defs>{degrade(p + "g", 64, 0, 192, 0)}</defs>'
    return d + (f'<rect x="30" y="50" width="196" height="144" rx="34" fill="none" stroke="{e}" stroke-width="24"/>'
                f'<path d="M70 150 C 100 96, 132 166, 186 104" fill="none" stroke="{c}" stroke-width="24" stroke-linecap="round"/>'
                f'<rect x="96" y="210" width="64" height="18" rx="9" fill="{e}"/>')


def point_du_jour(encre, mono, p):
    """Un A ouvert comme une montagne ; sa barre est l'horizon, et le soleil se lève dessus."""
    jambes = mono or encre
    s_ = mono or f'url(#{p}s)'
    d = '' if mono else f'<defs>{degrade(p + "s", 0, 170, 0, 134, ((0, VIOLET), (1, ROSE)))}</defs>'
    return d + (f'<path d="M31 214 L128 46 L225 214" fill="none" stroke="{jambes}" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>'
                f'<path d="M56 182 H200" fill="none" stroke="{jambes}" stroke-width="22" stroke-linecap="round"/>'
                f'<path d="M96 171 A32 32 0 0 1 160 171 Z" fill="{s_}"/>')


def lecture2(encre, mono, p):
    """Le bouton lecture, et une vague d'aurore qui le traverse sans aller jusqu'à la pointe."""
    c = mono or f'url(#{p}g)'
    v = mono or encre
    d = (f'<defs><mask id="{p}m" maskUnits="userSpaceOnUse" x="0" y="0" width="256" height="256"><rect width="256" height="256" fill="#fff"/>'
         f'<path d="M56 146 C 84 116, 112 160, 150 128" fill="none" stroke="#000" stroke-width="40" stroke-linecap="round"/></mask>'
         + ('' if mono else degrade(p + 'g', 72, 220, 228, 36)) + '</defs>')
    return d + (f'<path mask="url(#{p}m)" d="M86 52 L86 204 L218 128 Z" fill="{c}" stroke="{c}" stroke-width="34" stroke-linejoin="round"/>'
                f'<path d="M64 146 C 88 122, 112 156, 142 132" fill="none" stroke="{v}" stroke-width="16" stroke-linecap="round"/>')


def ecran(encre, mono, p):
    """Un écran, et le jour qui se lève dedans : l'app (la télé) et le nom (l'aube) d'un seul trait."""
    e = mono or encre
    s_ = mono or f'url(#{p}s)'
    d = '' if mono else f'<defs>{degrade(p + "s", 0, 196, 0, 120, ((0, VIOLET), (1, ROSE)))}</defs>'
    return d + (f'<clipPath id="{p}c"><rect x="40" y="56" width="176" height="140" rx="30"/></clipPath>'
                f'<g clip-path="url(#{p}c)"><circle cx="128" cy="200" r="58" fill="{s_}"/></g>'
                f'<rect x="28" y="44" width="200" height="164" rx="42" fill="none" stroke="{e}" stroke-width="24"/>')


PISTES = [
    ('actuel', 'Le Λ actuel', actuel),
    ('strates', 'Strates', strates),
    ('point-du-jour', 'Point du jour', point_du_jour),
    ('vague', 'Vague', vague),
    ('lueur', 'Lueur', lueur),
    ('arche', 'Arche', arche),
    ('lever', 'Lever', lever),
    ('lecture', 'Lecture', lecture2),
    ('ecran', 'Écran', ecran),
]


def svg(contenu, taille=256, titre='Aurora'):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="{taille}" height="{taille}" role="img">'
            f'<title>{titre}</title>{contenu}</svg>')


def tuile(f, p, clair=False, mono=None):
    """L'icône d'app : un carré arrondi (22,5 %) et la marque à 64 % au centre."""
    fond = ('<rect width="256" height="256" rx="58" fill="#f6f4ff"/>' if clair else
            f'<defs><linearGradient id="{p}t" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1640"/><stop offset="1" stop-color="{NUIT}"/></linearGradient></defs>'
            f'<rect width="256" height="256" rx="58" fill="url(#{p}t)"/>')
    encre = NUIT if clair else BLANC
    return fond + f'<g transform="translate(46 46) scale(.64)">{f(encre, mono, p)}</g>'
