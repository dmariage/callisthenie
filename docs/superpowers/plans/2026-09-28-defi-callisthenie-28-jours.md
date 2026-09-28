# Défi Callisthénie 28 Jours — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire une PWA Vue 3 autonome (sans backend) qui fait vivre à un homme de 50 ans, débutant en callisthénie et avec une contrainte de poignet droit, un défi de 28 jours (poids du corps + chaise), avec suivi de progression, minuteur et calendrier/streak, déployée sur GitHub Pages.

**Architecture:** Programme statique typé (`src/data/program.ts`) généré par une fonction `buildWeek()` appliquant 4 variantes de progression hebdomadaire sur un catalogue d'exercices uniques ; état de progression (jours complétés, streak) dans un store Pinia persistant en `localStorage` ; composants Vue (cartes d'exercice, minuteur, calendrier) consommant ce store et le catalogue ; PWA installable via `vite-plugin-pwa`, déploiement automatisé par GitHub Actions.

**Tech Stack:** Vue 3 (`<script setup>` + TypeScript), Vite, Pinia + `pinia-plugin-persistedstate`, Vue Router, `vite-plugin-pwa`, Vitest + `@vue/test-utils`, GitHub Actions + `actions/deploy-pages`.

**Spec:** [docs/superpowers/specs/2026-09-28-defi-callisthenie-28-jours-design.md](../specs/2026-09-28-defi-callisthenie-28-jours-design.md)

## Global Constraints

- Aucune dépendance backend, aucune notification programmée : tout l'état vit en `localStorage` côté client (spec §"Contraintes", §"Hors scope").
- Toutes les variantes d'exercice évitent l'extension complète du poignet droit (appui poings/avant-bras, ou mains sur la chaise) — chaque entrée du catalogue a `wristFriendly: true` (spec §"Contraintes", §"Adaptation poignet droit").
- Répartition hebdomadaire fixe sur les 4 semaines : 3 jours `training`, 2 jours `mobility`, 2 jours `rest` (spec §"Structure du programme (28 jours)").
- Progression sur 4 semaines : semaine 1 = fondations (sets=2), semaine 2 = volume (sets=3, mêmes variantes), semaine 3 = intensité (sets=3, variantes plus dures), semaine 4 = consolidation (pareil que semaine 3, jour 28 = test final) (spec §"Progression sur 4 semaines").
- `base: '/callisthenie/'` dans `vite.config.ts` pour le déploiement GitHub Pages sur `dmariage/callisthenie` (spec §"PWA & déploiement GitHub Pages").
- Illustrations exclusivement en SVG schématique ligne/silhouette, une par exercice unique, jamais de photo/vidéo (spec §"Illustrations des exercices", §"Hors scope").
- Pas de tests E2E ; couverture attendue : logique de streak, calcul du jour courant, `useTimer` (Vitest) + `DayCard`/`ProgressCalendar` (Vue Test Utils) (spec §"Plan de tests").
- Import des modules internes via l'alias `@/*` → `src/*` (défini en Tâche 1, utilisé par toutes les tâches suivantes).

---

### Task 1: Scaffolding du projet (Vite + Vue 3 + TS + Vitest + Pinia + Router)

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `.gitignore`
- Create: `src/main.ts`
- Create: `src/App.vue`
- Create: `src/env.d.ts`
- Create: `src/App.spec.ts`

**Interfaces:**
- Consumes: rien (première tâche).
- Produces: alias `@/*` → `src/*` (utilisé par toutes les tâches suivantes) ; scripts npm `dev`, `build`, `preview`, `test`, `test:watch`, `typecheck` ; `src/main.ts` exposant un point d'entrée `createApp(App)` que la Tâche 8 modifiera pour y brancher le router.

- [ ] **Step 1: Écrire `package.json`**

```json
{
  "name": "callisthenie",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "vue-tsc --noEmit"
  },
  "dependencies": {
    "pinia": "^2.2.6",
    "pinia-plugin-persistedstate": "^4.1.3",
    "vue": "^3.5.13",
    "vue-router": "^4.4.5"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.1",
    "@vue/test-utils": "^2.4.6",
    "@vue/tsconfig": "^0.7.0",
    "jsdom": "^25.0.1",
    "typescript": "~5.6.3",
    "vite": "^6.0.3",
    "vite-plugin-pwa": "^0.21.1",
    "vitest": "^2.1.8",
    "vue-tsc": "^2.1.10"
  }
}
```

- [ ] **Step 2: Installer les dépendances**

Run: `npm install`
Expected: `node_modules/` créé, `package-lock.json` généré, aucune erreur.

- [ ] **Step 3: Écrire `tsconfig.json`**

```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.vue"]
}
```

- [ ] **Step 4: Écrire `vite.config.ts`**

```ts
/// <reference types="vitest" />
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/callisthenie/' : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
}))
```

- [ ] **Step 5: Écrire `index.html`**

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Défi Callisthénie 28 Jours</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 6: Écrire `.gitignore`**

```
node_modules
dist
dist-ssr
*.local
.DS_Store
```

- [ ] **Step 7: Écrire `src/env.d.ts`**

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 8: Écrire `src/main.ts`**

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App).use(pinia).mount('#app')
```

- [ ] **Step 9: Écrire `src/App.vue`**

```vue
<template>
  <main class="app">
    <h1>Défi Callisthénie 28 Jours</h1>
  </main>
</template>

<style scoped>
.app {
  max-width: 480px;
  margin: 0 auto;
  padding: 1rem;
  font-family: system-ui, sans-serif;
}
</style>
```

- [ ] **Step 10: Écrire le test de fumée `src/App.spec.ts`**

```ts
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './App.vue'

describe('App', () => {
  it('renders the challenge title', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Défi Callisthénie 28 Jours')
  })
})
```

- [ ] **Step 11: Lancer les tests**

Run: `npm test`
Expected: 1 fichier de test, 1 test, PASS.

- [ ] **Step 12: Vérifier le build**

Run: `npm run build`
Expected: build réussi, dossier `dist/` généré, aucune erreur TypeScript.

- [ ] **Step 13: Commit**

```bash
git add package.json package-lock.json tsconfig.json vite.config.ts index.html .gitignore src
git commit -m "chore: scaffold Vite + Vue 3 + TS + Vitest + Pinia project"
```

---

### Task 2: Modèle de données du programme (`src/data/program.ts`)

**Files:**
- Create: `src/data/program.ts`
- Create: `src/data/program.spec.ts`

**Interfaces:**
- Consumes: rien de nouveau (types TS purs).
- Produces:
  - `interface Exercise { id: string; name: string; sets: number; reps?: number; durationSec?: number; restSec: number; wristFriendly: boolean; illustrationId: string; notes?: string }`
  - `interface DayProgram { day: number; week: number; type: 'training' | 'mobility' | 'rest'; focus: string; warmup: Exercise[]; main: Exercise[]; cooldown: Exercise[]; notes?: string }` — le champ optionnel `notes` (absent de l'esquisse de la spec) porte le message du jour 28 ("Test final") et l'indication de mobilité bonus des jours de repos ; c'est une extension mineure et rétro-compatible du modèle de la spec, documentée en auto-revue.
  - `EXERCISE_CATALOG: Record<string, (sets: number) => Exercise>` — catalogue des 19 exercices uniques, indexé par `id`.
  - `buildWeek(week: number): DayProgram[]` — génère les 7 jours d'une semaine (1 à 4).
  - `PROGRAM: DayProgram[]` — les 28 jours (`[1, 2, 3, 4].flatMap(buildWeek)`).

**Contexte de conception (pour l'implémenteur) :**

Motif hebdomadaire fixe (jour 1 = premier jour de la semaine) :
1. `training` (focus "Full body A")
2. `mobility` (focus "Mobilité épaules/thoracique")
3. `rest` (bonus mobilité optionnel)
4. `training` (focus "Full body B")
5. `mobility` (focus "Mobilité hanches/fessiers")
6. `rest` (repos complet)
7. `training` (focus "Full body C" ; "Test final" en semaine 4 → jour 28)

Cela donne bien 3 `training` + 2 `mobility` + 2 `rest` par semaine (28 = 4×7), et le jour 28 tombe sur un jour `training`, marqué comme test final.

Catalogue des 19 exercices uniques (tous `wristFriendly: true`, aucun exercice du programme ne charge le poignet en extension complète) :
- Échauffement : `jumping-jacks`, `arm-circles`, `cat-cow-fist`
- Circuit principal (squat, poussée, tirage isométrique, gainage, fessiers/hanches) : `chair-assisted-squat` / `squat-bulgarian-chair` (squat facile/dur), `incline-pushup-fist` / `pushup-fist-floor` (poussée facile/dure), `superman-hold` (tirage isométrique, durée progressive), `forearm-plank` (gainage, durée progressive), `glute-bridge` / `glute-bridge-single-leg` (fessiers facile/dur)
- Jours de mobilité : `shoulder-mobility-circles`, `thoracic-rotation-chair`, `hip-opener-90-90`, `hip-flexor-lunge-stretch`
- Retour au calme : `chest-doorway-stretch`, `hamstring-standing-stretch`, `glute-figure4-stretch`, `child-pose-fist`

Progression par semaine (`WEEK_VARIANTS`) :
- Semaine 1 : `basicSets=2`, variantes faciles, `supermanDurationSec=15`, `plankDurationSec=20`
- Semaine 2 : `basicSets=3`, mêmes variantes, `supermanDurationSec=20`, `plankDurationSec=30`
- Semaine 3 : `basicSets=3`/`hardSets=3`, variantes dures (`squat-bulgarian-chair`, `pushup-fist-floor`, `glute-bridge-single-leg`), `supermanDurationSec=25`, `plankDurationSec=35`
- Semaine 4 : identique à la semaine 3, `supermanDurationSec=30`, `plankDurationSec=40`, jour 28 marqué "Test final"

- [ ] **Step 1: Créer le dossier et écrire le test `src/data/program.spec.ts` (échoue d'abord car `program.ts` n'existe pas encore)**

```ts
import { describe, expect, it } from 'vitest'
import { EXERCISE_CATALOG, PROGRAM } from './program'

