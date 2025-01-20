est/SplashScreen.spec.js:
import { mount } from '@vue/test-utils'
import SplashScreen from '@/components/SplashScreen.vue'

describe('SplashScreen', () => {
  it('renders a loading message', () => {
    const wrapper = mount(SplashScreen)

    expect(wrapper.text()).toMatch('Loading...')
  })

  it('renders a Spinner component', () => {
    const wrapper = mount(SplashScreen)

    expect(wrapper.findComponent({ name: 'Spinner' })).toBeTruthy()
  })
})
