import { mount, VueWrapper } from "@vue/test-utils"
import { vi } from "vitest"
import ProfileSettings from "@/views/settings/ProfileSettings.vue"
import BookingsTable from "@/components/entities/BookingsTable.vue"
import { createStore } from "vuex"
import { createRouter, createWebHistory } from "vue-router"
// Mock Firebase analytics
vi.mock("firebase/analytics", () => ({
	getAnalytics: vi.fn(),
	logEvent: vi.fn(),
}))

// Mock local Firebase helpers
vi.mock("@/firebase", () => ({
	firebaseAnalytics: {}, // Provide a simple mock object
}))

let wrapper

const mockStore = createStore({
	state: {},
	getters: {},
	mutations: {},
	actions: {},
})

// If using Vite, either use import.meta.env.BASE_URL or omit the argument:
const mockRouter = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL), // or createWebHistory()
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

const createWrapper = () => 
{
	wrapper = mount(ProfileSettings, {
		global: {
			components: {
				BookingsTable, 
			},
			plugins: [
				mockStore,
				mockRouter,
			],
			stubs:
			{
				FontAwesomeIcon: {
					name: "FontAwesomeIcon",
					props: [
						"icon",
						"class",
					],
					template: "<span class=\"font-awesome-icon\" :class=\"$props.class\" />",
				},

				Spinner: {
					name: "Spinner",
					template: "<div class=\"spinner-stub\">Spinner</div>",
				},
			},
		},
	})
}

describe("ProfileSettings.vue", () => 
{
	beforeEach(() => 
	{
		createWrapper()
	})

	afterEach(() => 
	{
		wrapper.unmount()
	})

	it("should render h2 element with 'Profile Tab' text", () => 
	{
		expect(wrapper.get("h2").text()).toBe("Profile Tab")
	})

	it("should render p element with expected text", () => 
	{
		// Use a template literal that matches the actual p text
		const expectedText = "Here you could add user profile form fields, upload avatars, social links, etc."
		expect(wrapper.get("p").text()).toBe(expectedText)
	})
})

