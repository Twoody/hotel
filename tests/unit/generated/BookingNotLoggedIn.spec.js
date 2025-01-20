import { mount } from "@vue/test-utils";
import BookingNotLoggedIn from "@/views/bookings/BookingNotLoggedIn.vue";
import { nextTick } from "vue";
import { createRouter, createWebHistory } from "vue-router";

describe("BookingNotLoggedIn.vue", () => {
  // Create the router instance for Vue 3
  const router = createRouter({
    history: createWebHistory(), // Use web history
    routes: [{ path: '/login', name: 'login' }],
  });

  // Mount the component with the router
  const wrapper = mount(BookingNotLoggedIn, {
    global: {
      plugins: [router], // Provide the router plugin
    },
  });

  it("renders a message for not logged in users", () => {
    const headline = wrapper.find("h2");
    expect(headline.text()).toEqual("You are not logged in.");
  });

  it("prompts users to log in", async () => {
    // Push the initial route
    router.push('/');
    await router.isReady(); // Ensure the router is ready before running tests

    const link = wrapper.findComponent({ name: "RouterLink" });
    expect(link.props().to).toEqual('/login');

    await link.trigger("click");
    await nextTick();

    // Check the updated route
    expect(router.currentRoute.value.path).toBe('/login');
  });
});

