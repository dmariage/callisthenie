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
