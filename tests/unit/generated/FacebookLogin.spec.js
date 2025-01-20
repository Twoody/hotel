import { shallowMount } from '@vue/test-utils'
import FacebookLogin from '@/components/FacebookLogin.vue'
import SocialLogin from '@/components/buttons/login/SocialLogin.vue'

// Mock the SocialLogin component
jest.mock('@/components/buttons/login/SocialLogin.vue', () => ({
  name: 'SocialLogin',
  render: () => {}
}))

describe('FacebookLogin.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(FacebookLogin)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders the SocialLogin component with correct provider', () => {
    const socialLogin = wrapper.findComponent(SocialLogin)
    expect(socialLogin.exists()).toBe(true)
    expect(socialLogin.props('provider')).toBe('facebook')
  })

  // Add more tests if needed to cover the logic in this component
})
