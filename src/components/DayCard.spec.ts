import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import DayCard from './DayCard.vue'
import { useProgressStore } from '@/stores/progress'
import type { Exercise } from '@/data/program'

const exercise: Exercise = {
  id: 'forearm-plank',
  name: 'Planche sur les avant-bras',
  sets: 3,
  durationSec: 30,
  restSec: 20,
  wristFriendly: true,
  illustrationId: 'forearm-plank',
  notes: 'Appui sur les avant-bras.',
}

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('DayCard', () => {
  it('renders the exercise name and detail', () => {
    const wrapper = mount(DayCard, { props: { exercise, day: 1 } })
    expect(wrapper.text()).toContain('Planche sur les avant-bras')
    expect(wrapper.text()).toContain('3 séries')
    expect(wrapper.text()).toContain('30 s')
  })

  it('toggles the exercise in the progress store when checked', async () => {
    const wrapper = mount(DayCard, { props: { exercise, day: 1 } })
    const store = useProgressStore()
    expect(store.isExerciseCompleted(1, 'forearm-plank')).toBe(false)
    await wrapper.find('input[type="checkbox"]').setValue(true)
    expect(store.isExerciseCompleted(1, 'forearm-plank')).toBe(true)
  })

  it('applies the completed class once checked', async () => {
    const wrapper = mount(DayCard, { props: { exercise, day: 1 } })
    await wrapper.find('input[type="checkbox"]').setValue(true)
    expect(wrapper.classes()).toContain('day-card--completed')
  })
})
