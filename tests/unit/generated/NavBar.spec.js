import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import NavBar from \"@/path/to/NavBar.vue\";

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);

const router = new VueRouter();
let store;

beforeEach(() => {
  store = new Vuex.Store({
    state: {
      user: {
        user: {first_name: '', last_name: ''},
        isLoggedIn: false,
        isAuthReady: false,
        isLoggingIn: false
      }
    }
  });
});

describe('NavBar.vue', () => {
  it('renders navigation items', () => {
    const wrapper = shallowMount(NavBar, { localVue, router, store });
    expect(wrapper.findAll('.nav-item').length).toBe(5);
  });

  it('renders Login link when not logged in', () => {
    store.state.user.isAuthReady = true;
    const wrapper = shallowMount(NavBar, { localVue, router, store });
    expect(wrapper.find('.nav-item').text()).toBe('Login');
  });

  it('renders user settings when user is logged in', () => {
    store.state.user.isLoggedIn = true;
    const wrapper = shallowMount(NavBar, { localVue, router, store });
    expect(wrapper.find('.user-items').exists()).toBe(true);
  });

  it('go to user settings when the user-icon is clicked', async () => {
    store.state.user.isLoggedIn = true;
    const wrapper = shallowMount(NavBar, { localVue, router, store });
    const userIcon = wrapper.find('.user-icon');
    await userIcon.trigger('click');
    expect(wrapper.vm.$route.path).toBe('/settings');
  });
});
