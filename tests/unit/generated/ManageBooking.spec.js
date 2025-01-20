import { mount } from '@vue/test-utils'
import ManageBooking from '@/views/bookings/ManageBooking'

describe('ManageBooking', () => {
  it('shows spinner while loading', () => {
    // Adjust the data for the test case
    const wrapper = mount(ManageBooking, {
      data() {
        return {
          isAuthReady: false,
          isLoggingIn: true,
          isLoadingBooking: true,
        }
      },
    })

    // Test that spinner is visible when loading
    expect(wrapper.find('Spinner').isVisible()).toBe(true)
  })

  it('shows BookingNotLoggedIn when isAuthReady true but isLoggedIn false', () => {
    const wrapper = mount(ManageBooking, {
      data() {
        return {
          isAuthReady: true,
          isLoggedIn: false,
          isLoadingBooking: false,
        }
      },
    })

    // Test that BookingNotLoggedIn is visible
    expect(wrapper.find('BookingNotLoggedIn').isVisible()).toBe(true)
  })

  // Add more test cases
})