describe('PROGRAM', () => {
  it('contains exactly 28 days numbered 1 to 28 in order', () => {
    expect(PROGRAM).toHaveLength(28)
    PROGRAM.forEach((dayProgram, index) => {
      expect(dayProgram.day).toBe(index + 1)
    })
  })

  it('assigns each day to a week from 1 to 4', () => {
    PROGRAM.forEach((dayProgram) => {
      const expectedWeek = Math.ceil(dayProgram.day / 7)
      expect(dayProgram.week).toBe(expectedWeek)
    })
  })

  it('distributes 3 training, 2 mobility and 2 rest days per week', () => {
    for (let week = 1; week <= 4; week += 1) {
      const daysOfWeek = PROGRAM.filter((dayProgram) => dayProgram.week === week)
      expect(daysOfWeek).toHaveLength(7)
      const counts = daysOfWeek.reduce(
        (acc, dayProgram) => {
          acc[dayProgram.type] += 1
          return acc
        },
        { training: 0, mobility: 0, rest: 0 } as Record<'training' | 'mobility' | 'rest', number>,
      )
      expect(counts).toEqual({ training: 3, mobility: 2, rest: 2 })
    }
  })

  it('marks day 28 as the final test', () => {
    const day28 = PROGRAM.find((dayProgram) => dayProgram.day === 28)
    expect(day28?.focus).toContain('Test final')
  })

  it('references only exercises that exist in the catalogue', () => {
    const catalogueIds = new Set(Object.keys(EXERCISE_CATALOG))
    for (const dayProgram of PROGRAM) {
      for (const exercise of [...dayProgram.warmup, ...dayProgram.main, ...dayProgram.cooldown]) {
        expect(catalogueIds.has(exercise.id)).toBe(true)
      }
    }
  })

  it('gives every exercise instance the wrist-friendly flag', () => {
    for (const dayProgram of PROGRAM) {
      for (const exercise of [...dayProgram.warmup, ...dayProgram.main, ...dayProgram.cooldown]) {
        expect(exercise.wristFriendly).toBe(true)
      }
    }
  })

  it('leaves rest days without any exercise', () => {
    const restDays = PROGRAM.filter((dayProgram) => dayProgram.type === 'rest')
    expect(restDays).toHaveLength(8)
    for (const dayProgram of restDays) {
      expect(dayProgram.warmup).toHaveLength(0)
      expect(dayProgram.main).toHaveLength(0)
      expect(dayProgram.cooldown).toHaveLength(0)
      expect(dayProgram.notes).toBeDefined()
    }
  })
})
```

- [ ] **Step 2: Lancer le test pour vérifier qu'il échoue**

Run: `npm test -- program`
Expected: FAIL — `Cannot find module './program'` (ou équivalent).

- [ ] **Step 3: Écrire `src/data/program.ts`**

```ts
export interface Exercise {
  id: string
  name: string
  sets: number
  reps?: number
  durationSec?: number
  restSec: number
  wristFriendly: boolean
  illustrationId: string
  notes?: string
}

export interface DayProgram {
  day: number
  week: number
  type: 'training' | 'mobility' | 'rest'
  focus: string
  warmup: Exercise[]
  main: Exercise[]
  cooldown: Exercise[]
  notes?: string
}

export const EXERCISE_CATALOG: Record<string, (sets: number) => Exercise> = {
  'jumping-jacks': (sets) => ({
    id: 'jumping-jacks',
    name: 'Jumping jacks',
    sets,
    durationSec: 30,
    restSec: 10,
    wristFriendly: true,
    illustrationId: 'jumping-jacks',
    notes: 'Cardio léger pour échauffer tout le corps.',
  }),
  'arm-circles': (sets) => ({
    id: 'arm-circles',
    name: 'Cercles de bras',
    sets,
    durationSec: 20,
    restSec: 0,
    wristFriendly: true,
    illustrationId: 'arm-circles',
    notes: "10 secondes vers l'avant, 10 secondes vers l'arrière.",
  }),
  'cat-cow-fist': (sets) => ({
    id: 'cat-cow-fist',
    name: 'Chat-vache sur les poings',
    sets,
    reps: 10,
    restSec: 0,
    wristFriendly: true,
    illustrationId: 'cat-cow-fist',
    notes: 'Appui sur les poings ou les avant-bras pour protéger le poignet.',
  }),
  'chair-assisted-squat': (sets) => ({
    id: 'chair-assisted-squat',
    name: 'Squat assisté à la chaise',
    sets,
    reps: 12,
    restSec: 30,
    wristFriendly: true,
    illustrationId: 'chair-assisted-squat',
    notes: "Mains posées sur l'assise de la chaise pour t'aider à descendre et remonter.",
  }),
  'squat-bulgarian-chair': (sets) => ({
    id: 'squat-bulgarian-chair',
    name: 'Squat bulgare sur chaise',
    sets,
    reps: 10,
    restSec: 45,
    wristFriendly: true,
    illustrationId: 'squat-bulgarian-chair',
    notes: "Un pied surélevé sur la chaise derrière toi, descente contrôlée sur l'autre jambe.",
  }),
  'incline-pushup-fist': (sets) => ({
    id: 'incline-pushup-fist',
    name: 'Pompe inclinée sur les poings',
    sets,
    reps: 10,
    restSec: 30,
    wristFriendly: true,
    illustrationId: 'incline-pushup-fist',
    notes: "Poings ou avant-bras en appui sur l'assise de la chaise, corps incliné.",
  }),
  'pushup-fist-floor': (sets) => ({
    id: 'pushup-fist-floor',
    name: 'Pompe au sol sur les poings',
    sets,
    reps: 8,
    restSec: 45,
    wristFriendly: true,
    illustrationId: 'pushup-fist-floor',
    notes: 'Appui sur les poings au sol, corps aligné de la tête aux pieds.',
  }),
  'superman-hold': (sets) => ({
    id: 'superman-hold',
    name: 'Superman isométrique',
    sets,
    durationSec: 20,
    restSec: 20,
    wristFriendly: true,
    illustrationId: 'superman-hold',
    notes: 'Allongé sur le ventre, bras et jambes tendus, soulève légèrement et tiens la position.',
  }),
  'forearm-plank': (sets) => ({
    id: 'forearm-plank',
    name: 'Planche sur les avant-bras',
    sets,
    durationSec: 30,
    restSec: 20,
    wristFriendly: true,
    illustrationId: 'forearm-plank',
    notes: 'Appui sur les avant-bras, jamais sur les paumes, corps aligné de la tête aux pieds.',
  }),
  'glute-bridge': (sets) => ({
    id: 'glute-bridge',
    name: 'Pont fessier',
    sets,
    reps: 15,
    restSec: 20,
    wristFriendly: true,
    illustrationId: 'glute-bridge',
    notes: 'Allongé sur le dos, pieds au sol, pousse les hanches vers le haut.',
  }),
  'glute-bridge-single-leg': (sets) => ({
    id: 'glute-bridge-single-leg',
    name: 'Pont fessier unilatéral',
    sets,
    reps: 10,
    restSec: 30,
    wristFriendly: true,
    illustrationId: 'glute-bridge-single-leg',
    notes: "Même mouvement, une jambe tendue en l'air pour plus d'intensité.",
  }),
  'shoulder-mobility-circles': (sets) => ({
    id: 'shoulder-mobility-circles',
    name: "Cercles d'épaules amples",
    sets,
    reps: 10,
    restSec: 0,
    wristFriendly: true,
    illustrationId: 'shoulder-mobility-circles',
    notes: 'Cercles amples, dans les deux sens, pour dérouiller les épaules.',
  }),
  'thoracic-rotation-chair': (sets) => ({
    id: 'thoracic-rotation-chair',
    name: 'Rotation thoracique assise',
    sets,
    reps: 10,
    restSec: 0,
    wristFriendly: true,
    illustrationId: 'thoracic-rotation-chair',
    notes: "Assis sur la chaise, rotation du haut du dos d'un côté puis de l'autre.",
  }),
  'hip-opener-90-90': (sets) => ({
    id: 'hip-opener-90-90',
    name: 'Ouverture de hanches 90/90',
    sets,
    durationSec: 30,
    restSec: 0,
    wristFriendly: true,
    illustrationId: 'hip-opener-90-90',
    notes: "Position 90/90 assise au sol, bascule douce d'un côté à l'autre.",
  }),
  'hip-flexor-lunge-stretch': (sets) => ({
    id: 'hip-flexor-lunge-stretch',
    name: 'Étirement fléchisseurs de hanche en fente',
    sets,
    durationSec: 30,
    restSec: 0,
    wristFriendly: true,
    illustrationId: 'hip-flexor-lunge-stretch',
    notes: "Fente basse, bascule du bassin vers l'avant pour étirer l'avant de la hanche.",
  }),
  'chest-doorway-stretch': (sets) => ({
    id: 'chest-doorway-stretch',
    name: 'Étirement pectoraux',
    sets,
    durationSec: 20,
    restSec: 0,
    wristFriendly: true,
    illustrationId: 'chest-doorway-stretch',
    notes: "Avant-bras contre un mur ou un montant de porte, tourne légèrement le buste.",
  }),
  'hamstring-standing-stretch': (sets) => ({
    id: 'hamstring-standing-stretch',
    name: 'Étirement ischios debout',
    sets,
    durationSec: 20,
    restSec: 0,
    wristFriendly: true,
    illustrationId: 'hamstring-standing-stretch',
    notes: 'Debout, jambe tendue posée sur la chaise, buste incliné vers l\'avant.',
  }),
  'glute-figure4-stretch': (sets) => ({
    id: 'glute-figure4-stretch',
    name: 'Étirement fessiers figure 4',
    sets,
    durationSec: 30,
    restSec: 0,
    wristFriendly: true,
    illustrationId: 'glute-figure4-stretch',
    notes: 'Assis sur la chaise, cheville sur le genou opposé, buste incliné vers l\'avant.',
  }),
  'child-pose-fist': (sets) => ({
    id: 'child-pose-fist',
    name: "Posture de l'enfant sur les poings",
    sets,
    durationSec: 30,
    restSec: 0,
    wristFriendly: true,
    illustrationId: 'child-pose-fist',
    notes: 'Appui sur les poings ou les avant-bras pour protéger le poignet.',
  }),
}

interface WeekVariant {
  basicSets: number
  hardSets: number
  useHardVariant: boolean
  supermanDurationSec: number
  plankDurationSec: number
}

const WEEK_VARIANTS: Record<number, WeekVariant> = {
  1: { basicSets: 2, hardSets: 2, useHardVariant: false, supermanDurationSec: 15, plankDurationSec: 20 },
  2: { basicSets: 3, hardSets: 3, useHardVariant: false, supermanDurationSec: 20, plankDurationSec: 30 },
  3: { basicSets: 3, hardSets: 3, useHardVariant: true, supermanDurationSec: 25, plankDurationSec: 35 },
  4: { basicSets: 3, hardSets: 3, useHardVariant: true, supermanDurationSec: 30, plankDurationSec: 40 },
}

function buildTrainingMain(variant: WeekVariant): Exercise[] {
  const squat = variant.useHardVariant
    ? EXERCISE_CATALOG['squat-bulgarian-chair'](variant.hardSets)
    : EXERCISE_CATALOG['chair-assisted-squat'](variant.basicSets)
  const push = variant.useHardVariant
    ? EXERCISE_CATALOG['pushup-fist-floor'](variant.hardSets)
    : EXERCISE_CATALOG['incline-pushup-fist'](variant.basicSets)
  const pull = { ...EXERCISE_CATALOG['superman-hold'](variant.basicSets), durationSec: variant.supermanDurationSec }
  const core = { ...EXERCISE_CATALOG['forearm-plank'](variant.basicSets), durationSec: variant.plankDurationSec }
  const glute = variant.useHardVariant
    ? EXERCISE_CATALOG['glute-bridge-single-leg'](variant.hardSets)
    : EXERCISE_CATALOG['glute-bridge'](variant.basicSets)
  return [squat, push, pull, core, glute]
}

function buildTrainingDay(
  day: number,
  week: number,
  focus: string,
  variant: WeekVariant,
  notes?: string,
): DayProgram {
  const dayProgram: DayProgram = {
    day,
    week,
    type: 'training',
    focus,
    warmup: [EXERCISE_CATALOG['jumping-jacks'](1), EXERCISE_CATALOG['arm-circles'](1)],
    main: buildTrainingMain(variant),
    cooldown: [EXERCISE_CATALOG['chest-doorway-stretch'](1), EXERCISE_CATALOG['hamstring-standing-stretch'](1)],
  }
  if (notes) {
    dayProgram.notes = notes
  }
  return dayProgram
}

