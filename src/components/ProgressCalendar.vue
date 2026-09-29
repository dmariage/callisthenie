<script setup lang="ts">
import { computed } from 'vue'
import { useProgressStore } from '@/stores/progress'

type DayStatus = 'completed' | 'today' | 'missed' | 'upcoming'

interface DayEntry {
  day: number
  status: DayStatus
}

const progressStore = useProgressStore()

const days = computed<DayEntry[]>(() => {
  const currentDay = progressStore.currentDay
  return Array.from({ length: 28 }, (_, index) => {
    const day = index + 1
    let status: DayStatus
    if (currentDay === 0 || day > currentDay) {
      status = 'upcoming'
    } else if (progressStore.isDayCompleted(day)) {
      status = 'completed'
    } else if (day === currentDay) {
      status = 'today'
    } else {
      status = 'missed'
    }
    return { day, status }
  })
})
</script>

<template>
  <div class="progress-calendar">
    <RouterLink
      v-for="entry in days"
      :key="entry.day"
      :to="`/day/${entry.day}`"
      class="progress-calendar__cell"
      :class="`progress-calendar__cell--${entry.status}`"
    >
      {{ entry.day }}
    </RouterLink>
  </div>
</template>

<style scoped>
.progress-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.4rem;
}
.progress-calendar__cell {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  border-radius: 0.4rem;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
}
.progress-calendar__cell--completed {
  background: #2f6fed;
  color: #fff;
}
.progress-calendar__cell--today {
  background: #fff3cd;
  color: #7a5b00;
  border: 2px solid #f0b400;
}
.progress-calendar__cell--missed {
  background: #f1f1f1;
  color: #999;
  text-decoration: line-through;
}
.progress-calendar__cell--upcoming {
  background: #f8f8f8;
  color: #bbb;
}
</style>
