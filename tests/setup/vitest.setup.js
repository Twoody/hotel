import { vi } from "vitest"

// Mock global browser dialogs
global.alert = vi.fn()
global.confirm = vi.fn()
global.prompt = vi.fn()
