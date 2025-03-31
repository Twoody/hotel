// tests/unit/OopsPage.spec.js
import { describe, it, expect } from "vitest"
import { mount } from "@vue/test-utils"
import NotFound from "@/views/NotFound.vue"

// Helper function to create the wrapper
/**
 *
 */
function createWrapper () 
{
	return mount(NotFound)
}

describe.concurrent("NotFoun.vue", () => 
{
	it("renders the correct heading", () => 
	{
		const wrapper = createWrapper()
		// Verify that the <h1> text is rendered
		expect(wrapper.find("h1").text().length).toBeGreaterThan(11)
	})
})

