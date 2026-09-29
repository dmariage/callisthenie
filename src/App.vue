<script setup lang="ts"></script>

<template>
  <div class="app">
    <header class="app__header">
      <RouterLink to="/" class="app__title">Défi Callisthénie 28 Jours</RouterLink>
      <nav class="app__nav">
        <RouterLink to="/" class="app__nav-link">Aujourd'hui</RouterLink>
        <RouterLink to="/progress" class="app__nav-link">Progression</RouterLink>
      </nav>
    </header>
    <main class="app__content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  max-width: 480px;
  margin: 0 auto;
  font-family: system-ui, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.app__header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}
.app__title {
  display: block;
  font-weight: 700;
  font-size: 1.1rem;
  text-decoration: none;
  color: inherit;
  margin-bottom: 0.5rem;
}
.app__nav {
  display: flex;
  gap: 1rem;
}
.app__nav-link {
  text-decoration: none;
  color: #2f6fed;
  font-weight: 600;
}
.app__content {
  flex: 1;
  padding: 1rem;
}
</style>
