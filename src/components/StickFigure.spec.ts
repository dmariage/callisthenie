import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StickFigure, { STICK_FIGURES } from './StickFigure.vue'
import { EXERCISE_CATALOG } from '@/data/program'

describe('StickFigure', () => {
  it('has an illustration for every exercise in the catalogue', () => {
    const missing = Object.keys(EXERCISE_CATALOG).filter((id) => !(id in STICK_FIGURES))
    expect(missing).toEqual([])
  })

  it('renders the matching SVG markup for a known illustration id', () => {
    const wrapper = mount(StickFigure, { props: { illustrationId: 'forearm-plank' } })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('renders nothing for an unknown illustration id', () => {
    const wrapper = mount(StickFigure, { props: { illustrationId: 'does-not-exist' } })
    expect(wrapper.find('svg').exists()).toBe(false)
  })
})
