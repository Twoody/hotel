import { shallowMount } from "@vue/test-utils"
import GoogleLogin from "@/components/buttons/login/GoogleLogin.vue"
// Mock Firebase analytics
vi.mock("firebase/analytics", () => ({
	getAnalytics: vi.fn(),
	logEvent: vi.fn(),
}))

// Mock local Firebase helpers
vi.mock("@/firebase", () => ({
	firebaseAnalytics: {}, // Provide a simple mock object
}))

describe("GoogleLogin.vue", () => 
{
	it("renders SocialLogin.vue", () => 
	{
		const wrapper = shallowMount(GoogleLogin)
		expect(wrapper.findComponent({
			name: "SocialLogin", 
		}).exists()).toBeTruthy()
	})

	// additional tests here for user interaction and component's behavior
	// but based on given code there aren't any handlers or methods in GoogleLogin component
	// so couldn't add those tests
})