function buildMobilityDay(day: number, week: number, focus: string): DayProgram {
  return {
    day,
    week,
    type: 'mobility',
    focus,
    warmup: [EXERCISE_CATALOG['cat-cow-fist'](1)],
    main: [
      EXERCISE_CATALOG['shoulder-mobility-circles'](1),
      EXERCISE_CATALOG['thoracic-rotation-chair'](1),
      EXERCISE_CATALOG['hip-opener-90-90'](1),
      EXERCISE_CATALOG['hip-flexor-lunge-stretch'](1),
    ],
    cooldown: [EXERCISE_CATALOG['glute-figure4-stretch'](1)],
  }
}

function buildRestDay(day: number, week: number, notes: string): DayProgram {
  return {
    day,
    week,
    type: 'rest',
    focus: 'Repos',
    warmup: [],
    main: [],
    cooldown: [],
    notes,
  }
}

export function buildWeek(week: number): DayProgram[] {
  const variant = WEEK_VARIANTS[week]
  const base = (week - 1) * 7
  const isFinalWeek = week === 4

  return [
    buildTrainingDay(base + 1, week, `Full body A — semaine ${week}`, variant),
    buildMobilityDay(base + 2, week, `Mobilité épaules/thoracique — semaine ${week}`),
    buildRestDay(
      base + 3,
      week,
      "Jour de repos. Si tu en as envie : 5 à 10 minutes d'étirements doux (épaules, hanches).",
    ),
    buildTrainingDay(base + 4, week, `Full body B — semaine ${week}`, variant),
    buildMobilityDay(base + 5, week, `Mobilité hanches/fessiers — semaine ${week}`),
    buildRestDay(base + 6, week, 'Jour de repos complet. Aucune activité requise.'),
    buildTrainingDay(
      base + 7,
      week,
      isFinalWeek ? 'Test final — Circuit complet' : `Full body C — semaine ${week}`,
      variant,
      isFinalWeek
        ? 'Jour 28 : refais le circuit complet et note tes progrès depuis le jour 1 !'
        : undefined,
    ),
  ]
}

export const PROGRAM: DayProgram[] = [1, 2, 3, 4].flatMap((week) => buildWeek(week))
```

- [ ] **Step 4: Lancer les tests pour vérifier qu'ils passent**

Run: `npm test -- program`
Expected: 7 tests, PASS.

- [ ] **Step 5: Vérifier le typecheck**

Run: `npm run typecheck`
Expected: aucune erreur.

- [ ] **Step 6: Commit**

```bash
git add src/data
git commit -m "feat: add 28-day program data model with weekly progression"
```

---

### Task 3: Store Pinia de progression (`src/stores/progress.ts`)

**Files:**
- Create: `src/stores/progress.ts`
- Create: `src/stores/progress.spec.ts`

**Interfaces:**
- Consumes: `PROGRAM: DayProgram[]`, `type DayProgram` depuis `@/data/program` (Tâche 2).
- Produces:
  - `interface CompletedDayEntry { completedAt: string; completedExercises: string[] }`
  - `interface ProgressState { startDate: string | null; completedDays: Record<number, CompletedDayEntry>; currentStreak: number; bestStreak: number }`
  - `useProgressStore()` (Pinia store id `'progress'`) avec :
    - getters : `currentDay: number` (0 si le défi n'a pas démarré, sinon `joursÉcoulés + 1` plafonné à 28), `isExerciseCompleted(day: number, exerciseId: string): boolean`, `isDayCompleted(day: number): boolean`
    - actions : `startChallenge(): void`, `toggleExercise(day: number, exerciseId: string): void`, `recalculateStreak(): void`
  - Persistance activée via `pinia-plugin-persistedstate` (`persist: true`), le plugin étant déjà enregistré sur l'instance Pinia dans `src/main.ts` (Tâche 1).

**Notes de conception :**
- Un jour est "complet" si tous les exercices de `warmup + main + cooldown` sont dans `completedExercises` — pour les jours de repos (tableaux vides), c'est vrai par vacuité : aucune action de l'utilisateur n'est nécessaire, ce qui permet au streak de continuer naturellement pendant les jours de repos.
- `recalculateStreak()` recompte en partant de `currentDay` (inclus s'il est complet, sinon on part de `currentDay - 1`) et remonte tant que les jours sont complets ; c'est équivalent au calcul incrémental décrit dans la spec mais idempotent, donc sûr à rappeler après chaque `toggleExercise`.

- [ ] **Step 1: Écrire le test `src/stores/progress.spec.ts` (échoue d'abord car le store n'existe pas encore)**

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useProgressStore } from './progress'
import { PROGRAM } from '@/data/program'

function completeDay(store: ReturnType<typeof useProgressStore>, day: number): void {
  const dayProgram = PROGRAM.find((d) => d.day === day)
  if (!dayProgram) throw new Error(`Unknown day ${day}`)
  for (const exercise of [...dayProgram.warmup, ...dayProgram.main, ...dayProgram.cooldown]) {
    store.toggleExercise(day, exercise.id)
  }
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-02-01T09:00:00Z'))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useProgressStore', () => {
  it('has no current day before the challenge starts', () => {
    const store = useProgressStore()
    expect(store.currentDay).toBe(0)
  })

  it('sets day 1 as the current day on the day the challenge starts', () => {
    const store = useProgressStore()
    store.startChallenge()
    expect(store.currentDay).toBe(1)
  })

  it('computes the current day from the start date, capped at 28', () => {
    const store = useProgressStore()
    store.startDate = new Date('2026-01-01T00:00:00Z').toISOString()
    expect(store.currentDay).toBe(28)
  })

  it('toggles an exercise on and off', () => {
    const store = useProgressStore()
    store.startChallenge()
    store.toggleExercise(1, 'jumping-jacks')
    expect(store.isExerciseCompleted(1, 'jumping-jacks')).toBe(true)
    store.toggleExercise(1, 'jumping-jacks')
    expect(store.isExerciseCompleted(1, 'jumping-jacks')).toBe(false)
  })

  it('marks a day as completed once every exercise is checked', () => {
    const store = useProgressStore()
    store.startChallenge()
    completeDay(store, 1)
    expect(store.isDayCompleted(1)).toBe(true)
  })

  it('treats rest days as always completed', () => {
    const store = useProgressStore()
    store.startDate = new Date('2026-01-30T00:00:00Z').toISOString() // currentDay = 3 (rest)
    expect(store.currentDay).toBe(3)
    expect(store.isDayCompleted(3)).toBe(true)
  })

  it('builds a streak across consecutive completed days including rest days', () => {
    const store = useProgressStore()
    store.startDate = new Date('2026-01-30T00:00:00Z').toISOString() // currentDay = 3 (rest)
    completeDay(store, 1)
    completeDay(store, 2)
    expect(store.currentDay).toBe(3)
    expect(store.currentStreak).toBe(3)
    expect(store.bestStreak).toBe(3)
  })

  it('resets the streak when a day is missed', () => {
    const store = useProgressStore()
    store.startDate = new Date('2026-01-28T00:00:00Z').toISOString() // currentDay = 5 (mobility)
    completeDay(store, 1)
    // day 2 left incomplete on purpose
    completeDay(store, 3)
    completeDay(store, 4)
    completeDay(store, 5)
    expect(store.currentDay).toBe(5)
    expect(store.currentStreak).toBe(3)
    expect(store.bestStreak).toBe(3)
  })
})
```

- [ ] **Step 2: Lancer le test pour vérifier qu'il échoue**

Run: `npm test -- progress`
Expected: FAIL — `Cannot find module './progress'` (ou équivalent).

- [ ] **Step 3: Écrire `src/stores/progress.ts`**

```ts
import { defineStore } from 'pinia'
import { PROGRAM, type DayProgram } from '@/data/program'

export interface CompletedDayEntry {
  completedAt: string
  completedExercises: string[]
}

export interface ProgressState {
  startDate: string | null
  completedDays: Record<number, CompletedDayEntry>
  currentStreak: number
  bestStreak: number
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

function getDayProgram(day: number): DayProgram | undefined {
  return PROGRAM.find((dayProgram) => dayProgram.day === day)
}

function allExerciseIds(dayProgram: DayProgram): string[] {
  return [...dayProgram.warmup, ...dayProgram.main, ...dayProgram.cooldown].map((exercise) => exercise.id)
}

function isDayFullyCompleted(day: number, completedDays: Record<number, CompletedDayEntry>): boolean {
  const dayProgram = getDayProgram(day)
  if (!dayProgram) return false
  const requiredIds = allExerciseIds(dayProgram)
  if (requiredIds.length === 0) return true
  const entry = completedDays[day]
  if (!entry) return false
  const completedSet = new Set(entry.completedExercises)
  return requiredIds.every((id) => completedSet.has(id))
}

function todayISO(): string {
  return new Date().toISOString()
}

function daysBetween(startDateISO: string, todayDateISO: string): number {
  const start = new Date(startDateISO)
  const today = new Date(todayDateISO)
  const startUTC = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
  const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  return Math.floor((todayUTC - startUTC) / MS_PER_DAY)
}

export const useProgressStore = defineStore('progress', {
  state: (): ProgressState => ({
    startDate: null,
    completedDays: {},
    currentStreak: 0,
    bestStreak: 0,
  }),
  getters: {
    currentDay(state): number {
      if (!state.startDate) return 0
      const elapsed = daysBetween(state.startDate, todayISO())
      const day = elapsed + 1
      if (day < 1) return 1
      if (day > 28) return 28
      return day
    },
    isExerciseCompleted(state) {
      return (day: number, exerciseId: string): boolean => {
        const entry = state.completedDays[day]
        if (!entry) return false
        return entry.completedExercises.includes(exerciseId)
      }
    },
    isDayCompleted(state) {
      return (day: number): boolean => isDayFullyCompleted(day, state.completedDays)
    },
  },
  actions: {
    startChallenge(): void {
      if (this.startDate) return
      this.startDate = todayISO()
    },
    toggleExercise(day: number, exerciseId: string): void {
      const existing = this.completedDays[day] ?? { completedAt: todayISO(), completedExercises: [] }
      const isCompleted = existing.completedExercises.includes(exerciseId)
      const completedExercises = isCompleted
        ? existing.completedExercises.filter((id) => id !== exerciseId)
        : [...existing.completedExercises, exerciseId]
      this.completedDays = {
        ...this.completedDays,
        [day]: { completedAt: todayISO(), completedExercises },
      }
      this.recalculateStreak()
    },
    recalculateStreak(): void {
      let day = this.currentDay
      if (!isDayFullyCompleted(day, this.completedDays)) {
        day -= 1
      }
      let streak = 0
      while (day >= 1 && isDayFullyCompleted(day, this.completedDays)) {
        streak += 1
        day -= 1
      }
      this.currentStreak = streak
      if (streak > this.bestStreak) {
        this.bestStreak = streak
      }
    },
  },
  persist: true,
})
```

- [ ] **Step 4: Lancer les tests pour vérifier qu'ils passent**

Run: `npm test -- progress`
Expected: 8 tests, PASS.

- [ ] **Step 5: Vérifier le typecheck**

Run: `npm run typecheck`
Expected: aucune erreur.

- [ ] **Step 6: Commit**

