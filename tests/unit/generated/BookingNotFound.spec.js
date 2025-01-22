import { mount } from "@vue/test-utils"
import { describe, it, expect, beforeEach } from "vitest"
import BookingNotFound from "@/views/bookings/BookingNotFound.vue"

// Helper function to create the wrapper
/**
 *
 * @param options
 */
function createWrapper (options = {}) 
{
	return mount(BookingNotFound, {
		// If there were child components or additional global config needed, 
		// we'd place them in the `global` property here.
		...options,
	})
}

describe("BookingNotFound.vue", () => 
{
	let wrapper

	beforeEach(() => 
	{
		wrapper = createWrapper()
	})

	it("mounts successfully", () => 
	{
		expect(wrapper.exists()).toBe(true)
	})

	it("displays the correct heading", () => 
	{
		const heading = wrapper.find("h2")
		expect(heading.exists()).toBe(true)
		expect(heading.text()).toBe("Booking Not Found")
	})

	it("renders the descriptive paragraph text", () => 
	{
		const paragraph = wrapper.find("p")
		expect(paragraph.exists()).toBe(true)
		expect(paragraph.text()).toContain("The requested booking could not be located.")
	})

	it("includes the booking-not-found-wrapper class", () => 
	{
		const wrapperDiv = wrapper.find(".booking-not-found-wrapper")
		expect(wrapperDiv.exists()).toBe(true)
	})

	it("has the correct Vue component name", () => 
	{
		// Optionally validate the `name` field on the component
		expect(wrapper.vm.$options.name).toBe("BookingNotFound")
	})
})
