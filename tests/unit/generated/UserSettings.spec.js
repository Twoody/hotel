import { mount } from "@vue/test-utils"
import { createStore } from "vuex"
import { createRouter, createWebHistory } from "vue-router"
import UserSettings from "@/views/settings/UserSettings.vue"
import user from "@/store/user"

const testUser = {
	uid: "del-12",
	first_name: "foo",
	last_name: "bar",
}

const pushMock = vi.fn()

vi.mock("firebase/analytics", () =>
{
	return {
		// Provide mocked versions of what your code might call
		getAnalytics: vi.fn(),
		logEvent: vi.fn(),
	}
})

// create new router instance for testing purposes
// helper function to create wrapper
const createWrapper = ({ userState = {}, ...options } = {}) =>
{
	const store = createStore({
		state: {
			user: {
				isAuthReady: false,
				isLoggedIn: false,
				isLoggingIn: false,
				user: null,
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
	router.push = pushMock

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
	it("displays login reminder when auth is ready but user not logged in", () =>
	{
		const wrapper = createWrapper()
		const notLoggedIn = wrapper.find("[data-testid='user-settings-case-not-logged-in']")
		expect(notLoggedIn.exists()).toBe(true)
		expect(notLoggedIn.text()).toContain("Currently not logged in; Please visit")
		expect(notLoggedIn.text()).toContain("the login page")

		const tabs = wrapper.find("[data-testid='user-settings-tab-navigation']")
		expect(tabs.exists()).toBe(false)
	})

	it("renders the User Settings tabs when user is authenticated", () =>
	{
		const wrapper = createWrapper()
		const tabs = wrapper.find("[data-testid='user-settings-tab-navigation']")
		expect(tabs.exists()).toBe(false)
			
		const notLoggedIn = wrapper.find("[data-testid='user-settings-case-not-logged-in']")
		expect(notLoggedIn.exists()).toBe(true)

	})

	it("sets the active tab based on route query", async () =>
	{
		await wrapper.router.push({
			path: "/",
			query: {
				"active-tab": 1,
			},
		})
		const wrapper = createWrapper()
		await wrapper.vm.$nextTick()
		expect(wrapper.vm.activeTab.id).toBe(1)
	})

	it("logs a firebase event on tab navigation", () =>
	{
		const wrapper = createWrapper()
		wrapper.vm.handleTabNavigation(2)
		expect(logEvent).toHaveBeenCalledWith(firebaseAnalyics, "settings_tab_navigation", {
			value: "Privacy + Security",
		})
	})
})
