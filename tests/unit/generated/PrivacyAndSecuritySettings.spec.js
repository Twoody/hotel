import { mount } from "@vue/test-utils"
import { describe, it, expect, beforeEach, vi } from "vitest"
import { createStore } from "vuex"
import { createRouter, createWebHistory } from "vue-router"
import PrivacyAndSecuritySettings from "@/views/settings/PrivacyAndSecuritySettings.vue"

vi.mock("@/src/store/user.js", () => ({
	logoutUser: vi.fn(),
}))
vi.mock("firebase/analytics", () =>
{
	return {
		// Provide mocked versions of what your code might call
		getAnalytics: vi.fn(),
	}
})
vi.mock("firebase/auth", () => ({
	signOut: vi.fn().mockResolvedValue(),
}))

vi.mock("@/firebase", () => ({
	db: {},
	firebaseAuth: {},
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
			setIsLoggedIn (state, value)
			{
				state.user.isLoggedIn = value
			},
		},

		actions: {
			fetchUser: vi.fn(),
			updateUserStore: vi.fn(),
			logoutUser: ({ commit, }) => commit("setIsLoggedIn", false),
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
							:disabled="disabled"
								:class="{ disabled: disabled }"
								@click="$emit('click', $event)"
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

	it("updates store when logout button is clicked", async () =>
	{
		const wrapper = createWrapper()
		await wrapper.vm.$router.push({
			path: "/settings",
			query: {
				"active-tab": 1,
			},
		})

		expect(wrapper.vm.isLoggingOut).toBe(false)
		await wrapper.vm.$nextTick()

		// Verify the initial state
		expect(wrapper.vm.$store.state.user.isLoggedIn).toBe(true)

		const logoutButton = wrapper.find("[data-testid=\"button-user-action-logout\"]")
		await logoutButton.trigger("click")

		// Wait for the logout method to complete
		await wrapper.vm.$nextTick()

		// TODO: Similar test to check that the route is updated
		// expect(wrapper.vm.$router.currentRoute.value.path).toBe("/");

		// Verify the Vuex state was updated
		expect(wrapper.vm.$store.state.user.isLoggedIn).toBe(false)
	})
	it("ensures disabled buttons cannot trigger their respective methods", async () =>
	{
		const wrapper = createWrapper({
			userState: {
				isLoggedIn: false, // Set a scenario where the user is not logged in
			},
		})
		await wrapper.vm.$nextTick()

		const resetPasswordButton = wrapper.findComponent(
			"[data-testid=\"button-user-action-password-reset\"]"
		)
		const deleteAccountButton = wrapper.find(
			"[data-testid=\"button-user-action-delete-account\"]"
		)

		expect(wrapper.vm.canResetPassword).toBe(false)
		expect(wrapper.vm.canDeleteAccount).toBe(false)

		// Check that the buttons are disabled based on the reactive state
		expect(resetPasswordButton.classes()).toContain("disabled")
		expect(deleteAccountButton.classes()).toContain("disabled")

		// Attempt to trigger a click (shouldn't work because the buttons are disabled)
		await resetPasswordButton.trigger("click")
		await deleteAccountButton.trigger("click")

		// Verify that console.log wasn't called since methods shouldn't execute
		const consoleSpy = vi.spyOn(console, "log")
		expect(consoleSpy).not.toHaveBeenCalled()
		consoleSpy.mockRestore()
	})

	it("calls resetUserPassword when reset password button is clicked", async () =>
	{
		const wrapper = createWrapper({
			userState: {
				isLoggedIn: true, // Ensure the user is logged in to enable the button
			},
		})

		const consoleSpy = vi.spyOn(console, "log").mockImplementation(() =>
		{})

		const resetPasswordButton = wrapper.findComponent(
			"[data-testid=\"button-user-action-password-reset\"]"
		)
		expect(resetPasswordButton.exists()).toBe(true)

		// Trigger the click event
		await resetPasswordButton.vm.$emit("click")

		// Verify the method was called
		expect(consoleSpy).toHaveBeenCalledWith("Reset password clicked (TODO).")
	})

	it("calls deleteUserAccount when delete account button is clicked", async () =>
	{
		const wrapper = createWrapper({
			userState: {
				isLoggedIn: true,
			}, // Enable the button
		})

		const consoleSpy = vi.spyOn(console, "log").mockImplementation(() =>
		{})

		const deleteAccountButton = wrapper.findComponent(
			"[data-testid=\"button-user-action-delete-account\"]"
		)

		// Trigger the click event
		await deleteAccountButton.vm.$emit("click")

		// Verify the method was called
		expect(consoleSpy).toHaveBeenCalledWith("Delete user account clicked (TODO).")
	})
})
