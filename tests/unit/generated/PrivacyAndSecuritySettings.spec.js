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
				DialogModal: {
					name: "DialogModal",
					template: `
						<div class="dialog-modal-wrapper">
							<div class="title-wrapper">
								<slot name="title"/>
							</div>
							<div class="content-wrapper">
								<slot name="content"/>
							</div>
							<button
								class='cta-button'
								@click="$emit('click', $event)"
							>
								Close Modal
							</button>
						</div>
					`,
				},

				Validatable: {
					name: "Validatable",
					template: "<div class='validatable-stub'><slot /></div>",
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
		// Mock the resetUserPassword method
		const resetUserPasswordMock = vi.spyOn(PrivacyAndSecuritySettings.methods, "resetUserPassword")

		const wrapper = createWrapper({
			userState: {
				isLoggedIn: true, // Ensure the user is logged in to enable the button
				user: {
					email: "test@example.com", 
				}, // Mock the current user's email
			},
		})

		// Find the reset password button and trigger click event
		const resetPasswordButton = wrapper.find("[data-testid='button-user-action-password-reset']")

		// Ensure the button is enabled
		expect(resetPasswordButton.exists()).toBe(true)
		expect(wrapper.vm.canResetPassword).toBe(true)
		expect(wrapper.vm.isResetingPassword).toBe(false)
		expect(resetPasswordButton.classes()).not.toContain("disabled")

		// Verify that the method was called
		await resetPasswordButton.trigger("click")
		await wrapper.vm.$nextTick()
		expect(resetUserPasswordMock).toHaveBeenCalledWith( expect.anything())
	})

	it("calls openDeleteModal when delete account button is clicked", async () => 
	{
		const openDeleteModal = vi.spyOn(
			PrivacyAndSecuritySettings.methods,
			"openDeleteModal"
		)

		const wrapper = createWrapper({
			userState: {
				isLoggedIn: true, // Ensure the user is logged in
				user: {
					email: "test@example.com", 
				}, // Mock current user's email
			},
		})

		// Find the delete account button and trigger click event
		const deleteAccountButton = wrapper.find("[data-testid='button-user-action-delete-account']")
		// Ensure the button is enabled
		expect(deleteAccountButton.exists()).toBe(true)
		expect(wrapper.vm.canDeleteAccount).toBe(true)
		expect(wrapper.vm.isDeletingAccount).toBe(false)
		expect(wrapper.vm.showDeleteModal).toBe(false)
		expect(deleteAccountButton.classes()).not.toContain("disabled")

		// Verify that the method was called
		await deleteAccountButton.trigger("click")
		await wrapper.vm.$nextTick()
		expect(wrapper.vm.showDeleteModal).toBe(true)
		expect(openDeleteModal).toHaveBeenCalledWith( expect.anything())
	})

})