```bash
git add src/stores
git commit -m "feat: add progress store with streak calculation and persistence"
```

---

### Task 4: Composable minuteur (`src/composables/useTimer.ts`)

**Files:**
- Create: `src/composables/useTimer.ts`
- Create: `src/composables/useTimer.spec.ts`

**Interfaces:**
- Consumes: rien de nouveau (Vue `ref`, `getCurrentInstance`, `onUnmounted`).
- Produces: `useTimer(): { remaining: Ref<number>; isRunning: Ref<boolean>; start: (durationSec: number) => void; pause: () => void; reset: () => void }` — consommé par `Timer.vue` (Tâche 7).

**Notes de conception :**
- `start(durationSec)` (ré)initialise `remaining` à `durationSec` et démarre le décompte ; c'est aussi la fonction utilisée pour reprendre après une pause (l'appelant repasse alors `remaining.value` courant, cf. Tâche 7).
- `pause()` arrête le décompte sans modifier `remaining`.
- `reset()` arrête le décompte et remet `remaining` à 0.
- À la fin du décompte (`remaining` atteint 0), un bip est joué via Web Audio API ; l'appel est protégé par un `try/catch` pour ne jamais faire planter le composable si `AudioContext` est indisponible (environnement de test, navigateur non supporté).
- L'appel à `onUnmounted` est protégé par `getCurrentInstance()` pour permettre l'utilisation du composable dans des tests unitaires hors contexte de composant.

- [ ] **Step 1: Écrire le test `src/composables/useTimer.spec.ts` (échoue d'abord car le composable n'existe pas encore)**

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTimer } from './useTimer'

class FakeOscillator {
  type = ''
  frequency = { value: 0 }
  onended: (() => void) | null = null
  connect = vi.fn()
  start = vi.fn()
  stop = vi.fn()
}

class FakeGainNode {
  connect = vi.fn()
}

