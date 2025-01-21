import { mount, createLocalVue } from "@vue/test-utils"
import FinalizeBooking from "@/views/bookings/FinalizeBooking.vue"
import Vue from "vue"

let wrapper

beforeEach(() => 
{

	wrapper = mount(FinalizeBooking, {
		propsData: {
			booking: {
				id: "123",
				guestID: "456",
			},
		},
	})
})

afterEach(() => 
{
	wrapper?.destroy()
})

describe("FinalizeBooking", () => 
{
	test("renders properly", () => 
	{
		expect(wrapper.html()).toMatchSnapshot()
	})

	test("displays the correct booking and guest id", () => 
	{
		expect(wrapper.find("p").text()).toContain("Booking ID: 123")
		expect(wrapper.find("p").text()).toContain("Guest ID: 456")
	})

	test("calls `onPayNow` method when `Pay Now` button is clicked", async () => 
	{
		const mockMethod = vi.spyOn(FinalizeBooking.methods, "onPayNow")
		await wrapper.find(".pay-button").trigger("click")
		expect(mockMethod).toHaveBeenCalled()
	})
})
