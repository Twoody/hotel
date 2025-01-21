import { mount } from '@vue/test-utils';
import store from "@/store/store"
import BookingsTable from '@/components/entities/BookingsTable';

// You may need to add more mock data to cover all cases.
vi.mock('@/store/store', () => ({
  state: {
    user: {
      user: {
        uid: 'test'
      }
    }
  }
}))

describe('BookingsTable', () => {
  it('displays a loading indicator when fetching data', () => {
    const wrapper = mount(BookingsTable);
    wrapper.setData({ isLoading: true });

    expect(wrapper.find('Spinner').isVisible()).toBe(true);
  });

  it('shows a message when no bookings are found', async () => {
    const wrapper = mount(BookingsTable);
    await wrapper.setData({ isLoading: false, userBookings: [] });

    expect(wrapper.text()).toContain('No bookings found.');
  });

  it('renders a table of bookings', async () => {
    const wrapper = mount(BookingsTable);
    await wrapper.setData({ 
      isLoading: false, 
      userBookings: [{  id: 'test', startDate: "2023-11-23T10:20:30Z", endDate: "2023-11-24T10:20:30Z", isPaid: true, status: "Future"}] 
    });

    expect(wrapper.find('table').isVisible()).toBe(true);
  });

  // Continue writing tests for other scenarios and functionalities such as sorting, deleting a booking etc.
});
