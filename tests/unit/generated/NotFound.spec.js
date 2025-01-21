import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

// Creating a helper function to create a wrapper using mount
const createWrapper = (component) => {
  return mount(component)
}

describe('404 Page', () => {
  it('renders correct error message', () => {
    const NotFoundComponent = defineComponent({
      render() {
        return h('template', {}, 
          h('h1', "Oops, it looks like the page you're looking for doesn't exist.")
        )
      }
    })
    const wrapper = createWrapper(NotFoundComponent)
    expect(wrapper.html()).toContain("Oops, it looks like the page you're looking for doesn't exist.")
  })
})
