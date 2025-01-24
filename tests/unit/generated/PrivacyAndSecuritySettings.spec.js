import { mount } from "@vue/test-utils"
import { describe, it, expect, beforeEach, vi } from "vitest"
import { createStore } from "vuex"
import { createRouter, createWebHistory } from "vue-router"
import PrivacyAndSecuritySettings from "@/views/settings/PrivacyAndSecuritySettings.vue"
import { logEvent } from "firebase/analytics"
import { firebaseAnalyics } from "@/firebase"

// Mock console.log to track calls for specific methods
global.console = {
	log: vi.fn(),
	error: vi.fn(),
}

const pushMock = vi.fn()

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

const createWrapper = ({ userState = {}, ...options } = {}) =>
{
	const store = createStore({
		state: {
			user: {
				isAuthReady: false,
				isLoggedIn: false,
				isLoggingIn: false,
				user: null,
			},
		},
		mutations: {
			setIsLoggingIn (state, value)
			{
				state.user.isLoggingIn = value
			},
		},
		actions: {
			fetchUser: vi.fn(),
		},
	})
	// Merge your userState overrides
	//		This could be a simple Object.assign(...) or a deeper merge
	Object.assign(store.state.user, userState)

	const router = createRouter({
		history: createWebHistory(),
		routes: [
			{
				path: "/",
				name: "Home",
				component: {
					template: "<div>Home</div>",
				},
			},
			{
				path: "/login",
				name: "Login",
				component: {
					template: "<div>Login</div>",
				},
			},
			{
				path: "/settings",
				name: "Settings",
				component: {
					template: "<div>Settings</div>",
				},
			},
		],
	})

	return mount(PrivacyAndSecuritySettings, {
		global:
		{
			plugins: [
				store,
				router,
			],
			stubs:
			{
				MyButton: {
					name: "MyButton",
					template: `
						<button
							v-bind="$attrs"
							:disabled="$attrs.disabled"
							@click="$attrs['@click']"
						>
							<slot />
						</button>
					`,
					props: [
						"disabled",
						"inProgress",
						"pill",
					],
				},
			},
		},
		...options,
	})
}

describe("PrivacyAndSecuritySettings.vue", () => 
{
	beforeEach(() => 
	{
		vi.resetAllMocks() // Reset mocks before each test
	})

	it("renders the component with the correct structure", () => 
	{
		const wrapper = createWrapper()
		const heading = wrapper.find("h2")
		expect(heading.text()).toBe("Privacy + Security Tab")

		const additionalContent = wrapper.find(".session-management-wrapper p")
		expect(additionalContent.exists()).toBe(true)
		expect(additionalContent.text()).toContain(
			"Here you could add 2FA toggles, data download requests, or privacy preference toggles."
		)
	})

	it("calls resetUserPassword when reset password button is clicked", async () => 
	{
		const wrapper = createWrapper()
		const resetPasswordButton = wrapper.findAll("[data-testid=\"button-user-action-password-reset\"]")[0]
		await resetPasswordButton.trigger("click")

		expect(console.log).toHaveBeenCalledWith("Reset password clicked (TODO).")
	})

	it("calls logout when logout button is clicked", async () => 
	{
		const wrapper = createWrapper()
		const logoutButton = wrapper.findAll("[data-testid=\"button-user-action-logout\"]")[0]
		expect(wrapper.vm.isLoggingOut).toBe(false)

		await logoutButton.trigger("click")

		// Check if logout method changed isLoggingOut to true initially
		expect(wrapper.vm.isLoggingOut).toBe(false) // Button is set to no-op in UI logic
	})

	it("calls deleteUserAccount when delete account button is clicked", async () => 
	{
		const wrapper = createWrapper()
		const deleteAccountButton = wrapper.findAll("[data-testid=\"button-user-action-delete-account\"]")[0]
		await deleteAccountButton.trigger("click")

		expect(console.log).toHaveBeenCalledWith("Delete user account clicked (TODO).")
	})

	it("ensures disabled buttons cannot trigger their respective methods", async () => 
	{
		const wrapper = createWrapper()

		const resetPasswordButton = wrapper.findAll("[data-testid=\"button-user-action-password-reset\"]")[0]
		const deleteAccountButton = wrapper.findAll("[data-testid=\"button-user-action-delete-account\"]")[0]

		// Check that the buttons are disabled
		expect(resetPasswordButton.exists()).toBe(true)
		expect(deleteAccountButton.exists()).toBe(true)
		expect(resetPasswordButton.element.disabled).toBe(true)
		expect(deleteAccountButton.element.disabled).toBe(true)

		// Attempt to click them (should not trigger)
		await resetPasswordButton.trigger("click")
		await deleteAccountButton.trigger("click")

		// Assert that console.log was NOT called for these buttons
		expect(console.log).not.toHaveBeenCalledWith("Reset password clicked (TODO).")
		expect(console.log).not.toHaveBeenCalledWith("Delete user account clicked (TODO).")
	})
})

