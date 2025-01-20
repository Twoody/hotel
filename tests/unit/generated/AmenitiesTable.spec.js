import { shallowMount } from '@vue/test-utils';
import AmenitiesTable from '@/components/entities/amenities/AmenitiesTable.vue';
import { AMENITIES } from '@/constants/amenities.js';

describe('AmenitiesTable.vue', () => {

  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(AmenitiesTable);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('sorts the keys from AMENITIES constant', () => {
    const expectedKeys = Object.keys(AMENITIES).sort((a, b) => a.localeCompare(b));
    expect(wrapper.vm.keys).toEqual(expectedKeys);
  });

  it('formats the title correctly', () => {
    expect(wrapper.vm.formatTitle("LIVING_ROOM")).toBe("LIVING ROOM");
  });

});
