import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { mount } from '@vue/test-utils'
import HomeView from './HomeView.vue'
import DayView from './DayView.vue'
import { useProgressStore } from '@/stores/progress'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: HomeView },
      { path: '/day/:day', name: 'day', component: DayView, props: true },
    ],
  })
}

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('HomeView', () => {
  it('shows the start button when the challenge has not started', async () => {
    const router = createTestRouter()
    router.push('/')
    await router.isReady()
    const wrapper = mount(HomeView, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('Démarrer le défi')
  })

  it('shows the current day focus after starting the challenge', async () => {
    const router = createTestRouter()
    router.push('/')
    await router.isReady()
    const wrapper = mount(HomeView, { global: { plugins: [router] } })
    const store = useProgressStore()
    store.startChallenge()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Jour 1 / 28')
  })
})
