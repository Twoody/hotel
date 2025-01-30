import { mount } from "@vue/test-utils"
import { describe, it, expect, beforeEach, vi } from "vitest"
import { createStore } from "vuex"
import { createRouter, createWebHistory } from "vue-router"

// 1) Mock the updateFirestoreUser function from "@/utils/firestore.js"
vi.mock("@/utils/firestore.js", () => ({
	updateFirestoreUser: vi.fn(),
	reauthenticateGoogleUser: vi.fn().mockResolvedValue(true),
}))

import AccountSettings from "@/views/settings/AccountSettings.vue"
import { reauthenticateGoogleUser, updateFirestoreUser } from "@/utils/firestore.js"

// 2) Minimal store mock or real store
//		The actual component imports store directly, but it also uses "this.$store" in code
//		We'll provide a store that references "updateUserStore" action to avoid errors.
/**
 *
 * @param userState
 */
function createVuexStore (userState = {})
{
	return createStore({
		state: {
			user: {
				user: userState,
			},
		},
		actions: {
			updateUserStore: vi.fn(),
		},
	})
}

// 3) Minimal router if the component calls `this.$router.push(...)`
/**
 *
 */
function createTestRouter ()
{
	return createRouter({
		history: createWebHistory(),
		routes: [
			{
				path: "/",
				name: "Home",
				component: {
					template: "<div>Home Page</div>",
				},
			},
		],
	})
}

// 4) Helper to mount the component with store/router
/**
 *
 * @param options
 */
function createWrapper (options = {})
{
	const store = createVuexStore(options.userState || {})
	const router = createTestRouter()

	return mount(AccountSettings, {
		global: {
			plugins: [
				store,
				router,
			],
			stubs: {
				// We can stub out FontAwesomeIcon, Validatable, MyButton, etc. to keep the test more isolated
				FontAwesomeIcon: {
					name: "FontAwesomeIcon",
					template: "<span class='font-awesome-icon' />",
				},
				Validatable: {
					name: "Validatable",
					template: "<div class='validatable-stub'><slot /></div>",
				},
				MyButton: {
					name: "MyButton",
					// Forward attributes so :disabled, :in-progress, etc. appear on the button
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
						"submit",
					],
				},
			},
		},
		...options,
	})
}

