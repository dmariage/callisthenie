import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { mount } from '@vue/test-utils'
import ProgressCalendar from './ProgressCalendar.vue'
import { useProgressStore } from '@/stores/progress'
import { PROGRAM } from '@/data/program'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/day/:day', name: 'day', component: { template: '<div />' } }],
  })
}

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('ProgressCalendar', () => {
  it('renders 28 day cells', async () => {
    const router = createTestRouter()
    router.push('/day/1')
    await router.isReady()
    const wrapper = mount(ProgressCalendar, { global: { plugins: [router] } })
    expect(wrapper.findAll('.progress-calendar__cell')).toHaveLength(28)
  })

  it('marks all days as upcoming when the challenge has not started', async () => {
    const router = createTestRouter()
    router.push('/day/1')
    await router.isReady()
    const wrapper = mount(ProgressCalendar, { global: { plugins: [router] } })
    const cells = wrapper.findAll('.progress-calendar__cell')
    expect(cells[0].classes()).toContain('progress-calendar__cell--upcoming')
    expect(cells[27].classes()).toContain('progress-calendar__cell--upcoming')
  })

  it('marks a fully completed day as completed', async () => {
    const router = createTestRouter()
    router.push('/day/1')
    await router.isReady()
    const store = useProgressStore()
    store.startDate = new Date().toISOString()
    const day1 = PROGRAM.find((d) => d.day === 1)!
    for (const exercise of [...day1.warmup, ...day1.main, ...day1.cooldown]) {
      store.toggleExercise(1, exercise.id)
    }
    const wrapper = mount(ProgressCalendar, { global: { plugins: [router] } })
    const cell = wrapper.findAll('.progress-calendar__cell')[0]
    expect(cell.classes()).toContain('progress-calendar__cell--completed')
  })
})
