import { mount } from '@vue/test-utils'
import UnauthorizedBooking from '../src/components/UnauthorizedBooking.vue'

function mountComponent() {
  return mount(UnauthorizedBooking)
}

describe('UnauthorizedBooking', () => {
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

  test('applies correct styling to wrapper', () => {
    const wrapper = mountComponent()
    const styles = wrapper.find('.unauthorized-booking-wrapper').element.style

    expect(styles.backgroundColor).toBe('lavendar')
    expect(styles.borderRadius).toBe('7px')
    expect(styles.margin).toBe('7px')
    expect(styles.padding).toBe('20px')
  })
})

