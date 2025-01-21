import { mount, VueWrapper } from "@vue/test-utils"
import ProfileSettings from "@/views/settings/ProfileSettings.vue"
import BookingsTable from "@/components/entities/BookingsTable.vue"
import { createStore } from "vuex"
import { createRouter, createWebHistory } from "vue-router"

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
	routes: [],
})

const createComponent = () => 
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
		},
	})
}

describe("ProfileSettings.vue", () => 
{
	beforeEach(() => 
	{
		createComponent()
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

