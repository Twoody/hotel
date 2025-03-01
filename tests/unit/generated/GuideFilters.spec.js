import { mount } from "@vue/test-utils"
import { vi } from "vitest"
import MapFilters from "@/components/buttons/filters/MapFilters.vue"

// 1) Define any hoisted variables/functions you need:
const { mockLogEvent, } = vi.hoisted(() => 
{
	// This function is hoisted above all other code in the module.
	// So we can safely define mockLogEvent here for the upcoming vi.mock call.
	return {
		mockLogEvent: vi.fn(),
	}
})

// Mock Firebase logEvent
vi.mock("firebase/analytics", () => ({
	logEvent: mockLogEvent,
}))
vi.mock("firebase/auth", () => ({
	getAuth: vi.fn(),
}))

// Mock Local Firebase helpers
vi.mock("@/firebase.js", () => ({
	db: {},
	firebaseAnalyics: {},
}))

// Mock constants
vi.mock("constants/misc.js", () => ({
	MAP_FILTERS: {
		1: "Filter A",
		2: "Filter B",
		3: "Filter C",
	},
}))

// Helper function to create wrapper
const createWrapper = (options = {}) => 
{
	return mount(MapFilters, {
		global: {
			stubs:
			{
				Filters:
				{
					name: "Filters",
					template: `<div>
						<button
							v-for="filter in filters"
							:key="filter.id"
							@click="$emit('update', filter.id)">
							{{ filter.title }}
						</button>
					</div>`,
					props: {
						filters: Array,
						inactive: Boolean,
					},
				},
			},
		},
		...options,
	})
}

describe("MapFilters.vue", () => 
{
	it("renders two Filters components", () => 
	{
		const wrapper = createWrapper()
		const filters = wrapper.findAllComponents({
			name: "Filters", 
		})
		expect(filters).toHaveLength(2)
	})

	it("properly computes active and inactive filters", () => 
	{
		const wrapper = createWrapper()
		wrapper.vm.filtersAll = {
			1: {
				id: 1,
				title: "Filter A",
				active: false, 
			},
			2: {
				id: 2,
				title: "Filter B",
				active: true, 
			},
			3: {
				id: 3,
				title: "Filter C",
				active: false, 
			},
		}

		expect(wrapper.vm.filtersActive).toEqual([
			{
				id: 2,
				title: "Filter B",
				active: true, 
			},
		])
		expect(wrapper.vm.filtersInactive).toEqual([
			{
				id: 1,
				title: "Filter A",
				active: false, 
			},
			{
				id: 3,
				title: "Filter C",
				active: false, 
			},
		])
	})

	it("emits 'updated-active' event when active filters change", async () => 
	{
		const wrapper = createWrapper()
		wrapper.vm.filtersAll = {
			1: {
				id: 1,
				title: "Filter A",
				active: false, 
			},
			2: {
				id: 2,
				title: "Filter B",
				active: false, 
			},
		}
		expect(wrapper.vm.filtersActive?.length).not.toBeTruthy()

		await wrapper.setData({
			filtersAll: {
				1: {
					id: 1,
					title: "Filter A",
					active: true, 
				},
				2: {
					id: 2,
					title: "Filter B",
					active: false, 
				},
			},
		})
		await wrapper.vm.$nextTick()

		expect(wrapper.vm.filtersActive?.length).toBeTruthy()
		expect(wrapper.emitted()["updated-active"]).toBeTruthy()
		expect(wrapper.emitted()["updated-active"][1]).toEqual([
			[
				{
					id: 1,
					title: "Filter A",
					active: true, 
				},
			],
		])
	})

	it("toggles filters when handleClick is called", () => 
	{
		const wrapper = createWrapper()
		wrapper.vm.filtersAll = {
			1: {
				id: 1,
				title: "Filter A",
				active: false, 
			},
		}

		wrapper.vm.handleClick(1)

		expect(wrapper.vm.filtersAll[1].active).toBe(true)
	})

	it("builds filters correctly on creation", () => 
	{
		const wrapper = createWrapper()

		expect(wrapper.vm.filtersAll).toEqual({
			1: {
				id: 1,
				title: "Filter A",
				active: false, 
			},
			2: {
				id: 2,
				title: "Filter B",
				active: false, 
			},
			3: {
				id: 3,
				title: "Filter C",
				active: false, 
			},
		})
	})

	it("calls Firebase logEvent when handleClick is called", () => 
	{
		const wrapper = createWrapper()
		wrapper.vm.filtersAll = {
			1: {
				id: 1,
				title: "Filter A",
				active: false, 
			},
		}

		// Trigger handleClick
		wrapper.vm.handleClick(1)

		// Check our hoisted mock was called
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(), // the firebaseAnalyics object
			"map_filter_set",
			{
				value: "Filter A", 
			}
		)
	})

	it("handles errors gracefully when Firebase logEvent fails", () => 
	{
		const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => 
		{})
		// Make `mockLogEvent` throw
		mockLogEvent.mockImplementationOnce(() => 
		{
			throw new Error("Firebase error")
		})

		const wrapper = createWrapper()
		wrapper.vm.filtersAll = {
			1: {
				id: 1,
				title: "Filter A",
				active: false, 
			}, 
		}

		wrapper.vm.handleClick(1)

		expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error))
		expect(consoleErrorSpy).toHaveBeenCalledWith(new Error("Firebase error"))
		consoleErrorSpy.mockRestore()
	})

	it("sorts filters alphabetically", () => 
	{
		const wrapper = createWrapper()
		const sorted = wrapper.vm.sortFilter({
			title: "B", 
		}, {
			title: "A", 
		})
		expect(sorted).toBe(1)

		const sortedEqual = wrapper.vm.sortFilter({
			title: "A", 
		}, {
			title: "A", 
		})
		expect(sortedEqual).toBe(0)

		const sortedReverse = wrapper.vm.sortFilter({
			title: "A", 
		}, {
			title: "B", 
		})
		expect(sortedReverse).toBe(-1)
	})
})

