# Défi Callisthénie 28 Jours — Design

**Date :** 2026-09-28
**Statut :** Validé pour implémentation

## Contexte et objectif

Application web mobile (PWA) pour suivre un défi de callisthénie de 28 jours,
conçu pour un homme de 50 ans ayant une pratique sportive régulière (mais pas
spécifiquement en callisthénie), avec une douleur au poignet droit à prendre
en compte, disposant uniquement de son poids du corps et d'une chaise comme
accessoire, sur des séances de 20 minutes.

Usage strictement personnel, sur un seul appareil, sans compte ni backend.
Déploiement prévu sur GitHub Pages (repo `dmariage/callisthenie`).

## Contraintes

- **Public :** homme 50 ans, pratique sportive régulière (généraliste), débutant
  en callisthénie spécifiquement
- **Équipement :** poids du corps uniquement + une chaise
- **Durée de séance :** ~20 minutes
- **Contrainte santé :** douleur au poignet droit → toutes les variantes
  d'appui (pompes, planche) doivent éviter l'extension complète du poignet
  (appui sur poings/avant-bras, ou mains posées sur la chaise pour réduire
  l'angle)
- **Stockage :** local uniquement (localStorage), pas de backend, pas de compte
- **Notifications :** hors scope (nécessiteraient un backend push, abandonné
  par choix produit)
- **Déploiement :** GitHub Pages, repo `dmariage/callisthenie`,
  `base: '/callisthenie/'`

## Approche technique retenue

**Vue 3 + Vite + Pinia + vite-plugin-pwa**, données du programme statiques
(TS/JSON embarqué, pas d'admin/CMS), état de progression persistant en
localStorage via `pinia-plugin-persistedstate`.

Alternatives écartées :
- *Sans Pinia (composables + localStorage direct)* : logique de progression/
  streak trop éparpillée, moins maintenable.
- *IndexedDB* : volume de données trop faible (quelques Ko) pour justifier
  la complexité — YAGNI.
- *Notifications programmées* : nécessiterait un serveur push, incompatible
  avec la contrainte "pas de backend" → abandonné.

## Architecture

```
callisthenie/
├── src/
│   ├── data/
│   │   └── program.ts          # Programme complet des 28 jours
│   ├── stores/
│   │   └── progress.ts         # Pinia store : jours complétés, streak
│   ├── composables/
│   │   └── useTimer.ts         # Logique du minuteur (repos / isométrie)
│   ├── components/
│   │   ├── DayCard.vue         # Exercice + case à cocher
│   │   ├── Timer.vue           # Minuteur visuel (compte à rebours)
│   │   ├── ProgressCalendar.vue # Calendrier 28 jours + streak
│   │   └── ExerciseList.vue    # Liste des exercices du jour
│   ├── views/
│   │   ├── HomeView.vue        # Jour du jour + accès rapide
│   │   ├── DayView.vue         # Détail d'une séance (checkboxes + timer)
│   │   └── ProgressView.vue    # Vue calendrier/statistiques
│   ├── router/
│   ├── App.vue
│   └── main.ts
│   └── assets/
│       └── illustrations/      # SVG ligne/silhouette, un par exercice unique
├── public/
│   └── icons/                  # Icônes PWA (192x192, 512x512)
├── vite.config.ts               # vite-plugin-pwa + base path GitHub Pages
└── .github/workflows/deploy.yml # CI de déploiement
```

## Structure du programme (28 jours)

**Répartition hebdomadaire** (répétée sur 4 semaines avec progression) :
- 3 jours d'entraînement (circuit complet ~20 min : squat, poussée, tirage
  isométrique, gainage, fessiers/hanches)
- 2 jours de mobilité active (épaules/hanches/thoracique, étirements — sans
  charge sur le poignet)
- 2 jours de repos (dont un avec option "bonus mobilité")

**Progression sur 4 semaines :**
- Semaine 1 — Fondations : apprentissage des mouvements, volume modéré
  (2 séries)
- Semaine 2 — Volume : +1 série, tenues isométriques plus longues
- Semaine 3 — Intensité : variantes plus dures (ex : squat bulgare sur
  chaise, pompes inclinées → déclinées)
- Semaine 4 — Consolidation : combinaison volume+intensité, mini-test final
  jour 28

**Adaptation poignet droit :** toutes les variantes de pompes/planche
utilisent un appui sur poings/avant-bras (jamais paume à plat en extension
complète) ; la chaise est aussi utilisée pour réduire l'angle du poignet
(ex : pompes inclinées, mains posées sur l'assise).

**Modèle de données :**
```ts
interface Exercise {
  id: string
  name: string
  sets: number
  reps?: number        // ex: 12 répétitions
  durationSec?: number // ex: 30s de gainage
  restSec: number
  wristFriendly: boolean // variante appui poing/avant-bras si true
  illustrationId: string // référence vers src/assets/illustrations/<id>.svg
  notes?: string
}

interface DayProgram {
  day: number           // 1 à 28
  week: number          // 1 à 4
  type: 'training' | 'mobility' | 'rest'
  focus: string          // ex: "Full body A", "Mobilité hanches/épaules"
  warmup: Exercise[]
  main: Exercise[]
  cooldown: Exercise[]
}
```

Le contenu exercice par exercice détaillé (les 28 jours complets) sera écrit
lors de l'implémentation en suivant ces règles de progression et
d'adaptation au poignet.

**Illustrations des exercices :**
- Les exercices sont réutilisés à travers les 28 jours (variations de séries/
  reps/durée pour un même mouvement) — le nombre d'exercices **uniques** est
  estimé à ~15-20 sur l'ensemble du programme, pas 28×6
- Chaque exercice unique dispose d'une **illustration SVG schématique** (style
  silhouette/ligne, pas photoréaliste), stockée en fichier statique dans
  `src/assets/illustrations/` et référencée via `illustrationId`
- Pas de photo ni de vidéo (hors scope, cf. section "Hors scope") : uniquement
  des illustrations vectorielles simples créées pour ce projet, légères et
  fonctionnant offline sans dépendance externe
- Affichées dans `ExerciseList.vue` / `DayCard.vue` à côté du nom de l'exercice

## État et persistance

**Store `progress.ts` (Pinia) :**
```ts
interface ProgressState {
  startDate: string | null          // date de démarrage du défi (jour 1)
  completedDays: Record<number, {   // clé = numéro du jour (1-28)
    completedAt: string
    completedExercises: string[]    // ids des exercices cochés
  }>
  currentStreak: number
  bestStreak: number
}
```

- **Calcul du streak :** recalculé à chaque case cochée — si le jour
  précédent (calendaire) est complété, `currentStreak++`, sinon reset à 1.
  `bestStreak` = max historique.
- **Persistance :** `pinia-plugin-persistedstate` → sauvegarde automatique
  en `localStorage` à chaque changement, rechargement automatique à
  l'ouverture de l'app.
- **Jour "du jour" :** calculé à partir de `startDate`
  (`joursÉcoulés + 1`, plafonné à 28). Si l'utilisateur n'a pas démarré,
  `HomeView` propose de démarrer le défi (fixe `startDate = today`).

**Minuteur (`useTimer.ts`) :**
- Composable réutilisable : `start(durationSec)`, `pause()`, `reset()`,
  état réactif `remaining`, `isRunning`
- Utilisé pour le temps de repos entre séries et les exercices en
  isométrie (ex : gainage 30s)
- Bip sonore simple (Web Audio API, pas de fichier externe) à la fin du
  décompte

## PWA & déploiement GitHub Pages

**Configuration PWA (`vite-plugin-pwa`) :**
- `manifest.json` généré : nom "Défi Callisthénie 28 Jours", icônes
  192x192 / 512x512, `display: standalone`
- Service worker en mode `autoUpdate` : cache les assets pour un
  fonctionnement 100% offline après le premier chargement
- `registerType: 'autoUpdate'` pour propager les mises à jour futures sans
  action utilisateur

**Spécificités GitHub Pages :**
- `base: '/callisthenie/'` dans `vite.config.ts` (repo `dmariage/callisthenie`)
- Scope du service worker cohérent avec ce `base` path
- GitHub Actions (`.github/workflows/deploy.yml`) : build automatique sur
  push vers `main`, déploiement via `actions/deploy-pages`
- HTTPS natif sur `*.github.io` → prérequis PWA respecté

## Plan de tests

- **Tests unitaires (Vitest)** sur la logique critique :
  - Calcul du streak (`progress.ts` store) : jours consécutifs, reset, best
    streak
  - Calcul du "jour actuel" à partir de `startDate`
  - Composable `useTimer` : start/pause/reset/décompte
- **Tests de composants (Vue Test Utils)** ciblés :
  - `DayCard` : cocher un exercice met à jour l'état et déclenche la
    sauvegarde
  - `ProgressCalendar` : affichage correct des jours complétés/manqués
- **Pas de tests E2E** (hors scope pour un usage personnel, ajoutable plus
  tard si besoin)

## Hors scope (décisions explicites)

- Notifications/rappels programmés (nécessiteraient un backend push)
- Multi-appareils / synchronisation cloud / comptes utilisateurs
- Édition du programme via une UI (le programme est statique, codé en dur)
- Tests end-to-end
- Photos/vidéos réelles de démonstration des exercices (uniquement des
  illustrations SVG schématiques créées pour ce projet)
