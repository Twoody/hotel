import { mount } from "@vue/test-utils"
import { createStore } from "vuex"
import { createRouter, createWebHistory } from "vue-router"
import { vi } from "vitest"
import ManageBooking from "@/views/bookings/ManageBooking.vue"
import { getDoc } from "firebase/firestore"

// Mock Firebase methods
vi.mock("firebase/firestore", () => ({
	doc: vi.fn(() => ({
		id: "testBookingId",
	})),
	getDoc: vi.fn(() => ({
		exists: () => true,
		data: () => ({
			guestID: "testUserId",
			paidAt: "2023-01-01",
		}),
	})),
}))

// Mock Firebase methods
vi.mock("@/firebase", () => ({
	db: {},
	getFirestore: vi.fn(),
}))

// Helper function to create wrapper
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
				name: "home",
				component: {
					template: "<div>Home Page</div>",
				},
			},
			{
				path: "/booking/:id",
				name: "Booking",
				component: {
					template: "<div>Booking page</div>",
				},
			},
		],
	})

	return mount(ManageBooking, {
		global: {
			plugins: [
				store,
				router,
			],
			stubs: {
				Spinner: {
					name: "Spinner",
					template: "<div class=\"spinner-stub\">Spinner</div>",
				},
				BookingNotLoggedIn: {
					template: "<div>BookingNotLoggedIn</div>",
				},
				BookingNotFound: {
					template: "<div>BookingNotFound</div>",
				},
				CompletedBooking: {
					template: "<div>CompletedBooking</div>",
				},
				FinalizeBooking: {
					template: "<div>FinalizeBooking</div>",
				},
				UnauthorizedBooking: {
					template: "<div>UnauthorizedBooking</div>",
				},
			},
			mocks: {
				$route: {
					params: {
						id: "TEST_ID",
					},
				},
			},
		},
		...options,
	})
}