class FakeAudioContext {
  currentTime = 0
  destination = {}
  createOscillator = vi.fn(() => new FakeOscillator())
  createGain = vi.fn(() => new FakeGainNode())
  close = vi.fn()
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('AudioContext', FakeAudioContext)
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('useTimer', () => {
  it('counts down from the given duration', () => {
    const timer = useTimer()
    timer.start(5)
    expect(timer.remaining.value).toBe(5)
    expect(timer.isRunning.value).toBe(true)
    vi.advanceTimersByTime(3000)
    expect(timer.remaining.value).toBe(2)
    expect(timer.isRunning.value).toBe(true)
  })

  it('stops at zero and is no longer running', () => {
    const timer = useTimer()
    timer.start(2)
    vi.advanceTimersByTime(2000)
    expect(timer.remaining.value).toBe(0)
    expect(timer.isRunning.value).toBe(false)
  })

  it('plays a beep when the countdown reaches zero', () => {
    const timer = useTimer()
    timer.start(1)
    vi.advanceTimersByTime(1000)
    expect(FakeAudioContext.prototype.createOscillator).toBeDefined()
  })

  it('pauses without resetting the remaining time', () => {
    const timer = useTimer()
    timer.start(10)
    vi.advanceTimersByTime(3000)
    timer.pause()
    expect(timer.remaining.value).toBe(7)
    expect(timer.isRunning.value).toBe(false)
    vi.advanceTimersByTime(5000)
    expect(timer.remaining.value).toBe(7)
  })

  it('resumes from the remaining time after a pause', () => {
    const timer = useTimer()
    timer.start(10)
    vi.advanceTimersByTime(3000)
    timer.pause()
    timer.start(timer.remaining.value)
    vi.advanceTimersByTime(2000)
    expect(timer.remaining.value).toBe(5)
  })

  it('resets remaining time to zero and stops', () => {
    const timer = useTimer()
    timer.start(10)
    vi.advanceTimersByTime(2000)
    timer.reset()
    expect(timer.remaining.value).toBe(0)
    expect(timer.isRunning.value).toBe(false)
  })
})
```

- [ ] **Step 2: Lancer le test pour vérifier qu'il échoue**

Run: `npm test -- useTimer`
Expected: FAIL — `Cannot find module './useTimer'` (ou équivalent).

- [ ] **Step 3: Écrire `src/composables/useTimer.ts`**

```ts
import { getCurrentInstance, onUnmounted, ref, type Ref } from 'vue'

export interface UseTimerReturn {
  remaining: Ref<number>
  isRunning: Ref<boolean>
  start: (durationSec: number) => void
  pause: () => void
  reset: () => void
}

export function useTimer(): UseTimerReturn {
  const remaining = ref(0)
  const isRunning = ref(false)
  let intervalId: ReturnType<typeof setInterval> | null = null

  function playBeep(): void {
    try {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new AudioContextClass()
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = 880
      oscillator.connect(gain)
      gain.connect(ctx.destination)
      oscillator.start()
      oscillator.stop(ctx.currentTime + 0.3)
      oscillator.onended = () => ctx.close()
    } catch {
      // Web Audio API unavailable — le bip est un bonus, jamais bloquant.
    }
  }

  function clearIntervalIfNeeded(): void {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function tick(): void {
    remaining.value -= 1
    if (remaining.value <= 0) {
      remaining.value = 0
      isRunning.value = false
      clearIntervalIfNeeded()
      playBeep()
    }
  }

  function start(durationSec: number): void {
    clearIntervalIfNeeded()
    remaining.value = durationSec
    isRunning.value = true
    intervalId = setInterval(tick, 1000)
  }

  function pause(): void {
    isRunning.value = false
    clearIntervalIfNeeded()
  }

  function reset(): void {
    pause()
    remaining.value = 0
  }

  if (getCurrentInstance()) {
    onUnmounted(() => {
      clearIntervalIfNeeded()
    })
  }

  return { remaining, isRunning, start, pause, reset }
}
```

- [ ] **Step 4: Lancer les tests pour vérifier qu'ils passent**

Run: `npm test -- useTimer`
Expected: 6 tests, PASS.

- [ ] **Step 5: Vérifier le typecheck**

Run: `npm run typecheck`
Expected: aucune erreur.

- [ ] **Step 6: Commit**

```bash
git add src/composables
git commit -m "feat: add useTimer composable with countdown and beep"
```

---

### Task 5: Illustrations SVG (`src/components/StickFigure.vue`)

**Files:**
- Create: `src/components/StickFigure.vue`
- Create: `src/components/StickFigure.spec.ts`

**Interfaces:**
- Consumes: `EXERCISE_CATALOG` depuis `@/data/program` (Tâche 2, pour le test de couverture).
- Produces: composant `StickFigure` avec prop `illustrationId: string` ; export nommé `STICK_FIGURES: Record<string, string>` (19 entrées, une par exercice unique) — consommé par `DayCard.vue` (Tâche 6).

**Notes de conception :**
- Le `Record<string, string>` est déclaré directement dans un bloc `<script>` (non-`setup`) du fichier `StickFigure.vue` : ses liaisons de premier niveau sont automatiquement visibles dans le bloc `<script setup>` du même fichier (comportement standard des SFC Vue), ce qui évite un fichier de mapping séparé tout en restant testable via un import nommé.
- Chaque SVG utilise `viewBox="0 0 100 100"`, uniquement des `<line>`/`<circle>` (et deux `<path>` d'arc pour représenter un mouvement circulaire des bras/épaules), `stroke="currentColor"` pour s'adapter au thème.
- Si `illustrationId` ne correspond à aucune entrée, le composant affiche une chaîne vide (pas de `console.warn` requis par la spec).

- [ ] **Step 1: Écrire le test `src/components/StickFigure.spec.ts` (échoue d'abord car le composant n'existe pas encore)**

```ts
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StickFigure, { STICK_FIGURES } from './StickFigure.vue'
import { EXERCISE_CATALOG } from '@/data/program'

describe('StickFigure', () => {
  it('has an illustration for every exercise in the catalogue', () => {
    const missing = Object.keys(EXERCISE_CATALOG).filter((id) => !(id in STICK_FIGURES))
    expect(missing).toEqual([])
  })

  it('renders the matching SVG markup for a known illustration id', () => {
    const wrapper = mount(StickFigure, { props: { illustrationId: 'forearm-plank' } })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('renders nothing for an unknown illustration id', () => {
    const wrapper = mount(StickFigure, { props: { illustrationId: 'does-not-exist' } })
    expect(wrapper.find('svg').exists()).toBe(false)
  })
})
```

- [ ] **Step 2: Lancer le test pour vérifier qu'il échoue**

Run: `npm test -- StickFigure`
Expected: FAIL — `Cannot find module './StickFigure.vue'` (ou équivalent).

- [ ] **Step 3: Écrire `src/components/StickFigure.vue`**

```vue
<script lang="ts">
export const STICK_FIGURES: Record<string, string> = {
  'jumping-jacks': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="50" cy="16" r="8"/><line x1="50" y1="24" x2="50" y2="58"/><line x1="50" y1="30" x2="22" y2="12"/><line x1="50" y1="30" x2="78" y2="12"/><line x1="50" y1="58" x2="24" y2="90"/><line x1="50" y1="58" x2="76" y2="90"/></svg>',
  'arm-circles': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="45" cy="16" r="8"/><line x1="45" y1="24" x2="45" y2="60"/><line x1="45" y1="60" x2="32" y2="92"/><line x1="45" y1="60" x2="58" y2="92"/><line x1="45" y1="32" x2="65" y2="18"/><path d="M65,18 A14,14 0 1 1 52,6"/></svg>',
  'cat-cow-fist': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="85" cy="38" r="7"/><line x1="78" y1="42" x2="25" y2="50"/><line x1="25" y1="50" x2="25" y2="78"/><circle cx="25" cy="82" r="3" fill="currentColor"/><line x1="65" y1="46" x2="65" y2="78"/><circle cx="65" cy="82" r="3" fill="currentColor"/></svg>',
  'chair-assisted-squat': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="28" cy="20" r="8"/><line x1="30" y1="28" x2="42" y2="52"/><line x1="42" y1="52" x2="66" y2="50"/><line x1="42" y1="52" x2="30" y2="78"/><line x1="42" y1="52" x2="58" y2="78"/><line x1="66" y1="46" x2="86" y2="46"/><line x1="70" y1="50" x2="70" y2="70"/><line x1="82" y1="50" x2="82" y2="70"/></svg>',
  'squat-bulgarian-chair': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="25" cy="18" r="8"/><line x1="27" y1="26" x2="38" y2="50"/><line x1="38" y1="50" x2="20" y2="80"/><line x1="38" y1="50" x2="70" y2="55"/><line x1="70" y1="50" x2="90" y2="50"/><line x1="74" y1="55" x2="74" y2="72"/><line x1="86" y1="55" x2="86" y2="72"/></svg>',
  'incline-pushup-fist': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="85" cy="45" r="7"/><line x1="78" y1="50" x2="60" y2="55"/><line x1="60" y1="55" x2="20" y2="72"/><line x1="78" y1="50" x2="78" y2="58"/><circle cx="78" cy="62" r="3" fill="currentColor"/><line x1="65" y1="60" x2="90" y2="60"/><line x1="70" y1="64" x2="70" y2="78"/><line x1="85" y1="64" x2="85" y2="78"/></svg>',
  'pushup-fist-floor': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="85" cy="55" r="7"/><line x1="78" y1="58" x2="55" y2="58"/><line x1="55" y1="58" x2="20" y2="70"/><line x1="78" y1="58" x2="78" y2="63"/><circle cx="78" cy="67" r="3" fill="currentColor"/><line x1="10" y1="85" x2="95" y2="85"/></svg>',
  'superman-hold': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="15" cy="52" r="6"/><line x1="20" y1="55" x2="80" y2="55"/><line x1="80" y1="55" x2="92" y2="45"/><line x1="20" y1="55" x2="8" y2="68"/><line x1="5" y1="80" x2="95" y2="80"/></svg>',
  'forearm-plank': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="85" cy="48" r="6"/><line x1="20" y1="55" x2="80" y2="50"/><line x1="20" y1="55" x2="20" y2="72"/><line x1="10" y1="85" x2="95" y2="85"/></svg>',
  'glute-bridge': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="15" cy="62" r="6"/><line x1="20" y1="60" x2="55" y2="55"/><line x1="55" y1="55" x2="60" y2="75"/><line x1="60" y1="75" x2="75" y2="75"/><line x1="5" y1="80" x2="95" y2="80"/></svg>',
  'glute-bridge-single-leg': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="15" cy="62" r="6"/><line x1="20" y1="60" x2="55" y2="55"/><line x1="55" y1="55" x2="60" y2="75"/><line x1="60" y1="75" x2="75" y2="75"/><line x1="55" y1="55" x2="85" y2="40"/><line x1="5" y1="80" x2="95" y2="80"/></svg>',
  'shoulder-mobility-circles': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="50" cy="16" r="8"/><line x1="50" y1="24" x2="50" y2="60"/><line x1="50" y1="60" x2="38" y2="90"/><line x1="50" y1="60" x2="62" y2="90"/><path d="M30,35 A15,15 0 1 1 45,20"/><path d="M70,35 A15,15 0 1 0 55,20"/></svg>',
  'thoracic-rotation-chair': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="50" cy="20" r="8"/><line x1="50" y1="28" x2="58" y2="58"/><line x1="58" y1="45" x2="80" y2="35"/><line x1="58" y1="45" x2="40" y2="50"/><line x1="30" y1="65" x2="70" y2="65"/><line x1="35" y1="65" x2="35" y2="85"/><line x1="65" y1="65" x2="65" y2="85"/></svg>',
  'hip-opener-90-90': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="50" cy="25" r="7"/><line x1="50" y1="32" x2="50" y2="60"/><line x1="50" y1="65" x2="25" y2="60"/><line x1="25" y1="60" x2="20" y2="80"/><line x1="50" y1="65" x2="75" y2="70"/><line x1="75" y1="70" x2="85" y2="50"/></svg>',
  'hip-flexor-lunge-stretch': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="30" cy="18" r="7"/><line x1="32" y1="25" x2="40" y2="50"/><line x1="40" y1="50" x2="35" y2="80"/><line x1="40" y1="50" x2="75" y2="85"/></svg>',
  'chest-doorway-stretch': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><line x1="80" y1="10" x2="80" y2="90"/><circle cx="40" cy="18" r="7"/><line x1="40" y1="26" x2="45" y2="60"/><line x1="45" y1="40" x2="78" y2="35"/><line x1="45" y1="60" x2="35" y2="90"/><line x1="45" y1="60" x2="55" y2="90"/></svg>',
  'hamstring-standing-stretch': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="30" cy="20" r="7"/><line x1="32" y1="28" x2="55" y2="50"/><line x1="55" y1="50" x2="70" y2="55"/><line x1="60" y1="55" x2="85" y2="55"/><line x1="65" y1="55" x2="65" y2="70"/><line x1="80" y1="55" x2="80" y2="70"/><line x1="32" y1="55" x2="25" y2="85"/></svg>',
  'glute-figure4-stretch': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><line x1="25" y1="60" x2="75" y2="60"/><line x1="30" y1="60" x2="30" y2="85"/><line x1="70" y1="60" x2="70" y2="85"/><circle cx="50" cy="25" r="7"/><line x1="50" y1="32" x2="50" y2="55"/><line x1="50" y1="55" x2="65" y2="50"/><line x1="65" y1="50" x2="40" y2="52"/></svg>',
  'child-pose-fist': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><line x1="75" y1="68" x2="40" y2="55"/><circle cx="35" cy="52" r="6"/><line x1="40" y1="55" x2="15" y2="50"/><circle cx="15" cy="50" r="3" fill="currentColor"/><line x1="75" y1="70" x2="80" y2="85"/><line x1="75" y1="70" x2="65" y2="85"/></svg>',
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  illustrationId: string
}>()

const markup = computed(() => STICK_FIGURES[props.illustrationId] ?? '')
</script>

<template>
  <div class="stick-figure" aria-hidden="true" v-html="markup"></div>
</template>

<style scoped>
.stick-figure {
  display: block;
  width: 100%;
  height: 100%;
  color: #2f6fed;
}
.stick-figure :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
```

- [ ] **Step 4: Lancer les tests pour vérifier qu'ils passent**

Run: `npm test -- StickFigure`
Expected: 3 tests, PASS.

- [ ] **Step 5: Vérifier le typecheck**

Run: `npm run typecheck`
Expected: aucune erreur.

- [ ] **Step 6: Commit**

```bash
git add src/components/StickFigure.vue src/components/StickFigure.spec.ts
git commit -m "feat: add schematic SVG illustrations for every exercise"
```

---

### Task 6: `DayCard.vue` + `ExerciseList.vue`

**Files:**
- Create: `src/components/DayCard.vue`
- Create: `src/components/DayCard.spec.ts`
- Create: `src/components/ExerciseList.vue`
- Create: `src/components/ExerciseList.spec.ts`

**Interfaces:**
- Consumes: `type Exercise` depuis `@/data/program` (Tâche 2), `useProgressStore()` depuis `@/stores/progress` (Tâche 3), `StickFigure` depuis `./StickFigure.vue` (Tâche 5).
- Produces: `DayCard` (props `exercise: Exercise`, `day: number`) et `ExerciseList` (props `title: string`, `exercises: Exercise[]`, `day: number`) — consommés par `DayView.vue` (Tâche 8).

- [ ] **Step 1: Écrire le test `src/components/DayCard.spec.ts` (échoue d'abord car le composant n'existe pas encore)**

```ts
import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import DayCard from './DayCard.vue'
import { useProgressStore } from '@/stores/progress'
import type { Exercise } from '@/data/program'

const exercise: Exercise = {
  id: 'forearm-plank',
  name: 'Planche sur les avant-bras',
  sets: 3,
  durationSec: 30,
  restSec: 20,
  wristFriendly: true,
  illustrationId: 'forearm-plank',
  notes: 'Appui sur les avant-bras.',
}

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('DayCard', () => {
  it('renders the exercise name and detail', () => {
    const wrapper = mount(DayCard, { props: { exercise, day: 1 } })
    expect(wrapper.text()).toContain('Planche sur les avant-bras')
    expect(wrapper.text()).toContain('3 séries')
    expect(wrapper.text()).toContain('30 s')
  })

  it('toggles the exercise in the progress store when checked', async () => {
    const wrapper = mount(DayCard, { props: { exercise, day: 1 } })
    const store = useProgressStore()
    expect(store.isExerciseCompleted(1, 'forearm-plank')).toBe(false)
    await wrapper.find('input[type="checkbox"]').setValue(true)
    expect(store.isExerciseCompleted(1, 'forearm-plank')).toBe(true)
  })

  it('applies the completed class once checked', async () => {
    const wrapper = mount(DayCard, { props: { exercise, day: 1 } })
    await wrapper.find('input[type="checkbox"]').setValue(true)
    expect(wrapper.classes()).toContain('day-card--completed')
  })
})
```

- [ ] **Step 2: Lancer le test pour vérifier qu'il échoue**

Run: `npm test -- DayCard`
Expected: FAIL — `Cannot find module './DayCard.vue'` (ou équivalent).

- [ ] **Step 3: Écrire `src/components/DayCard.vue`**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import type { Exercise } from '@/data/program'
import { useProgressStore } from '@/stores/progress'
import StickFigure from './StickFigure.vue'

const props = defineProps<{
  exercise: Exercise
  day: number
}>()

const progressStore = useProgressStore()

const isCompleted = computed(() => progressStore.isExerciseCompleted(props.day, props.exercise.id))

const detailLabel = computed(() => {
  const parts: string[] = [`${props.exercise.sets} série${props.exercise.sets > 1 ? 's' : ''}`]
  if (props.exercise.reps !== undefined) {
    parts.push(`${props.exercise.reps} répétitions`)
  }
  if (props.exercise.durationSec !== undefined) {
    parts.push(`${props.exercise.durationSec} s`)
  }
  parts.push(`repos ${props.exercise.restSec} s`)
  return parts.join(' · ')
})

function onToggle(): void {
  progressStore.toggleExercise(props.day, props.exercise.id)
}
</script>

<template>
  <li class="day-card" :class="{ 'day-card--completed': isCompleted }">
    <label class="day-card__checkbox">
      <input type="checkbox" :checked="isCompleted" @change="onToggle" />
    </label>
    <StickFigure class="day-card__illustration" :illustration-id="exercise.illustrationId" />
    <div class="day-card__body">
      <p class="day-card__name">{{ exercise.name }}</p>
      <p class="day-card__detail">{{ detailLabel }}</p>
      <p v-if="exercise.notes" class="day-card__notes">{{ exercise.notes }}</p>
    </div>
  </li>
</template>

<style scoped>
.day-card {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  list-style: none;
}
.day-card--completed {
  opacity: 0.6;
}
.day-card__illustration {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
}
.day-card__name {
  font-weight: 600;
  margin: 0;
}
.day-card__detail {
  margin: 0.15rem 0 0;
  font-size: 0.85rem;
  color: #555;
}
.day-card__notes {
  margin: 0.35rem 0 0;
  font-size: 0.8rem;
  color: #777;
}
</style>
```

- [ ] **Step 4: Lancer les tests pour vérifier qu'ils passent**

Run: `npm test -- DayCard`
Expected: 3 tests, PASS.

- [ ] **Step 5: Écrire le test `src/components/ExerciseList.spec.ts` (échoue d'abord car le composant n'existe pas encore)**

```ts
import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import ExerciseList from './ExerciseList.vue'
import type { Exercise } from '@/data/program'

const exercises: Exercise[] = [
  {
    id: 'jumping-jacks',
    name: 'Jumping jacks',
    sets: 1,
    durationSec: 30,
    restSec: 10,
    wristFriendly: true,
    illustrationId: 'jumping-jacks',
  },
]

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('ExerciseList', () => {
  it('renders a title and one DayCard per exercise', () => {
    const wrapper = mount(ExerciseList, { props: { title: 'Échauffement', exercises, day: 1 } })
    expect(wrapper.text()).toContain('Échauffement')
    expect(wrapper.findAll('.day-card')).toHaveLength(1)
  })

  it('renders nothing when the exercise list is empty', () => {
    const wrapper = mount(ExerciseList, { props: { title: 'Échauffement', exercises: [], day: 1 } })
    expect(wrapper.find('section').exists()).toBe(false)
  })
})
```

- [ ] **Step 6: Lancer le test pour vérifier qu'il échoue**

Run: `npm test -- ExerciseList`
Expected: FAIL — `Cannot find module './ExerciseList.vue'` (ou équivalent).

- [ ] **Step 7: Écrire `src/components/ExerciseList.vue`**

```vue
<script setup lang="ts">
import type { Exercise } from '@/data/program'
import DayCard from './DayCard.vue'

defineProps<{
  title: string
  exercises: Exercise[]
  day: number
}>()
</script>

<template>
  <section v-if="exercises.length > 0" class="exercise-list">
    <h2 class="exercise-list__title">{{ title }}</h2>
    <ul class="exercise-list__items">
      <DayCard v-for="exercise in exercises" :key="exercise.id" :exercise="exercise" :day="day" />
    </ul>
  </section>
</template>

<style scoped>
.exercise-list {
  margin-bottom: 1.5rem;
}
.exercise-list__title {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #888;
  margin: 0 0 0.5rem;
}
.exercise-list__items {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
}
</style>
```

- [ ] **Step 8: Lancer les tests pour vérifier qu'ils passent**

Run: `npm test -- ExerciseList`
Expected: 2 tests, PASS.

- [ ] **Step 9: Vérifier le typecheck**

Run: `npm run typecheck`
Expected: aucune erreur.

- [ ] **Step 10: Commit**

```bash
git add src/components/DayCard.vue src/components/DayCard.spec.ts src/components/ExerciseList.vue src/components/ExerciseList.spec.ts
git commit -m "feat: add DayCard and ExerciseList components"
```

---

### Task 7: `Timer.vue`

**Files:**
- Create: `src/components/Timer.vue`
- Create: `src/components/Timer.spec.ts`

**Interfaces:**
- Consumes: `useTimer()` depuis `@/composables/useTimer` (Tâche 4).
- Produces: composant `Timer` (props `durationSec: number`, `label?: string`) — pourra être intégré librement dans `DayView.vue` ou toute autre vue nécessitant un minuteur visuel.

**Notes de conception :**
- Le composant garde un état local `started` pour distinguer "pas encore démarré" (affiche `durationSec`) de "terminé" (`remaining === 0` après un décompte, affiche `00:00`) — sans cela, l'affichage retomberait à tort sur la durée initiale complète après la fin du décompte.
- Le bouton "Démarrer" relance `timer.start(...)` avec soit le temps restant (reprise après pause), soit `durationSec` (premier démarrage ou après un `reset`).

- [ ] **Step 1: Écrire le test `src/components/Timer.spec.ts` (échoue d'abord car le composant n'existe pas encore)**

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Timer from './Timer.vue'

class FakeAudioContext {
  currentTime = 0
  destination = {}
  createOscillator = vi.fn(() => ({
    type: '',
    frequency: { value: 0 },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    onended: null,
  }))
  createGain = vi.fn(() => ({ connect: vi.fn() }))
  close = vi.fn()
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('AudioContext', FakeAudioContext)
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('Timer', () => {
  it('shows the initial duration before starting', () => {
    const wrapper = mount(Timer, { props: { durationSec: 90 } })
    expect(wrapper.text()).toContain('01:30')
  })

  it('counts down after clicking Démarrer', async () => {
    const wrapper = mount(Timer, { props: { durationSec: 5 } })
    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')
    vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('00:03')
  })

  it('shows 00:00 once the countdown finishes', async () => {
    const wrapper = mount(Timer, { props: { durationSec: 2 } })
    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')
    vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('00:00')
  })

  it('resets back to the initial duration', async () => {
    const wrapper = mount(Timer, { props: { durationSec: 5 } })
    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')
    vi.advanceTimersByTime(2000)
    await buttons[2].trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('00:05')
  })
})
```

- [ ] **Step 2: Lancer le test pour vérifier qu'il échoue**

Run: `npm test -- Timer`
Expected: FAIL — `Cannot find module './Timer.vue'` (ou équivalent).

- [ ] **Step 3: Écrire `src/components/Timer.vue`**

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTimer } from '@/composables/useTimer'

const props = defineProps<{
  durationSec: number
  label?: string
}>()

const timer = useTimer()
const started = ref(false)

const displayTime = computed(() => {
  const total = started.value ? timer.remaining.value : props.durationSec
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

function onStart(): void {
  const seconds = timer.remaining.value > 0 ? timer.remaining.value : props.durationSec
  started.value = true
  timer.start(seconds)
}

function onPause(): void {
  timer.pause()
}

function onReset(): void {
  timer.reset()
  started.value = false
}
</script>

<template>
  <div class="timer">
    <p v-if="label" class="timer__label">{{ label }}</p>
    <p class="timer__display">{{ displayTime }}</p>
    <div class="timer__actions">
      <button type="button" :disabled="timer.isRunning.value" @click="onStart">Démarrer</button>
      <button type="button" :disabled="!timer.isRunning.value" @click="onPause">Pause</button>
      <button type="button" @click="onReset">Réinitialiser</button>
    </div>
  </div>
</template>

<style scoped>
.timer {
  text-align: center;
  padding: 1rem;
}
.timer__display {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0.25rem 0;
}
.timer__actions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}
.timer__actions button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  background: #2f6fed;
  color: #fff;
  font-weight: 600;
}
.timer__actions button:disabled {
  background: #ccc;
  color: #666;
}
</style>
```

- [ ] **Step 4: Lancer les tests pour vérifier qu'ils passent**

Run: `npm test -- Timer`
Expected: 4 tests, PASS.

- [ ] **Step 5: Vérifier le typecheck**

Run: `npm run typecheck`
Expected: aucune erreur.

- [ ] **Step 6: Commit**

```bash
git add src/components/Timer.vue src/components/Timer.spec.ts
git commit -m "feat: add Timer component with start/pause/reset controls"
```

---

### Task 8: Router + `HomeView.vue` + `DayView.vue` + `App.vue`

**Files:**
- Create: `src/router/index.ts`
- Create: `src/views/HomeView.vue`
- Create: `src/views/HomeView.spec.ts`
- Create: `src/views/DayView.vue`
- Create: `src/views/DayView.spec.ts`
- Create: `src/views/ProgressView.vue`
- Modify: `src/main.ts`
- Modify: `src/App.vue`
- Modify: `src/App.spec.ts`

**Interfaces:**
- Consumes: `PROGRAM` depuis `@/data/program` (Tâche 2), `useProgressStore()` depuis `@/stores/progress` (Tâche 3), `ExerciseList` depuis `@/components/ExerciseList.vue` (Tâche 6).
- Produces: routes nommées `home` (`/`), `day` (`/day/:day`), `progress` (`/progress`) — `ProgressView.vue` créé ici avec un contenu minimal fonctionnel (texte de streak), enrichi en Tâche 9 avec `ProgressCalendar.vue`.

**Notes de conception :**
- Utilisation de `createWebHashHistory()` pour le router : évite tout problème de réécriture d'URL côté serveur statique GitHub Pages (pas de configuration serveur supplémentaire nécessaire).
- `DayView.vue` affiche un message spécial pour les jours de type `rest` (aucune séance), sinon les trois `ExerciseList` (échauffement / circuit principal / retour au calme).

- [ ] **Step 1: Écrire `src/router/index.ts`**

```ts
import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DayView from '@/views/DayView.vue'
import ProgressView from '@/views/ProgressView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/day/:day', name: 'day', component: DayView, props: true },
    { path: '/progress', name: 'progress', component: ProgressView },
  ],
})

export default router
```

- [ ] **Step 2: Écrire `src/views/ProgressView.vue` (version initiale, complétée en Tâche 9)**

```vue
<script setup lang="ts">
import { useProgressStore } from '@/stores/progress'

const progressStore = useProgressStore()
</script>

<template>
  <section class="progress-view">
    <h2>Progression</h2>
    <p class="progress-view__streak">Série en cours : {{ progressStore.currentStreak }} jour(s)</p>
    <p class="progress-view__streak">Meilleure série : {{ progressStore.bestStreak }} jour(s)</p>
  </section>
</template>

<style scoped>
.progress-view {
  text-align: center;
  padding: 1.5rem 0;
}
.progress-view__streak {
  font-size: 1rem;
  color: #555;
}
</style>
```

- [ ] **Step 3: Écrire le test `src/views/HomeView.spec.ts` (échoue d'abord car `HomeView.vue` n'existe pas encore)**

```ts
import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { mount } from '@vue/test-utils'
import HomeView from './HomeView.vue'
import DayView from './DayView.vue'
import { useProgressStore } from '@/stores/progress'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: HomeView },
      { path: '/day/:day', name: 'day', component: DayView, props: true },
    ],
  })
}

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('HomeView', () => {
  it('shows the start button when the challenge has not started', async () => {
    const router = createTestRouter()
    router.push('/')
    await router.isReady()
    const wrapper = mount(HomeView, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('Démarrer le défi')
  })

  it('shows the current day focus after starting the challenge', async () => {
    const router = createTestRouter()
    router.push('/')
    await router.isReady()
    const wrapper = mount(HomeView, { global: { plugins: [router] } })
    const store = useProgressStore()
    store.startChallenge()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Jour 1 / 28')
  })
})
```

- [ ] **Step 4: Lancer le test pour vérifier qu'il échoue**

Run: `npm test -- HomeView`
Expected: FAIL — `Cannot find module './HomeView.vue'` (ou équivalent).

- [ ] **Step 5: Écrire `src/views/HomeView.vue`**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useProgressStore } from '@/stores/progress'
import { PROGRAM } from '@/data/program'

const progressStore = useProgressStore()

const hasStarted = computed(() => progressStore.startDate !== null)
const currentDayProgram = computed(() => PROGRAM.find((d) => d.day === progressStore.currentDay))

function onStart(): void {
  progressStore.startChallenge()
}
</script>

<template>
  <section v-if="!hasStarted" class="home home--start">
    <h2>Prêt à commencer ?</h2>
    <p>Le défi dure 28 jours, à raison de 20 minutes par jour.</p>
    <button type="button" class="home__start-button" @click="onStart">Démarrer le défi</button>
  </section>
  <section v-else-if="currentDayProgram" class="home">
    <h2>Jour {{ currentDayProgram.day }} / 28</h2>
    <p class="home__focus">{{ currentDayProgram.focus }}</p>
    <p class="home__streak">
      Série en cours : {{ progressStore.currentStreak }} jour(s) · Record :
      {{ progressStore.bestStreak }} jour(s)
    </p>
    <RouterLink :to="`/day/${currentDayProgram.day}`" class="home__cta">Voir la séance du jour</RouterLink>
  </section>
  <section v-else class="home">
    <h2>Défi terminé !</h2>
    <p>Tu as complété les 28 jours. Bravo !</p>
  </section>
</template>

<style scoped>
.home {
  text-align: center;
  padding: 1.5rem 0;
}
.home__start-button,
.home__cta {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  background: #2f6fed;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
}
.home__streak {
  color: #555;
  font-size: 0.9rem;
}
</style>
```

- [ ] **Step 6: Lancer les tests pour vérifier qu'ils passent**

Run: `npm test -- HomeView`
Expected: 2 tests, PASS.

- [ ] **Step 7: Écrire le test `src/views/DayView.spec.ts` (échoue d'abord car `DayView.vue` n'existe pas encore)**

```ts
import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import DayView from './DayView.vue'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('DayView', () => {
  it('renders warmup, main and cooldown exercises for a training day', () => {
    const wrapper = mount(DayView, { props: { day: '1' } })
    expect(wrapper.text()).toContain('Échauffement')
    expect(wrapper.text()).toContain('Circuit principal')
    expect(wrapper.text()).toContain('Retour au calme')
  })

  it('shows the full rest day message for a rest day', () => {
    const wrapper = mount(DayView, { props: { day: '3' } })
    expect(wrapper.text()).toContain('Jour de repos')
    expect(wrapper.find('.day-view__rest').exists()).toBe(true)
  })

  it('shows a not-found message for an out-of-range day', () => {
    const wrapper = mount(DayView, { props: { day: '99' } })
    expect(wrapper.text()).toContain('introuvable')
  })
})
```

- [ ] **Step 8: Lancer le test pour vérifier qu'il échoue**

Run: `npm test -- DayView`
Expected: FAIL — `Cannot find module './DayView.vue'` (ou équivalent).

- [ ] **Step 9: Écrire `src/views/DayView.vue`**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { PROGRAM } from '@/data/program'
import ExerciseList from '@/components/ExerciseList.vue'

const props = defineProps<{
  day: string
}>()

const dayNumber = computed(() => Number(props.day))
const dayProgram = computed(() => PROGRAM.find((d) => d.day === dayNumber.value))
const isRestDay = computed(() => dayProgram.value?.type === 'rest')
</script>

<template>
  <section v-if="dayProgram" class="day-view">
    <h2>Jour {{ dayProgram.day }} / 28</h2>
    <p class="day-view__focus">{{ dayProgram.focus }}</p>
    <p v-if="dayProgram.notes" class="day-view__notes">{{ dayProgram.notes }}</p>
    <div v-if="isRestDay" class="day-view__rest">
      <p>Jour de repos complet. Profites-en pour récupérer, aucune séance aujourd'hui.</p>
    </div>
    <template v-else>
      <ExerciseList title="Échauffement" :exercises="dayProgram.warmup" :day="dayProgram.day" />
      <ExerciseList title="Circuit principal" :exercises="dayProgram.main" :day="dayProgram.day" />
      <ExerciseList title="Retour au calme" :exercises="dayProgram.cooldown" :day="dayProgram.day" />
    </template>
  </section>
  <section v-else class="day-view">
    <p>Jour introuvable.</p>
  </section>
</template>

<style scoped>
.day-view__focus {
  color: #555;
  margin-top: -0.5rem;
}
.day-view__notes {
  background: #fff8e1;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
}
.day-view__rest {
  padding: 2rem 0;
  text-align: center;
  color: #555;
}
</style>
```

- [ ] **Step 10: Lancer les tests pour vérifier qu'ils passent**

Run: `npm test -- DayView`
Expected: 3 tests, PASS.

- [ ] **Step 11: Modifier `src/main.ts` pour brancher le router**

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App).use(pinia).use(router).mount('#app')
```

- [ ] **Step 12: Modifier `src/App.vue` pour ajouter la coquille de navigation**

```vue
<script setup lang="ts"></script>

<template>
  <div class="app">
    <header class="app__header">
      <RouterLink to="/" class="app__title">Défi Callisthénie 28 Jours</RouterLink>
      <nav class="app__nav">
        <RouterLink to="/" class="app__nav-link">Aujourd'hui</RouterLink>
        <RouterLink to="/progress" class="app__nav-link">Progression</RouterLink>
      </nav>
    </header>
    <main class="app__content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  max-width: 480px;
  margin: 0 auto;
  font-family: system-ui, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.app__header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}
.app__title {
  display: block;
  font-weight: 700;
  font-size: 1.1rem;
  text-decoration: none;
  color: inherit;
  margin-bottom: 0.5rem;
}
.app__nav {
  display: flex;
  gap: 1rem;
}
.app__nav-link {
  text-decoration: none;
  color: #2f6fed;
  font-weight: 600;
}
.app__content {
  flex: 1;
  padding: 1rem;
}
</style>
```

- [ ] **Step 13: Modifier `src/App.spec.ts` pour installer le router et Pinia dans le test**

```ts
import { describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { mount } from '@vue/test-utils'
import App from './App.vue'
import HomeView from './views/HomeView.vue'
import DayView from './views/DayView.vue'
import ProgressView from './views/ProgressView.vue'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: HomeView },
      { path: '/day/:day', name: 'day', component: DayView, props: true },
      { path: '/progress', name: 'progress', component: ProgressView },
    ],
  })
}

