import { mount } from \"@vue/test-utils\"
import WifiQuestionAccordion from \"@/components/WifiQuestionAccordion.vue\"

describe(\"WifiQuestionAccordion.vue\", () => {
  it(\"renders the title\", () => {
    const wrapper = mount(WifiQuestionAccordion)
    expect(wrapper.text()).toContain(\"Wifi\")
  })
  
  it(\"renders the content\", () => {
    const wrapper = mount(WifiQuestionAccordion)
    expect(wrapper.text()).toContain(\"We have fiber optic internet, with a blazing up and down time.\")
    expect(wrapper.text()).toContain(\"If it is working from home or streaming, our internet speeds have you covered.\")
    expect(wrapper.text()).toContain(\"If you have problems with the password, please contact Tanner.\")
  })
})
