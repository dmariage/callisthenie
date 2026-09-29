import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import ExerciseList from './ExerciseList.vue'
import type { Exercise } from '@/data/program'

const exercises: Exercise[] = [
  {
    id: 'jumping-jacks',
    name: 'Jumping jacks',
    sets: 1,
    durationSec: 30,
    restSec: 10,
    wristFriendly: true,
    illustrationId: 'jumping-jacks',
  },
]

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('ExerciseList', () => {
  it('renders a title and one DayCard per exercise', () => {
    const wrapper = mount(ExerciseList, { props: { title: 'Échauffement', exercises, day: 1 } })
    expect(wrapper.text()).toContain('Échauffement')
    expect(wrapper.findAll('.day-card')).toHaveLength(1)
  })

  it('renders nothing when the exercise list is empty', () => {
    const wrapper = mount(ExerciseList, { props: { title: 'Échauffement', exercises: [], day: 1 } })
    expect(wrapper.find('section').exists()).toBe(false)
  })
})
