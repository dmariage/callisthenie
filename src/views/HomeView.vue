<script setup lang="ts">
import { computed } from 'vue'
import { useProgressStore } from '@/stores/progress'
import { PROGRAM } from '@/data/program'

const progressStore = useProgressStore()

const hasStarted = computed(() => progressStore.startDate !== null)
const currentDayProgram = computed(() => PROGRAM.find((d) => d.day === progressStore.currentDay))

function onStart(): void {
  progressStore.startChallenge()
}
</script>

<template>
  <section v-if="!hasStarted" class="home home--start">
    <h2>Prêt à commencer ?</h2>
    <p>Le défi dure 28 jours, à raison de 20 minutes par jour.</p>
    <button type="button" class="home__start-button" @click="onStart">Démarrer le défi</button>
  </section>
  <section v-else-if="currentDayProgram" class="home">
    <h2>Jour {{ currentDayProgram.day }} / 28</h2>
    <p class="home__focus">{{ currentDayProgram.focus }}</p>
    <p class="home__streak">
      Série en cours : {{ progressStore.currentStreak }} jour(s) · Record :
      {{ progressStore.bestStreak }} jour(s)
    </p>
    <RouterLink :to="`/day/${currentDayProgram.day}`" class="home__cta">Voir la séance du jour</RouterLink>
  </section>
  <section v-else class="home">
    <h2>Défi terminé !</h2>
    <p>Tu as complété les 28 jours. Bravo !</p>
  </section>
</template>

<style scoped>
.home {
  text-align: center;
  padding: 1.5rem 0;
}
.home__start-button,
.home__cta {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  background: #2f6fed;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
}
.home__streak {
  color: #555;
  font-size: 0.9rem;
}
</style>
