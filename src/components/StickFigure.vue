<script lang="ts">
export const STICK_FIGURES: Record<string, string> = {
  'jumping-jacks': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="50" cy="16" r="8"/><line x1="50" y1="24" x2="50" y2="58"/><line x1="50" y1="30" x2="22" y2="12"/><line x1="50" y1="30" x2="78" y2="12"/><line x1="50" y1="58" x2="24" y2="90"/><line x1="50" y1="58" x2="76" y2="90"/></svg>',
  'arm-circles': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="45" cy="16" r="8"/><line x1="45" y1="24" x2="45" y2="60"/><line x1="45" y1="60" x2="32" y2="92"/><line x1="45" y1="60" x2="58" y2="92"/><line x1="45" y1="32" x2="65" y2="18"/><path d="M65,18 A14,14 0 1 1 52,6"/></svg>',
  'cat-cow-fist': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="85" cy="38" r="7"/><line x1="78" y1="42" x2="25" y2="50"/><line x1="25" y1="50" x2="25" y2="78"/><circle cx="25" cy="82" r="3" fill="currentColor"/><line x1="65" y1="46" x2="65" y2="78"/><circle cx="65" cy="82" r="3" fill="currentColor"/></svg>',
  'chair-assisted-squat': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="28" cy="20" r="8"/><line x1="30" y1="28" x2="42" y2="52"/><line x1="42" y1="52" x2="66" y2="50"/><line x1="42" y1="52" x2="30" y2="78"/><line x1="42" y1="52" x2="58" y2="78"/><line x1="66" y1="46" x2="86" y2="46"/><line x1="70" y1="50" x2="70" y2="70"/><line x1="82" y1="50" x2="82" y2="70"/></svg>',
  'squat-bulgarian-chair': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="25" cy="18" r="8"/><line x1="27" y1="26" x2="38" y2="50"/><line x1="38" y1="50" x2="20" y2="80"/><line x1="38" y1="50" x2="70" y2="55"/><line x1="70" y1="50" x2="90" y2="50"/><line x1="74" y1="55" x2="74" y2="72"/><line x1="86" y1="55" x2="86" y2="72"/></svg>',
  'incline-pushup-fist': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="85" cy="45" r="7"/><line x1="78" y1="50" x2="60" y2="55"/><line x1="60" y1="55" x2="20" y2="72"/><line x1="78" y1="50" x2="78" y2="58"/><circle cx="78" cy="62" r="3" fill="currentColor"/><line x1="65" y1="60" x2="90" y2="60"/><line x1="70" y1="64" x2="70" y2="78"/><line x1="85" y1="64" x2="85" y2="78"/></svg>',
  'pushup-fist-floor': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="85" cy="55" r="7"/><line x1="78" y1="58" x2="55" y2="58"/><line x1="55" y1="58" x2="20" y2="70"/><line x1="78" y1="58" x2="78" y2="63"/><circle cx="78" cy="67" r="3" fill="currentColor"/><line x1="10" y1="85" x2="95" y2="85"/></svg>',
  'superman-hold': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="15" cy="52" r="6"/><line x1="20" y1="55" x2="80" y2="55"/><line x1="80" y1="55" x2="92" y2="45"/><line x1="20" y1="55" x2="8" y2="68"/><line x1="5" y1="80" x2="95" y2="80"/></svg>',
  'forearm-plank': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="85" cy="48" r="6"/><line x1="20" y1="55" x2="80" y2="50"/><line x1="20" y1="55" x2="20" y2="72"/><line x1="10" y1="85" x2="95" y2="85"/></svg>',
  'glute-bridge': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="15" cy="62" r="6"/><line x1="20" y1="60" x2="55" y2="55"/><line x1="55" y1="55" x2="60" y2="75"/><line x1="60" y1="75" x2="75" y2="75"/><line x1="5" y1="80" x2="95" y2="80"/></svg>',
  'glute-bridge-single-leg': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="15" cy="62" r="6"/><line x1="20" y1="60" x2="55" y2="55"/><line x1="55" y1="55" x2="60" y2="75"/><line x1="60" y1="75" x2="75" y2="75"/><line x1="55" y1="55" x2="85" y2="40"/><line x1="5" y1="80" x2="95" y2="80"/></svg>',
  'shoulder-mobility-circles': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="50" cy="16" r="8"/><line x1="50" y1="24" x2="50" y2="60"/><line x1="50" y1="60" x2="38" y2="90"/><line x1="50" y1="60" x2="62" y2="90"/><path d="M30,35 A15,15 0 1 1 45,20"/><path d="M70,35 A15,15 0 1 0 55,20"/></svg>',
  'thoracic-rotation-chair': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="50" cy="20" r="8"/><line x1="50" y1="28" x2="58" y2="58"/><line x1="58" y1="45" x2="80" y2="35"/><line x1="58" y1="45" x2="40" y2="50"/><line x1="30" y1="65" x2="70" y2="65"/><line x1="35" y1="65" x2="35" y2="85"/><line x1="65" y1="65" x2="65" y2="85"/></svg>',
  'hip-opener-90-90': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="50" cy="25" r="7"/><line x1="50" y1="32" x2="50" y2="60"/><line x1="50" y1="65" x2="25" y2="60"/><line x1="25" y1="60" x2="20" y2="80"/><line x1="50" y1="65" x2="75" y2="70"/><line x1="75" y1="70" x2="85" y2="50"/></svg>',
  'hip-flexor-lunge-stretch': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="30" cy="18" r="7"/><line x1="32" y1="25" x2="40" y2="50"/><line x1="40" y1="50" x2="35" y2="80"/><line x1="40" y1="50" x2="75" y2="85"/></svg>',
  'chest-doorway-stretch': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><line x1="80" y1="10" x2="80" y2="90"/><circle cx="40" cy="18" r="7"/><line x1="40" y1="26" x2="45" y2="60"/><line x1="45" y1="40" x2="78" y2="35"/><line x1="45" y1="60" x2="35" y2="90"/><line x1="45" y1="60" x2="55" y2="90"/></svg>',
  'hamstring-standing-stretch': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><circle cx="30" cy="20" r="7"/><line x1="32" y1="28" x2="55" y2="50"/><line x1="55" y1="50" x2="70" y2="55"/><line x1="60" y1="55" x2="85" y2="55"/><line x1="65" y1="55" x2="65" y2="70"/><line x1="80" y1="55" x2="80" y2="70"/><line x1="32" y1="55" x2="25" y2="85"/></svg>',
  'glute-figure4-stretch': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><line x1="25" y1="60" x2="75" y2="60"/><line x1="30" y1="60" x2="30" y2="85"/><line x1="70" y1="60" x2="70" y2="85"/><circle cx="50" cy="25" r="7"/><line x1="50" y1="32" x2="50" y2="55"/><line x1="50" y1="55" x2="65" y2="50"/><line x1="65" y1="50" x2="40" y2="52"/></svg>',
  'child-pose-fist': '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"><line x1="75" y1="68" x2="40" y2="55"/><circle cx="35" cy="52" r="6"/><line x1="40" y1="55" x2="15" y2="50"/><circle cx="15" cy="50" r="3" fill="currentColor"/><line x1="75" y1="70" x2="80" y2="85"/><line x1="75" y1="70" x2="65" y2="85"/></svg>',
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  illustrationId: string
}>()

const markup = computed(() => STICK_FIGURES[props.illustrationId] ?? '')
</script>

<template>
  <div class="stick-figure" aria-hidden="true" v-html="markup"></div>
</template>

<style scoped>
.stick-figure {
  display: block;
  width: 100%;
  height: 100%;
  color: #2f6fed;
}
.stick-figure :deep(svg) {
  width: 100%;
  height: 100%;
}
</style>
