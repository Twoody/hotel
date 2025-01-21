import { shallowMount } from "@vue/test-utils"
import UserSettings from "@/path/to/user/settings/AccountSettings.vue"
import Spinner from "@/path/to/spinner/Spinner.vue"
import AccountSettings from "@/views/settings/AccountSettings.vue"
import PrivacyAndSecuritySettings from "@/views/settings/PrivacyAndSecuritySettings.vue"
import ProfileSettings from "@/views/settings/ProfileSettings.vue"

describe("UserSettings.vue", () => 
{
	let wrapper

	beforeEach(() => 
	{
		wrapper = shallowMount(UserSettings)
	})

	afterEach(() => 
	{
		wrapper.destroy()
	})

	it("renders spinner if auth not ready", () => 
	{
		// mock the computed prop isAuthReady to return false
		wrapper = shallowMount(UserSettings, {
			computed: {
				isAuthReady: () => false,
			},
		})

		expect(wrapper.findComponent(Spinner).exists()).toBe(true)
	})

	// create similar tests for remaining scenarios
  
	it("renders AccountSettings when activeTab id is 0", () => 
	{
		wrapper = shallowMount(UserSettings, {
			data: () => ({
				activeTab: {
					id: 0, 
				}, 
			}),
			computed: {
				isAuthReady: () => true,
				isLoggedIn: () => true,
			},
		})

		expect(wrapper.findComponent(AccountSettings).exists()).toBe(true)
	})

	// create similar tests for remaining sub-components
  
	it("calls handleTabNavigation when Filters component emits update", () => 
	{
		const mockTabId = 1 // replace with appropriate value
		wrapper.setData({
			activeTab: {
				id: 0, 
			}, 
		})

		wrapper.vm.handleTabNavigation = jest.fn()
		wrapper.find("filters-selector").vm.$emit("update", mockTabId) // replace 'filters-selector' with your Filters component's selector

		expect(wrapper.vm.handleTabNavigation).toHaveBeenCalledWith(mockTabId)
	})
})
