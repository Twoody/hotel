import { mount } from "@vue/test-utils"
import { describe, it, expect, beforeEach, vi } from "vitest"
import FinalizeBooking from "@/views/bookings/FinalizeBooking.vue"

// Mock components used in FinalizeBooking
const Validatable = {
	template: "<div><slot /></div>",
	props: [
		"error",
	],
}

const MyButton = {
	template: "<button><slot /></button>",
	props: [
		"disabled",
		"inProgress",
		"sucess",
		"submit",
	],
}

// Mock Vuex store
import { createStore } from "vuex"

const store = createStore({
	state: {
		hotel: {
			dailyRate: 100,
			cleaningFee: 50,
			petFee: 20,
		},
	},
})

/**
 *
 * @param options
 */
function createWrapper (options = {}) 
{
	const defaultProps = {
		booking: {
			id: "booking123",
			guestID: "guestABC",
			startDate: "2025-01-01",
			endDate: "2025-01-02",
		},
	}

	return mount(FinalizeBooking, {
		global: {
			components: {
				Validatable,
				MyButton, 
			},
			plugins: [
				store,
			], // Provide the Vuex store here
		},
		props: defaultProps,
		...options,
	})
}

describe("FinalizeBooking.vue", () => 
{
	let wrapper

	beforeEach(() => 
	{
		wrapper = createWrapper()
	})

	it("mounts without error", () => 
	{
		expect(wrapper.exists()).toBe(true)
	})

	it("requires a booking prop", () => 
	{
		expect(wrapper.props("booking")).toEqual({
			id: "booking123",
			guestID: "guestABC",
			startDate: "2025-01-01",
			endDate: "2025-01-02",
		})
	})

	it("renders the correct heading and instructions", () => 
	{
		const heading = wrapper.find("h2")
		expect(heading.exists()).toBe(true)
		expect(heading.text()).toBe("Finalize Your Booking")
		expect(wrapper.text()).toContain(
			"Please complete any outstanding steps to confirm your booking."
		)
	})

	it("renders a Pay Now button", () => 
	{
		const payButton = wrapper.find(".pay-button")
		expect(payButton.exists()).toBe(true)
		expect(payButton.text()).toBe("Pay Now")
	})

	it("successfully submits booking details when Pay Now is clicked", async () => 
	{
		const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => 
		{})

		const payButton = wrapper.find(".pay-button")
		await payButton.trigger("click")

		expect(consoleSpy).toHaveBeenCalledWith("Form submitted successfully!")

		consoleSpy.mockRestore()
	})
})
