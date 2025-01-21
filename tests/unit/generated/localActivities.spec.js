import { mount } from '@vue/test-utils'
import { LOCAL_ACTIVITIES  } from 'path-to-file'
import { createApp } from 'vue'

describe('Testing LOCAL_ACTIVITIES', () => {
  
  // Helper function to mount component
  const wrapperHelper = (componentObj) => {
    const app = createApp(componentObj);
    return mount(app.component);
  }

  test('Check total activities', () => {
    const totalActivities = Object.keys(LOCAL_ACTIVITIES).length
    expect(totalActivities).toBe(18)
  })

  test('Check properties of each activity', () => {
    for (const activity in LOCAL_ACTIVITIES) {
      expect(activity).toHaveProperty('id')
      expect(activity).toHaveProperty('thumbnail')
      expect(activity).toHaveProperty('description')
      expect(activity).toHaveProperty('maps_id')
      expect(activity).toHaveProperty('tags')
      expect(activity).toHaveProperty('title')
      
      // Optional properties
      const hasSubtitle = activity.hasOwnProperty('subtitle')
      const hasStartAt = activity.hasOwnProperty('start_at')
      const hasEndAt = activity.hasOwnProperty('end_at')
      expect(hasSubtitle || hasStartAt || hasEndAt).toBeTruthy()
    }
  })

  // You can move further and test the components where these data are being used
  test('Check activity data in component', async () => {
    // Assuming using the activity in SomeComponent
    const wrapper = wrapperHelper(SomeComponent)

    // Assuming the activity data is used in an h1 tag
    const h1 = wrapper.get('h1')

    // Assuming the first activity is loaded by default (as an example)
    const firstActivity = LOCAL_ACTIVITIES.BURNSIDE

    expect(h1.text().toContain(firstActivity.title)).toBe(true)
  })

  // Similarly, other test cases can be written
})
