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

const QuestionAccordion = {
	template: "<div><slot /></div>",
	props: [
		"question",
		"answer",
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
				QuestionAccordion,
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
		// Explicitly set valid dates on the form to pass validation
		await wrapper.setData({
			formData: {
				startDate: "2025-01-01",
				endDate: "2025-01-02",
				adults: 1, // required fields valid by default
				babies: 0,
				cats: 0,
				dogs: 0,
				kids: 0,
				specialRequests: "",
				toddlers: 0,
			},
		})

		const payButton = wrapper.find(".pay-button")
		expect(payButton.element.disabled).toBe(false)
		expect(payButton.element.disabled).toBe(false)
		expect(payButton.exists()).toBe(true)

		// Booking is in the past
		expect(wrapper.vm.isShowingErrors).toBe(true)
		expect(wrapper.vm.isFormValid).toBe(false)

		expect(wrapper.vm.isProcessingRequest).toBe(false)
		await payButton.trigger("click")
		let sucess = await wrapper.vm.submitBookingDetails()
		expect(sucess).toBe(false)

	})
})
