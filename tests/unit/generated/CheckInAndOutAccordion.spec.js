import { mount } from "@vue/test-utils"
import { describe, it, expect, beforeEach } from "vitest"
import CheckInAndOutAccordion from "@/components/accordions/questions/CheckInAndOutAccordion.vue"

// A helper function to create the wrapper using `mount`
/**
 *
 * @param options
 */
function createWrapper (options = {}) 
{
	return mount(CheckInAndOutAccordion, {
		global: {
			// Stub the <QuestionAccordion> so it won't throw an error if the real component
			// is not globally registered or not imported.
			stubs: {
				QuestionAccordion: {
					name: "QuestionAccordion",
					props: [
						"hasNested",
					],
					template: `
						<section class="question-accordion-stub">
							<header>
								<slot name="title" />
							</header>
							<div class="content-slot">
								<slot name="content" />
							</div>
						</section>
					`,
				},
			},
			// You could add additional global plugins or mocks if needed:
			// plugins: [router, store], etc.
		},
		...options,
	})
}

describe("CheckInAndOutAccordion.vue", () => 
{
	let wrapper

	beforeEach(() => 
	{
		wrapper = createWrapper()
	})

	it("mounts without error", () => 
	{
		expect(wrapper.exists()).toBe(true)
	})

	it("displays the correct title slot content", () => 
	{
		// Because we stubbed <QuestionAccordion>, the #title slot should appear in the stub
		// We'll just check text content in the wrapper for the known text "Check In / Check Out".
		expect(wrapper.text()).toContain("Check In / Check Out")
	})

	it("displays the correct content slot content", () => 
	{
		// The #content slot includes the instructions. We'll confirm each portion is present.
		expect(wrapper.text()).toContain("Check in by getting the details via airbnb for now.")
		expect(wrapper.text()).toContain("Check out by just sending us a text,")
	})
})

