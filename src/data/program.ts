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
