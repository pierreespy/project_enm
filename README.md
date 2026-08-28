# Project ENM — appli mobile (Expo / React Native)

Veille juridique **biquotidienne** (éditions « matin » et « midi ») pour juristes,
avocats et magistrats. Implémentation
native (iOS) de la maquette conçue dans Claude Design (`../project/Project ENM - App.dc.html`).

Parti pris repris fidèlement de la maquette : **papier crème éditorial**, accent
**bleu marine**, typographie serif **Spectral**, chips colorées par rubrique,
« Essentiel » = une actu phare, onglets fonctionnels et fiche du terme dépliable.

## Trois écrans

- **Journal** — masthead « PROJECT / ENM », encadré marine « L'essentiel du jour »
  (une actu phare), puis 6 cartes (une par rubrique : Législation & réglementation,
  Jurisprudence, Doctrine & études, Culture générale, Pratique & procédure,
  Actualité classique). Chaque carte a une chip de rubrique colorée, un titre
  cliquable, un résumé et une source avec flèche ↗. Un tap sur le titre ou la
  flèche ouvre l'article à sa source.
- **Terme du jour** — le terme en très gros sur carte marine, un sous-titre, une
  carte « définition », et un bouton **+ / –** qui déplie/replie la fiche complète.
- **Astrophysique** — la leçon du jour d'un **mini-cours** quotidien (une notion,
  2 à 3 minutes) : carte marine (numéro, titre, sous-titre), deux ou trois
  cartes de section, le vocabulaire à retenir, un récapitulatif d'une phrase et
  l'annonce de la leçon du lendemain. Un sommaire dépliable donne accès à
  **toutes les leçons passées**.

## Mouvement et retour tactile

Toutes les cartes entrent en fondu, décalées les unes des autres dans l'ordre de
lecture (`src/components/FadeIn.tsx`). Les surfaces pressées s'enfoncent sous le
doigt (`src/components/Press.tsx`), le bandeau du Journal se décale en parallaxe
pendant le défilement, une pastille claire glisse sous l'onglet actif et chaque
écran entre du côté d'où il vient.

Les gestes sont soulignés par un retour haptique au vocabulaire volontairement
court (`src/lib/haptics.ts`), du cran le plus fin (`tick`) au coup franc
(`heavy`), plus des figures rythmées pour la sonnerie.

Le réglage système **« Réduire les animations »** est respecté partout
(`src/hooks/useReduceMotion.ts`) : le mouvement disparaît, l'haptique reste —
c'est elle qui porte l'information une fois l'animation coupée.

Barre d'onglets flottante (pilule marine) : **Journal** (icône page), **Terme du
jour** (icône **balance de la justice**) et **Astrophysique** (icône planète).

## Easter egg

Tirer le Journal depuis le haut relève la boîte aux lettres. Tirer **longtemps**
— au-delà du seuil, et en maintenant — fait monter un filet marine en haut de
l'écran, avec des crans haptiques qui s'accélèrent, puis ouvre un **appel
entrant** en plein écran : ça sonne, ça vibre en cadence, et la photo tressaute
à chaque salve. Refuser ferme, accepter passe sur un écran « appel en cours »
avec compteur, qui raccroche de lui-même.

La sonnerie (`assets/ringtone.mp3`) est **jouée en entier, une seule fois** :
elle démarre avec l'écran d'appel et se coupe net dès qu'on décroche ou qu'on
refuse (`src/lib/ringtone.ts`). Si le morceau se termine sans réponse, l'appel
reste à l'écran, silencieux mais toujours vibrant — la cadence des vibrations
est indépendante de l'audio (`RING_PULSE_MS`, dans `IncomingCall.tsx`).
**Changer de sonnerie = remplacer le fichier, rien d'autre**, sa durée n'entrant
nulle part dans le code.

Le fichier actuel est un **bouche-trou** : une composition maison — un arpège de
marimba synthétisé par [`tools/make-ringtone.py`](tools/make-ringtone.py) —
plutôt qu'une sonnerie système, qui ne pourrait pas être embarquée. Le jour où
un vrai enregistrement le remplace, le générateur peut disparaître avec lui.

