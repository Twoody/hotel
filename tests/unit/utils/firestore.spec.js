import { describe, it, expect, vi } from "vitest"

vi.mock("@/firebase", () => ({
	db: {},
	firebaseAuth: {},
}))
vi.mock("firebase/firestore", () => ({
	doc: vi.fn(),
	deleteDoc: vi.fn(),
	getDoc: vi.fn(),
	setDoc: vi.fn(),
	serverTimestamp: vi.fn(() => "ts"),
}))
vi.mock("firebase/auth", () => ({
	GoogleAuthProvider: vi.fn(),
	reauthenticateWithCredential: vi.fn(),
	signInWithPopup: vi.fn(),
}))

import { getDoc } from "firebase/firestore"
import { addUserToFirestore, getUsersAccount } from "@/utils/firestore.js"

describe("firestore user helpers return plain objects", () =>
{
	it("addUserToFirestore returns {..data, id, invalid:false} for an existing user", async () =>
	{
		getDoc.mockResolvedValue({
			data: () => ({
				roles: [],
			}),
			exists: () => true,
			id: "u1",
		})
		const result = await addUserToFirestore({
			uid: "u1",
		})
		expect(result.invalid).toBe(false)
		expect(result.id).toBe("u1")
		expect(typeof result.data).toBe("undefined") // NOT a snapshot
	})

	it("getUsersAccount flags missing users invalid", async () =>
	{
		getDoc.mockResolvedValue({
			exists: () => false,
		})
		const result = await getUsersAccount({
			uid: "nope",
		})
		expect(result.invalid).toBe(true)
	})
})
