import { mount } from "@vue/test-utils"
import AirbnbCleaning from "@/views/AirbnbCleaning.vue"

describe.concurrent("AirbnbCleaning.vue", () => 
{
	const createWrapper = (options = {}) => 
	{
		return mount(
			AirbnbCleaning,
			{
				global: {
					stubs: {
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
				...options,
			}
		)
	}

	it("renders the main wrapper", () => 
	{
		const wrapper = createWrapper()
		expect(wrapper.classes()).toContain("airbnb-cleaning-wrapper")
	})

	it("renders the tips list", () => 
	{
		const wrapper = createWrapper()
		const tips = wrapper.find(".tips-list")
		expect(tips.exists()).toBe(true)
		expect(tips.findAll("li").length).toBeGreaterThan(0)
	})

	it("conditionally renders living room notes when hasDog is true", () => 
	{
		const wrapper = createWrapper()
		const withDog = wrapper.find(
			"[data-testid=\"title-living-room-with-dog\"]"
		)
		expect(withDog.text()).toContain("Special Notes: Living Room")
	})

	it("renders multiple QuestionAccordion components", () => 
	{
		const wrapper = createWrapper()
		const contentElement = wrapper.find(".accordion-section > div:last-child")
		expect(contentElement.exists()).toBe(true)
		expect(contentElement.text()).toContain("Move holiday pillow")
	})

	it("renders nested accordions for rooms", () => 
	{
		const wrapper = createWrapper()
		const nestedAccordions = wrapper.findAll(".nested-list")
		expect(nestedAccordions.length).toBeGreaterThan(0)
	})

	it("conditionally renders dog-related items in living", () => 
	{
		const wrapper = createWrapper()
		const livingRoom = wrapper.find("[data-testid=\"content-living-room-defaults\"]")
		expect(livingRoom.text()).toContain("dog bed")
	})

	it("conditionally renders flower-related items in dining room when hasFlowers is true", () => 
	{
		const wrapper = createWrapper()
		const diningRoomAccordion = wrapper.find("[data-testid=\"content-dining-room\"]")
		expect(diningRoomAccordion.text()).toContain("Trim flowers if necessary")
	})

	it("ensures the `hasDog` and `hasFlowers` flags work as expected", async () => 
	{
		const wrapper = createWrapper({
			data () 
			{
				return {
					hasDog: false,
					hasFlowers: false, 
				}
			},
		})
		expect(wrapper.html()).not.toContain("dog bed")
		expect(wrapper.html()).not.toContain("Trim flowers if necessary")

		await wrapper.setData({
			hasDog: true,
			hasFlowers: true, 
		})
		expect(wrapper.html()).toContain("dog bed")
		expect(wrapper.html()).toContain("Trim flowers if necessary")
	})

	it("ensures all accordions have titles and content", () => 
	{
		const wrapper = createWrapper()
		const contentElement = wrapper.find(".accordion-section > div:last-child")
		expect(contentElement.exists()).toBe(true)
		expect(contentElement.text()).toContain("Move holiday pillow")

		const accordions = wrapper.findAll(".accordion-section")
		accordions.forEach((accordion) => 
		{
			expect(accordion.exists()).toBe(true)
			expect(accordion.text().length).toBeGreaterThan(0)
		})
	})
})
