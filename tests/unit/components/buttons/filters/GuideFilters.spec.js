import { mount } from "@vue/test-utils"
import { vi } from "vitest"
import GuideFilters from "@/components/buttons/filters/GuideFilters.vue"
// Mock Firebase analytics
vi.mock("firebase/analytics", () => ({
	getAnalytics: vi.fn(),
	logEvent: vi.fn(),
}))

// Mock local Firebase helpers
vi.mock("@/firebase", () => ({
	firebaseAnalytics: {}, // Provide a simple mock object
}))

const mockFilters = {
	1: "Filter One",
	2: "Filter Two",
	3: "Filter Three",
}

/**
 *
 * @param customFilters
 */
function createWrapper (customFilters = mockFilters) 
{
	return mount(GuideFilters, {
		global: {
			stubs: {
				Filters: true, // Stub Filters component
			},
		},
		data () 
		{
			return {
				filters: customFilters,
			}
		},
	})
}

describe.concurrent("GuideFilters.vue", () => 
{
	it("renders the guide filters wrapper", () => 
	{
		const wrapper = createWrapper()
		expect(wrapper.find("div.guide-filters-wrapper").exists()).toBe(true)
		expect(wrapper.classes()).toContain("guide-filters-wrapper")
	})

	it("renders active and inactive filters", () => 
	{
		const wrapper = createWrapper()
		const inactiveFilters = wrapper.vm.filtersInactive
		const activeFilters = wrapper.vm.filtersActive

		expect(inactiveFilters.length).toBe(3) // All filters should be inactive initially
		expect(activeFilters.length).toBe(0) // No filters should be active initially

		// Stubbed Filters component should be rendered twice
		const filtersComponents = wrapper.findAllComponents({
			name: "Filters", 
		})
		expect(filtersComponents.length).toBe(2)
	})

	it("emits an event when filters are updated", async () => 
	{
		const wrapper = createWrapper()

		// Simulate making a filter active
		await wrapper.vm.handleClick(1)

		expect(wrapper.vm.filtersAll[1].active).toBe(true) // Ensure the filter is now active

		// Check if the 'updated-active' event was emitted with the correct filters
		expect(wrapper.emitted("updated-active")).toBeTruthy()
		expect(wrapper.emitted("updated-active")[1][0]).toEqual([
			{
				id: 1,
				title: "Filter One",
				active: true, 
			},
		])
	})

	it("sorts filters alphabetically", () => 
	{
		const customFilters = {
			1: "Zebra",
			2: "Apple",
			3: "Banana",
		}

		const wrapper = createWrapper(customFilters)
		const sortedActive = wrapper.vm.filtersInactive

		expect(sortedActive[0].title).toBe("Apple")
		expect(sortedActive[1].title).toBe("Banana")
		expect(sortedActive[2].title).toBe("Zebra")
	})

	it("updates the filter state when clicked", async () => 
	{
		const wrapper = createWrapper()

		// Initially, all filters are inactive
		expect(wrapper.vm.filtersInactive.length).toBe(3)
		expect(wrapper.vm.filtersActive.length).toBe(0)

		// Simulate clicking a filter to make it active
		await wrapper.vm.handleClick(1)

		// Check if the filter is now active
		expect(wrapper.vm.filtersActive.length).toBe(1)
		expect(wrapper.vm.filtersInactive.length).toBe(2)

		// Simulate clicking the same filter again to deactivate it
		await wrapper.vm.handleClick(1)

		// Ensure the filter is now inactive
		expect(wrapper.vm.filtersActive.length).toBe(0)
		expect(wrapper.vm.filtersInactive.length).toBe(3)
	})
})

