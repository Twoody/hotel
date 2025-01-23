import { mount } from "@vue/test-utils"
import UserSettings from "@/views/settings/UserSettings.vue"
import store from "@/store/store.js"
import { createRouter, createWebHistory } from "vue-router"

vi.mock("firebase/analytics", () =>
{
	return {
		// Provide mocked versions of what your code might call
		getAnalytics: vi.fn(),
	}
})

// create new router instance for testing purposes
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

// helper function to create wrapper
const createWrapper = () =>
{
	return mount(UserSettings, {
		global: {
			plugins: [
				store,
				router,
			],
			stubs: {
				Spinner: {
					name: "Spinner",
					template: "<div class=\"spinner-stub\">Spinner</div>",
				},
				Filters: {
					name: "Filters",
					template: `<div>
						<button v-for="filter in filters" :key="filter.id" @click="$emit('update', filter.id)">
							{{ filter.title }}
						</button>
					</div>`,
					props: [
						"filters",
						"inactive",
					],
				},
				MyButton: {
					name: "MyButton",
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
					name: "Validatable",
					template: "<div class='validatable-stub'><slot /></div>",
				},

				LoadingBar: {
					name: "LoadingBar",
					template: "<div class=\"loadingbar-stub\">Loading Bar</div>",
				},
				FontAwesomeIcon: {
					name: "FontAwesomeIcon",
					props: [
						"icon",
						"class",
					],
					template: "<span class=\"font-awesome-icon\" :class=\"$props.class\" />",
				},

			},

		},
	})
}

describe("UserSettings.vue", () =>
{
	it("renders a spinner when authentication process is ongoing", () =>
	{
		// prepare
		store.state.user.isAuthReady = false
		const wrapper = createWrapper()
		// execute
		const spinner = wrapper.findComponent("Spinner")
		// verify
		expect(spinner.exists()).toBe(true)
	})

	it("displays login reminder when auth is ready but user not logged in", () =>
	{
		// prepare
		store.state.user.isAuthReady = true
		store.state.user.isLoggedIn = false
		const wrapper = createWrapper()
		// execute
		const reminder = wrapper.getText()
		// verify
		expect(reminder).toContain("Currently not logged in; Please visit the login page")
	})

	it("renders the User Settings tabs when user is authenticated", () =>
	{
		// prepare
		store.state.user.isAuthReady = true
		store.state.user.isLoggedIn = true
		const wrapper = createWrapper()
		// execute
		const tabs = wrapper.findComponent("Filters")
		// verify
		expect(tabs.exists()).toBe(true)
	})

	it("sets the active tab based on route query", async () =>
	{
		// prepare
		store.state.user.isAuthReady = true
		store.state.user.isLoggedIn = true
		await router.push({
			path: "/",
			query: {
				"active-tab": 1,
			},
		})
		const wrapper = createWrapper()
		// execute
		await wrapper.vm.$nextTick()
		// verify
		expect(wrapper.vm.activeTab.id).toBe(1)
	})

	it("logs a firebase event on tab navigation", () =>
	{
		// prepare
		store.state.user.isAuthReady = true
		store.state.user.isLoggedIn = true
		const wrapper = createWrapper()
		// mock the logEvent function
		jest.mock("firebase/analytics", () => ({
			logEvent: jest.fn(),
		}))
		// execute
		wrapper.vm.handleTabNavigation(2)
		// verify
		expect(logEvent).toHaveBeenCalledWith(firebaseAnalyics, "settings_tab_navigation", {
			value: "Privacy + Security",
		})
	})
})
