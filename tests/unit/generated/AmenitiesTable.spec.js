import { mount } from "@vue/test-utils"
import AmenitiesTable from "@/components/entities/amenities/AmenitiesTable.vue"
import { vi } from "vitest"

const createWrapper = ({ options = {}, } = {}) => 
{
	return mount(AmenitiesTable, {
		global: {
			stubs: {
				AmenitiesSection: {
					name: "AmenitiesSection",
					template: `
						<div>
							<slot name="title"></slot>
							<div class="amenities">
								<slot />
							</div>
						</div>
					`,
					props: [
						"amenities",
					],
				},
			},
		},
		...options,
	})
}

describe("AmenitiesTable.vue", () => 
{
	it("renders the table wrapper", () => 
	{
		const wrapper = createWrapper()
		expect(wrapper.find(".amenities-table-wrapper").exists()).toBe(true)
	})

	it("displays the correct number of amenities sections", () => 
	{
		const wrapper = createWrapper()
		const keys = wrapper.vm.keys
		expect(wrapper.findAllComponents({
			name: "AmenitiesSection", 
		}).length).toBe(keys.length)
	})

	it("sorts keys alphabetically", () => 
	{
		const wrapper = createWrapper()
		const keys = wrapper.vm.keys
		const sortedKeys = [
			...keys,
		].sort((a, b) => a.localeCompare(b))
		expect(keys).toEqual(sortedKeys)
	})

	it("formats titles correctly", () => 
	{
		const wrapper = createWrapper()
		const testKey = "LIVING_ROOM"
		const formattedTitle = wrapper.vm.formatTitle(testKey)
		expect(formattedTitle).toBe("LIVING ROOM")
	})

	it("renders a title for each section", () => 
	{
		const wrapper = createWrapper()
		const keys = wrapper.vm.keys

		keys.forEach((key, index) => 
		{
			const section = wrapper.findAllComponents({
				name: "AmenitiesSection", 
			}).at(index)
			const title = section.find("div").text() // Assuming title is rendered in a div
			expect(title).toBe(wrapper.vm.formatTitle(key))
		})
	})

	it("passes the correct amenities data to each section", () => 
	{
		const wrapper = createWrapper()
		const keys = wrapper.vm.keys

		keys.forEach((key, index) => 
		{
			const section = wrapper.findAllComponents({
				name: "AmenitiesSection", 
			}).at(index)
			expect(section.props("amenities")).toBe(wrapper.vm.AMENITIES[key])
		})
	})
})

