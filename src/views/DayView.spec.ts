import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import DayView from './DayView.vue'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('DayView', () => {
  it('renders warmup, main and cooldown exercises for a training day', () => {
    const wrapper = mount(DayView, { props: { day: '1' } })
    expect(wrapper.text()).toContain('Échauffement')
    expect(wrapper.text()).toContain('Circuit principal')
    expect(wrapper.text()).toContain('Retour au calme')
  })

  it('shows the full rest day message for a rest day', () => {
    const wrapper = mount(DayView, { props: { day: '3' } })
    expect(wrapper.text()).toContain('Jour de repos')
    expect(wrapper.find('.day-view__rest').exists()).toBe(true)
  })

  it('shows a not-found message for an out-of-range day', () => {
    const wrapper = mount(DayView, { props: { day: '99' } })
    expect(wrapper.text()).toContain('introuvable')
  })
})
