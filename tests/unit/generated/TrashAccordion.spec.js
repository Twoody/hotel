import { mount } from \"@vue/test-utils\";
import { Vue } from \"vue/dist/vue.esm-bundler\";
import QuestionAccordion from \"@/component/QuestionAccordion\";  // ensure path

// Helper function to create the wrapper
const createComponent = propsData => mount(QuestionAccordion, { propsData });

describe(\"TashQuestionAccordion.vue\", () => {
    test('renders the correct title', () => {
        const wrapper = createComponent({
            title: 'Trash + Recycling + Pets'
        });

        expect(wrapper.findTemplateRef('#title').text()).toBe('Trash + Recycling + Pets');
    });

    test('renders the correct content', () => {
        const wrapper = createComponent({
            content: 'Trash, recycling, and composte is picked up every Tuesday morning...'
        });

        expect(wrapper.find('.trash-info').exists()).toBe(true);
        expect(wrapper.find('.trash-info').text()).toContain('Trash, recycling, and composte is picked up every Tuesday morning');
    });

    test('renders the correct classes', () => {
        const wrapper = createComponent({
            class: 'trash-accordion-section'
        });

        expect(wrapper.classes()).toContain('trash-accordion-section');
    });

    test('renders li elements correctly with color styling', () => {
        const wrapper = createComponent();

        const trash = wrapper.find('li:nth-of-type(1) span')
        expect(trash.text()).toBe('Trash is the green bin.');
        expect(trash.attributes().style).toBe('color:green;')
        // Repeat for other li elements
    });

    test('has the correct name', () => {
        const wrapper = createComponent();

        expect(wrapper.vm.$options.name).toBe(\"TashQuestionAccordion\");
    });
});
