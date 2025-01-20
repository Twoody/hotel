import { mount } from "@vue/test-utils";
import BookingNotLoggedIn from "@/views/bookings/BookingNotLoggedIn.vue";
import { nextTick } from "vue";
import { VueRouter } from "vue-router";

describe("BookingNotLoggedIn.vue", () => {
  
  //assuming VueRouter is installed
  const router = new VueRouter({
      routes: [{ path: '/login', name: 'login' }]
  });
  
  const wrapper = mount(BookingNotLoggedIn, { global: { plugins: [router] }});

  it("renders a message for not logged in users", () => {
    const headline = wrapper.find("h2");
    expect(headline.text()).toEqual("You are not logged in.");
  });

  it("prompts users to log in", async () => {
    const link = wrapper.findComponent({ name: 'RouterLink' });
    expect(link.props().to).toEqual('/login');
    link.trigger('click');
    await nextTick();
    expect(wrapper.vm.$route.path).toBe('/login')
  });
});
