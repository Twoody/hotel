import { describe, it, expect, beforeEach, vi } from "vitest"
import { mount } from "@vue/test-utils"
import { createStore } from "vuex"
import { createRouter, createWebHistory } from "vue-router"
import BookingsTable from "@/components/entities/BookingsTable.vue"

// --- 1) Mock Firebase Firestore functions ---
vi.mock("@/firebase.js", () => ({
	db: {},
}))
vi.mock("firebase/firestore", () =>
{
	return {
		// Mocked Firestore methods
		collection: vi.fn(),
		query: vi.fn(),
		where: vi.fn(),
		getDocs: vi.fn().mockResolvedValue({
			forEach: (callback) =>
			{
				callback({
					id: "2",
					data: () => ({
						padiAt: null, // no paidAt => bookingIsPaid => false
						startDate: "2025-01-01",
						endDate: "2025-01-05",
					}),
				})
			},
		}),

		doc: vi.fn(),
		deleteDoc: vi.fn().mockResolvedValue(),
	}
})

const createWrapper = ({ userState = {}, ...options } = {}) =>
{
	const store = createStore({
		state: {
			user: {
				isAuthReady: true,
				isLoggedIn: true,
				isLoggingIn: false,
				user: {
					uid: "testUserId",
				},
			},
		},
		actions: {},
	})

	// Merge your userState overrides
	//		This could be a simple Object.assign(...) or a deeper merge
	Object.assign(store.state.user, userState)

	const router = createRouter({
		history: createWebHistory(),
		routes: [
			{
				path: "/",
				name: "homne",
				component: {
					template: "<div>Home Page</div>",
				},
			},
		],
	})

	return mount(BookingsTable, {
		global: {
			plugins: [
				store,
				router,
			],
			// Stub out components so we don’t need their real implementations
			stubs: {
				Spinner: {
					name: "Spinner",
					template: "<div class=\"spinner-stub\">Spinner</div>",
				},
				// The component uses <router-link> for booking links
				RouterLink: {
					name: "RouterLink",
					props: [
						"to",
					],
					template: "<a :href=\"to\"><slot /></a>",
				},
				// It also uses <font-awesome-icon>, so we can stub
				FontAwesomeIcon: {
					name: "FontAwesomeIcon",
					props: [
						"icon",
						"class",
					],
					template: "<span class=\"font-awesome-icon\" :class=\"$props.class\" />",
				},
			},
		},
		...options,
	})
}

