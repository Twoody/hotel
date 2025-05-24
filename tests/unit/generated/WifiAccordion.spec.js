import { mount } from "@vue/test-utils"
import WifiAccordion from "@/components/accordions/questions/WifiAccordion.vue"

/**
 * Helper function to create a wrapper
 */
function createWrapper ()
{
	return mount(
		WifiAccordion,
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

describe.concurrent("WifiAccordion", () =>
{
	let wrapper

	beforeEach(() =>
	{
		wrapper = createWrapper()
	})

	afterEach(() =>
	{
		wrapper.unmount()
	})

	it("should have a proper title", () =>
	{
		const titleElement = wrapper.find(".accordion-section > div:first-child")
		expect(titleElement.exists()).toBe(true)
		expect(titleElement.text()).toContain("Wifi")
	})

	it("should have proper content", () =>
	{
		const content = wrapper.find(".wifi-accordion-section")
		expect(content.exists()).toBe(true)
		expect(content.text()).toContain("our internet speeds have you covered")
		expect(content.text()).toContain("please contact Tanner")
	})
})
