// Import the required modules
import { mount } from '@vue/test-utils'
import AccessibilityQuestionAccordion from '@src/components/AccessibilityQuestionAccordion.vue'

// A helper function to create a wrapper around the component
const createComponentWrapper = (component, options) => {
    return mount(component, options);
};

// Write test cases for the AccessibilityQuestionAccordion.vue here
describe('AccessibilityQuestionAccordion.vue', () => {
    it('Renders the title correctly', () => {
        const wrapper = createComponentWrapper(AccessibilityQuestionAccordion);

        // Check if the title is rendered correctly
        const title = wrapper.get('.title');
        expect(title.text()).toBe('Accessibility');
    });

    it('Renders the content correctly', () => {
        const wrapper = createComponentWrapper(AccessibilityQuestionAccordion);

        // Check if the first paragraph in the content is rendered correctly
        const firstParagraph = wrapper.findAll('p')[0];
        expect(firstParagraph.text()).toContain('We believe that anyone can belong anywhere');

        // Check if the second paragraph in the content is rendered correctly
        const secondParagraph = wrapper.findAll('p')[1];
        expect(secondParagraph.text()).toContain('Please reach out');

    });

    // Add more tests as required for different scenarios and edge cases
})
