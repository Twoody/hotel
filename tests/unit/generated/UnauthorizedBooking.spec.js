// UnauthorizedBooking.test.js 
import { shallowMount } from "@vue/test-utils"
import UnauthorizedBooking from "@/components/UnauthorizedBooking.vue"

describe("UnauthorizedBooking.vue", () => 
{
	it("renders the component", () => 
	{
		const wrapper = shallowMount(UnauthorizedBooking)
		expect(wrapper).toBeTruthy()
	})

	it("displays the correct title", () => 
	{
		const wrapper = shallowMount(UnauthorizedBooking)
		expect(wrapper.find("h2").text()).toEqual("Access Denied")
	})

	it("displays the correct message", () => 
	{
		const wrapper = shallowMount(UnauthorizedBooking)
		expect(wrapper.find("p").text()).toEqual("This booking does not belong to you, or you do not have permission to view it.")
	})
})