describe("BookingsTable.vue", () =>
{
	beforeEach(() =>
	{
		// Clear mocks before each test
		vi.resetAllMocks()
	})

	it("mounts without error", () =>
	{
		const wrapper = createWrapper({ })
		expect(wrapper.exists()).toBe(true)
	})

	it("shows a Spinner if isLoading is true", async () =>
	{
		const wrapper = createWrapper()
		await wrapper.vm.$nextTick()
		// Initially, isLoading is false
		expect(wrapper.vm.isLoading).toBe(false)
		await wrapper.setData({
			isLoading: true,
		})

		// Now the spinner block should render
		expect(wrapper.find("table.bookings-table").exists()).toBe(false)
		expect(wrapper.find(".no-bookings").exists()).toBe(false)
		const spinner = wrapper.find(".spinner-stub")
		expect(spinner.exists()).toBe(true)
		// The table or "no bookings" text should not be rendered now
	})

	it("shows 'No bookings found.' if finished loading and no bookings", async () =>
	{
		const wrapper = createWrapper({ })
		await wrapper.vm.$nextTick()
		// Must ensure isLoading = false and userBookings is empty
		await wrapper.setData({
			isLoading: false,
			userBookings: [],
		})
		// The <p> with "No bookings found." should appear
		const noBookingsMsg = wrapper.find("p")
		expect(noBookingsMsg.exists()).toBe(true)
		expect(noBookingsMsg.text()).toContain("No bookings found.")

		// No spinner and no table
		expect(wrapper.find(".spinner-stub").exists()).toBe(false)
		expect(wrapper.find("table.bookings-table").exists()).toBe(false)
	})

	it("displays the table if userBookings is non-empty", async () =>
	{
		// Provide some test bookings
		const testBookings = [
			{
				id: "1",
				startDate: "2025-01-01",
				endDate: "2025-01-05",
				isPaid: true,
				status: "Future",
			},
			{
				id: "2",
				startDate: "2024-12-25",
				endDate: "2024-12-31",
				isPaid: false,
				status: "Future",
			},
		]

		const wrapper = createWrapper({ })
		await wrapper.vm.$nextTick()
		await wrapper.setData({
			isLoading: false,
			userBookings: testBookings,
		})

		// The table should appear
		const table = wrapper.find("table.bookings-table")
		expect(table.exists()).toBe(true)

		// The spinner or "No bookings" should NOT be displayed
		expect(wrapper.find(".spinner-stub").exists()).toBe(false)
		expect(wrapper.find("table.bookings-table").exists()).toBe(true)

		// Confirm we have two table rows (besides the header)
		const rows = table.findAll("tbody tr")
		expect(rows.length).toBe(2)
	})

	it("sorts bookings by clicked column", async () =>
	{
		// Provide test data unsorted
		const testBookings = [
			{
				id: "1",
				startDate: "2025-01-05",
				isPaid: true,
				status: "Future",
			},
			{
				id: "2",
				startDate: "2025-01-01",
				isPaid: false,
				status: "Future",
			},
		]

		const wrapper = createWrapper({ })
		await wrapper.vm.$nextTick()
		await wrapper.setData({
			isLoading: false,
			userBookings: testBookings,
		})

		// Confirm initial unsorted order => [id:1, id:2]
		expect(wrapper.vm.sortedBookings[0].id).toBe("1")

		// Click the "Start Date" <th> to sort
		const startDateHeader = wrapper.findAll("th").at(0)
		await startDateHeader.trigger("click")

		// After 1 click => sortKey="startDate", sortOrder="asc"
		expect(wrapper.vm.sortKey).toBe("startDate")
		expect(wrapper.vm.sortOrder).toBe("asc")
		// Bookings should be sorted ascending by startDate => id:2 first, then id:1
		expect(wrapper.vm.sortedBookings[0].id).toBe("2")

		// Click again => toggles sortOrder to "desc"
		await startDateHeader.trigger("click")
		expect(wrapper.vm.sortOrder).toBe("desc")
		// Now the order should be reversed
		expect(wrapper.vm.sortedBookings[0].id).toBe("1")
	})

	it("calls deleteDoc when deleteBooking is invoked", async () =>
	{
		// Provide a single booking
		const testBookings = [
			{
				id: "1",
				startDate: "2025-01-05",
				isPaid: true,
				status: "Future",
			},
			{
				id: "2",
				startDate: "2025-01-01",
				isPaid: false,
				status: "Future",
			},
		]

		const wrapper = createWrapper()
		await wrapper.vm.$nextTick()
		await wrapper.setData({
			isLoading: false,
			userBookings: testBookings,
		})

		await wrapper.vm.$nextTick()

		// Confirm initial unsorted order => [id:1, id:2]
		expect(wrapper.vm.sortedBookings[0].id).toBe("1")

		// The trash icon is shown only if booking.isPaid = false
		const trashIcon = wrapper.find(".delete-icon")
		expect(trashIcon.exists()).toBe(true)

		// Trigger the click
		await trashIcon.trigger("click")

		// We expect "deleteDoc" to have been called with doc(..., "bookings", "2")
		const { deleteDoc, doc, } = await import("firebase/firestore")
		expect(doc).toHaveBeenCalledWith(expect.anything(), "bookings", "2")
		expect(deleteDoc).toHaveBeenCalledTimes(1)

		expect(wrapper.vm.userBookings.find((b) => b.id === "2")).toBeUndefined()
	})

	it("fetches user bookings on created() if a user is logged in", async () =>
	{
		// We mock getDocs, which is called in fetchUserBookings
		const { getDocs, } = await import("firebase/firestore")
		const wrapper = createWrapper()
		await wrapper.vm.$nextTick()

		// By default, the store mock sets currentUser.uid = "test-uid-123"
		// So fetchUserBookings() tries to query Firestore on created()

		// On mount, isLoading is true => we can verify it eventually gets set to false
		expect(wrapper.vm.isLoading).toBe(false) // after completed
		// fetchUserBookings is called once during created

		// We can also check if getDocs was called with the correct query args
		expect(getDocs).toHaveBeenCalledTimes(1)
	})

	it("skips fetching if no user is logged in", async () =>
	{
		let userState = {
			isAuthReady: true,
			isLoggedIn: false,
			isLoggingIn: true,
			user: null,
		}
		const wrapper = createWrapper({
			userState,
		})

		const { getDocs, } = await import("firebase/firestore")
		// getDocs should NOT be called
		expect(getDocs).not.toHaveBeenCalled()
		// userBookings should remain empty
		expect(wrapper.vm.userBookings.length).toBe(0)
	})
})

