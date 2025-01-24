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

vi.mock("@/src/store/user.js", () => ({
	logoutUser: vi.fn(),
}))
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
				isLoggedIn: true,
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
			updateUserStore: vi.fn(),
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
		const resetPasswordButton = wrapper.find(
			"[data-testid=\"button-user-action-password-reset\"]"
		)
		await resetPasswordButton.trigger("click")

		expect(console.log).toHaveBeenCalledWith("Reset password clicked (TODO).")
	})

	it("updates store when logout button is clicked", async () => 
	{
		const wrapper = createWrapper()
		expect(wrapper.vm.isLoggedIn).toBe(true)

		const logoutButton = wrapper.find(
			"[data-testid=\"button-user-action-logout\"]"
		)
		await logoutButton.trigger("click")
		// this.$store.dispatch("logoutUser")

		expect(wrapper.vm.isLoggedIn).toBe(false)
	})

	it("calls deleteUserAccount when delete account button is clicked", async () => 
	{
		const wrapper = createWrapper()
		const deleteAccountButton = wrapper.find(
			"[data-testid=\"button-user-action-delete-account\"]"
		)
		await deleteAccountButton.trigger("click")

		expect(console.log).toHaveBeenCalledWith("Delete user account clicked (TODO).")
	})

	it("ensures disabled buttons cannot trigger their respective methods", async () => 
	{
		const wrapper = createWrapper()

		const resetPasswordButton = wrapper.find(
			"[data-testid=\"button-user-action-password-reset\"]"
		)
		const deleteAccountButton = wrapper.find(
			"[data-testid=\"button-user-action-delete-account\"]"
		)

		expect(resetPasswordButton.element.disabled).toBe(true)
		expect(deleteAccountButton.element.disabled).toBe(true)

		await resetPasswordButton.trigger("click")
		await deleteAccountButton.trigger("click")

		expect(console.log).not.toHaveBeenCalledWith("Reset password clicked (TODO).")
		expect(console.log).not.toHaveBeenCalledWith("Delete user account clicked (TODO).")
	})
})
