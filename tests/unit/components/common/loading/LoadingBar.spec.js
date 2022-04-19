import { createLocalVue } from "@vue/test-utils"
import { shallowMount } from "@vue/test-utils"
import LoadingBar from "@/components/common/loading/LoadingBar"

const localVue = createLocalVue()
describe("LoadingBar Component", () => 
{
	let wrapper
	beforeEach(() =>
	{
		// Instantiate the component
		wrapper = shallowMount(
			LoadingBar,
			{
				localVue,
				propsData: {},
			}
		)
	})

	it("renders in general", () => 
	{
		expect(wrapper.find("div.loading-bar-wrapper").exists()).toBeTruthy()
		expect(wrapper.find("div.loading-bar-md").exists()).toBeTruthy()
		expect(wrapper.find("div.loading-bar-short").exists()).toBeTruthy()
	})

	it("renders with prop `size`", async () => 
	{
		wrapper.setProps({
			size: "small",
		})
		await wrapper.vm.$nextTick()
		expect(wrapper.find("div.loading-bar-wrapper").exists()).toBeTruthy()
		expect(wrapper.find("div.loading-bar-sm").exists()).toBeTruthy()

		wrapper.setProps({
			size: "large",
		})
		await wrapper.vm.$nextTick()
		expect(wrapper.find("div.loading-bar-lg").exists()).toBeTruthy()

		wrapper.setProps({
			size: "i-am-not-an-acutal-size-lol",
		})
		await wrapper.vm.$nextTick()
		expect(wrapper.find("div.loading-bar-md").exists()).toBeTruthy()
	})

	it("renders with prop `tall`", async () => 
	{
		expect(wrapper.find("div.loading-bar-wrapper").exists()).toBeTruthy()
		wrapper.setProps({
			tall: true,
		})
		await wrapper.vm.$nextTick()
		expect(wrapper.find("div.loading-bar-tall").exists()).toBeTruthy()
	})
})
