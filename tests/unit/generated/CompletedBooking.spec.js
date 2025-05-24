import { mount } from "@vue/test-utils"
import CompletedBooking from "@/views/bookings/CompletedBooking.vue"

describe.concurrent("CompletedBooking.vue", () => 
{
	it("renders booking details when passed", () => 
	{
		const booking = {
			id: "test",
			guestID: "guest1",
			startDate: "01-02-2022",
			endDate: "05-02-2022",
		}
		const wrapper = mount(CompletedBooking, {
			props: {
				booking, 
			},
		})
		expect(wrapper.text()).toMatch(`Booking ID: ${booking.id}`)
		expect(wrapper.text()).toMatch(`Guest ID: ${booking.guestID}`)
		expect(wrapper.text()).toMatch(`Start Date: ${booking.startDate}`)
		expect(wrapper.text()).toMatch(`End Date: ${booking.endDate}`)
	})
})
