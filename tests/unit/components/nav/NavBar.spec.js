import { createLocalVue } from "@vue/test-utils"
import { RouterLinkStub } from "@vue/test-utils"
import { shallowMount } from "@vue/test-utils"
import NavBar from "@/components/nav/NavBar"
import store from "@/store/store.js"
import VueRouter from "vue-router"
import Vuex from "vuex"

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

const router = new VueRouter({
	routes: [
		{
			name: "Home",
			path: "/",
		},
		{
			name: "About",
			path: "/about",
		},
		{
			name: "Login",
			path: "/signup",
		},
	],
})

describe("NavBar Component", () => 
{
	let wrapper
	beforeEach(() =>
	{
		// Instantiate the component
		wrapper = shallowMount(
			NavBar,
			{
				localVue,
				router,
				stubs: [],
			}
		)
	})

	it("renders in general + default not logged in", () => 
	{
		expect(wrapper.find("div.nav-wrapper").exists()).toBeTruthy()
		expect(wrapper.find("div.options-guest").exists()).toBeTruthy()
	})

	it("renders when logged in", async () => 
	{
		wrapper = shallowMount(NavBar, {
			store,
			localVue,
		})
		
		// Expect user to be logged out at first
		expect(wrapper.vm.isLoadingData).toBeFalsy()
		expect(store.state.user.isLoggedIn).toBeFalsy()
		expect(store.state.user.isLoggingIn).toBeFalsy()
		expect(wrapper.find("div.options-guest").exists()).toBeTruthy()
		expect(wrapper.find("div.options-user").exists()).toBeFalsy()

		// Login user
		store.commit("setIsLoggingIn", true)
		// Login user: Expect loading state
		expect(wrapper.vm.isLoadingData).toBeTruthy()

		store.commit(
			"setUserData",
			{
				firstName: "Tanner",
				lastName: "Woody",
			}
		)
		store.commit("setIsLoggedIn", true)
		// Turn off loading state
		store.commit("setIsLoggingIn", false)
		expect(wrapper.vm.isLoadingData).toBeFalsy()
		await wrapper.vm.$nextTick()

		// Expect user data to be showing and new dom elements
		expect(store.state.user.isLoggedIn).toBeTruthy()
		expect(wrapper.vm.isLoggedIn).toEqual(true)
		expect(wrapper.vm.firstName).toEqual("Tanner")
		expect(wrapper.vm.lastName).toEqual("Woody")
		expect(wrapper.vm.userInitials).toEqual("TW")
		expect(wrapper.find("div.nav-wrapper").exists()).toBeTruthy()
		expect(wrapper.find("div.options-user").exists()).toBeTruthy()

		// Expect logout button to wipe data and show previous dom elements
		try
		{
			wrapper.vm.logout()
		}
		catch (e)
		{
			console.log("me")
		}
	})
})
