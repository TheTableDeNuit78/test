# Aurora : logo « Écran » et intro « Allumage »

Le nouveau logo d'Aurora est un écran où le jour se lève : l'app (la télé) et le nom (Aurora, l'aube) en un seul signe. L'intro « Allumage » le raconte en 2,6 s, sans son : le cadre de l'écran se dessine, le jour se lève dedans, le nom monte, puis l'écran s'allume et grandit jusqu'à devenir l'app.

Ouvrez `intro/apercu.html` dans un navigateur pour voir l'intro telle qu'elle tournera, avec une fausse page d'accueil derrière et un bouton Rejouer. C'est un aperçu : il n'est pas à copier dans le projet.

## 1. L'intro

Remplacer les deux fichiers de l'intro actuelle. Ils gardent les mêmes noms et le même branchement : il n'y a rien d'autre à changer.

| Fichier | Rôle |
|---|---|
| `intro/IntroLancement.tsx` | le composant : même nom, même export `IntroLancement`, même import `useApp` depuis `../store` |
| `intro/intro.css` | ses styles, à importer là où l'ancien `intro.css` l'était |

Le composant se monte toujours **à la racine** (`main.tsx`), à côté de l'app et non dedans.

- **Pas de son, aucune dépendance** : React et les Web Animations du navigateur (Electron/Chrome).
- **Un clic ou une touche** passe l'intro : elle s'efface en fondu (0,4 s), et l'app reprend aussitôt sa taille.
- **« Réduire les animations »** activé dans le système : pas d'intro.
- **Erreur de démarrage** (`initError`) : l'intro disparaît.
- Elle prend la **police de l'app** (Familjen Grotesk), qu'elle attend au plus 0,7 s.
- Elle se **retire d'elle-même** une fois l'écran devenu l'app, et ne laisse rien derrière elle : aucune animation ni transformation ne reste sur l'app.

**L'écran qui devient l'app.** À la sortie, l'intro se perce d'une fenêtre à la place de l'intérieur de l'écran du logo, et la fenêtre grandit jusqu'à tout l'écran. Derrière, les éléments de l'app (les frères de l'intro dans le DOM) sont réduits pour tenir dans la fenêtre, puis reviennent à leur taille avec elle : on voit l'app en miniature dans l'écran. Pour que l'écran s'ouvre sur l'app à sa taille, sans la réduire : `<IntroLancement miniature={false} />`.

L'écran s'allume à 1,8 s sur ce qu'il y a dessous : si l'app charge encore, on voit l'écran de chargement grandir.

## 2. Le logo

| Fichier | Usage |
|---|---|
| `logo/aurora-ecran.svg` | le logo en couleurs, pour les fonds sombres (celui de l'app) |
| `logo/aurora-ecran-clair.svg` | en couleurs, pour les fonds clairs |
| `logo/aurora-ecran-aplat.svg` | en couleurs unies, sans dégradé (impression, petites tailles) |
| `logo/aurora-ecran-blanc.svg`, `-noir.svg` | en une seule couleur |
| `logo/aurora-horizontal.svg`, `-clair.svg` | le logo et le nom côte à côte ; le nom est en contours (police du projet, graisse 600) |
| `logo/favicon.svg` | l'icône pour l'onglet d'un navigateur |
| `logo/LogoAurora.tsx` | le logo en composant React : `<LogoAurora taille={24} />`, variantes `couleur`, `clair`, `mono` |

Toutes les formes sont pleines (aucun trait, aucun masque) : les fichiers s'agrandissent, s'impriment et se découpent sans surprise. Pour l'en-tête de l'app, `<LogoAurora taille={28} />` à côté du nom, à la place de l'ancien Λ.

## 3. Les icônes de l'app

| Fichier | Pour |
|---|---|
| `icones/aurora.ico` | Windows (16 à 256 px) |
| `icones/aurora.icns` | macOS (16 à 1024 px, sur la grille d'Apple : le carré arrondi fait 824 px sur 1024) |
| `icones/aurora-512.png` | Linux |
| `icones/png/` | toutes les tailles, de 16 à 1024 px, et la version claire |
| `icones/icone-ios-1024.png` | iOS (carré plein, sans transparence : le système arrondit lui-même) |
| `logo/ios/calque-*.svg` | les trois calques (fond, cadre, soleil) pour composer l'icône en verre d'iOS 26 dans Icon Composer |
| `logo/android/*.svg` | l'icône adaptative d'Android : premier plan, arrière-plan, et la version monochrome que le système teinte |

Avec electron-builder, l'emplacement habituel est le dossier `build/` du projet (`build/icon.ico`, `build/icon.icns`, `build/icon.png`) ; ailleurs, ce sont les champs `icon` de la configuration.

## Vérifié

- TypeScript en mode strict, sans erreur.
- React 18 en `StrictMode` (qui monte deux fois les composants) : l'intro ne se joue qu'une fois, sans avertissement.
- Dans Chromium : la lecture entière, le passage au clic et au clavier, Rejouer, « réduire les animations », l'affichage sur téléphone ; après l'intro, l'app n'a plus aucune transformation.
- Le logo : forme maître notée 100/100 par l'outil d'audit de logo (géométrie, angles, détails trop fins).

## À faire de votre côté

- **Une recherche de marque** (INPI, EUIPO) avant d'adopter le logo : je ne peux pas vérifier qu'il est libre.
