import { nextTick } from 'vue'
import { mount, configure } from '@vue/test-utils'
import ThermometerPage from '../src/components/ThermometerPage.vue'
import { createStore } from 'vuex';
import { createRouter, createWebHistory } from 'vue-router';

describe('ThermometerPage', () => {

  // helper function for creating a wrapper
  const createWrapper = (component, options) => mount(component, options)

  let store;
  let router;

  beforeEach(() => {
      store = createStore({
          modules: {
              // Mock module, you could use your actual store here, if there is any state composition needed.
          }
      });

      router = createRouter({
          history: createWebHistory(),
          routes: [] // pass your actual routes here, for navigation.
      });
  });

  it('renders the correct headline', () => {
    const wrapper = createWrapper(ThermometerPage, {
        global: { plugins: [store, router] }
    });
    expect(wrapper.find('h1').text()).toBe('Thermometer')
  })

  it('renders Thermometer component and passes props correctly', async () => {
    const wrapper = createWrapper(ThermometerPage, {
        global: { plugins: [store, router] }
    });
    await nextTick()
    const thermometer = wrapper.findComponent({ name: 'Thermometer' })
    expect(thermometer.props('currentAmount')).toBe(wrapper.vm.debtPaid)
    expect(thermometer.props('maxAmount')).toBe(wrapper.vm.debt.originalOwed)
  })

  it('correctly computes debtPaid', () => {
    const wrapper = createWrapper(ThermometerPage, {
        global: { plugins: [store, router] }
    });
    expect(wrapper.vm.debtPaid).toBe(wrapper.vm.debt.originalOwed - wrapper.vm.currentBalance())
  })
})
