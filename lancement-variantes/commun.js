/*
 * Socle commun des variantes : la barre du haut, les icônes (Lucide, comme l'app), les données de
 * démonstration (les chaînes, films et séries des maquettes du 04/10/2026, et le catalogue de
 * « Mon abonnement » de l'écran Comptes) et le simulateur du chargement.
 *
 * Paramètres utiles pour les captures : ?p=0.42 fige le chargement à 42 %, ?fige fige aussi les
 * animations d'ambiance.
 */
'use strict';
(() => {
  const params = new URLSearchParams(location.search);
  const FIGE = params.has('fige');
  if (FIGE) document.documentElement.classList.add('fige');

  /* ───────── Icônes (tracés Lucide) ───────── */
  const ICONES = {
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    ellipsis: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    loader: '<path d="M21 12a9 9 0 1 1-6.219-8.56"/>',
    tv: '<rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/>',
    calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
    film: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/>',
    clapper: '<path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/><path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 4"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
    layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
    grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    server: '<rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/>',
    list: '<path d="M21 5H3"/><path d="M15 12H3"/><path d="M17 19H3"/>',
    listPlay: '<path d="M21 5H3"/><path d="M11 12H3"/><path d="M11 19H3"/><path d="M15 12v7l6-3.5z"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
    eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    rotate: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  };
  const icone = (nom, classe = 'ico') =>
    `<svg class="${classe}" viewBox="0 0 24 24" aria-hidden="true">${ICONES[nom] || ''}</svg>`;

  /* ───────── La barre du haut ───────── */
  const LIENS = ['Accueil', 'Films', 'Séries', 'Direct', 'Guide TV', 'Bibliothèque', 'Favoris', 'Téléchargements', 'Historique', 'Enregistrements'];
  function barre({ marque = false, actif = null } = {}) {
    // Avec la marque, le dernier lien sort du cadre, comme dans l'app (`.horsCadre`).
    const liens = (marque ? LIENS.slice(0, -1) : LIENS).map((l) => `<a class="topLink" href="#"${l === actif ? ' aria-current="page"' : ''} tabindex="-1">${l}</a>`).join('');
    return `<header class="topbar">
      ${marque ? '<span class="marque marqueBarre"><span class="lambda"></span>Aurora</span>' : ''}
      <nav class="topLiens" aria-label="Les écrans d’Aurora">${liens}</nav>
      <button class="topRond" type="button" aria-label="Rechercher" tabindex="-1">${icone('search')}</button>
      <button class="topRond" type="button" aria-label="Plus" tabindex="-1">${icone('ellipsis')}</button>
      <button class="topRond" type="button" aria-label="Réglages" tabindex="-1">${icone('settings')}</button>
    </header>`;
  }

  /* ───────── Données de démonstration ───────── */
  const CHAINES = [
    ['TF1', '#1f4fa8', 'FR - TF1 FHD'], ['F2', '#c8102e', 'FR - FRANCE 2 FHD'], ['F3', '#1d6fd1', 'FR - FRANCE 3 FHD'],
    ['C+', '#202024', 'FR - CANAL+ FHD'], ['F5', '#27a35a', 'FR - FRANCE 5 FHD'], ['M6', '#5b2c83', 'FR - M6 FHD'],
    ['Arte', '#ff4f00', 'FR - ARTE FHD'], ['W9', '#3f3f9f', 'FR - W9 HD'], ['TMC', '#0a6aa1', 'FR - TMC HD'],
    ['TFX', '#e0007a', 'FR - TFX HD'], ['6ter', '#8a2be2', 'FR - 6TER HD'], ['BFM', '#0c3a73', 'FR - BFM TV'],
    ['fi', '#e1000f', 'FR - FRANCEINFO'], ['LCI', '#0057a3', 'FR - LCI'], ['C+C', '#2a2a30', 'FR - CANAL+ CINÉMA(S)'],
    ['Ciné+', '#6b1d1d', 'FR - CINÉ+ FRISSON'], ['beIN1', '#5b2a86', 'FR - BEIN SPORTS 1'], ['beIN2', '#4a2373', 'FR - BEIN SPORTS 2'],
    ['DAZN', '#1b1b1b', 'FR - DAZN 1 FHD'], ['Éq', '#d40000', 'FR - L’ÉQUIPE'], ['RMC1', '#0f2b4f', 'FR - RMC SPORT 1'],
    ['C+S', '#16161a', 'FR - CANAL+ SPORT'], ['SKY', '#c10b2f', 'UK - SKY SPORTS'], ['ES1', '#141b4d', 'FR - EUROSPORT 1'],
    ['Gulli', '#f28c00', 'FR - GULLI HD'], ['DC', '#1b4fa0', 'FR - DISNEY CHANNEL'], ['NG', '#c9a400', 'FR - NATIONAL GEOGRAPHIC'],
    ['RMC D', '#0d6e6e', 'FR - RMC DÉCOUVERTE'], ['RTL', '#e2001a', 'BE - RTL TVI HD'], ['La Une', '#c4122f', 'BE - LA UNE HD'],
    ['PAR', '#0064d2', 'FR - PARIS PREMIÈRE'],
  ].map(([sigle, couleur, nom]) => ({ sigle, couleur, nom }));

  // Les palettes des affiches de démonstration de l'app : un fond sombre teinté, une lueur en haut à droite.
  const PALETTES = {
    rose: ['#5a2440', '#170f18', '#ff6cab'],
    violet: ['#3b2a63', '#120f1f', '#9d5cff'],
    bleu: ['#1d3a5f', '#0d1420', '#4ea8f5'],
    ambre: ['#5a4216', '#17120a', '#f5a524'],
    vert: ['#1f4a3a', '#0c1712', '#38d18a'],
    rouge: ['#5c1d22', '#170b0c', '#ff5d67'],
    sarcelle: ['#134a4a', '#0a1616', '#2fd0c8'],
    orange: ['#5a2e14', '#170e08', '#ff8a3d'],
  };
  const TITRES = [
    ['Dune : Deuxième partie', 'rose', 'film', 2024], ['Le Comte de Monte-Cristo', 'violet', 'film', 2024],
    ['Severance', 'vert', 'serie', 2022], ['Oppenheimer', 'ambre', 'film', 2023], ['The Bear', 'ambre', 'serie', 2022],
    ['Shōgun', 'rouge', 'serie', 2024], ['Fallout', 'bleu', 'serie', 2024], ['Frieren', 'bleu', 'serie', 2023],
    ['Anatomie d’une chute', 'sarcelle', 'film', 2023], ['Heat', 'orange', 'film', 1995], ['Seven', 'bleu', 'film', 1995],
    ['Kaamelott', 'ambre', 'serie', 2005], ['Slow Horses', 'vert', 'serie', 2022], ['Andor', 'rouge', 'serie', 2022],
    ['Le Bureau des légendes', 'violet', 'serie', 2015], ['La Zone d’intérêt', 'vert', 'film', 2023],
    ['Killers of the Flower Moon', 'orange', 'film', 2023], ['Vice-versa 2', 'rose', 'film', 2024],
    ['Le Cercle des neiges', 'bleu', 'film', 2023], ['The Last of Us', 'sarcelle', 'serie', 2023],
    ['The White Lotus', 'rose', 'serie', 2021], ['House of the Dragon', 'rouge', 'serie', 2022],
    ['Baron noir', 'violet', 'serie', 2016], ['Dix pour cent', 'ambre', 'serie', 2015], ['Le Fil', 'sarcelle', 'film', 2024],
    ['Megadoc', 'violet', 'film', 2025], ['One Piece', 'orange', 'serie', 2023], ['Mufasa : Le Roi Lion', 'ambre', 'film', 2024],
    ['The Office', 'bleu', 'serie', 2005], ['Les Oiseaux migrateurs', 'vert', 'film', 2001],
  ].map(([titre, palette, genre, annee]) => ({ titre, palette, genre, annee }));

  const CATEGORIES = [
    ['FR | Nouveautés', 'films', 412], ['FR | Action', 'films', 3184], ['FR | Policier & Thriller', 'films', 2210],
    ['FR | Science-fiction', 'films', 1406], ['FR | Comédie', 'films', 4102], ['FR | Drame', 'films', 5318],
    ['FR | Animation', 'films', 1977], ['FR | Documentaires', 'films', 2649], ['FR | Sagas', 'films', 688],
    ['EN | Movies 4K', 'films', 1290], ['FR | Séries Netflix', 'séries', 2384], ['FR | Séries Disney+', 'séries', 911],
    ['FR | Séries Canal+', 'séries', 478], ['FR | Séries Prime Video', 'séries', 1032], ['FR | Animés', 'séries', 1655],
    ['EN | TV Shows', 'séries', 3870], ['FR | Généralistes', 'chaînes', 64], ['FR | Sport', 'chaînes', 212],
    ['UK | Sport', 'chaînes', 148], ['FR | Info', 'chaînes', 38], ['FR | Cinéma', 'chaînes', 96], ['FR | Jeunesse', 'chaînes', 57],
    ['FR | Découverte', 'chaînes', 73], ['BE | Belgique', 'chaînes', 41],
  ].map(([nom, type, n]) => ({ nom, type, n }));

  // Une affiche de démonstration, comme celles que l'app dessine quand le fournisseur n'en donne pas.
  function affiche(t, { classe = '' } = {}) {
    const [a, b, c] = PALETTES[t.palette];
    return `<div class="affiche ${classe}" style="--a:${a};--b:${b};--c:${c}"><span>${t.titre}</span></div>`;
  }
  function logo(ch, classe = 'logoChaine') {
    const long = ch.sigle.length > 3;
    return `<span class="${classe}${long ? ' long' : ''}" style="--c:${ch.couleur}">${ch.sigle}</span>`;
  }

  /* ───────── Mise en forme ───────── */
  const fmt = (n) => Math.round(n).toLocaleString('fr-FR');
  const pluriel = (n, [un, plusieurs]) => (Math.round(n) <= 1 ? un : plusieurs);
  const duree = (s) => (s < 1 ? 'moins d’une seconde' : `${Math.round(s)} s`);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  function hasard(graine) { // mulberry32 : le même tirage d'une lecture à l'autre
    let s = graine >>> 0;
    return () => {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ───────── Le simulateur du chargement ─────────
     Les cinq étapes de l'écran actuel, dans son ordre, avec le catalogue de « Mon abonnement »
     (écran Comptes : 99 123 films · 24 936 séries · 21 576 chaînes). Les durées imitent un vrai
     fournisseur : la liste des films est la plus longue. */
  const ETAPES = [
    { cle: 'categories', nom: 'Catégories', cible: 312, unite: ['catégorie', 'catégories'], duree: 0.8, icone: 'layers' },
    { cle: 'films', nom: 'Films', cible: 99123, unite: ['film', 'films'], duree: 3.8, icone: 'film' },
    { cle: 'series', nom: 'Séries', cible: 24936, unite: ['série', 'séries'], duree: 2.6, icone: 'clapper' },
    { cle: 'chaines', nom: 'Chaînes en direct', cible: 21576, unite: ['chaîne', 'chaînes'], duree: 1.9, icone: 'tv' },
    { cle: 'guide', nom: 'Guide des programmes', cible: 186402, unite: ['programme', 'programmes'], duree: 2.5, icone: 'calendar' },
  ];
  const TOTAL = ETAPES.reduce((s, e) => s + e.duree, 0);
  const ATTENTE = 0.5; // avant la première réponse du serveur

  // L'état du chargement à l'instant t (secondes depuis le début).
  function etatA(t) {
    let reste = t - ATTENTE, courante = -1, fait = 0;
    const etapes = ETAPES.map((e, i) => {
      let k = 0;
      if (reste >= e.duree) { k = 1; reste -= e.duree; fait += e.duree; } else if (reste > 0) { k = reste / e.duree; fait += reste; reste = 0; courante = i; } else { reste = 0; }
      // Les éléments arrivent par paquets, plus vite au début : c'est ce que fait la pagination.
      const paquets = Math.max(1, Math.round(e.cible / 1200));
      const n = k >= 1 ? e.cible : Math.floor((1 - Math.pow(1 - k, 1.6)) * paquets) / paquets * e.cible;
      return { ...e, k, n, etat: k >= 1 ? 'fait' : k > 0 ? 'encours' : 'attente' };
    });
    if (courante === -1 && t >= ATTENTE) { const j = etapes.findIndex((e) => e.k < 1); if (j >= 0) { courante = j; etapes[j].etat = 'encours'; } }
    if (t < ATTENTE) { courante = 0; etapes[0].etat = 'encours'; }
    const p = clamp(fait / TOTAL, 0, 1);
    const finies = etapes.filter((e) => e.etat === 'fait').length;
    return {
      t, p, etapes, courante, finies, fini: p >= 1,
      ecoule: Math.max(0, t),
      reste: Math.max(0, TOTAL + ATTENTE - t),
    };
  }

  /*
   * Lance la simulation et appelle `rendu(etat)` à chaque image. Quand tout est arrivé, l'écran
   * reste posé `pause` secondes puis recommence — c'est une maquette qu'on regarde en boucle.
   * `?p=0.42` fige l'état à 42 % (pour les captures).
   */
  function chargement({ rendu, pause = 3.2, boucle = true }) {
    const fige = params.has('p') ? clamp(parseFloat(params.get('p')) || 0, 0, 1) : null;
    if (fige !== null) {
      const t = fige >= 1 ? TOTAL + ATTENTE + 0.01 : ATTENTE + fige * TOTAL;
      rendu(etatA(t), { premier: true, fige: true });
      return { rejouer() {} };
    }
    let debut = performance.now(), premier = true, raf = 0;
    const image = (now) => {
      let t = (now - debut) / 1000;
      if (boucle && t > TOTAL + ATTENTE + pause) { debut = now; t = 0; premier = true; }
      rendu(etatA(t), { premier, fige: false, recommence: premier && t === 0 });
      premier = false;
      raf = requestAnimationFrame(image);
    };
    raf = requestAnimationFrame(image);
    return { rejouer() { debut = performance.now(); premier = true; } };
  }

  window.Aurora = {
    FIGE, icone, barre, CHAINES, PALETTES, TITRES, CATEGORIES, ETAPES, TOTAL, ATTENTE,
    affiche, logo, fmt, pluriel, duree, clamp, hasard, etatA, chargement,
  };
})();
