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
