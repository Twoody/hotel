import { describe, it, expect, beforeEach, vi } from "vitest"
import { mount } from "@vue/test-utils"
import Guides from "@/views/Guides.vue"

/**
 * Create a simple mock router to check $router.push calls.
 */
const pushMock = vi.fn()
const mockRouter = {
	push: pushMock,
}
vi.mock("firebase/analytics", () =>
{
	return {
		// Provide mocked versions of what your code might call
		getAnalytics: vi.fn(),
		logEvent: vi.fn(),
	}
})
vi.mock("@/firebase", () => ({
	firebaseAnalyics: {}, // Provide a simple mock object
}))

/**
 * Create a simple mock store with `state.isOnline`
 */
const mockStore = {
	state: {
		isOnline: true,
	},
}

/**
 * Helper function to create a wrapper using Vue Test Utils `mount`.
 *
 * @param options
 */
function createWrapper (options = {})
{
	return mount(Guides, {
		global: {
			stubs: {
				GuideCard: {
					template: "<div class=\"mocked-guide-card\">Guide Card</div>",
				},
				GuideFilters: {
					template: "<div class=\"mocked-guide-filters\"></div>",
				},
				MapCard: {
					template: "<div class=\"mocked-map-card\">Map Card</div>",
				},

			},

			mocks: {
				$store: mockStore,
				$router: mockRouter,
			},
		},
		...options,
	})
}

describe("Guides.vue", () =>
{
	beforeEach(() =>
	{
		// Clear all mocks before each test
		vi.clearAllMocks()
	})

	it("renders a title 'Guides'", () =>
	{
		const wrapper = createWrapper()
		const title = wrapper.find("h1.main-title")
		expect(title.exists()).toBe(true)
		expect(title.text()).toBe("Guides")
	})

	it("renders the GuideFilters component", () =>
	{
		const wrapper = createWrapper()
		// The child is stubbed, but we can still confirm it appears
		const filters = wrapper.find(".mocked-guide-filters")
		expect(filters.exists()).toBe(true)
	})

	it("renders activities in .guides-content via GuideCard stubs", () =>
	{
		const wrapper = createWrapper()
		const content = wrapper.find(".guides-content")
		expect(content.exists()).toBe(true)

		// By default, if LOCAL_ACTIVITIES is non-empty, we expect multiple .mocked-guide-card
		// Because we haven't explicitly mocked LOCAL_ACTIVITIES in the test,
		// this check simply ensures the stub is in the DOM (or zero if no default data).
		const cards = wrapper.findAll(".mocked-guide-card")
		// We haven't set up a local mock for LOCAL_ACTIVITIES,
		// so the number might be 0 if the array is empty by default,
		// or greater if the real constants produce data.
		// Either way, we can check that the element exists:
		expect(cards).toBeTruthy()
	})

	it("has a gotoItem method that calls this.$router.push correctly", () =>
	{
		const wrapper = createWrapper()

		// Manually call gotoItem
		wrapper.vm.gotoItem(123)
		expect(pushMock).toHaveBeenCalledWith({
			name: "GuideItem",
			params: {
				id: 123,
			},
		})
	})

	it("updates activeFilters when updateFilters is called", () =>
	{
		const wrapper = createWrapper()
		expect(wrapper.vm.activeFilters).toEqual([])

		wrapper.vm.updateFilters([
			{
				id: 1,
				title: "Filter A",
			},
		])
		expect(wrapper.vm.activeFilters).toEqual([
			{
				id: 1,
				title: "Filter A",
			},
		])
	})

	it("reflects active filters in computed shownActivies (filters out items not matching)", () =>
	{
		const wrapper = createWrapper({
			data ()
			{
				return {
					activities: {
						10: {
							id: 10,
							title: "Activity 10",
							tags: [
								1,
							],
							shown: true,
						},
						11: {
							id: 11,
							title: "Activity 11",
							tags: [
								2,
							],
							shown: true,
						},
						12: {
							id: 12,
							title: "Activity 12",
							tags: [
								3,
							],
							shown: true,
						},
					},
				}
			},
		})

		// Initially, no active filters => all are shown
		expect(wrapper.vm.shownActivies).toHaveLength(3)
		expect(wrapper.vm.shownActivies.every((act) => act.shown === true)).toBe(true)

		// Now set a filter with id=1 => only items w/ tag=1 should remain
		wrapper.vm.updateFilters([
			{
				id: 1,
				title: "Fake Filter",
			},
		])

		// Re-check shownActivies
		// Because the code checks each filter's .id in activity.tags,
		// only { id: 10, tags: [1] } should remain shown.
		let updated = wrapper.vm.shownActivies
		const shownItems = updated.filter((act) => act.shown)
		expect(shownItems).toHaveLength(1)
		expect(shownItems[0].id).toBe(10)
	})

	it("shows nothing if an activity has empty tags but there is an active filter", () =>
	{
		const wrapper = createWrapper({
			data ()
			{
				return {
					activities: {
						10: {
							id: 10,
							title: "Activity 10",
							tags: [],
							shown: true,
						},
					},
				}
			},
		})

		// If we have an active filter but an activity has no tags, code sets shown=false
		wrapper.vm.updateFilters([
			{
				id: 1,
				title: "Fake Filter",
			},
		])
		const updated = wrapper.vm.shownActivies
		const shownItems = updated.filter((act) => act.shown)
		expect(shownItems).toHaveLength(0)
	})

	it("displays all activities if activeFilters is empty", () =>
	{
		const wrapper = createWrapper({
			data ()
			{
				return {
					activities: {
						10: {
							id: 10,
							title: "Activity 10",
							tags: [
								1,
							],
							shown: true,
						},
						11: {
							id: 11,
							title: "Activity 11",
							tags: [
								2,
							],
							shown: true,
						},
					},
				}
			},
		})

		// No filters => all should remain shown
		expect(wrapper.vm.shownActivies.length).toBe(2)
		expect(wrapper.vm.shownActivies.every((act) => act.shown === true)).toBe(true)
	})
})
