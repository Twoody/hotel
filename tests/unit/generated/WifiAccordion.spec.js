import { mount } from \"@vue/test-utils\"
import WifiQuestionAccordion from '@/components/WifiQuestionAccordion.vue'

// Helper function
const createComponent = (propsData = {}, slots = {}) => mount(WifiQuestionAccordion, { propsData, slots })

describe('WifiQuestionAccordion', () => {
  let wrapper;

  beforeEach(() => {
     wrapper = createComponent()
  });

  afterEach(() => {
     wrapper.unmount()
  });

  it('should have a proper title', () => {
    const title = wrapper.find('.wifi-accordion-section').text()
    expect(title).toBe('Wifi')
  });

  it('should have proper content', () => {
    const content = wrapper.find('.wifi-accordion-section').text()    
    // Add proper assertions against the content          
  });
  
  // Add more tests as needed
});
