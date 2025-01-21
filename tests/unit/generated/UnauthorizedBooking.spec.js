import { mount } from '@vue/test-utils'
import UnauthorizedBooking from '@/views/bookings/UnauthorizedBooking.vue'

function mountComponent() {
  return mount(UnauthorizedBooking)
}

describe('UnauthorizedBooking', () => {
  test('has the right class structure', () => {
	  const wrapper = mountComponent();
expect(wrapper.find('.unauthorized-booking-wrapper').exists()).toBe(true);
  })
  test('renders access denied header', () => {
    const wrapper = mountComponent()
    const header = wrapper.find('h2')

    expect(header.exists()).toBe(true)
    expect(header.text()).toBe('Access Denied')
  })

  test('renders error message', () => {
    const wrapper = mountComponent()
    const message = wrapper.find('p')

    expect(message.exists()).toBe(true)
    expect(message.text()).toContain('This booking does not belong to you')
    expect(message.text()).toContain('or you do not have permission to view it')
  })

})