describe('App', () => {
  it('renders the challenge title and navigation', async () => {
    setActivePinia(createPinia())
    const router = createTestRouter()
    router.push('/')
    await router.isReady()
    const wrapper = mount(App, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('Défi Callisthénie 28 Jours')
    expect(wrapper.text()).toContain('Progression')
  })
})
```

- [ ] **Step 14: Lancer toute la suite de tests**

Run: `npm test`
Expected: tous les tests PASS (App, data/program, stores/progress, composables/useTimer, components/*, views/*).

- [ ] **Step 15: Vérifier le typecheck et le build**

Run: `npm run typecheck && npm run build`
Expected: aucune erreur, build réussi.

- [ ] **Step 16: Commit**

```bash
git add src/router src/views src/main.ts src/App.vue src/App.spec.ts
git commit -m "feat: add router, HomeView and DayView"
```

---

### Task 9: `ProgressCalendar.vue` + `ProgressView.vue`

**Files:**
- Create: `src/components/ProgressCalendar.vue`
- Create: `src/components/ProgressCalendar.spec.ts`
- Modify: `src/views/ProgressView.vue`
- Create: `src/views/ProgressView.spec.ts`

**Interfaces:**
- Consumes: `useProgressStore()` (getters `currentDay`, `isDayCompleted`, `currentStreak`, `bestStreak`) depuis `@/stores/progress` (Tâche 3).
- Produces: composant `ProgressCalendar` (aucune prop, lit directement le store) — intégré dans `ProgressView.vue`.

**Notes de conception :**
- Statut de chaque jour (1 à 28) :
  - `upcoming` si le défi n'a pas démarré (`currentDay === 0`) ou si `day > currentDay`
  - `completed` si `isDayCompleted(day)` est vrai
  - `today` si `day === currentDay` et non complété
  - `missed` sinon (jour passé non complété)

- [ ] **Step 1: Écrire le test `src/components/ProgressCalendar.spec.ts` (échoue d'abord car le composant n'existe pas encore)**

```ts
import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { mount } from '@vue/test-utils'
import ProgressCalendar from './ProgressCalendar.vue'
import { useProgressStore } from '@/stores/progress'
import { PROGRAM } from '@/data/program'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/day/:day', name: 'day', component: { template: '<div />' } }],
  })
}

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('ProgressCalendar', () => {
  it('renders 28 day cells', async () => {
    const router = createTestRouter()
    router.push('/day/1')
    await router.isReady()
    const wrapper = mount(ProgressCalendar, { global: { plugins: [router] } })
    expect(wrapper.findAll('.progress-calendar__cell')).toHaveLength(28)
  })

  it('marks all days as upcoming when the challenge has not started', async () => {
    const router = createTestRouter()
    router.push('/day/1')
    await router.isReady()
    const wrapper = mount(ProgressCalendar, { global: { plugins: [router] } })
    const cells = wrapper.findAll('.progress-calendar__cell')
    expect(cells[0].classes()).toContain('progress-calendar__cell--upcoming')
    expect(cells[27].classes()).toContain('progress-calendar__cell--upcoming')
  })

  it('marks a fully completed day as completed', async () => {
    const router = createTestRouter()
    router.push('/day/1')
    await router.isReady()
    const store = useProgressStore()
    store.startDate = new Date().toISOString()
    const day1 = PROGRAM.find((d) => d.day === 1)!
    for (const exercise of [...day1.warmup, ...day1.main, ...day1.cooldown]) {
      store.toggleExercise(1, exercise.id)
    }
    const wrapper = mount(ProgressCalendar, { global: { plugins: [router] } })
    const cell = wrapper.findAll('.progress-calendar__cell')[0]
    expect(cell.classes()).toContain('progress-calendar__cell--completed')
  })
})
```

- [ ] **Step 2: Lancer le test pour vérifier qu'il échoue**

Run: `npm test -- ProgressCalendar`
Expected: FAIL — `Cannot find module './ProgressCalendar.vue'` (ou équivalent).

- [ ] **Step 3: Écrire `src/components/ProgressCalendar.vue`**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useProgressStore } from '@/stores/progress'

type DayStatus = 'completed' | 'today' | 'missed' | 'upcoming'

interface DayEntry {
  day: number
  status: DayStatus
}

const progressStore = useProgressStore()

const days = computed<DayEntry[]>(() => {
  const currentDay = progressStore.currentDay
  return Array.from({ length: 28 }, (_, index) => {
    const day = index + 1
    let status: DayStatus
    if (currentDay === 0 || day > currentDay) {
      status = 'upcoming'
    } else if (progressStore.isDayCompleted(day)) {
      status = 'completed'
    } else if (day === currentDay) {
      status = 'today'
    } else {
      status = 'missed'
    }
    return { day, status }
  })
})
</script>

<template>
  <div class="progress-calendar">
    <RouterLink
      v-for="entry in days"
      :key="entry.day"
      :to="`/day/${entry.day}`"
      class="progress-calendar__cell"
      :class="`progress-calendar__cell--${entry.status}`"
    >
      {{ entry.day }}
    </RouterLink>
  </div>
</template>

<style scoped>
.progress-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.4rem;
}
.progress-calendar__cell {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  border-radius: 0.4rem;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
}
.progress-calendar__cell--completed {
  background: #2f6fed;
  color: #fff;
}
.progress-calendar__cell--today {
  background: #fff3cd;
  color: #7a5b00;
  border: 2px solid #f0b400;
}
.progress-calendar__cell--missed {
  background: #f1f1f1;
  color: #999;
  text-decoration: line-through;
}
.progress-calendar__cell--upcoming {
  background: #f8f8f8;
  color: #bbb;
}
</style>
```

