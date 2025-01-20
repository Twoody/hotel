import { mount } from \"@vue/test-utils\";
import TrashQuestionAccordion from \"@/components/TrashQuestionAccordion.vue\";

describe(\"TrashQuestionAccordion\", () => {
  
  // Test to check the component mounts successfully
  test(\"mounts successfully\", () => {
    const wrapper = mount(TrashQuestionAccordion);
    expect(wrapper.exists()).toBe(true);
  });

  // Test to check the rendered content
  test(\"renders correct content\", () => {
    const wrapper = mount(TrashQuestionAccordion);
    expect(wrapper.text()).toContain(\"Trash + Recycling + Pets\");
    expect(wrapper.text()).toContain(\"Trash, recycling, and composte is picked up every Tuesday morning\");
    expect(wrapper.text()).toContain(\"You can either contact Tanner or carry the trash up yourself\");
  });

  // Test to check correct class is applied
  test(\"correct class is applied\", () => {
    const wrapper = mount(TrashQuestionAccordion);
    expect(wrapper.classes()).toContain(\"trash-accordion-section\");
  });
  
  // Test to check for nested question accordion
  test(\"validates has-nested prop\", () => {
    const wrapper = mount(TrashQuestionAccordion, {
      props: {
        hasNested: true,
      }
    });
    
    expect(wrapper.vm.$props.hasNested).toBe(true);
  });
});
