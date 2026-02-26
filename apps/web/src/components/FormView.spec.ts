import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FormView from '../views/FormView.vue'

describe('FormView', () => {
  it('contains submit button', () => {
    const wrapper = mount(FormView)
    expect(wrapper.text()).toContain('提交')
  })
})
