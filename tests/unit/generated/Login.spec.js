import { mount } from "@vue/test-utils"
import { createStore } from "vuex"
import { createRouter, createWebHistory } from "vue-router"
import { vi } from "vitest"
import Login from "@/views/Login.vue"

// Mock Firebase methods
vi.mock("firebase/auth", () => ({
	createUserWithEmailAndPassword: vi.fn(),
	signInWithEmailAndPassword: vi.fn(),
	getAuth: vi.fn(),
}))

// Mock Local Firebase helpers
vi.mock("@/firebase", () => ({
	db: {},
}))

// For example:

const createWrapper = (options = {}) => 
{
	const store = createStore({
		state: {
			user: {
				isAuthReady: false,
				isLoggedIn: false,
				isLoggingIn: false,
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

	const router = createRouter({
		history: createWebHistory(),
		routes: [
			{
				path: "/",
				name: "Home",
				component: {
					template: "<div>Home</div>", 
				}, // fix the router warning
			},
		],
	})

	return mount(Login, {
		global: {
			plugins: [
				store,
				router,
			],
			stubs: {
				MyButton: {
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
				Validatable: {
					template: `
						<div>
							<slot />
						</div>
					`,
				},
				SocialLogin: {
					template: "<div>Social Login</div>",
				},
			},
		},
		...options,
	})
}

describe("Login.vue", () => 
{
	it("renders the login page and displays the checking auth status message", () => 
	{
		const wrapper = createWrapper({
			global: {
				mocks: {
					$store: {
						state: {
							user: {
								isAuthReady: false, 
							}, 
						},
					},
				},
			},
		})
		expect(wrapper.find("h3").text()).toBe("Checking firebase auth status...")
	})

	it("shows the already logged-in message when the user is logged in", () => 
	{
		const wrapper = createWrapper({
		// Provide an initial store state via options:
			data: () => ({
			// or use a store plugin override approach
			}),
			global: {
			// Instead of mocks, we can do a slight store override:
				plugins: [
					createStore({
						state: {
							user: {
								isAuthReady: true,
								isLoggedIn: true,
								isLoggingIn: false,
							},
						},
						mutations: {},
					}),
				],
			},
		})
		expect(wrapper.find("h3").text()).toBe("Already Logged in")
	})

	it("toggles between sign-in and sign-up modes", async () => 
	{
		const wrapper = createWrapper({
			global: {
				mocks: {
					$store: {
						state: {
							user: {
								isAuthReady: true, 
							}, 
						},
					},
				},
			},
		})
		// Find both toggles
		const toggles = wrapper.findAll(".title-toggle")
		expect(toggles.length).toBe(2)

		// signUpButton is toggles[1]
		await toggles[1].trigger("click")
		expect(wrapper.vm.isRegistering).toBe(true)

		// signInButton is toggles[0]
		await toggles[0].trigger("click")
		expect(wrapper.vm.isRegistering).toBe(false)
	})

	it("validates user input and focuses on invalid fields", async () => 
	{
		const wrapper = createWrapper()

		wrapper.vm.email = "" // Force it invalid
		wrapper.vm.password = ""
		wrapper.vm.passwordConfirm = ""

		// This calls `this.$refs.email?.focus()`
		await wrapper.vm.assignFocus()

		// Because <Validatable> stub preserves <input ref="email" />,
		// the ref is now defined.
		expect(wrapper.vm.$refs.email).toBeDefined()
	})

	it("handles login errors gracefully", async () => 
	{
		const wrapper = createWrapper()

		const { signInWithEmailAndPassword, } = await import("firebase/auth")
		signInWithEmailAndPassword.mockRejectedValueOnce({
			code: "auth/user-not-found", 
		})

		wrapper.vm.email = "test@example.com"
		wrapper.vm.password = "password123"

		await wrapper.vm.login()

		expect(wrapper.vm.loginError).toBe("User not found")
		expect(wrapper.vm.success).toBe(false)
	})

	it("registers a new user with valid credentials", async () => 
	{
		const wrapper = createWrapper()

		const { createUserWithEmailAndPassword, } = await import("firebase/auth")
		createUserWithEmailAndPassword.mockResolvedValueOnce({
			user: {
				uid: "testUser123", 
			},
		})

		wrapper.vm.isRegistering = true
		wrapper.vm.email = "test@example.com"
		wrapper.vm.password = "password123"
		wrapper.vm.passwordConfirm = "password123"

		await wrapper.vm.registerNewUser()

		expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
			expect.anything(),
			"test@example.com",
			"password123"
		)
	})

	it("displays validation errors for incorrect input", () => 
	{
		const wrapper = createWrapper()

		wrapper.vm.email = ""
		wrapper.vm.password = "short"
		wrapper.vm.passwordConfirm = "mismatch"
		wrapper.vm.isRegistering = true

		const errors = wrapper.vm.errors

		expect(errors.email).toBe("Please enter an email")
		expect(errors.password).toBe("Password less than 8 characters")
		expect(errors.passwordConfirm).toBe("Passwords do not match")
	})

	it("disables login button while logging in", async () => 
	{
		const wrapper = createWrapper({
			global: {
				mocks: {
					$store: {
						state: {
							user: {
								isLoggingIn: true, 
							}, 
						},
					},
				},
			},
		})

		const loginButton = wrapper.find(".login-button")
		expect(loginButton.attributes("disabled")).toBeDefined()
	})

	it("redirects to the home page after successful login", async () => 
	{
		const wrapper = createWrapper()

		const router = wrapper.vm.$router
		const pushSpy = vi.spyOn(router, "push")

		const { signInWithEmailAndPassword, } = await import("firebase/auth")
		signInWithEmailAndPassword.mockResolvedValueOnce({
			user: {
				uid: "testUser123", 
			},
		})

		wrapper.vm.email = "test@example.com"
		wrapper.vm.password = "password123"

		await wrapper.vm.login()

		expect(pushSpy).toHaveBeenCalledWith({
			path: "/", 
		})
	})
})

