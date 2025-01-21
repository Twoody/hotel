import { shallowMount } from "@vue/test-utils"
import ParkingQuestionAccordion from "@/components/ParkingQuestionAccordion.vue" // Path to your component

describe("ParkingQuestionAccordion", () => 
{
	it("renders correctly", () => 
	{
		const wrapper = shallowMount(ParkingQuestionAccordion)
		expect(wrapper.element).toMatchSnapshot()
	})
})
