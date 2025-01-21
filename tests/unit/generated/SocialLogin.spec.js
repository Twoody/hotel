import { mountVue } from 'path/to/mountHelper'
import { createStore } from 'vuex';
import SocialLogin from '@/path-to/SocialLogin.vue'; // path to SocialLogin in project

describe('SocialLogin.vue', () => {  
  let wrapper;
  let store;

  beforeEach(() => {
    store = createStore({
      state: {
        user: {
          isLoggedIn: false,
          isAuthReady: false,
          isLoggingIn: false,
        },
      },
      mutations: { // mock the mutations in store
        setIsLoggingIn(state, value) {
          state.user.isLoggingIn = value;
        },
      },
      actions: { // mock the actions in store
        fetchUser(state, data) {
          // action implementation here
        },
      },
    });

    wrapper = mountVue(SocialLogin, {
      props: {
        provider: 'google',
      },
      global: {
        plugins: [store], // provide store as plugin
      },
    });
  });

  test('handleLogin', async () => {
    const button = wrapper.find('.social-button'); // find button element

    // mocking firebase
    const userMock = { user: { uid: '1', displayName: 'John Doe' } };
    global.firebaseAuth = jest.fn().mockImplementation(() => {
      return {
        signInWithPopup: () => Promise.resolve(userMock),
      };
    });

    await button.trigger('click'); // trigger click event
    expect(button.attributes('disabled')).toBe(undefined); // button should not be disabled
  });
});
