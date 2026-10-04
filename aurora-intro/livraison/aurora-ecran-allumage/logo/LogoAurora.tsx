import { useId } from 'react'

/**
 * **Le logo Aurora, « Écran »** : un écran où le jour se lève. Le cadre est une seule forme pleine
 * (un anneau en rectangle arrondi), le soleil un disque coupé au bas de l'écran. Grille de 256.
 *
 * - `couleur` (par défaut) : cadre clair et soleil en dégradé, pour les fonds sombres de l'app ;
 * - `clair` : cadre encre, pour les fonds clairs ;
 * - `mono` : tout en `currentColor`, pour une icône qui prend la couleur du texte.
 */
const CADRE =
  'M70 32H186A54 54 0 0 1 240 86V166A54 54 0 0 1 186 220H70A54 54 0 0 1 16 166V86A54 54 0 0 1 70 32Z' +
  'M70 56A30 30 0 0 0 40 86V166A30 30 0 0 0 70 196H186A30 30 0 0 0 216 166V86A30 30 0 0 0 186 56Z'
const SOLEIL = 'M70.14 196A58 58 0 0 1 185.86 196Z'

export function LogoAurora({
  taille = 24,
  variante = 'couleur',
  titre,
}: {
  taille?: number
  variante?: 'couleur' | 'clair' | 'mono'
  titre?: string
}): JSX.Element {
  // Un identifiant par logo affiché : deux logos sur la même page ne se partagent pas leur dégradé.
  const id = useId().replace(/:/g, '')
  const mono = variante === 'mono'
  const cadre = mono ? 'currentColor' : variante === 'clair' ? '#0a0a0e' : '#f2f0ff'
  return (
    <svg width={taille} height={taille} viewBox="0 0 256 256" role={titre ? 'img' : undefined} aria-hidden={titre ? undefined : true}>
      {titre ? <title>{titre}</title> : null}
      {mono ? null : (
        <defs>
          <linearGradient id={`soleil-${id}`} gradientUnits="userSpaceOnUse" x1="0" y1="196" x2="0" y2="142">
            <stop offset="0" stopColor="#9d5cff" />
            <stop offset="1" stopColor="#ff6cab" />
          </linearGradient>
        </defs>
      )}
      <path fill={cadre} fillRule="evenodd" d={CADRE} />
      <path fill={mono ? 'currentColor' : `url(#soleil-${id})`} d={SOLEIL} />
    </svg>
  )
}
