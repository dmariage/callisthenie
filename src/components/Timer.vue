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
