import { vi } from "vitest"
import { LOCAL_ACTIVITIES } from "@/constants/localActivities.js"

// Mock Firebase analytics
vi.mock("firebase/analytics", () => ({
	getAnalytics: vi.fn(),
	logEvent: vi.fn(),
}))

// Mock local Firebase helpers
vi.mock("@/firebase", () => ({
	firebaseAnalytics: {}, // Provide a simple mock object
}))

describe("Testing LOCAL_ACTIVITIES", () =>
{
	
	test("Check total activities", () =>
	{
		const totalActivities = Object.keys(LOCAL_ACTIVITIES).length
		expect(totalActivities).toBeGreaterThan(18)
	})

	test("Check properties of each activity", () =>
	{
		for (const activityKey in LOCAL_ACTIVITIES)
		{
			const activity = LOCAL_ACTIVITIES[activityKey]
			expect(activity).toHaveProperty("id")
			expect(activity).toHaveProperty("thumbnail")
			expect(activity).toHaveProperty("description")
			expect(activity).toHaveProperty("maps_id")
			expect(activity).toHaveProperty("tags")
			expect(activity).toHaveProperty("title")

			// Optional properties
			const optionalProperties = [
				"subtitle",
				"start_at",
				"end_at",
			]
			const hasOptionalProperty = optionalProperties.some((prop) => prop in activity)
			expect(hasOptionalProperty).toBeTruthy()
		}
	})

})
