import { mount } from "@vue/test-utils"
import { describe, it, expect, beforeEach } from "vitest"
import BookingNotLoggedIn from "@/views/bookings/BookingNotLoggedIn.vue"

// Helper function to create the wrapper
/**
 *
 * @param options
 */
function createWrapper (options = {}) 
{
	return mount(BookingNotLoggedIn, {
		global: {
			// We stub router-link so we can easily test its "to" prop
			// without needing a full router config.
			stubs: {
				RouterLink: {
					name: "RouterLink",
					props: [
						"to",
					],
					template: "<a :href=\"to\"><slot/></a>",
				},

			},
		},
		...options,
	})
}

describe.concurrent("BookingNotLoggedIn.vue", () => 
{
	let wrapper

	beforeEach(() => 
	{
		wrapper = createWrapper()
	})

	it("mounts the component successfully", () => 
	{
		expect(wrapper.exists()).toBe(true)
	})

	it("displays the correct heading", () => 
	{
		const heading = wrapper.find("h2")
		expect(heading.exists()).toBe(true)
		expect(heading.text()).toBe("You are not logged in.")
	})

	it("renders the descriptive paragraph text", () => 
	{
		const paragraph = wrapper.find("p")
		expect(paragraph.exists()).toBe(true)
		expect(paragraph.text()).toContain("Please")
		expect(paragraph.text()).toContain("log in")
	})

	it("includes the booking-not-logged-in-wrapper class", () => 
	{
		const container = wrapper.find(".booking-not-logged-in-wrapper")
		expect(container.exists()).toBe(true)
	})

	it("contains a router-link pointing to /login", () => 
	{
		// Even though we stubbed RouterLink to a plain <a> tag,
		// we can still check that the component passed the 'to' prop if we like.
		// Another approach is to rely on finding the <a> and trusting the stub.
		// We'll show how to check a stub's props below:

		// 1) Confirm the <router-link> was indeed rendered (as a stub).
		const linkStub = wrapper.findComponent({
			name: "RouterLink", 
		})
		expect(linkStub.exists()).toBe(true)

		// 2) Check the 'to' prop
		// Because we stubbed it, we can see the passed prop:
		expect(linkStub.props("to")).toBe("/login")
	})

	it("has the correct Vue component name", () => 
	{
		expect(wrapper.vm.$options.name).toBe("BookingNotLoggedIn")
	})
})
