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
