import { describe, it, expect, vi, beforeEach } from "vitest"
import { createStore } from "vuex"
import userModule from "@/store/user.js"

vi.mock("@/utils/firestore.js", () => ({
	getUsersAccount: vi.fn(),
}))
import { getUsersAccount } from "@/utils/firestore.js"

const buildStore = () => createStore({
	modules: {
		user: userModule,
	},
})

describe("user store", () =>
{
	beforeEach(() => vi.clearAllMocks())

	it("fetchUser marks admins from the roles array", async () =>
	{
		const store = buildStore()
		await store.dispatch("fetchUser", {
			invalid: false,
			roles: [
				"admin",
			],
			uid: "u1",
		})
		expect(store.state.user.isAdmin).toBe(true)
		expect(store.state.user.isLoggedIn).toBe(true)
	})

	it("updateUserStore consumes the plain-object shape returned by getUsersAccount", async () =>
	{
		// The helper returns a PLAIN OBJECT (post-2.7.0 contract) — no .data() method
		getUsersAccount.mockResolvedValue({
			id: "u1",
			invalid: false,
			roles: [],
		})
		const store = buildStore()
		store.state.user.user = {
			uid: "u1",
		}
		await store.dispatch("updateUserStore")
		// Regression guard: a .data() call would throw and force-log-out
		expect(store.state.user.isLoggedIn).toBe(true)
	})
})
