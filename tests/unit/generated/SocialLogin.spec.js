ests/unit/socialLogin.spec.js:
import { mount } from '@vue/test-utils'
import SocialLogin from \"@/path/to/SocialLogin\";
import store from  \"@/store/store\";
import { nextTick } from 'vue';

jest.mock('@/firebase', () => ({
  firebaseAuth: {
    signInWithPopup: jest.fn(),
  },
  GoogleAuthProvider: jest.fn(),
  FacebookAuthProvider: jest.fn()
}))

jest.mock('@/utils', () => ({
  addUserToFirestore: jest.fn(),
}))

describe('SocialLogin.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(SocialLogin, {
      global: {
        plugins: [store]
      },
      propsData: {
        provider: 'google'
      }
    })
  })
  
  it('renders provider name', () => {
    expect(wrapper.find('.social-button-dex').text()).toBe('Google');
  })

  it('login button is disabled when user is already logged in', async () => {
    expect(wrapper.find('.social-button').attributes().disabled).toBe('false');
    
    await store.commit('user/setUser', {id: 1, name: 'Test user'});
    
    await nextTick(); // Wait for rerender
    
    expect(wrapper.find('.social-button').attributes().disabled).toBe('true');
  })

  // Add more test cases....
})
