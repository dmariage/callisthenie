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
