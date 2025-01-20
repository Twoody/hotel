import { mount } from '@vue/test-utils'
import GuestSafetyAccordion from '@/components/accordions/questions/GuestSafetyAccordion.vue'

function createWrapper() {
	return mount(
		GuestSafetyAccordion,
		{
			global:
			{
				stubs:
				{
					QuestionAccordion:
					{
						template: `
							<div class="accordion-section">
								<div><slot name="title"></slot></div>
								<div><slot name="content"></slot></div>
							</div>
						`,
					},
				},
			},
		},
	)
}

let wrapper

describe('GuestSafetyQuestionAccordion', () => {
	it('Has a title of \"Guest Safety\"', async () => {
		wrapper = createWrapper()
		const titleElement = wrapper.find('.accordion-section > div:first-child')

		expect(titleElement.exists()).toBe(true)
		expect(titleElement.text()).toContain('Guest Safety')
	})

	it('Has correct content about guest safety', async () => {
		wrapper = createWrapper()
		const contentElement = wrapper.find('.accordion-section > div:last-child')
		expect(contentElement.exists()).toBe(true)
		expect(contentElement.text()).toContain('We live in the area and are in touch with leading local experts.')
		expect(contentElement.text()).toContain('We encourage communication and provide guests with important local information.')
	})
})
