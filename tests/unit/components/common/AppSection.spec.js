import { createLocalVue } from "@vue/test-utils"
import { shallowMount } from "@vue/test-utils"
import AppSection from "@/components/common/AppSection"

const localVue = createLocalVue()
describe("AppSection Component", () => 
{
	let wrapper
	beforeEach(() =>
	{
		// Instantiate the component
		wrapper = shallowMount(
			AppSection,
			{
				localVue,
				propsData: {},
				slots:
				{
					default: "<div class=\"fake-section-content\"></div>",
				},
			}
		)
	})

	it("renders in general", async () => 
	{
		expect(wrapper.find("div.app-section-wrapper").exists()).toBeTruthy()
		expect(wrapper.find("div.is-collapsed").exists()).toBeFalsy()
		expect(wrapper.find("div.is-hidden").exists()).toBeTruthy()
		expect(wrapper.find("div.is-showing").exists()).toBeFalsy()
		wrapper.setProps({
			isShowing: true,
		})
		await wrapper.vm.$nextTick()
		expect(wrapper.find("div.is-collapsed").exists()).toBeFalsy()
		expect(wrapper.find("div.is-hidden").exists()).toBeFalsy()
		expect(wrapper.find("div.is-showing").exists()).toBeTruthy()
	})
	it("renders collapsed state", async () => 
	{
		wrapper.setProps({
			isCollapsed: true,
			isShowing: true,
		})
		await wrapper.vm.$nextTick()
		expect(wrapper.find("div.app-section-wrapper").exists()).toBeTruthy()
		expect(wrapper.find("div.is-collapsed").exists()).toBeTruthy()
		expect(wrapper.find("div.is-hidden").exists()).toBeFalsy()
		expect(wrapper.find("div.is-showing").exists()).toBeFalsy()
	})
	it("renders hidden state", () => 
	{
		wrapper.setProps({
			isShowing: false,
		})
		expect(wrapper.find("div.app-section-wrapper").exists()).toBeTruthy()
		expect(wrapper.find("div.is-collapsed").exists()).toBeFalsy()
		expect(wrapper.find("div.is-hidden").exists()).toBeTruthy()
		expect(wrapper.find("div.is-showing").exists()).toBeFalsy()
	})
	it("renders slot content", () => 
	{
		wrapper.setProps({
			isShowing: true,
		})
		expect(wrapper.find("div.app-section-wrapper").exists()).toBeTruthy()
		expect(wrapper.findAll(".fake-section-content").length).toBe(1)
	})

	// TODO: Copy the below but test inner slot emiting click
	it("main wrapper div emits a click", async () => 
	{
		let button = wrapper.findComponent(AppSection)
		await button.trigger("click")
		expect(wrapper.emitted()["click"]).toBeTruthy()
	})
})
