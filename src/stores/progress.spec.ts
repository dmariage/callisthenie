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
