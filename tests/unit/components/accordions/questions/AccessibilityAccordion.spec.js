import { mount } from "@vue/test-utils"
import AccessibilityAccordion from "@/components/accordions/questions/AccessibilityAccordion.vue"

/**
 * Helper function to create a wrapper 
 */
function createWrapper () 
{
	return mount(
		AccessibilityAccordion,
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
								<div><slot name="content"></slot></div>
							</div>
						`,
					},
				},
			},
		}
	)
}

describe("AccessibilityAccordion.vue", () => 
{
	test("renders accordion section", () => 
	{
		const wrapper = createWrapper()
		expect(wrapper.classes()).toContain("accordion-section")
	})

	test("renders title correctly", () => 
	{
		const wrapper = createWrapper()
		const titleElement = wrapper.find(".accordion-section > div:first-child")
		expect(titleElement.exists()).toBe(true)
		expect(titleElement.text()).toContain("Accessibility")
	})

	test("renders content correctly", () => 
	{
		const wrapper = createWrapper()
		const contentElement = wrapper.find(".accordion-section > div:last-child")
		expect(contentElement.exists()).toBe(true)
		expect(contentElement.text()).toContain("We believe that anyone can belong anywhere")
		expect(contentElement.text()).toContain("Please reach out")
		expect(contentElement.text()).toContain("Wheelchair accessibility is our biggest \"next step\" for our space.")
		expect(contentElement.text()).toContain("We apologize for that inconvenience.")
	})
})