Sur Android, où l'`overscroll` n'est qu'un effet visuel, le repli est de
rafraîchir trois fois en moins de huit secondes.

## Contenu

Le contenu est publié **deux fois par jour** (créneaux `matin` et `midi`) par la
routine du dépôt [`project-enm-content`](https://github.com/pierreespy/project-enm-content),
qui dépose chaque édition dans la « boîte aux lettres » `latest.json`. L'app lit
cette adresse fixe au démarrage **et à chaque retour au premier plan**, de sorte
qu'une app ouverte le matin bascule sur l'édition du midi dès sa publication
(voir [`src/data/remote.ts`](src/data/remote.ts)).

Le créneau de l'édition affichée (`slot`) apparaît dans le coin du bandeau, à
côté de la date : « 25 août · midi ».

L'onglet **Astrophysique** sert un mini-cours suivi, écrit pour un lecteur sans
formation scientifique : une notion par jour, 2 à 3 minutes de lecture, chaque
leçon s'appuyant sur les précédentes — le pari est la régularité, pas le volume. Les leçons vivent dans `astro/lessons/` du dépôt de contenu et
la leçon en cours est jointe à `latest.json` (champ `astro`) — l'app n'a donc
qu'un seul fichier à relever au démarrage. Les leçons **passées** sont listées
via `astro/index.json` et chargées une par une, à la demande, quand l'utilisateur
les ouvre depuis le sommaire : le poids du flux quotidien ne grossit pas avec le
cours.

[`src/data/content.ts`](src/data/content.ts) contient le **fallback embarqué** —
le contenu juridique de démonstration de la maquette — affiché hors ligne ou si le
flux est inaccessible ; il définit aussi le type `DailyContent`, la forme exacte
que le flux doit servir.

## Lancer

```bash
cd project-enm
npm install
npm run ios      # simulateur iOS (macOS requis) — ou l'app Expo Go sur iPhone
npm start        # démarre Metro, puis scanner le QR code avec Expo Go
```

## Structure

```
App.tsx                    Coquille : chargement des fontes Spectral, état des onglets, barre flottante
src/theme.ts               Tokens design (couleurs, fontes, gabarit) extraits de la maquette
src/data/content.ts        Fallback embarqué + types du flux
src/data/remote.ts         Relève de latest.json et des leçons d'archive
src/components/
  Header.tsx               Masthead centré PROJECT / ENM
  EssentielCard.tsx        Carte marine « L'essentiel du jour »
  RubriqueCard.tsx         Carte blanche à chip colorée
  TabBar.tsx               Barre d'onglets flottante (pastille glissante)
  ToggleButton.tsx         Bouton « ouvrir / réduire » partagé Terme + Astro
  Press.tsx                Surface qui s'enfonce sous le doigt
  FadeIn.tsx               Entrée en fondu, décalable
  IncomingCall.tsx         Easter egg : l'écran d'appel entrant
  icons.tsx                Icônes SVG (page journal, balance de justice)
src/hooks/
  useLongPullEasterEgg.ts  Le tirage long qui déclenche l'appel
  useReduceMotion.ts       Réglage système « Réduire les animations »
src/lib/
  haptics.ts               Vocabulaire haptique de l'app
  ringtone.ts              Lecture en boucle de la sonnerie
src/screens/
  JournalScreen.tsx        Écran 1
  TermeScreen.tsx          Écran 2 (fiche dépliable)
  AstroScreen.tsx          Écran 3 (leçon du jour + sommaire des archives)
assets/ringtone.mp3        Sonnerie de l'appel entrant
tools/make-ringtone.py     Générateur de la sonnerie bouche-trou
```

> L'ajout d'`expo-audio` est un module natif : Expo Go ne suffit plus pour
> entendre la sonnerie, il faut un build de développement ou une build EAS.
> C'est pourquoi `app.json` passe en `1.2.0` — `runtimeVersion` suit
> `appVersion`, et une mise à jour OTA ne doit pas atterrir sur un binaire qui
> ne contient pas le module.

## Vérification

- `npx tsc --noEmit` — typecheck OK
- `npx expo export --platform ios` — le bundle iOS se construit sans erreur