describe("AccountSettings.vue", () =>
{
	beforeEach(() =>
	{
		vi.resetAllMocks()
		vi.spyOn(window, "alert").mockImplementation(() => 
		{})
		reauthenticateGoogleUser.mockResolvedValue(true) // Explicit mock reset before each test

	})

	it("renders the account settings form with a heading", () =>
	{
		const wrapper = createWrapper()
		expect(wrapper.find("h2").text()).toBe("Account Settings")

		// Check that the form is present
		const form = wrapper.find("form.user-settings-form")
		expect(form.exists()).toBe(true)
	})

	it("preloads form data from currentUser if available", () =>
	{
		// Provide user in the store
		const wrapper = createWrapper({
			userState: {
				first_name: "John",
				last_name: "Doe",
				city: "Test City",
			},
		})

		// The preloadFormData() runs on created()
		expect(wrapper.vm.formData.first_name).toBe("John")
		expect(wrapper.vm.formData.last_name).toBe("Doe")
		expect(wrapper.vm.formData.city).toBe("Test City")
	})

	it("disables the phone and email inputs", () =>
	{
		// Even if phone/email exist, they should appear 'locked'
		const wrapper = createWrapper({
			userState: {
				email: "john@example.com",
				phone: "123-456-7890",
			},
		})
		const emailInput = wrapper.find("input.locked-input[type=\"text\"]")
		expect(emailInput.exists()).toBe(true)
		expect(emailInput.element.disabled).toBe(true)

		const phoneInput = wrapper.findAll("input.locked-input[type=\"text\"]")[1]
		expect(phoneInput.element.disabled).toBe(true)
	})

	it("displays a required phone error if user has no phone number", () =>
	{
		// The code sets errors.phoneNumber if currentUser has no phone
		const wrapper = createWrapper({
			userState: {
				phone: "",
			},
		})
		// Force isShowingErrors = true so error messages appear
		wrapper.vm.isShowingErrors = true
		expect(wrapper.vm.errors.phoneNumber).toBe("User must have a phone number")
	})
	it(" reauthenticateGoogleUser", async () => 
	{
		const wrapper = createWrapper()
		// Call the function manually
		await wrapper.vm.submitUpdatedUser()
		// Ensure it's mocked correctly
		expect(reauthenticateGoogleUser).toHaveBeenCalled()
	})

	it("calls updateFirestoreUser when submitting the form", async () =>
	{
		const wrapper = createWrapper({
			userState: {
				email: "myuser@example.com",
				phone: "555-555-5555",
			},
		})

		updateFirestoreUser.mockResolvedValueOnce({
			success: true, 
		})

		// Fill out some fields
		wrapper.vm.formData.first_name = "Jane"
		wrapper.vm.formData.last_name = "Doe"
		wrapper.vm.formData.city = "City X"

		// Trigger form submission
		const form = wrapper.find("form.user-settings-form")
		const button = wrapper.find(".submit-button")
		expect(form.exists()).toBe(true)
		expect(button.exists()).toBe(true)
		expect(wrapper.vm.isUpdating).toBe(false)
		await form.trigger("submit.prevent")
		await button.trigger("submit")
		await button.trigger("click")
		await wrapper.vm.$nextTick()

		// Expect updateFirestoreUser to have been called
		expect(updateFirestoreUser).toHaveBeenCalledWith(
			{
				email: "myuser@example.com",
				phone: "555-555-5555",
			}, // currentUser
			expect.objectContaining({
				first_name: "Jane",
				last_name: "Doe",
				city: "City X",
			})
		)

		// Because result is not mocked, code goes to the "else" or catch
		// But we can at least see it tried. If we want to test success path:
		updateFirestoreUser.mockResolvedValueOnce({
			success: true,
		})
	})

	it("has a submit button that manages state and edge cases", async () =>
	{
		const wrapper = createWrapper()

		// Force a success result
		updateFirestoreUser.mockResolvedValueOnce({
			success: true,
		})

		// Check that the submit button is there and is clickable when not isUpdating
		const submitButton = wrapper.find(".submit-button")
		await submitButton.trigger("click")

		// Right after, it should have reset isUpdating = true
		expect(wrapper.vm.isUpdating).toBe(false)

		// Repeate the test, but this time assume the button has already been clicked once and is actively updating
		wrapper.vm.isUpdating = true
		updateFirestoreUser.mockResolvedValueOnce({
			success: true,
		})

		await submitButton.trigger("click")
		expect(wrapper.vm.isUpdating).toBe(true)
	})

	it("alerts user on success", async () =>
	{
		// Return success = true from updateFirestoreUser
		updateFirestoreUser.mockResolvedValueOnce({
			success: true,
		})

		const wrapper = createWrapper()
		await wrapper.find("form.user-settings-form").trigger("submit.prevent")
		await wrapper.vm.$nextTick()

		expect(window.alert).toHaveBeenCalledWith("User updated successfully!")
	})

	it("alerts an error on failure", async () =>
	{
		updateFirestoreUser
			.mockResolvedValueOnce({
				success: false,
				message: "Something failed",
			})
			.mockResolvedValueOnce({
				success: false,
				message: "Something failed",
			})

		const wrapper = createWrapper()
		await wrapper.find("form.user-settings-form").trigger("submit.prevent")
		await wrapper.vm.$nextTick()

		// The code calls "alert('Failed to update user.')" if !success
		expect(window.alert).toHaveBeenCalledWith("Failed to update user.")
	})
})
