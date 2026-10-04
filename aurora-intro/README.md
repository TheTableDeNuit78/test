# Intros Aurora

Quatre intros courtes pour le lancement d’Aurora, toutes avec du son. Ouvrez `index.html` : c’est la galerie, avec une vignette réelle de chaque intro et ce que font les grandes plateformes.

## Les intros

| Fichier | Intro | Durée | Idée | Son |
|---|---|---|---|---|
| `eclat.html` | **Éclat** (conseillée) | 1,7 s | le Λ se trace, rebondit, puis s’envole vers l’en-tête et devient le logo de l’app | souffle, trois clochettes, déclic à l’arrivée |
| `trace.html` | **Tracé** | 2,6 s | une pointe de lumière dessine le Λ, puis on traverse le Λ, qui s’ouvre sur l’app | souffle qui suit la pointe, signature, appel d’air |
| `aube.html` | **Aube** | 2,7 s | la marque se lève derrière une ligne d’horizon, puis l’écran s’ouvre en deux sur l’app | fil aigu, nappe du lever, souffle large |
| `neon.html` | **Néon** (gardée telle quelle) | 3,6 s | l’enseigne s’allume en grésillant, reflet au sol | claquements, ronron du transformateur |

Éclat, Tracé et Aube finissent dans l’app (une maquette de l’accueil) : la transition fait partie de l’intro. Néon finit sur l’enseigne.

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
- **Les sorties** : Tracé découpe l’app en `clip-path` dans la forme de l’intérieur du Λ, avec un zoom exponentiel qui accélère ; Éclat fait voler le Λ vers le logo de l’en-tête (technique FLIP, trajectoire en arc), et le vrai logo prend le relais au pixel près ; Aube ouvre deux volets à l’horizon, qui emportent chacun leur moitié de la marque.
- **Passer** : l’app se met tout de suite en place et l’intro s’efface en 0,4 s, sans s’arrêter net.
- **Son en Web Audio**, entièrement synthétisé : rien à télécharger. Il est activé par défaut ; si le navigateur le bloque avant un clic, le bouton « Activer le son » s’allume. Dans l’app Electron, rien ne le bloque. Les niveaux ont été mesurés par rendu hors ligne : aucune saturation.
- **« Réduire les animations »** : l’app s’affiche directement (Néon : l’enseigne allumée), sans son.
- **Autonomes** : une page = un fichier, police embarquée. Néon charge anime.js depuis jsDelivr ; sans réseau, il affiche l’enseigne allumée.
