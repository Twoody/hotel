// NameOfFile.spec.ts

import { mount, VueWrapper } from \"@vue/test-utils\";
import ProfileSettings from \"@/components/ProfileSettings.vue\";
import BookingsTable from \"@/components/entities/BookingsTable.vue\";
import { createStore } from \"vuex\";
import { createRouter, createWebHistory } from 'vue-router';

let wrapper: VueWrapper<any>;
const mockStore = createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
});

const mockRouter = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: []
});

const createComponent = () => {
  wrapper = mount(ProfileSettings, {
    global: {
      components: {
        BookingsTable,
      },
      plugins: [mockStore, mockRouter],
    },
  });
};

describe(\"ProfileSettings.vue\", () => {
  beforeEach(() => {
    createComponent();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it(\"should render h2 element with 'Profile Tab' text\", () => {
    expect(wrapper.get(\"h2\").text()).toBe(\"Profile Tab\");
  });

  it(\"should render p element with expected text\", () => {
    const expectedText = \"Here you could add user profile form fields,\
                        \nupload avatars, social links, etc.\";
    expect(wrapper.get(\"p\").text()).toBe(expectedText);
  });
});
