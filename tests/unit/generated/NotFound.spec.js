import { mount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'  // Please replace this by your component's actual path

describe('MyComponent', () => {
  test('renders correctly', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.html()).toContain(\"<h1>Oops, it looks like the page you're looking for doesn't exist.</h1>\")
  })
})
