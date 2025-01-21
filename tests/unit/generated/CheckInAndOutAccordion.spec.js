import { mount } from "@vue/test-utils"
import CheckInAndOutQuestionAccordion from "@/components/accordions/questions/CheckInAndOutAccordion.vue"

describe("CheckInAndOutQuestionAccordion.vue", () => 
{
	let wrapper

	beforeEach(() => 
	{
		wrapper = mount(CheckInAndOutQuestionAccordion)
	})

	it("renders the title properly ", () => 
	{
		expect(wrapper.find(".accordion-section").text()).toContain("Check In / Check Out")
	})

	it("renders the check in instructions ", () => 
	{
		expect(wrapper.text()).toContain("Check in by getting the details via airbnb for now.")
	})
  
	it("renders the check out instructions", () => 
	{
		expect(wrapper.text()).toContain("Check out by just sending us a text, letting us know when you are gone.")
	})
})