describe.concurrent("ManageBooking.vue", () =>
{
	beforeEach(() =>
	{
		// Clear mocks before each test
		vi.resetAllMocks()

		getDoc.mockResolvedValue({
			exists: () => true,
			data: () => ({
				guestID: "testUserId",
				paidAt: "2023-01-01",
			}),
		})

	})

	it("shows a spinner while auth or booking is loading", () =>
	{
		let userState = {
			isAuthReady: false,
			isLoggedIn: false,
			isLoggingIn: false,
			user: null,
		}
		const wrapper = createWrapper({
			userState,
		})

		expect(wrapper.findComponent({
			name: "Spinner",
		}).exists()).toBe(true)
	})

	it("shows the BookingNotLoggedIn component if the user is not logged in", async () =>
	{
		let userState = {
			isAuthReady: true,
			isLoggedIn: false,
			isLoggingIn: false,
		}
		const wrapper = createWrapper({
			userState,
		})

		await wrapper.vm.fetchBooking()

		const loading = wrapper.find("[data-testid=\"conditional-view-manager-loading\"]")
		const notFound = wrapper.find("[data-testid=\"conditional-view-manager-booking-404\"]")
		const unauthorized = wrapper.find("[data-testid=\"conditional-view-manager-not-right-user\"]")
		const good = wrapper.find("[data-testid=\"conditional-view-manager-good-booking\"]")
		const notCompleted = wrapper.find("[data-testid=\"conditional-view-manager-not-completed\"]")
		const loggedOut = wrapper.find("[data-testid=\"conditional-view-manager-needs-logged-in\"]")

		expect(loading.exists()).toBe(false)
		expect(notFound.exists()).toBe(false)
		expect(unauthorized.exists()).toBe(false)
		expect(good.exists()).toBe(false)
		expect(notCompleted.exists()).toBe(false)
		expect(loggedOut.exists()).toBe(true)
	})

	it("shows the BookingNotFound component if no booking is found", async () =>
	{
		getDoc.mockResolvedValueOnce({
			exists: () => false,
		})

		let userState = {
			isAuthReady: true,
			isLoggedIn: true,
			isLoggingIn: false,
			user: null,
		}
		const wrapper = createWrapper({
			userState,
		})

		await wrapper.vm.fetchBooking()
		const loading = wrapper.find("[data-testid=\"conditional-view-manager-loading\"]")
		const notFound = wrapper.find("[data-testid=\"conditional-view-manager-booking-404\"]")
		const unauthorized = wrapper.find("[data-testid=\"conditional-view-manager-not-right-user\"]")
		const good = wrapper.find("[data-testid=\"conditional-view-manager-good-booking\"]")
		const notCompleted = wrapper.find("[data-testid=\"conditional-view-manager-not-completed\"]")
		const loggedOut = wrapper.find("[data-testid=\"conditional-view-manager-needs-logged-in\"]")

		expect(loading.exists()).toBe(false)
		expect(unauthorized.exists()).toBe(false)
		expect(loggedOut.exists()).toBe(false)
		expect(notCompleted.exists()).toBe(false)
		expect(good.exists()).toBe(false)
		expect(notFound.exists()).toBe(true)
	})

	it("shows the UnauthorizedBooking component if booking belongs to another user", async () =>
	{
		getDoc.mockResolvedValueOnce({
			exists: () => true,
			data: () => ({
				guestID: "differentUserId",
			}),
		})

		let userState = {
			isAuthReady: true,
			isLoggedIn: true,
			isLoggingIn: false,
			user: null,
		}
		const wrapper = createWrapper({
			userState,
		})

		await wrapper.vm.fetchBooking()
		expect(wrapper.vm.bookingBelongsToUser).toBe(false)
		const loading = wrapper.find("[data-testid=\"conditional-view-manager-loading\"]")
		const notFound = wrapper.find("[data-testid=\"conditional-view-manager-booking-404\"]")
		const unauthorized = wrapper.find("[data-testid=\"conditional-view-manager-not-right-user\"]")
		const good = wrapper.find("[data-testid=\"conditional-view-manager-good-booking\"]")
		const notCompleted = wrapper.find("[data-testid=\"conditional-view-manager-not-completed\"]")
		const loggedOut = wrapper.find("[data-testid=\"conditional-view-manager-needs-logged-in\"]")

		expect(loading.exists()).toBe(false)
		expect(notFound.exists()).toBe(false)
		expect(loggedOut.exists()).toBe(false)
		expect(notCompleted.exists()).toBe(false)
		expect(good.exists()).toBe(false)
		expect(unauthorized.exists()).toBe(true)
	})

	it("shows the CompletedBooking component if the booking is complete", async () =>
	{
		let userState = {
			isAuthReady: true,
			isLoggedIn: true,
			isLoggingIn: false,
		}
		const wrapper = createWrapper({
			userState,
		})

		await wrapper.vm.fetchBooking()
		await wrapper.vm.$nextTick()
		expect(wrapper.vm.bookingCompleted).toBe(true)

		const loading = wrapper.find("[data-testid=\"conditional-view-manager-loading\"]")
		const notFound = wrapper.find("[data-testid=\"conditional-view-manager-booking-404\"]")
		const unauthorized = wrapper.find("[data-testid=\"conditional-view-manager-not-right-user\"]")
		const good = wrapper.find("[data-testid=\"conditional-view-manager-good-booking\"]")
		const notCompleted = wrapper.find("[data-testid=\"conditional-view-manager-not-completed\"]")
		const loggedOut = wrapper.find("[data-testid=\"conditional-view-manager-needs-logged-in\"]")

		expect(loading.exists()).toBe(false)
		expect(notFound.exists()).toBe(false)
		expect(unauthorized.exists()).toBe(false)
		expect(loggedOut.exists()).toBe(false)
		expect(notCompleted.exists()).toBe(false)
		expect(good.exists()).toBe(true)
	})

	it("shows the FinalizeBooking component if the booking is not complete", async () =>
	{
		// Overwrite the mock returned in beforeEach
		getDoc.mockResolvedValue({
			exists: () => true,
			data: () => ({
				guestID: "testUserId",
				paidAt: null,
			}),
		})

		let userState = {
			isAuthReady: true,
			isLoggedIn: true,
			isLoggingIn: false,
		}
		const wrapper = createWrapper({
			userState,
		})

		await wrapper.vm.fetchBooking()
		await wrapper.vm.$nextTick()
		expect(wrapper.vm.bookingNotFound).toBe(false)
		expect(wrapper.vm.booking.guestID).toBe("testUserId")
		expect(wrapper.vm.booking.paidAt).toBe(null)
		expect(wrapper.vm.bookingCompleted).toBe(false)

		const loading = wrapper.find("[data-testid=\"conditional-view-manager-loading\"]")
		const notFound = wrapper.find("[data-testid=\"conditional-view-manager-booking-404\"]")
		const unauthorized = wrapper.find("[data-testid=\"conditional-view-manager-not-right-user\"]")
		const good = wrapper.find("[data-testid=\"conditional-view-manager-good-booking\"]")
		const notCompleted = wrapper.find("[data-testid=\"conditional-view-manager-not-completed\"]")
		const loggedOut = wrapper.find("[data-testid=\"conditional-view-manager-needs-logged-in\"]")

		expect(loading.exists()).toBe(false)
		expect(notFound.exists()).toBe(false)
		expect(unauthorized.exists()).toBe(false)
		expect(good.exists()).toBe(false)
		expect(loggedOut.exists()).toBe(false)
		expect(notCompleted.exists()).toBe(true)
	})

	it("handles errors during booking fetch", async () =>
	{
		const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() =>
		{})
		getDoc.mockRejectedValueOnce(new Error("Firestore error"))

		let userState = {
			isAuthReady: true,
			isLoggedIn: true,
			isLoggingIn: false,
			user: null,
		}
		const wrapper = createWrapper({
			userState,
		})
		await wrapper.vm.$nextTick()
		await wrapper.vm.fetchBooking()

		expect(consoleErrorSpy).toHaveBeenCalledWith(
			"Error fetching booking:",
			new Error("Firestore error")
		)
		expect(wrapper.vm.isLoadingBooking).toBe(false)

		consoleErrorSpy.mockRestore()
	})

	it("tracks loading state during booking fetch", async () =>
	{
		let userState = {
			isAuthReady: true,
			isLoggedIn: true,
			isLoggingIn: false,
			user: null,
		}
		const wrapper = createWrapper({
			userState,
		})
		await wrapper.vm.$nextTick()

		expect(wrapper.vm.isLoadingBooking).toBe(false)
		wrapper.vm.fetchBooking()
		expect(wrapper.vm.isLoadingBooking).toBe(true)

		await wrapper.vm.$nextTick()
		expect(wrapper.vm.isLoadingBooking).toBe(false)
	})
})

