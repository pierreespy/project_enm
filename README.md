# Project ENM — appli mobile (Expo / React Native)

Veille juridique quotidienne pour juristes, avocats et magistrats. Implémentation
native (iOS) de la maquette conçue dans Claude Design (`../project/Project ENM - App.dc.html`).

Parti pris repris fidèlement de la maquette : **papier crème éditorial**, accent
**bleu marine**, typographie serif **Spectral**, chips colorées par rubrique,
« Essentiel » = une actu phare, onglets fonctionnels et fiche du terme dépliable.

## Deux écrans

- **Journal** — masthead « PROJECT / ENM », encadré marine « L'essentiel du jour »
  (une actu phare), puis 6 cartes (une par rubrique : Législation & réglementation,
  Jurisprudence, Doctrine & études, Culture générale, Pratique & procédure,
  Actualité classique). Chaque carte a une chip de rubrique colorée, un titre
  cliquable, un résumé et une source avec flèche ↗. Un tap sur le titre ou la
  flèche ouvre l'article à sa source.
- **Terme du jour** — le terme en très gros sur carte marine, un sous-titre, une
  carte « définition », et un bouton **+ / –** qui déplie/replie la fiche complète.

Barre d'onglets flottante (pilule marine) : **Journal** (icône page) et **Terme du
jour** (icône **balance de la justice**).

## Contenu

Le contenu quotidien est pour l'instant **codé en dur** dans
[`src/data/content.ts`](src/data/content.ts) (le contenu juridique de démonstration
de la maquette). L'app avait été pensée pour aller chercher ce contenu sur un
dépôt GitHub quotidien : le module `content.ts` reproduit la forme attendue de ce
flux, de sorte que brancher une couche de `fetch` plus tard ne touche que ce fichier.

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
