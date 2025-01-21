import { mount } from '@vue/test-utils'
import Vue from 'vue'
import { MAP_FILTERS, MAPS } from './source.js'

const makeWrapper = (Component, propsData) => {
  return mount(Component, { propsData })
}

// Define your component here
const Component = Vue.extend({
  methods: {
    getMapFilter: function (filterId) {
      return MAP_FILTERS[filterId]
    },
    getMapName: function (mapId) {
      return Object.keys(MAPS).find(key => MAPS[key] === mapId)
    }
  }
})

describe('Testing MAPS and MAP_FILTERS', () => {
  test('getMapFilter returns correct filter', () => {
    const wrapper = makeWrapper(Component)
    expect(wrapper.vm.getMapFilter(1)).toBe('Dog Friendly')
    expect(wrapper.vm.getMapFilter(2)).toBe('Food')
  })

  test('getMapName returns correct map name', () => {
    const wrapper = makeWrapper(Component)
    expect(wrapper.vm.getMapName(1)).toBe('BURNSIDE')
    expect(wrapper.vm.getMapName(10)).toBe('CANBY')
  })
})
