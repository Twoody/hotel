import { mount } from "@vue/test-utils"
import About from "@/views/About.vue"

describe.concurrent("About.vue", () => 
{
	it("renders about page", () => 
	{
		const wrapper = mount(About)
		expect(wrapper.find("h1").text()).toBe("About Us")
		expect(wrapper.find("h2").text()).toBe("The Creators")
    
		const paragraphs = wrapper.findAll("p")
		expect(paragraphs.length).toBe(3)

		const listItems = wrapper.findAll("li")
		expect(listItems.length).toBe(3)

		expect(wrapper.find(".statistic").exists()).toBe(true)
	})
})
