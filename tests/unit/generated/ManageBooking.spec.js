import { mount } from "@vue/test-utils"
import { createStore } from "vuex"
import { createRouter, createWebHistory } from "vue-router"
import { vi } from "vitest"
import ManageBooking from "@/views/bookings/ManageBooking.vue"

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
const createWrapper = (options = {}) => 
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

	const router = createRouter({
		history: createWebHistory(),
		routes: [
			{
				path: "/booking/:id",
				name: "Booking", 
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
					template: "<div>Spinner</div>", 
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
		},
		...options,
	})
}

describe("ManageBooking.vue", () => 
{
	it("shows a spinner while auth or booking is loading", () => 
	{
		const wrapper = createWrapper({
			global: {
				mocks: {
					$store: {
						state: {
							user: {
								isAuthReady: false, 
							}, 
						},
					},
				},
			},
		})
		expect(wrapper.findComponent({
			name: "Spinner", 
		}).exists()).toBe(true)
	})

	it("shows the BookingNotLoggedIn component if the user is not logged in", () => 
	{
		const wrapper = createWrapper({
			global: {
				mocks: {
					$store: {
						state: {
							user: {
								isLoggedIn: false, 
							}, 
						},
					},
				},
			},
		})
		expect(wrapper.findComponent({
			name: "BookingNotLoggedIn", 
		}).exists()).toBe(true)
	})

	it("shows the BookingNotFound component if no booking is found", async () => 
	{
		const { getDoc, } = await import("firebase/firestore")
		getDoc.mockResolvedValueOnce({
			exists: () => false,
		})

		const wrapper = createWrapper()
		await wrapper.vm.fetchBooking()

		expect(wrapper.vm.bookingNotFound).toBe(true)
		expect(wrapper.findComponent({
			name: "BookingNotFound", 
		}).exists()).toBe(true)
	})

	it("shows the UnauthorizedBooking component if booking belongs to another user", async () => 
	{
		const { getDoc, } = await import("firebase/firestore")
		getDoc.mockResolvedValueOnce({
			exists: () => true,
			data: () => ({
				guestID: "differentUserId", 
			}),
		})

		const wrapper = createWrapper()
		await wrapper.vm.fetchBooking()

		expect(wrapper.vm.bookingBelongsToUser).toBe(false)
		expect(wrapper.findComponent({
			name: "UnauthorizedBooking", 
		}).exists()).toBe(true)
	})

	it("shows the CompletedBooking component if the booking is complete", async () => 
	{
		const { getDoc, } = await import("firebase/firestore")
		getDoc.mockResolvedValueOnce({
			exists: () => true,
			data: () => ({
				guestID: "testUserId",
				paidAt: "2023-01-01", 
			}),
		})

		const wrapper = createWrapper()
		await wrapper.vm.fetchBooking()

		expect(wrapper.vm.bookingCompleted).toBe(true)
		expect(wrapper.findComponent({
			name: "CompletedBooking", 
		}).exists()).toBe(true)
	})

	it("shows the FinalizeBooking component if the booking is not complete", async () => 
	{
		const { getDoc, } = await import("firebase/firestore")
		getDoc.mockResolvedValueOnce({
			exists: () => true,
			data: () => ({
				guestID: "testUserId", 
			}),
		})

		const wrapper = createWrapper()
		await wrapper.vm.fetchBooking()

		expect(wrapper.vm.bookingCompleted).toBe(false)
		expect(wrapper.findComponent({
			name: "FinalizeBooking", 
		}).exists()).toBe(true)
	})

	it("handles errors during booking fetch", async () => 
	{
		const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => 
		{})
		const { getDoc, } = await import("firebase/firestore")
		getDoc.mockRejectedValueOnce(new Error("Firestore error"))

		const wrapper = createWrapper()
		await wrapper.vm.fetchBooking()

		expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching booking:", new Error("Firestore error"))
		expect(wrapper.vm.isLoadingBooking).toBe(false)

		consoleErrorSpy.mockRestore()
	})

	it("tracks loading state during booking fetch", async () => 
	{
		const wrapper = createWrapper()

		expect(wrapper.vm.isLoadingBooking).toBe(false)
		wrapper.vm.fetchBooking()
		expect(wrapper.vm.isLoadingBooking).toBe(true)

		await wrapper.vm.$nextTick()
		expect(wrapper.vm.isLoadingBooking).toBe(false)
	})
})

