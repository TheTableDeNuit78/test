import { useLayoutEffect, useRef, useState } from 'react'
import { useApp } from '../store'

/**
 * **L'intro du lancement**, version « Allumage », avec le logo **Écran** — choisis le 4 octobre
 * 2026, **sans son**. Le logo, c'est un écran où le jour se lève : le lien le plus direct avec l'app
 * (la télé) et avec son nom (Aurora, l'aube). L'intro le raconte :
 *
 * 1. le **cadre de l'écran se dessine** d'un trait, depuis le haut ;
 * 2. **le jour se lève dedans** : le soleil monte, le ciel de l'écran s'éclaire ;
 * 3. le nom monte sous l'écran, lettre après lettre ;
 * 4. **l'écran s'allume** : l'aube laisse place à l'app, en miniature dans l'écran, et l'écran
 *    **grandit jusqu'à devenir la fenêtre de l'app**.
 *
 * **Durée : 2,6 s**, dans ce que font les grandes plateformes au lancement d'une app (les guides :
 * 1,5 à 2,5 s ; Android : icône animée d'une seconde au plus).
 *
 * **Comment l'écran devient l'app.** L'intro est posée **par-dessus** l'app : à la sortie, elle se
 * perce d'une fenêtre aux bords arrondis (`clip-path: path(evenodd, …)`), exactement à la place de
 * l'intérieur de l'écran du logo, et cette fenêtre grandit jusqu'à tout l'écran. Derrière, les
 * éléments de l'app — les frères de l'intro dans le DOM — sont réduits pour tenir dans la fenêtre,
 * puis reviennent à leur taille avec elle (`miniature`). Le cadre dessiné passe la main, au même
 * instant et au même endroit, à un cadre du DOM identique, qui grandit avec la fenêtre.
 *
 * **Elle se monte à la racine** (`main.tsx`), à côté de l'app et non dedans, comme la précédente :
 * rendue dans les branches d'`App.tsx`, elle serait démontée à chaque changement d'écran.
 *
 * **Elle ne retarde rien** : l'app charge dessous ; **un clic ou une touche la passe** (l'intro
 * s'efface en fondu, sans s'arrêter net). Qui demande **moins d'animations** n'en reçoit aucune ;
 * devant une **erreur de démarrage**, elle disparaît.
 */

const GESTE = 'cubic-bezier(.65,0,.35,1)'
const LEVER = 'cubic-bezier(.2,.8,.2,1)'
/** L'écran s'allume, en secondes. */
const SORTIE = 1.8
/** Le temps que met l'écran à devenir la fenêtre de l'app. */
const CROISSANCE = 0.78
/** La durée du fondu quand on passe l'intro, en millisecondes. */
const PASSER_MS = 420
/** L'attente maximale de la police avant de commencer, en millisecondes. */
const POLICE_MS = 700
/** Le nombre d'images-clés de la croissance (la fenêtre suit une courbe, pas une droite). */
const IMAGES = 30

/** Une étape d'une piste : à quelle seconde, quelles valeurs, et la courbe jusqu'à l'étape suivante. */
type Etape = [number, Keyframe, string?]

/** Une piste écrite en temps absolus ; une seule par élément et par propriété. */
function suite(el: Element, etapes: Etape[]): Animation {
  const t0 = etapes[0][0]
  const duree = Math.max(0.001, etapes[etapes.length - 1][0] - t0)
  const images = etapes.map(([t, valeurs, courbe]) => ({
    ...valeurs,
    offset: Math.min(1, Math.max(0, (t - t0) / duree)),
    easing: courbe ?? 'linear',
  }))
  return el.animate(images, { delay: t0 * 1000, duration: duree * 1000, fill: 'both' })
}

