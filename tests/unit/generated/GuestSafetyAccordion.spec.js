import { mount } from "@vue/test-utils"
import GuestSafetyAccordion from "@/components/accordions/questions/GuestSafetyAccordion.vue"

/**
 *
 */
function createWrapper () 
{
	return mount(
		GuestSafetyAccordion,
		{
			global:
			{
				stubs:
				{
					QuestionAccordion:
					{
						name: "QuestionAccordion",
						props: [
							"hasNested",
						],
						template: `
							<section class="accordion-section">
								<header class="title-wrappper">
									<slot name="title" />
								</header>
								<div class="content-slot">
									<slot name="content" />
								</div>
							</section>
						`,
					},
				},
			},
		}
	)
}

let wrapper

describe("GuestSafetyQuestionAccordion", () => 
{
	it("Has a title of \"Guest Safety\"", () => 
	{
		wrapper = createWrapper()
		const titleElement = wrapper.find(".accordion-section > header:first-child")

		expect(titleElement.exists()).toBe(true)
		expect(titleElement.text()).toContain("Guest Safety")
	})

	it("Has correct content about guest safety", () => 
	{
		wrapper = createWrapper()
		const contentElement = wrapper.find(".accordion-section > div:last-child")
		expect(contentElement.exists()).toBe(true)
		expect(contentElement.text()).toContain(
			"We live in the area and are in touch with leading local experts."
		)
		expect(contentElement.text()).toContain(
			"We encourage communication and provide guests with important local information."
		)
	})
})
