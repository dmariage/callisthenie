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
