import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { mount } from '@vue/test-utils'
import ProgressView from './ProgressView.vue'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/day/:day', name: 'day', component: { template: '<div />' } }],
  })
}

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('ProgressView', () => {
  it('renders the streak summary and the 28-day calendar', async () => {
    const router = createTestRouter()
    router.push('/day/1')
    await router.isReady()
    const wrapper = mount(ProgressView, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('Série en cours')
    expect(wrapper.findAll('.progress-calendar__cell')).toHaveLength(28)
  })
})
