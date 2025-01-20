// Import Vue testing utilities and the component to be tested
import { mount } from '@vue/test-utils'
import GuestSafetyQuestionAccordion from '@/components/GuestSafetyQuestionAccordion.vue'

describe('GuestSafetyQuestionAccordion', () => {
  it('Has a title of \"Guest Safety\"', async () => {
    const wrapper = mount(GuestSafetyQuestionAccordion)

    expect(wrapper.find('.accordion-section').text()).toContain('Guest Safety')
  })

  it('Has correct content about guest safety', async () => {
    const wrapper = mount(GuestSafetyQuestionAccordion)

    expect(wrapper.find('.accordion-section').text()).toContain(
      'We live in the area and are in touch with leading local experts.'
    )
    expect(wrapper.find('.accordion-section').text()).toContain(
      'We encourage communication and provide guests with important local information.'
    )
  })
})
