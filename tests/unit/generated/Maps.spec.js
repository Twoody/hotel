import { mount } from '@vue/test-utils'
import Maps from '@/path/to/Maps'

describe('Maps', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Maps, {
      // Mocking this.$store.state.isOnline
      mocks: {
        $store: {
          state: {
            isOnline: true
          }
        }
      }
    })
  })
