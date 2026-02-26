import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import HomeView from '../views/HomeView.vue'

describe('HomeView', () => {
  it('renders migration message', () => {
    const wrapper = mount(HomeView)
    expect(wrapper.text()).toContain('Vue 3 + Vite + pnpm workspace')
  })
})
