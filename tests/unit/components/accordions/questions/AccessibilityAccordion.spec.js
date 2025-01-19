import { mount } from '@vue/test-utils'
import AccessibilityAccordion from "@/components/accordions/questions/AccessibilityAccordion.vue"

// Helper function to create a wrapper 
function createWrapper() {
	return mount(
		AccessibilityAccordion,
		{
		global: {
			stubs: {
				QuestionAccordion: {
							template: '<div><slot name="title"></slot><slot name="content"></slot></div>',
				},
			},
		},
		},
	)
}

describe('AccessibilityAccordion.vue', () => {
	test('renders accordian section', () => {
		const wrapper = createWrapper()
		expect(wrapper.classes()).toContain('accordion-section')
	})

	test('renders title correctly', () => {

	const wrapper = createWrapper()
	const titleElement = wrapper.find('.accordion-title') // Update selector as needed
	expect(titleElement.text()).toContain('Accessibility')

	})

	test('renders content correctly', () => {
		const wrapper = createWrapper()
		const content = wrapper.find('template[content]').text()
		expect(content).toContain('We believe that anyone can belong anywhere')
		expect(content).toContain('Please reach out')
		expect(content).toContain('Wheelchair accessibility is our biggest \"next step\" for our space.')
		expect(content).toContain('We apologize for that inconvenience.')
	})

	// further tests...
})
