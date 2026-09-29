import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Timer from './Timer.vue'

class FakeAudioContext {
  currentTime = 0
  destination = {}
  createOscillator = vi.fn(() => ({
    type: '',
    frequency: { value: 0 },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    onended: null,
  }))
  createGain = vi.fn(() => ({ connect: vi.fn() }))
  close = vi.fn()
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('AudioContext', FakeAudioContext)
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('Timer', () => {
  it('shows the initial duration before starting', () => {
    const wrapper = mount(Timer, { props: { durationSec: 90 } })
    expect(wrapper.text()).toContain('01:30')
  })

  it('counts down after clicking Démarrer', async () => {
    const wrapper = mount(Timer, { props: { durationSec: 5 } })
    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')
    vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('00:03')
  })

  it('shows 00:00 once the countdown finishes', async () => {
    const wrapper = mount(Timer, { props: { durationSec: 2 } })
    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')
    vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('00:00')
  })

  it('resets back to the initial duration', async () => {
    const wrapper = mount(Timer, { props: { durationSec: 5 } })
    const buttons = wrapper.findAll('button')
    await buttons[0].trigger('click')
    vi.advanceTimersByTime(2000)
    await buttons[2].trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('00:05')
  })
})
