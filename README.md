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

Barre d'onglets flottante (pilule marine) : **Journal** (icône page), **Terme du
jour** (icône **balance de la justice**) et **Astrophysique** (icône planète).

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
src/data/content.ts        Contenu du jour (codé en dur)
src/components/
  Header.tsx               Masthead centré PROJECT / ENM
  EssentielCard.tsx        Carte marine « L'essentiel du jour »
  RubriqueCard.tsx         Carte blanche à chip colorée
  TabBar.tsx               Barre d'onglets flottante
  icons.tsx                Icônes SVG (page journal, balance de justice)
src/screens/
  JournalScreen.tsx        Écran 1
  TermeScreen.tsx          Écran 2 (fiche dépliable)
```

## Vérification

- `npx tsc --noEmit` — typecheck OK
- `npx expo export --platform ios` — le bundle iOS se construit sans erreur
