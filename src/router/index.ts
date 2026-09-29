import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DayView from '@/views/DayView.vue'
import ProgressView from '@/views/ProgressView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/day/:day', name: 'day', component: DayView, props: true },
    { path: '/progress', name: 'progress', component: ProgressView },
  ],
})

export default router
