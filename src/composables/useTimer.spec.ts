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

// `createOscillator` is a class field, so it lives on each instance, never on
// `FakeAudioContext.prototype`. Wrapping the stubbed constructor in a spy lets
// the "plays a beep" test observe that a beep was actually attempted.
const AudioContextConstructorSpy = vi.fn(() => new FakeAudioContext())

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('AudioContext', AudioContextConstructorSpy)
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
  AudioContextConstructorSpy.mockClear()
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
    expect(AudioContextConstructorSpy).toHaveBeenCalledTimes(1)
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
