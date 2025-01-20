import { mount } from \"@vue/test-utils\";
import Amenities from \"@/components/entities/amenities/AmenitiesTable.vue\";

describe(\"Amenities.vue\", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = mount(Amenities);
    });

    it(\"renders the correct markup\", () => {
        expect(wrapper.html()).toContain('<h1>Amenities</h1>');
        expect(wrapper.html()).toContain('<amenities-table-stub></amenities-table-stub>');
    });

    // Check if AmenitiesTable component is present
    it(\"has a component\", () => {
        expect(wrapper.findComponent({name: \"AmenitiesTable\"})).toBeTruthy();
    });
});