/** La courbe cubic-bezier(.7, 0, .2, 1), évaluée en JS : la croissance démarre doucement, file, se pose. */
function croissance(x: number): number {
  const f = (a: number, b: number, t: number): number => 3 * a * t * (1 - t) * (1 - t) + 3 * b * t * t * (1 - t) + t * t * t
  if (x <= 0) return 0
  if (x >= 1) return 1
  let bas = 0
  let haut = 1
  let t = x
  for (let i = 0; i < 32; i++) {
    t = (bas + haut) / 2
    if (f(0.7, 0.2, t) < x) bas = t
    else haut = t
  }
  return f(0, 1, t)
}

const melange = (a: number, b: number, k: number): number => a + (b - a) * k

/** Un rectangle arrondi, en px, pour un trou percé en evenodd. */
function rectangle(x0: number, y0: number, x1: number, y1: number, r: number): string {
  const n = (v: number): string => v.toFixed(2)
  return `M${n(x0 + r)} ${n(y0)}H${n(x1 - r)}A${n(r)} ${n(r)} 0 0 1 ${n(x1)} ${n(y0 + r)}V${n(y1 - r)}A${n(r)} ${n(r)} 0 0 1 ${n(x1 - r)} ${n(y1)}H${n(x0 + r)}A${n(r)} ${n(r)} 0 0 1 ${n(x0)} ${n(y1 - r)}V${n(y0 + r)}A${n(r)} ${n(r)} 0 0 1 ${n(x0 + r)} ${n(y0)}Z`
}

/**
 * Joue l'intro « Allumage » une fois, puis se retire d'elle-même quand l'écran est devenu l'app.
 * `miniature` : l'app apparaît d'abord en petit dans l'écran (par défaut) ; à `false`, l'écran
 * s'ouvre sur l'app à sa taille.
 */
