import { describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { mount } from '@vue/test-utils'
import App from './App.vue'
import HomeView from './views/HomeView.vue'
import DayView from './views/DayView.vue'
import ProgressView from './views/ProgressView.vue'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: HomeView },
      { path: '/day/:day', name: 'day', component: DayView, props: true },
      { path: '/progress', name: 'progress', component: ProgressView },
    ],
  })
}

describe('App', () => {
  it('renders the challenge title and navigation', async () => {
    setActivePinia(createPinia())
    const router = createTestRouter()
    router.push('/')
    await router.isReady()
    const wrapper = mount(App, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('Défi Callisthénie 28 Jours')
    expect(wrapper.text()).toContain('Progression')
  })
})
