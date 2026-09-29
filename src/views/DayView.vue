<script setup lang="ts">
import { computed } from 'vue'
import { PROGRAM } from '@/data/program'
import ExerciseList from '@/components/ExerciseList.vue'

const props = defineProps<{
  day: string
}>()

const dayNumber = computed(() => Number(props.day))
const dayProgram = computed(() => PROGRAM.find((d) => d.day === dayNumber.value))
const isRestDay = computed(() => dayProgram.value?.type === 'rest')
</script>

<template>
  <section v-if="dayProgram" class="day-view">
    <h2>Jour {{ dayProgram.day }} / 28</h2>
    <p class="day-view__focus">{{ dayProgram.focus }}</p>
    <p v-if="dayProgram.notes" class="day-view__notes">{{ dayProgram.notes }}</p>
    <div v-if="isRestDay" class="day-view__rest">
      <p>Jour de repos complet. Profites-en pour récupérer, aucune séance aujourd'hui.</p>
    </div>
    <template v-else>
      <ExerciseList title="Échauffement" :exercises="dayProgram.warmup" :day="dayProgram.day" />
      <ExerciseList title="Circuit principal" :exercises="dayProgram.main" :day="dayProgram.day" />
      <ExerciseList title="Retour au calme" :exercises="dayProgram.cooldown" :day="dayProgram.day" />
    </template>
  </section>
  <section v-else class="day-view">
    <p>Jour introuvable.</p>
  </section>
</template>

<style scoped>
.day-view__focus {
  color: #555;
  margin-top: -0.5rem;
}
.day-view__notes {
  background: #fff8e1;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
}
.day-view__rest {
  padding: 2rem 0;
  text-align: center;
  color: #555;
}
</style>
