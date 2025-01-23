import { mount } from "@vue/test-utils"
import Home from "@/views/Home.vue"
import { createRouter, createWebHistory } from "vue-router"
import { vi } from "vitest"
import { createStore } from "vuex"

// Mock Firebase methods
vi.mock("@/firebase.js", () => ({
	db: {},
}))

// Helper function to create wrapper
const createWrapper = (options = {}) => 
{
	const router = createRouter({
		history: createWebHistory(),
		routes: [
			{
				path: "/manageBooking",
				name: "manageBooking", 
			},
		],
	})

	const store = createStore({
		state: {
			user: {
				user: {
					uid: "testUser123", 
				},
				isAuthReady: true,
			},
		},
		mutations: {},
		actions: {},
	})

	return mount(Home, {
		global: {
			plugins: [
				router,
				store,
			],
			stubs: {
				AvailabilitySearch: {
					name: "AvailabilitySearch",
					template: "<div>AvailabilitySearch</div>",
				},
				AccessibilityAccordion: {
					template: "<div>AccessibilityAccordion</div>", 
				},
				CheckInAndOutAccordion: {
					template: "<div>CheckInAndOutAccordion</div>", 
				},
				GuestSafetyAccordion: {
					template: "<div>GuestSafetyAccordion</div>", 
				},
				ParkingAccordion: {
					template: "<div>ParkingAccordion</div>", 
				},
				TrashAccordion: {
					template: "<div>TrashAccordion</div>", 
				},
				WifiAccordion: {
					template: "<div>WifiAccordion</div>", 
				},
			},
		},
		...options,
	})
}

describe("Home.vue", () => 
{
	it("renders the main wrapper and subcomponents", () => 
	{
		const wrapper = createWrapper()
		expect(wrapper.classes()).toContain("home-wrapper")
		expect(wrapper.find(".booking-section").exists()).toBe(true)
		expect(wrapper.find(".accordion-sections").exists()).toBe(true)
	})

	it("renders the booking section with AvailabilitySearch", () => 
	{
		const wrapper = createWrapper()
		const bookingSection = wrapper.find(".booking-section")
		expect(bookingSection.exists()).toBe(true)
		expect(bookingSection.text()).toContain("AvailabilitySearch")
	})

	it("renders the accordion sections", () => 
	{
		const wrapper = createWrapper()
		const accordionSection = wrapper.find(".accordion-sections")
		expect(accordionSection.exists()).toBe(true)
		expect(accordionSection.text()).toContain("AccessibilityAccordion")
		expect(accordionSection.text()).toContain("CheckInAndOutAccordion")
		expect(accordionSection.text()).toContain("GuestSafetyAccordion")
		expect(accordionSection.text()).toContain("ParkingAccordion")
		expect(accordionSection.text()).toContain("TrashAccordion")
		expect(accordionSection.text()).toContain("WifiAccordion")
	})

	it("calls processBookingRequest on booking-request event", async () => 
	{
		const processBookingRequest = vi.spyOn(Home.methods, "processBookingRequest")
		const wrapper = createWrapper()
		const searchBar = await wrapper.findComponent({
			name: "AvailabilitySearch", 
		})
		await searchBar.vm.$emit("booking-request", {
			startDate: "2023-01-01",
			endDate: "2023-01-02", 
		})
		expect(processBookingRequest).toHaveBeenCalledWith({
			startDate: "2023-01-01",
			endDate: "2023-01-02", 
		})
	})

	it("handles isProcessing state to prevent duplicate booking requests", async () => 
	{
		const wrapper = createWrapper()
		const instance = wrapper.vm

		expect(instance.isProcessing).toBe(false)
		instance.processBookingRequest = vi.fn(async () => 
		{
			instance.isProcessing = true
			await new Promise((resolve) => setTimeout(resolve, 100))
			instance.isProcessing = false
		})

		await instance.processBookingRequest()
		expect(instance.isProcessing).toBe(false)

		await instance.processBookingRequest()
		expect(instance.processBookingRequest).toHaveBeenCalledTimes(2)
	})

	it("redirects to manageBooking after booking creation", async () => 
	{
		const wrapper = createWrapper()
		const router = wrapper.vm.$router
		const pushSpy = vi.spyOn(router, "push")
		const instance = wrapper.vm

		await instance.processBookingRequest({
			startDate: "2023-01-01",
			endDate: "2023-01-02", 
		})
		expect(pushSpy).toHaveBeenCalledWith({
			name: "manageBooking",
			params: {
				id: undefined, 
			}, // `id` is undefined here due to mocked Firestore
		})
	})

	it("displays the correct state for auth readiness", () => 
	{
		const wrapper = createWrapper()
		expect(wrapper.vm.isAuthReady).toBe(true)
	})

	it("handles errors during booking creation gracefully", async () => 
	{
		const wrapper = createWrapper()
		const instance = wrapper.vm
		const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => 
		{})

		instance.processBookingRequest = vi.fn(async () => 
		{
			throw new Error("Firestore error")
		})

		await instance.processBookingRequest({
			startDate: "2023-01-01",
			endDate: "2023-01-02", 
		})
		expect(consoleErrorSpy).toHaveBeenCalledWith("Error creating booking document: ", new Error("Firestore error"))
		consoleErrorSpy.mockRestore()
	})
})

