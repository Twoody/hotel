import NavBar from "@/components/NavBar"
import { mount, createLocalVue } from "@vue/test-utils"
import Vuex from "vuex"
import VueRouter from "vue-router"

describe("NavBar.vue", () => 
{
	let wrapper
	let store
	let state
	let actions
	let getters
	let router

	beforeEach(() => 
	{
		const localVue = createLocalVue()
		router = new VueRouter()
		localVue.use(VueRouter)
		localVue.use(Vuex)

		state = {
			user: {
				isLoggedIn: false,
				isAuthReady: false,
			},
		}

		actions = {
			// Declare actions or mock them
		}

		getters = {
			// Declare getters or mock them
		}

		store = new Vuex.Store({
			state,
			actions,
			getters,
		})

		wrapper = mount(NavBar, {
			localVue,
			router,
			store,
		})
	})

	it("renders a vue instance", () => 
	{
		expect(wrapper.isVueInstance()).toBe(true)
	})

	// Describe further tests...
})

