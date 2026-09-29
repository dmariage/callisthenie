<script setup lang="ts">
import { useProgressStore } from '@/stores/progress'

const progressStore = useProgressStore()
</script>

<template>
  <section class="progress-view">
    <h2>Progression</h2>
    <p class="progress-view__streak">Série en cours : {{ progressStore.currentStreak }} jour(s)</p>
    <p class="progress-view__streak">Meilleure série : {{ progressStore.bestStreak }} jour(s)</p>
  </section>
</template>

<style scoped>
.progress-view {
  text-align: center;
  padding: 1.5rem 0;
}
.progress-view__streak {
  font-size: 1rem;
  color: #555;
}
</style>
