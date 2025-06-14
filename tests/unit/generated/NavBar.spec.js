import { mount } from "@vue/test-utils"
import { createStore } from "vuex"
import { createRouter, createWebHistory } from "vue-router"
import { describe, it, expect, vi, beforeEach } from "vitest"
import NavBar from "@/components/nav/NavBar.vue" // <-- Adjust to actual path

const testUser = {
	uid: "del-12",
	first_name: "foo",
	last_name: "bar",
}
const pushMock = vi.fn()
const replaceMock = vi.fn()

vi.mock("firebase/analytics", () =>
{
	return {
		// Provide mocked versions of what your code might call
		getAnalytics: vi.fn(),
	}
})

/**
 * Helper to mount NavBar with an optional mock router.
 * The router is relevant if we want to test route pushes (e.g. gotoUserSettings).
 *
 * @param root0
 * @param root0.userState
 */
const createWrapper = ({ userState = {},} = {}) =>
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
				path: "/about",
				name: "About",
				component: {
					template: "<div>About</div>",
				},
			},
			{
				path: "/guides",
				name: "Guides",
				component: {
					template: "<div>Guides</div>",
				},
			},
			{
				path: "/amenities",
				name: "Amenities",
				component: {
					template: "<div>Amenities</div>",
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
	router.replace = replaceMock

	router.push = pushMock

	return mount(
		NavBar,
		{
			global: {
				plugins: [
					store,
					router,
				],
				stubs: {
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
		}
	)
}

describe.concurrent("NavBar.vue", () =>
{
	beforeEach(() =>
	{
		// Clear all mocks to avoid cross-test pollution
		vi.clearAllMocks()
	})

	it("shows main nav links (Home, About, Guides, Amenities) by default", async () =>
	{
		let userState = {
			isLoggedIn: false,
			isLoggingIn: true,
		}

		const wrapper = createWrapper({
			userState,
		})
		await wrapper.vm.$nextTick()

		const links = wrapper.findAll("a.nav-item")
		// We expect to see 4 links by default
		expect(wrapper.vm.isLoadingData).toBe(true)
		expect(links).toHaveLength(4)
		expect(links[0].text()).toBe("Home")
		expect(links[1].text()).toBe("About")
		expect(links[2].text()).toBe("Guides")
		expect(links[3].text()).toBe("Amenities")
	})

	it("shows the 'Login' link if not logged it", async () =>
	{
		let userState = {
			isLoggedIn: false,
			isLoggingIn: false,
		}

		const wrapper = createWrapper({
			userState,
		})
		await wrapper.vm.$nextTick()

		const links = wrapper.findAll("a.nav-item")
		expect(links).toHaveLength(5)

		// The last link should be "Login"
		expect(links[4].text()).toBe("Login")
	})

	it("shows user icon if user is logged in, and clicking it sends to settings", async () =>
	{
		let userState = {
			isLoggedIn: true,
			isLoggingIn: false,
			user: testUser,
		}

		const wrapper = createWrapper({
			userState,
		})
		// Because we are logged in and auth is ready, no "Login" link.
		const loginLink = wrapper.findAll("a.nav-item").filter((l) => l.text() === "Login")
		expect(loginLink.length).toBe(0)

		// The user-items should be visible, containing a .user-icon
		const userItems = wrapper.find(".user-items")
		expect(userItems.exists()).toBe(true)

		await userItems.trigger("click")

		// Expect `replace` to be called instead of `push`
		expect(replaceMock).toHaveBeenCalledWith({
			path: "/settings", 
		})
	})
})

