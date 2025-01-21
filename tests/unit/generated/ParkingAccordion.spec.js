import { mount } from "@vue/test-utils"
import ParkingAccordion from "@/components/accordions/questions/ParkingAccordion.vue"

/**
 *
 */
function createWrapper () 
{
	return mount(
		ParkingAccordion,
		{
			global:
			{
				stubs:
				{
					QuestionAccordion:
					{
						template: `
							<div class="accordion-section">
								<div><slot name="title"></slot></div>
								<div class='content-section'><slot name="content"></slot></div>
							</div>
						`,
					},
				},
			},
		}
	)
}

describe("ParkingAccordion", () => 
{
	it("renders the title as \"Parking\"", () => 
	{
		const wrapper = createWrapper()
    
		const titleElement = wrapper.find(".accordion-section > div:first-child")
		expect(titleElement.exists()).toBe(true)
		expect(titleElement.text()).toContain("Parking")
	})

	it("renders the parking information correctly", () => 
	{
		const wrapper = createWrapper()
    	const contentElement = wrapper.find(".accordion-section > div:last-child")
		expect(contentElement.exists()).toBe(true)
		expect(contentElement.text()).toContain(
			"Street parking is available outside of the entrance to the studio."
		)
		expect(contentElement.text()).toContain(
			"We keep an orange cone out for multiple functions."
		)
	})

	it("renders the instructions list correctly", () => 
	{
		const wrapper = createWrapper()
    
		const nestedAccordions = wrapper.findAll(".content-section")
		expect(nestedAccordions.length).toBeGreaterThan(0)
		expect(nestedAccordions.length).toBe(1)
		expect(nestedAccordions[0].text()).toContain("Feel free to keep the door open as need be with it.")
		expect(nestedAccordions[0].text()).toContain("Place it behind your car if you are worried about the corner.")
		expect(nestedAccordions[0].text()).toContain("Use it as a sign you are at the right place.")
	})
})
