import { mount } from '@vue/test-utils'
import Thermometer from '@/components/Thermometer.vue'

const factory = (propsData) => {
  return mount(Thermometer, { propsData: propsData })
}

describe('Thermometer.vue', () => {
  it('renders component when props are provided', () => {
    const wrapper = factory({ currentAmount: 20, maxAmount: 100 })
    expect(wrapper.find('.mercury').attributes().style).toBe('height: 20%')
  })

  it('renders 0% when maxAmount or currentAmount is 0', () => {
    const wrapper = factory({ currentAmount: 0, maxAmount: 100 })
    expect(wrapper.find('.mercury').attributes().style).toBe('height: 0%')

    const wrapper1 = factory({ currentAmount: 20, maxAmount: 0 })
    expect(wrapper1.find('.mercury').attributes().style).toBe('height: 0%')
  })

  it('renders 100% when currentAmount is more than maxAmount', () => {
    const wrapper = factory({ currentAmount: 120, maxAmount: 100 })
    expect(wrapper.find('.mercury').attributes().style).toBe('height: 100%')
  })

  it('renders main ten percent notches correctly', () => {
    const wrapper = factory({ currentAmount: 100, maxAmount: 100 })
    wrapper.findAll('.notches').wrappers.forEach((notch, index) => {
      expect(notch.attributes().bottom).toBe(`${index * 10}%`)
    })
  })

  it('renders secondary 5 percent notches correctly', () => {
    const wrapper = factory({ currentAmount: 100, maxAmount: 100 })
    wrapper.findAll('.notches .small-notch').wrappers.forEach((notch, index) => {
      expect(notch.attributes().bottom).toBe(`${index * 5}%`)
    })
  })
})
