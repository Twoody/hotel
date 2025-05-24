import { mount } from "@vue/test-utils"
import TrashAccordion from "@/components/accordions/questions/TrashAccordion.vue"

/**
 * Helper function to create a wrapper 
 */
function createWrapper () 
{
	return mount(
		TrashAccordion,
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

describe.concurrent("TashAccordion.vue", () => 
{
	test("renders the correct title", () => 
	{
		const wrapper = createWrapper()
		const trashTitle = wrapper.find("[data-testid=\"FAQ-trash-title\"]")

		expect(trashTitle.text()).toBe("Trash + Recycling + Pets")
	})

	test("renders the correct content", () => 
	{
		const wrapper = createWrapper()
		const info = wrapper.find(".trash-info")

		expect(info.exists()).toBe(true)
		expect(info.text()).toContain(
			"Trash, recycling, and composte is picked up every Tuesday morning"
		)
	})

	test("renders the correct classes", () => 
	{
		const wrapper = createWrapper()

		expect(wrapper.classes()).toContain("trash-accordion-section")
	})

	test("renders li elements correctly with color styling", () => 
	{
		const wrapper = createWrapper()

		const trash = wrapper.find("li:nth-of-type(1) span")
		expect(trash.text()).toBe("Trash is the green bin.")
		expect(trash.attributes().style).toBe("color: green;")
		// Repeat for other li elements
	})

	test("has the correct name", () => 
	{
		const wrapper = createWrapper()

		expect(wrapper.vm.$options.name).toBe("TashAccordion")
	})
})
