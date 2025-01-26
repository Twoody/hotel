import { mount } from "@vue/test-utils"
import { createStore } from "vuex"
import { createRouter, createWebHistory } from "vue-router"
import { vi } from "vitest"
import Login from "@/views/Login.vue"
import * as _FirebaseAuth from "firebase/auth"	// <-- import as a namespace

// Mock Firebase methods
vi.mock("firebase/auth", () => ({
	createUserWithEmailAndPassword: vi.fn(),
	signInWithEmailAndPassword: vi.fn(),
	getAuth: vi.fn(),
}))

// Mock Local Firebase helpers
vi.mock("@/firebase", () => ({
	db: {},
	firebaseAuth: {},
}))

// Spy on the named export function from the namespace
const createUserSpy = vi.spyOn(_FirebaseAuth, "createUserWithEmailAndPassword")
const signInSpy = vi.spyOn(_FirebaseAuth, "signInWithEmailAndPassword")

const createWrapper = ({ userState = {}, ...options } = {}) => 
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
		const wrapper = createWrapper()
		expect(wrapper.find("h3").text()).toBe("Checking firebase auth status...")
	})

	it("shows the already logged-in message when the user is logged in", () => 
	{
		let userState = {
			isAuthReady: true,
			isLoggedIn: true,
		}

		const wrapper = createWrapper({
			userState,
		})
		expect(wrapper.find("h3").text()).toBe("Already Logged in")
	})

	it("toggles between sign-in and sign-up modes", async () => 
	{
		let userState = {
			isAuthReady: true,
			isLoggedIn: false,
		}

		const wrapper = createWrapper({
			userState,
		})
		await wrapper.vm.$nextTick()
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
		let userState = {
			isAuthReady: true,
			isLoggedIn: false,
		}
		const wrapper = createWrapper({
			userState,
		})

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
		let userState = {
			isAuthReady: true,
			isLoggedIn: false,
		}
		const wrapper = createWrapper({
			userState,
		})

		const { signInWithEmailAndPassword, } = await import("firebase/auth")
		signInWithEmailAndPassword.mockRejectedValueOnce({
			code: "auth/user-not-found", 
		})

		wrapper.vm.email = "test@example.com"
		wrapper.vm.password = "password123"

		await wrapper.vm.login()

		// Ensure the right buttons are showing
		let loginButton = wrapper.find("[data-testid=\"button-login-text\"]")
		let registerButton = wrapper.find("[data-testid=\"button-register-text\"]")
		expect(registerButton.exists()).toBe(false)
		expect(loginButton.exists()).toBe(true)

		expect(loginButton.isVisible()).toBe(true)
		expect(loginButton.text()).toBe("Log In")
		expect(wrapper.vm.loginError).toBe("User not found")
		expect(wrapper.vm.success).toBe(false)
	})

	it("registers a new user with valid credentials", async () => 
	{
		createUserSpy.mockResolvedValueOnce({
			user: {
				uid: "testUser123", 
			},
		})

		let userState = {
			isAuthReady: true,
			isLoggedIn: false,
		}
		const wrapper = createWrapper({
			userState,
		})

		// Ensure registration toggle + activate registration mode
		let registerToggle = wrapper.find("[data-testid=\"button-toggle-to-registration\"]")
		expect(registerToggle.exists()).toBe(true)
		await registerToggle.trigger("click")

		// Ensure the right buttons are showing for registration
		let loginButton = wrapper.find("[data-testid=\"button-login-text\"]")
		let registerButton = wrapper.find("[data-testid=\"button-register-text\"]")
		expect(loginButton.exists()).toBe(false)
		expect(registerButton.exists()).toBe(true)

		wrapper.vm.email = "test@example.com"
		wrapper.vm.password = "password123"
		wrapper.vm.passwordConfirm = "password123"

		await registerButton.trigger("click")
		expect(wrapper.vm.registrationError).toBe("")

		expect(createUserSpy).toHaveBeenCalledWith(
			expect.anything(),
			"test@example.com",
			"password123"
		)
	})

	it("displays validation errors for incorrect input", () => 
	{
		let userState = {
			isAuthReady: true,
			isLoggedIn: false,
		}
		const wrapper = createWrapper({
			userState,
		})

		wrapper.vm.email = ""
		wrapper.vm.password = "short"
		wrapper.vm.passwordConfirm = "mismatch"
		wrapper.vm.isRegistering = true

		const errors = wrapper.vm.errors

		expect(errors.email).toBe("Please enter an email")
		expect(errors.password).toBe("Password less than 8 characters")
		expect(errors.passwordConfirm).toBe("Passwords do not match")
	})

	it("disables login button while logging in", () => 
	{
		let userState = {
			isAuthReady: true,
			isLoggedIn: false,
			isLoggingIn: true,
		}
		const wrapper = createWrapper({
			userState,
		})

		const loginButton = wrapper.find(".login-button")
		expect(loginButton.element.disabled).toBe(true)
	})

	it("redirects to the home page after successful login", async () => 
	{
		let userState = {
			isAuthReady: true,
			isLoggedIn: false,
			isLoggingIn: false,
		}
		const wrapper = createWrapper({
			userState,
		})

		const router = wrapper.vm.$router
		const pushSpy = vi.spyOn(router, "push")

		signInSpy.mockResolvedValueOnce({
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
