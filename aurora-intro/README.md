# Intros Aurora

Onze intros pour le lancement d’Aurora. Ouvrez `index.html` : c’est la galerie, avec une vignette réelle de chaque intro.

| Fichier | Intro | Idée | Outils |
|---|---|---|---|
| `poussiere.html` | **Poussière d’étoiles** (version principale) | 10 000 particules dessinent le Λ puis le nom ; à la sortie, le logo se range dans l’en-tête de l’app | WebGL2 instancié, Web Animations, View Transitions, Web Audio |
| `aurore.html` | Aurore boréale | des rideaux d’aurore se couchent sur le Λ | shader WebGL2 |
| `ruban.html` | Ruban | on part de l’intérieur de la lettre, la caméra recule (d’après le « ta-dum » de Netflix) | WebGL2 instancié |
| `zapping.html` | Zapping | télé cathodique, mire, film, série, puis le nom | Canvas 2D, shader CRT, Web Audio |
| `verre.html` | Verre | Λ 3D en métal irisé (d’après Apple TV+) | Three.js r186, WebGPU avec repli WebGL2, bloom TSL |
| `mosaique.html` | Mosaïque | un mur d’affiches écrit AURORA (d’après Prime Video) | Canvas 2D |
| `bande-annonce.html` | Bande-annonce | typo plein écran montée comme un trailer (Disney+, Max) | GSAP 3.15, SplitText, ScrambleText, CustomEase |
| `liquide.html` | Liquide | des gouttes fusionnent et se figent en Λ | shader SDF, filtre SVG « goo », CSS `linear()` |
| `neon.html` | Néon | l’enseigne s’allume en grésillant, reflet au sol | anime.js 4.5, `@property`, Web Audio |
| `pellicule.html` | Pellicule | amorce 3-2-1, puis carton-titre restauré | Canvas 2D à 24 i/s, Web Audio |
| `decodage.html` | Décodage | pluie de caractères, titre déchiffré | Canvas 2D, GSAP ScrambleText |

## Commandes

- un clic ou une touche : passer l’intro ;
- `R` : rejouer ; dans la version principale, `M` : son ;
- `?t=1.5` dans l’adresse : figer l’intro à 1,5 s (utile pour régler un instant) ;
- `poussiere.html?pose` : rester sur le logo posé, sans sortie automatique.

## Ce qui vaut pour toutes

- **Autonomes** : une page = un fichier, police Familjen Grotesk embarquée. Verre (Three.js), Bande-annonce et Décodage (GSAP), Néon (anime.js) chargent leur bibliothèque depuis jsDelivr ; sans réseau, ils passent à une version simplifiée qui finit sur la marque. Dans l’app Electron, il suffira d’installer ces bibliothèques avec npm.
- **Une seule horloge** pour le canvas et le DOM (`document.timeline`), donc des intros identiques à 60, 120 ou 144 Hz, figeables à n’importe quel instant.
- **« Réduire les animations »** : la marque s’affiche posée, sans mouvement.
- **Son** : jamais en lecture automatique ; il se lance avec le bouton Son (Poussière, Zapping, Néon, Pellicule).

## À savoir

L’intro d’origine notait une contrainte : « pas de couleur qui apparaît en arrière-plan du logo ». La version principale la respecte : le fond reste un aplat, seules les particules portent la couleur. Plusieurs variantes (Aurore boréale, Néon, Zapping, Mosaïque) remplissent ou éclairent l’arrière-plan pendant l’animation ; c’est voulu, à garder en tête au moment de choisir.
