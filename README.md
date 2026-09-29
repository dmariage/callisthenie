# Défi Callisthénie 28 Jours

PWA personnelle pour suivre un défi de callisthénie de 28 jours (poids du
corps + une chaise), avec adaptation pour préserver le poignet droit.

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

L'application est disponible sur http://localhost:5173.

## Tests

```bash
npm test
```

## Build de production

```bash
npm run build
npm run preview
```

## Déploiement

Le déploiement sur GitHub Pages (repo `dmariage/callisthenie`) est automatisé
via `.github/workflows/deploy.yml` : chaque push sur `main` déclenche les
tests, le build et la publication sur GitHub Pages
(https://dmariage.github.io/callisthenie/).

Pour régénérer les icônes de l'application après une modification du script :

```bash
node scripts/generate-icons.mjs
```
