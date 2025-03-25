import { mount } from "@vue/test-utils"
import { describe, it, expect, vi } from "vitest"
import GuideItem from "@/views/GuideItem.vue" // Adjust import to actual path

/**
 * A minimal mock for localActivities constant.
 * In your real project, you might simply let the code load the real constant,
 * or mock it more comprehensively if needed.
 */
vi.mock("constants/localActivities.js", () => ({
	LOCAL_ACTIVITIES: {
		valid_id: {
			title: "Test Activity",
			address: "https://guides.google.com/?q=Test+Activity",
			email: "mailto:test@example.com",
			phone: "tel:+12345678",
			href: "http://example.com",
		},
	},
}))

/**
 * Helper function to create a wrapped instance of the GuideItem component.
 * Use this approach to manage routing mocks, stubs, etc.
 *
 * @param {object} options - Additional mounting options or mocks
 * @param {object} routeParams - Mock route params
 */
function createWrapper (options = {}, routeParams = {})
{
	return mount(GuideItem, {
		global: {
			mocks: {
				$route: {
					params: {
						// Default to "valid_id" if not provided
						id: "valid_id",
						...routeParams,
					},
				},
			},
			stubs: {
				MyButton: {
					name: "MyButton",
					template: `
						<button
							v-bind="$attrs"
							:class="$attrs.class"
							:disabled="$attrs.disabled"
						>
							<slot />
						</button>
					`,
				},
			},

		},
		...options,
	})
}

describe("GuideItem.vue", () =>
{
	it("renders content if the route param has a valid entry in LOCAL_ACTIVITIES", () =>
	{
		// Default route param is valid_id
		const wrapper = createWrapper()

		// Expect "Guide Item: Test Activity"
		expect(wrapper.text()).toContain("Guide Item: Test Activity")

		// The contact toolbar should appear:
		// phone, directions (Guides), email
		const phoneButton = wrapper.find(".button-phone a.linked")
		expect(phoneButton.exists()).toBe(true)
		expect(phoneButton.attributes("href")).toBe("tel:+12345678")

		const directionsButton = wrapper.find(".button-directions a.linked")
		expect(directionsButton.exists()).toBe(true)
		expect(directionsButton.attributes("href")).toBe("https://guides.google.com/?q=Test+Activity")

		const emailButton = wrapper.find(".button-email a.linked")
		expect(emailButton.exists()).toBe(true)
		expect(emailButton.attributes("href")).toBe("mailto:test@example.com")
	})

	it("shows 'Guide Item Not Found' if the route param has no matching activity", () =>
	{
		// Provide a nonsense route param
		const wrapper = createWrapper({}, {
			id: "invalid_id",
		})

		// The page should show "Guide Item Not Found"
		expect(wrapper.text()).toContain("Guide Item Not Found")

		// Confirm contact links do NOT exist
		expect(wrapper.find(".button-phone").exists()).toBe(false)
		expect(wrapper.find(".button-directions").exists()).toBe(false)
		expect(wrapper.find(".button-email").exists()).toBe(false)
	})

	it("computed properties match the data from LOCAL_ACTIVITIES (valid_id)", () =>
	{
		const wrapper = createWrapper()
		// We can directly check the computed props
		expect(wrapper.vm.title).toBe("Test Activity")
		expect(wrapper.vm.address).toBe("https://guides.google.com/?q=Test+Activity")
		expect(wrapper.vm.email).toBe("mailto:test@example.com")
		expect(wrapper.vm.phone).toBe("tel:+12345678")
		expect(wrapper.vm.href).toBe("http://example.com")
		expect(wrapper.vm.hasContent).toBe(true)
	})

	it("computed properties are empty strings when the activity is missing or invalid", () =>
	{
		const wrapper = createWrapper({}, {
			id: "missing",
		})
		expect(wrapper.vm.title).toBe("")
		expect(wrapper.vm.address).toBe("")
		expect(wrapper.vm.email).toBe("")
		expect(wrapper.vm.phone).toBe("")
		expect(wrapper.vm.href).toBe("")
		expect(wrapper.vm.hasContent).toBe(false)
	})
})

