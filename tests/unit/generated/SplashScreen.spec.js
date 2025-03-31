import { mount } from "@vue/test-utils"
import SplashScreen from "@/components/entities/SplashScreen.vue"
import { expect } from "chai"

// Helper function to create a wrapper
const createWrapper = (component, options) => 
{
	return mount(component, {
		...options,
		global: {
			components: {
				Spinner: () => "Spinner",
			},
		},
	})
}

describe.concurrent("SplashScreen", () => 
{
	it("renders loading message", () => 
	{
		const wrapper = createWrapper(SplashScreen, {})
		expect(wrapper.find("h2").text()).to.equal("Loading...")
	})

	it("renders the spinner component", () => 
	{
		const wrapper = createWrapper(SplashScreen, {})
		expect(wrapper.findComponent({
			name: "Spinner",
		}).exists()).to.be.true
	})

	it("has the expected css class", () => 
	{
		const wrapper = createWrapper(SplashScreen, {})
		expect(wrapper.classes()).to.include("splash-screen")
	})
})