export function IntroLancement({ miniature = true }: { miniature?: boolean }): JSX.Element | null {
  const [partie, setPartie] = useState(false)
  const erreurDeDemarrage = useApp((s) => s.initError)
  const racine = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const r = racine.current
    if (!r) return

    // Réduire les animations, c'est ne pas en vouloir : l'app s'ouvre sans passer par l'intro.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setPartie(true)
      return
    }

    const el = (classe: string): HTMLElement => r.querySelector<HTMLElement>('.' + classe) as HTMLElement
    const pistes: Animation[] = []
    const pistesApp: Animation[] = []
    let annulee = false
    let finie = false
    let passee = false
    let debut = 0

    const terminer = (): void => {
      if (finie || annulee) return
      finie = true
      for (const a of pistesApp) a.cancel()
      setPartie(true)
    }

    // Un clic ou une touche la passe : l'app reprend aussitôt sa taille, l'intro s'efface en fondu.
    const passer = (): void => {
      if (finie || passee || (debut && performance.now() - debut >= SORTIE * 1000)) return
      passee = true
      for (const a of pistesApp) a.cancel()
      r.style.pointerEvents = 'none'
      const fondu = r.animate([{ opacity: 1 }, { opacity: 0 }], { duration: PASSER_MS, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' })
      pistes.push(fondu)
      fondu.finished.then(terminer, () => {})
    }

    const commencer = (): void => {
      if (annulee || passee) return
      const W = innerWidth
      const H = innerHeight
      // L'échelle de la marque : 1 = la maquette en 1280 × 800.
      const k = Math.min(1.3, Math.max(0.5, Math.min(W / 720, H / 800)))
      r.style.setProperty('--k', k.toFixed(4))
      // L'intérieur de l'écran du logo, à l'écran (grille de 256 : 40→216 × 56→196, rayon 30).
      const m = el('introMarque').getBoundingClientRect()
      const u = m.width / 256
      const dedans = { x0: m.left + 40 * u, y0: m.top + 56 * u, x1: m.left + 216 * u, y1: m.top + 196 * u, r: 30 * u }
      const bord = 24 * u
      const fenetre = (v: number): typeof dedans => {
        const e = croissance(v)
        return { x0: melange(dedans.x0, 0, e), y0: melange(dedans.y0, 0, e), x1: melange(dedans.x1, W, e), y1: melange(dedans.y1, H, e), r: melange(dedans.r, 0, e) }
      }
      const images = <T extends Keyframe>(f: (v: number) => T): Keyframe[] => Array.from({ length: IMAGES + 1 }, (_, i) => ({ ...f(i / IMAGES), offset: i / IMAGES }))
      const temps = { delay: SORTIE * 1000, duration: CROISSANCE * 1000 }
      const piste = (cible: Element, etapes: Etape[]): Animation => {
        const a = suite(cible, etapes)
        pistes.push(a)
        return a
      }

      // 1. Le cadre se dessine, depuis le haut, dans le sens des aiguilles d'une montre.
      piste(el('introCadreTrace'), [[0.05, { strokeDashoffset: 1.02 }, GESTE], [0.72, { strokeDashoffset: 0 }]])
      // 2. Le jour se lève dans l'écran.
      piste(el('introSoleil'), [[0.58, { transform: 'translateY(72px)' }, LEVER], [1.32, { transform: 'translateY(0)' }]])
      piste(el('introCiel'), [[0.55, { opacity: 0 }, 'ease-out'], [1.25, { opacity: 1 }]])
      // 3. Le nom monte, lettre après lettre ; il s'efface quand l'écran s'allume.
      r.querySelectorAll('.introNom .introLettre').forEach((n, i) => {
        piste(n, [[1 + i * 0.04, { transform: 'translateY(105%)', opacity: 0 }, 'cubic-bezier(.16,1,.3,1)'], [1.6 + i * 0.04, { transform: 'translateY(0)', opacity: 1 }]])
      })
      piste(el('introNom'), [[SORTIE, { opacity: 1 }, 'ease-in'], [SORTIE + 0.2, { opacity: 0 }]])

      // 4. L'allumage. La fenêtre se perce dans l'intro et grandit jusqu'à tout l'écran.
      const percee = CSS.supports?.('clip-path', 'path(evenodd, "M0 0H1V1Z")')
      if (percee) {
        pistes.push(el('introCouvert').animate(images((v) => {
          const f = fenetre(v)
          return { clipPath: `path(evenodd, "M0 0H${W}V${H}H0Z${rectangle(f.x0, f.y0, f.x1, f.y1, f.r)}")` }
        }), { ...temps, fill: 'forwards' }))
      } else {
        piste(el('introCouvert'), [[SORTIE, { opacity: 1 }, 'ease-in-out'], [SORTIE + CROISSANCE, { opacity: 0 }]])
      }
      // L'aube s'efface dans l'écran : on voit l'app à sa place.
      piste(el('introAube'), [[SORTIE, { opacity: 1 }, 'ease-out'], [SORTIE + 0.32, { opacity: 0 }]])
      // Le cadre dessiné passe la main au cadre du DOM, qui grandit avec la fenêtre.
      piste(el('introCadreTrace'), [[SORTIE - 0.001, { opacity: 1 }], [SORTIE, { opacity: 0 }]])
      pistes.push(el('introCadre').animate(images((v) => {
        const f = fenetre(v)
        return {
          left: `${(f.x0 - bord).toFixed(2)}px`, top: `${(f.y0 - bord).toFixed(2)}px`,
          width: `${(f.x1 - f.x0 + 2 * bord).toFixed(2)}px`, height: `${(f.y1 - f.y0 + 2 * bord).toFixed(2)}px`,
          borderWidth: `${bord.toFixed(2)}px`, borderRadius: `${(f.r + bord).toFixed(2)}px`, opacity: 1,
        }
      }), { ...temps, fill: 'forwards' }))

      // L'app, en miniature dans l'écran, qui grandit avec lui : chaque frère de l'intro est réduit
      // pour couvrir la fenêtre, puis revient à sa taille. Rien ne reste appliqué après.
      if (miniature && r.parentElement) {
        for (const frere of Array.from(r.parentElement.children)) {
          if (frere === r || !(frere instanceof HTMLElement)) continue
          const e = frere.getBoundingClientRect()
          if (!e.width || !e.height) continue
          pistesApp.push(frere.animate(images((v) => {
            if (v >= 1) return { transform: 'none', transformOrigin: '0 0' }
            const f = fenetre(v)
            const s = Math.max((f.x1 - f.x0) / e.width, (f.y1 - f.y0) / e.height)
            const tx = (f.x0 + f.x1) / 2 - e.left - (s * e.width) / 2
            const ty = (f.y0 + f.y1) / 2 - e.top - (s * e.height) / 2
            return { transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${s.toFixed(5)})`, transformOrigin: '0 0' }
          }), { ...temps, fill: 'backwards' }))
        }
      }

      debut = performance.now()
      r.classList.add('introPret')
      const derniere = pistes[pistes.length - 1]
      derniere.finished.then(terminer, () => {})
    }

    window.addEventListener('pointerdown', passer)
    window.addEventListener('keydown', passer)
    // On attend la police (un court instant au plus) : les mesures et le nom doivent être les bons.
    const nom = el('introNom')
    const police = document.fonts?.load(`600 62px ${getComputedStyle(nom).fontFamily}`) ?? Promise.resolve()
    Promise.race([police, new Promise((ok) => window.setTimeout(ok, POLICE_MS))])
      .catch(() => {})
      .then(commencer)

    return () => {
      annulee = true
      window.removeEventListener('pointerdown', passer)
      window.removeEventListener('keydown', passer)
      for (const a of pistes) a.cancel()
      for (const a of pistesApp) a.cancel()
    }
  }, [miniature])

  if (partie || erreurDeDemarrage) return null

  // La scène existe deux fois, à la même place : une fois percée par la fenêtre (le cadre et le nom),
  // une fois par-dessus (l'aube dans l'écran), pour que l'aube s'efface au lieu d'être coupée net.
  const scene = (aube: boolean): JSX.Element => (
    <div className="introScene">
      <svg className="introMarque" viewBox="0 0 256 256" aria-hidden="true">
        {aube ? (
          <>
            <defs>
              <linearGradient id="introSoleilDegrade" gradientUnits="userSpaceOnUse" x1="0" y1="196" x2="0" y2="142">
                <stop offset="0" stopColor="#9d5cff" />
                <stop offset="1" stopColor="#ff6cab" />
              </linearGradient>
              <radialGradient id="introCielDegrade" gradientUnits="userSpaceOnUse" cx="128" cy="200" r="150">
                <stop offset="0" stopColor="#ff6cab" stopOpacity=".5" />
                <stop offset=".45" stopColor="#9d5cff" stopOpacity=".25" />
                <stop offset="1" stopColor="#4ea8f5" stopOpacity="0" />
              </radialGradient>
              <clipPath id="introDedans">
                <rect x="40" y="56" width="176" height="140" rx="30" />
              </clipPath>
            </defs>
            <g clipPath="url(#introDedans)">
              <rect className="introCiel" x="40" y="56" width="176" height="140" fill="url(#introCielDegrade)" />
              <circle className="introSoleil" cx="128" cy="200" r="58" fill="url(#introSoleilDegrade)" />
            </g>
          </>
        ) : (
          <path className="introCadreTrace" pathLength={1} d="M128 44 H186 A42 42 0 0 1 228 86 V166 A42 42 0 0 1 186 208 H70 A42 42 0 0 1 28 166 V86 A42 42 0 0 1 70 44 Z" />
        )}
      </svg>
      <span className={aube ? 'introNom introCale' : 'introNom'} aria-hidden="true">
        {Array.from('Aurora').map((c, i) => (
          <span key={i} className="introLettre">{c}</span>
        ))}
      </span>
    </div>
  )

  return (
    <div className="intro" ref={racine} role="presentation">
      <div className="introCouvert">{scene(false)}</div>
      <div className="introAube">{scene(true)}</div>
      <div className="introCadre" aria-hidden="true" />
    </div>
  )
}
