# Intros Aurora

Vingt intros pour le lancement d’Aurora, toutes avec du son. Ouvrez `index.html` : c’est la galerie, avec une vignette réelle de chaque intro.

## Les intros

| Fichier | Intro | Idée | Son |
|---|---|---|---|
| `poussiere.html` | **Poussière d’étoiles** (préférée) | 10 000 particules dessinent le Λ puis le nom ; à la sortie, le logo se range dans l’en-tête | accord au choc, une note par lettre |
| `neon.html` | **Néon** (préférée) | l’enseigne s’allume en grésillant, reflet au sol | claquements, ronron du transformateur |
| `verre.html` | **Verre** (préférée) | Λ 3D en métal irisé qui pivote calmement depuis le profil | tintements de verre qui suivent le reflet |
| `supernova.html` | Supernova | un disque s’effondre, explose ; les débris reforment le Λ | montée, impact, crépitements |
| `galaxie.html` | Galaxie | spirale de 20 000 étoiles qui se couche, les bras dessinent le Λ | nappe spatiale, scintillements |
| `hyperespace.html` | Hyperespace | saut en vitesse lumière, sortie devant le logo | charge, détonation, souffle |
| `comete.html` | Comète | une comète trace le Λ avec sa traînée | stéréo, de gauche à droite |
| `constellation.html` | Constellation | les étoiles se relient en Λ, comme sur une carte du ciel | carillon, une note par étoile |
| `eclipse.html` | Éclipse | anneau de diamant, couronne aux couleurs d’Aurora | bourdon, tintement du diamant |
| `morphose.html` | Morphose | sphère → anneau → Λ, en points 3D | souffles à chaque métamorphose |
| `lucioles.html` | Lucioles | des lucioles se posent sur le nom et clignotent ensemble | grillons, clochettes |
| `foudre.html` | Foudre | les éclairs frappent le Λ, qui se couvre d’arcs | tonnerre, claquements, bourdonnement |
| `laser.html` | Laser | spectacle laser à 128 BPM, les faisceaux tracent le Λ | arpège, kick, zaps |
| `prisme.html` | Prisme | le Λ décompose un rayon blanc en couleurs | une note qui se divise en accord |
| `hologramme.html` | Hologramme | la marque projetée en hologramme, puis verrouillée | mise sous tension, bips |
| `feu-artifice.html` | Feu d’artifice | trois pivoines, puis un bouquet en forme de Λ | sifflets, détonations, crépitements |
| `cristal.html` | Cristal | le Λ se cristallise dans un verre qui disperse la lumière | mille tintements de verre |
| `pulsation.html` | Pulsation | un spectre qui écoute la musique, puis le drop | un morceau à 120 BPM |
| `synthwave.html` | Synthwave | soleil rayé, grille néon, titre en chrome | basse, batterie, nappes |
| `vortex.html` | Vortex | un tourbillon qui se referme sur le Λ | souffle tournant, implosion |

Toutes finissent sur la même **signature sonore** : mi, la, do dièse, puis l’accord de la majeur (neuvième ajoutée), joué avec le timbre de l’intro (cloches, verre, synthé, électrique ou nappe).

## Commandes

- un clic ou une touche : passer l’intro ;
- `R` : rejouer ; `M` : couper ou remettre le son ;
- `?t=1.5` dans l’adresse : figer l’intro à 1,5 s.

## Comment c’est fait

- **Autonomes** : une page = un fichier, police embarquée. Verre et Cristal chargent Three.js, Néon charge anime.js, depuis jsDelivr ; sans réseau, ils affichent le logo à plat.
- **Une seule horloge** pour l’image, le DOM et le son, donc des intros identiques à 60, 120 ou 144 Hz.
- **Son en Web Audio**, entièrement synthétisé : rien à télécharger. Il est activé par défaut ; si le navigateur le bloque avant un clic, le bouton « Activer le son » s’allume. Dans l’app Electron, rien ne le bloque. Les niveaux ont été mesurés par rendu hors ligne : aucune saturation.
- **« Réduire les animations »** : la marque s’affiche posée, sans mouvement ni son.
- Les sources du moteur commun (horloge, son, particules) sont recopiées dans chaque page pour que chacune s’ouvre seule.