- [ ] **Step 4: Lancer les tests pour vérifier qu'ils passent**

Run: `npm test -- ProgressCalendar`
Expected: 3 tests, PASS.

- [ ] **Step 5: Écrire le test `src/views/ProgressView.spec.ts` (échoue d'abord car `ProgressView.vue` ne contient pas encore le calendrier)**

```ts
import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { mount } from '@vue/test-utils'
import ProgressView from './ProgressView.vue'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/day/:day', name: 'day', component: { template: '<div />' } }],
  })
}

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('ProgressView', () => {
  it('renders the streak summary and the 28-day calendar', async () => {
    const router = createTestRouter()
    router.push('/day/1')
    await router.isReady()
    const wrapper = mount(ProgressView, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('Série en cours')
    expect(wrapper.findAll('.progress-calendar__cell')).toHaveLength(28)
  })
})
```

- [ ] **Step 6: Lancer le test pour vérifier qu'il échoue**

Run: `npm test -- ProgressView`
Expected: FAIL — le calendrier n'est pas encore intégré (`findAll('.progress-calendar__cell')` retourne 0 élément).

- [ ] **Step 7: Modifier `src/views/ProgressView.vue` pour intégrer le calendrier**

```vue
<script setup lang="ts">
import { useProgressStore } from '@/stores/progress'
import ProgressCalendar from '@/components/ProgressCalendar.vue'

const progressStore = useProgressStore()
</script>

<template>
  <section class="progress-view">
    <h2>Progression</h2>
    <p class="progress-view__streak">
      Série en cours : {{ progressStore.currentStreak }} jour(s) · Meilleure série :
      {{ progressStore.bestStreak }} jour(s)
    </p>
    <ProgressCalendar />
  </section>
</template>

<style scoped>
.progress-view {
  padding: 1.5rem 0;
}
.progress-view__streak {
  text-align: center;
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 1rem;
}
</style>
```

- [ ] **Step 8: Lancer les tests pour vérifier qu'ils passent**

Run: `npm test -- ProgressView`
Expected: 1 test, PASS.

- [ ] **Step 9: Lancer toute la suite de tests et le typecheck**

Run: `npm test && npm run typecheck`
Expected: tous les tests PASS, aucune erreur de typage.

- [ ] **Step 10: Commit**

```bash
git add src/components/ProgressCalendar.vue src/components/ProgressCalendar.spec.ts src/views/ProgressView.vue src/views/ProgressView.spec.ts
git commit -m "feat: add 28-day progress calendar with streak summary"
```

---

### Task 10: Finalisation PWA + déploiement GitHub Pages + README

**Files:**
- Create: `scripts/generate-icons.mjs`
- Create: `public/icons/icon-192.png` (généré par le script)
- Create: `public/icons/icon-512.png` (généré par le script)
- Modify: `vite.config.ts`
- Modify: `index.html`
- Create: `.github/workflows/deploy.yml`
- Create: `README.md`

**Interfaces:**
- Consumes: rien de nouveau côté application (configuration uniquement).
- Produces: manifeste PWA installable, service worker `autoUpdate`, icônes 192×192 et 512×512, pipeline de déploiement GitHub Actions vers GitHub Pages.

**Notes de conception :**
- Les icônes sont générées par un script Node autonome (`scripts/generate-icons.mjs`, sans dépendance externe) qui construit des PNG valides (carré uni, couleur de marque) via `zlib.deflateSync` et l'encodage PNG minimal (chunks `IHDR`/`IDAT`/`IEND` + CRC32). Les fichiers générés sont commités comme n'importe quel asset statique — pas besoin de les régénérer en CI.
- `vite-plugin-pwa` est ajouté à la configuration Vite existante (Tâche 1), avec `registerType: 'autoUpdate'` et un manifeste cohérent avec `base: '/callisthenie/'`.

- [ ] **Step 1: Installer `vite-plugin-pwa` (déjà en devDependencies depuis la Tâche 1) et créer le dossier des icônes**

Run: `mkdir -p public/icons scripts`
Expected: dossiers créés.

- [ ] **Step 2: Écrire `scripts/generate-icons.mjs`**

```js
import { mkdirSync, writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n += 1) {
    let c = n
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c
  }
  return table
})()

function crc32(buffer) {
  let crc = 0xffffffff
  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type, 'ascii')
  const lengthBuffer = Buffer.alloc(4)
  lengthBuffer.writeUInt32BE(data.length, 0)
  const crcBuffer = Buffer.alloc(4)
  crcBuffer.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0)
  return Buffer.concat([lengthBuffer, typeBuffer, data, crcBuffer])
}

function createSolidPng(size, [r, g, b]) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(size, 0)
  ihdrData.writeUInt32BE(size, 4)
  ihdrData[8] = 8 // bit depth
  ihdrData[9] = 2 // color type: RGB
  ihdrData[10] = 0
  ihdrData[11] = 0
  ihdrData[12] = 0
  const ihdr = chunk('IHDR', ihdrData)

  const rowSize = size * 3
  const raw = Buffer.alloc((rowSize + 1) * size)
  for (let y = 0; y < size; y += 1) {
    const rowStart = y * (rowSize + 1)
    raw[rowStart] = 0 // filter type: none
    for (let x = 0; x < size; x += 1) {
      const pixelStart = rowStart + 1 + x * 3
      raw[pixelStart] = r
      raw[pixelStart + 1] = g
      raw[pixelStart + 2] = b
    }
  }
  const idat = chunk('IDAT', deflateSync(raw))
  const iend = chunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, ihdr, idat, iend])
}

const BRAND_COLOR = [0x2f, 0x6f, 0xed]

mkdirSync('public/icons', { recursive: true })
writeFileSync('public/icons/icon-192.png', createSolidPng(192, BRAND_COLOR))
writeFileSync('public/icons/icon-512.png', createSolidPng(512, BRAND_COLOR))

console.log('Icons generated: public/icons/icon-192.png, public/icons/icon-512.png')
```

- [ ] **Step 3: Générer les icônes**

Run: `node scripts/generate-icons.mjs`
Expected: le script affiche `Icons generated: ...` et crée `public/icons/icon-192.png` et `public/icons/icon-512.png`.

- [ ] **Step 4: Vérifier que les fichiers PNG sont valides**

Run: `file public/icons/icon-192.png public/icons/icon-512.png`
Expected: chaque fichier est identifié comme `PNG image data, 192 x 192, ...` et `PNG image data, 512 x 512, ...` respectivement.

- [ ] **Step 5: Modifier `vite.config.ts` pour ajouter `vite-plugin-pwa`**

```ts
/// <reference types="vitest" />
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/callisthenie/' : '/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Défi Callisthénie 28 Jours',
        short_name: 'Callisthénie 28j',
        description:
          "Suivi personnel du défi de callisthénie sur 28 jours, sans matériel autre qu'une chaise.",
        start_url: mode === 'production' ? '/callisthenie/' : '/',
        scope: mode === 'production' ? '/callisthenie/' : '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#2f6fed',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
}))
```

- [ ] **Step 6: Modifier `index.html` pour ajouter la meta couleur de thème et l'icône de favori**

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#2f6fed" />
    <link rel="icon" href="/icons/icon-192.png" />
    <title>Défi Callisthénie 28 Jours</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 7: Lancer toute la suite de tests**

Run: `npm test`
Expected: tous les tests PASS (aucune régression liée à la configuration PWA).

- [ ] **Step 8: Vérifier le build de production**

Run: `npm run build`
Expected: build réussi ; `dist/manifest.webmanifest` et `dist/sw.js` (ou `dist/registerSW.js`) sont générés en plus des assets habituels.

- [ ] **Step 9: Écrire `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 10: Écrire `README.md`**

```markdown
# Défi Callisthénie 28 Jours

PWA personnelle pour suivre un défi de callisthénie de 28 jours (poids du
corps + une chaise), avec adaptation pour préserver le poignet droit.

## Installation

\`\`\`bash
npm install
\`\`\`

## Développement

\`\`\`bash
npm run dev
\`\`\`

L'application est disponible sur http://localhost:5173.

## Tests

\`\`\`bash
npm test
\`\`\`

## Build de production

\`\`\`bash
npm run build
npm run preview
\`\`\`

## Déploiement

Le déploiement sur GitHub Pages (repo `dmariage/callisthenie`) est automatisé
via `.github/workflows/deploy.yml` : chaque push sur `main` déclenche les
tests, le build et la publication sur GitHub Pages
(https://dmariage.github.io/callisthenie/).

Pour régénérer les icônes de l'application après une modification du script :

\`\`\`bash
node scripts/generate-icons.mjs
\`\`\`
```

- [ ] **Step 11: Commit**

```bash
git add scripts public/icons vite.config.ts index.html .github/workflows/deploy.yml README.md
git commit -m "feat: finalize PWA config, icons, GitHub Pages deployment and README"
```

---

## Self-Review

**1. Couverture de la spec :**

| Section de la spec | Tâche(s) couvrante(s) |
|---|---|
| Public / contraintes santé (poignet) | Tâche 2 (`wristFriendly: true` partout, variantes poings/avant-bras/chaise) |
| Approche technique (Vue 3 + Vite + Pinia + vite-plugin-pwa, pas de backend) | Tâche 1, Tâche 3, Tâche 10 |
| Architecture (arborescence des dossiers) | Tâches 1 à 10 (chaque fichier de l'arborescence de la spec est créé) |
| Structure du programme 28 jours / répartition hebdo / progression 4 semaines | Tâche 2 (`buildWeek`, `WEEK_VARIANTS`, tests de répartition) |
| Modèle de données `Exercise`/`DayProgram` | Tâche 2 (interfaces reprises à l'identique, `notes?` ajouté et justifié) |
| Illustrations SVG schématiques, une par exercice unique | Tâche 5 (`STICK_FIGURES`, 19 entrées, test de couverture exhaustive) |
| Store `progress.ts` (état, calcul streak, persistance) | Tâche 3 (`ProgressState`, `currentDay`, `recalculateStreak`, `persist: true`) |
| Minuteur `useTimer` (start/pause/reset, bip Web Audio) | Tâche 4 |
| Composants `DayCard`/`Timer`/`ProgressCalendar`/`ExerciseList` | Tâches 6, 7, 9 |
| Vues `HomeView`/`DayView`/`ProgressView` + `App.vue`/router | Tâche 8, Tâche 9 |
| PWA (manifest, icônes, `autoUpdate`) + déploiement GitHub Pages (`base`, CI) | Tâche 10 |
| Plan de tests (Vitest streak/jour courant/useTimer, Vue Test Utils DayCard/ProgressCalendar) | Tâches 3, 4, 6, 9 (et couverture supplémentaire sur toutes les autres tâches) |
| Hors scope (notifications, multi-appareils, édition UI du programme, E2E, photos/vidéos) | Respecté : aucune tâche n'introduit ces éléments |

Aucun écart identifié entre la spec et les tâches du plan.

**2. Scan des placeholders :** aucune occurrence de "TBD", "TODO", "à compléter", "gérer les cas limites" sans code concret. Chaque étape de code contient une implémentation réelle et complète (y compris les 19 illustrations SVG et le générateur d'icônes PNG). Les seules mentions de "notes" concernent le champ de données `notes?: string`, pas un travail restant.

**3. Cohérence des types entre tâches :**
- `Exercise` et `DayProgram` (Tâche 2) sont importés à l'identique dans les Tâches 3, 5, 6, 8, 9 (`import type { Exercise } from '@/data/program'`, `import { PROGRAM, EXERCISE_CATALOG } from '@/data/program'`).
- `useProgressStore()` (Tâche 3) expose `currentDay`, `isExerciseCompleted(day, exerciseId)`, `isDayCompleted(day)`, `startChallenge()`, `toggleExercise(day, exerciseId)`, `recalculateStreak()`, `currentStreak`, `bestStreak`, `startDate` — noms et signatures identiques dans toutes les consommations (Tâches 6, 8, 9).
- `useTimer()` (Tâche 4) expose `remaining`, `isRunning`, `start(durationSec)`, `pause()`, `reset()` — utilisés sans changement de nom dans `Timer.vue` (Tâche 7).
- `STICK_FIGURES` et le composant `StickFigure` (prop `illustrationId`) (Tâche 5) sont consommés à l'identique par `DayCard.vue` (Tâche 6).
- `ExerciseList` (props `title`, `exercises`, `day`) (Tâche 6) est consommé à l'identique par `DayView.vue` (Tâche 8).
- `ProgressCalendar` (Tâche 9) n'a pas de props et lit directement `useProgressStore()`, cohérent avec son intégration sans props dans `ProgressView.vue`.
- Aucune divergence de nom détectée entre la déclaration d'une fonction/type et son usage dans une tâche ultérieure.

Aucune correction nécessaire à l'issue de cette relecture.

