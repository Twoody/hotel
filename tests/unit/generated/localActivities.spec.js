import { mount } from "@vue/test-utils"
import { LOCAL_ACTIVITIES } from "@/constants/localActivities.js"
import { createApp } from "vue"
import Home from "@/views/Home.vue"

describe("Testing LOCAL_ACTIVITIES", () => 
{
  
	// Helper function to mount component
	const wrapperHelper = (componentObj) => 
	{
		const app = createApp(componentObj)
		return mount(app.component)
	}

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
			const hasSubtitle = activity.hasOwnProperty("subtitle")
			const hasStartAt = activity.hasOwnProperty("start_at")
			const hasEndAt = activity.hasOwnProperty("end_at")
			expect(hasSubtitle || hasStartAt || hasEndAt).toBeTruthy()
		}
	})
})
