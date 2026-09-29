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
