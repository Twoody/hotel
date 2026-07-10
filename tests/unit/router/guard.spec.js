import { describe, it, expect, vi } from "vitest"

vi.mock("firebase/analytics", () => ({
	logEvent: vi.fn(),
}))
vi.mock("@/firebase", () => ({
	firebaseAnalyics: {},
}))
vi.mock("@/store/store.js", () => ({
	default: {
		state: {
			user: {
				isAdmin: false,
				isLoggedIn: false,
			},
		},
	},
}))

import router from "@/router/index.js"
import store from "@/store/store.js"

const runGuard = async (path) =>
{
	try
	{
		await router.push(path)
	}
	catch
	{
		// Redirects surface as navigation aborts — currentRoute still tells us where we landed
	}
	return router.currentRoute.value.path
}

describe("admin route guard", () =>
{
	it("redirects anonymous users away from /a (the dashboard itself)", async () =>
	{
		store.state.user.isLoggedIn = false
		store.state.user.isAdmin = false
		const landed = await runGuard("/a")
		expect(landed).not.toBe("/a")
	})

	it("redirects non-admin users away from /a/users", async () =>
	{
		store.state.user.isLoggedIn = true
		store.state.user.isAdmin = false
		const landed = await runGuard("/a/users")
		expect(landed).not.toBe("/a/users")
	})

	it("admits admins to /a", async () =>
	{
		store.state.user.isLoggedIn = true
		store.state.user.isAdmin = true
		const landed = await runGuard("/a")
		expect(landed).toBe("/a")
	})
})
