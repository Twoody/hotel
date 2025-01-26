// tests/unit/Amenities.spec.js
import { mount } from "@vue/test-utils"
import { describe, it, expect, beforeEach } from "vitest"
import Amenities from "@/views/Amenities.vue"

/**
 *
 * @param options
 */
function createWrapper (options = {})
{
	return mount(Amenities, {
		// We can stub out the child component if needed, especially if
		// AmenitiesTable makes additional network/store calls we want to avoid here.
		global: {
			stubs: {
				AmenitiesTable: {
					name: "AmenitiesTable",
					template: "<div class=\"stubbed-amenities-table\"></div>",
				},
			},
		},
		...options,
	})
}

describe("Amenities.vue", () =>
{
	let wrapper

	beforeEach(() =>
	{
		wrapper = createWrapper()
	})

	it("mounts the component successfully", () =>
	{
		expect(wrapper.exists()).toBe(true)
	})

	it("renders the correct heading", () =>
	{
		const heading = wrapper.find("h1")
		expect(heading.exists()).toBe(true)
		expect(heading.text()).toBe("Amenities")
	})

	it("contains the amenities-wrapper class", () =>
	{
		const container = wrapper.find(".amenities-wrapper")
		expect(container.exists()).toBe(true)
	})

	it("renders the AmenitiesTable component", () =>
	{
		// We stubbed out AmenitiesTable above as <div class="stubbed-amenities-table" />
		// so let's check that the stub is present:
		const tableStub = wrapper.find(".stubbed-amenities-table")
		expect(tableStub.exists()).toBe(true)
	})
})

