import { mount } from "@vue/test-utils"
import { createStore } from "vuex"
import SocialLogin from "@/components/buttons/login/SocialLogin.vue"
import { vi } from "vitest"

// Mock Firebase analytics
vi.mock("firebase/analytics", () => ({
	getAnalytics: vi.fn(),
	logEvent: vi.fn(),
}))

// Mock local Firebase helpers
vi.mock("@/firebase", () => ({
	firebaseAnalytics: {}, // Provide a simple mock object
}))

const createWrapper = ({ userState = {}, ...options } = {}) => 
{
	const store = createStore({
		state: {
			user: {
				isLoggedIn: false,
				isAuthReady: false,
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
	Object.assign(store.state.user, userState)

	return mount(SocialLogin, {
		props: {
			provider: "google",
		},
		global: {
			plugins: [
				store,
			],
			stubs: {
				FontAwesomeIcon: {
					template: `
						<span
							class="font-awesome-icon"
							:class="$attrs.class"
						/>
					`,
				},
				MyButton: {
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

describe("SocialLogin.vue", () => 
{
	it("renders the social login button", () => 
	{
		const wrapper = createWrapper()
		expect(wrapper.find(".social-button").exists()).toBe(true)
	})

	it("handles login on button click", async () => 
	{
		const wrapper = createWrapper()

		// Mock Firebase authentication
		const userMock = {
			user: {
				uid: "1",
				displayName: "John Doe",
			},
		}
		global.firebaseAuth = vi.fn().mockImplementation(() => ({
			signInWithPopup: () => Promise.resolve(userMock),
		}))

		// Trigger the click event
		const button = wrapper.find(".social-button")
		await button.trigger("click")

		expect(button.classes()).not.toContain("disabled")
	})

	it("displays the correct provider label", async () => 
	{
		const wrapper = createWrapper()
		await wrapper.vm.$nextTick()
		expect(wrapper.find(".social-button-dex").text()).toContain("Google")
	})
})

