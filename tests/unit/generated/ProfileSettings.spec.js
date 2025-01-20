// ProfileSettings.test.js
import { mount } from '@vue/test-utils'
import ProfileSettings from '@/components/ProfileSettings.vue'
import BookingsTable from '@/components/entities/BookingsTable.vue'

describe('ProfileSettings', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ProfileSettings)
  })

  it('Should render h2 tag correctly', () => {
    const heading = wrapper.find('h2')
    expect(heading.text()).toBe('Profile Tab')
  })

  it('Should render p tag correctly', () => {
    const para = wrapper.find('p')
    expect(para.text()).toContain('Here you could add user profile form fields')
  })

  it('Should render the BookingsTable component', () => {
    expect(wrapper.findComponent(BookingsTable).exists()).toBe(true);
  })
})

