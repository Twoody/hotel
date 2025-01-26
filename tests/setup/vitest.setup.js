import { vi } from "vitest"
// Mock global alert
global.alert = vi.fn()

// Mock other global functions
global.confirm = vi.fn()
global.prompt = vi.fn()

// Mocking `console` methods if needed
global.console.log = vi.fn()
global.console.error = vi.fn()

it("should call alert with the correct message", () => 
{
	alert("Hello, world!")
	expect(global.alert).toHaveBeenCalledWith("Hello, world!")
})

