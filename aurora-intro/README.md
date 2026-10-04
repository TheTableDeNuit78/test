# Intros Aurora

Des intros courtes pour le lancement d’Aurora. Ouvrez `index.html` : c’est la galerie, avec une vignette réelle de chaque intro et ce que font les grandes plateformes.

## Le Λ devient le nom (sans son)

Le logo devient le nom : le Λ prend la place du A et « Aurora » se forme autour de lui. Le Λ y est dessiné à la hauteur, à la largeur et à la graisse du A de Familjen Grotesk (capitales de 0,657 em, fût de 0,142 em) : un trait de 8 au lieu de 5, dans le même cadre. L’en-tête de l’app affiche le même mot.

| Fichier | Intro | Durée | Le Λ devient le nom… | Sortie vers l’app |
|---|---|---|---|---|
| `glissement.html` | **Glissement** | 2,6 s | il se trace, glisse à la place du A, les lettres sortent de derrière lui | la caméra traverse le A |
| `recul.html` | **Recul** | 2,6 s | on part tout contre le Λ, la caméra recule et découvre le nom | le nom se range dans l’en-tête |
| `trait.html` | **Trait** | 2,9 s | il se pose en A, sa plume file sous le mot, les lettres se lèvent à son passage | l’écran s’ouvre en deux à la ligne |
| `depliage.html` | **Dépliage** | 2,7 s | il arrive en ressort, les lettres se déplient en 3D comme un accordéon | le nom se range dans l’en-tête |
| `rebond.html` | **Rebond** | 2,7 s | il tombe et rebondit, puis les lettres tombent une à une | l’écran remonte comme un rideau |
| `rouleaux.html` | **Rouleaux** | 2,7 s | les lettres défilent comme des rouleaux de machine à sous et s’arrêtent une par une | le nom se range dans l’en-tête |

## Premières pistes

| Fichier | Intro | Durée | Idée | Son |
|---|---|---|---|---|
| `eclat.html` | **Éclat** | 1,7 s | le Λ se trace, rebondit, puis s’envole vers l’en-tête et devient le logo de l’app | souffle, trois clochettes, déclic à l’arrivée |
| `trace.html` | **Tracé** | 2,6 s | une pointe de lumière dessine le Λ, puis on traverse le Λ, qui s’ouvre sur l’app | souffle qui suit la pointe, signature, appel d’air |
| `aube.html` | **Aube** | 2,7 s | la marque se lève derrière une ligne d’horizon, puis l’écran s’ouvre en deux sur l’app | fil aigu, nappe du lever, souffle large |
| `neon.html` | **Néon** | 3,6 s | l’enseigne s’allume en grésillant, reflet au sol | claquements, ronron du transformateur |

Toutes sauf Néon finissent dans l’app (une maquette de l’accueil) : la transition fait partie de l’intro.

## Ce que font les grandes plateformes

| Qui | Durée | Quand |
|---|---|---|
| Netflix | ≈ 4 s, le N et son « ta-dum » | avant ses films et séries originaux ([Fast Company](https://www.fastcompany.com/90299526/heres-the-new-netflix-intro-two-years-in-the-making), [CNBC](https://www.cnbc.com/2019/02/01/heres-netflixs-new-intro-that-the-company-worked-on-for-two-years.html)) |
| Disney+ | quelques secondes | le logo animé sert d’écran de lancement de l’app, et ouvre ses productions ([Wikipédia](https://en.wikipedia.org/wiki/Disney%2B), [Logopedia](https://logos.fandom.com/wiki/Disney%2B/On-screen_Logos)) |
| HBO Max | ≈ 5 s | l’intro historique a été raccourcie en un carton de cinq secondes ([20K](https://www.20k.org/episodes/hbo20)) |
| Google (Android) | icône animée ≤ 1 s | seulement au démarrage à froid ou tiède, jamais au retour dans l’app ; doit pouvoir être passée ; part dès que l’app est prête ([Android Developers](https://developer.android.com/develop/ui/views/launch/splash-screen)) |
| Apple | le plus court possible | l’écran de lancement n’est pas un moment de marque : il ressemble au premier écran de l’app ([Human Interface Guidelines](https://developers.apple.com/design/human-interface-guidelines/patterns/launching)) |

## Règles pour l’app

- **Au démarrage seulement** : quand l’app s’ouvre pour de bon, pas quand on revient dessus.
- **Pendant le chargement** : l’app se prépare sous l’intro, qui ne fait rien attendre. Viser 1,5 à 2,5 s, sans minuterie artificielle.
- **Toujours passable** : un clic ou une touche lance un fondu enchaîné vers l’app.
- **Désactivable** : une option dans les réglages ; rien du tout si le système demande moins d’animations.

## Commandes

- un clic ou une touche : passer l’intro ;
- `R` : rejouer ; `M` : couper ou remettre le son ;
- `?t=1.5` dans l’adresse : figer l’intro à 1,5 s.

## Comment c’est fait

- **Un seul rendu** : tout est en SVG et CSS, animé par Web Animations. Il n’y a pas de canvas qui passe la main au DOM, donc pas de fondu de raccord entre deux rendus.
- **Une seule horloge** pour l’image et le son : les intros sont identiques à 60, 120 ou 144 Hz.
- **Le passage du logo au nom** : le grand Λ vole jusqu’à la place du A (technique FLIP) en épaississant son trait de 5 à 8, et le vrai A du mot prend le relais au pixel près, au même instant.
- **Les sorties** : Tracé et Glissement découpent l’app en `clip-path` dans la forme de l’intérieur du Λ, avec un zoom exponentiel qui accélère ; Éclat fait voler le Λ vers le logo de l’en-tête (technique FLIP, trajectoire en arc), et le vrai logo prend le relais au pixel près ; Aube ouvre deux volets à l’horizon, qui emportent chacun leur moitié de la marque.
- **Passer** : l’app se met tout de suite en place et l’intro s’efface en 0,4 s, sans s’arrêter net.
- **Son en Web Audio** (premières pistes), entièrement synthétisé : rien à télécharger. Il est activé par défaut ; si le navigateur le bloque avant un clic, le bouton « Activer le son » s’allume. Dans l’app Electron, rien ne le bloque. Les niveaux ont été mesurés par rendu hors ligne : aucune saturation.
- **« Réduire les animations »** : l’app s’affiche directement (Néon : l’enseigne allumée), sans son.
- **Autonomes** : une page = un fichier, police embarquée. Néon charge anime.js depuis jsDelivr ; sans réseau, il affiche l’enseigne allumée.
