import { shallowMount } from '@vue/test-utils'
import Home from '@/pages/Home'
import store from '@/store/store.js'
import { db } from \"@/firebase\"

jest.mock('@/store/store.js')
jest.mock('@/firebase')

describe('Home', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(Home, {store})
  })
  test('renders properly', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
  test('correctly retrieves currentUser from store', () => {
    expect(wrapper.vm.currentUser).toBe(store.state.user.user)
  })
  test('correctly retrieves isAuthReady from store', () => {
    expect(wrapper.vm.isAuthReady).toBe(store.state.user.isAuthReady)
  })
  test('Checkout component is a vue instance', () => {
    expect(wrapper.exists()).toBe(true)
  })
})
