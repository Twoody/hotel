# Package Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the broken production build, login/session regressions, inverted dependency sections, dishonest test setup, and dead migration tooling identified by the 2026-07-10 review (see `docs/superpowers/specs/2026-07-10-package-improvements-design.md`).

**Architecture:** Vue 3 SPA (Vite build, Vuex, vue-router) + Firebase (client SDK in-app; admin SDK for Node-run Firestore migrations under `src/migrations/` driven by shell scripts in `scripts/`). No new abstractions — every task is a fix, move, or deletion.

**Tech Stack:** Vue 3, Vite 6, Vitest 3 (jsdom), firebase 11, firebase-admin 13, ESLint flat config.

## Global Constraints

- Code style (enforced by ESLint): **tab indentation**, **Allman braces**, **double quotes**, **no semicolons**, trailing commas in arrays/objects.
- After EVERY task: `npx eslint .` → 0 errors, `npm test` → all pass. Tasks that touch build behavior also run `npm run build`.
- Never run `npm run migrate:run`, `npm run migrate:rollback`, or any script that writes to Firestore. Migration fixes are verified with syntax checks (`node --check`) and import smoke tests only.
- Do not deploy anything (`firebase deploy` is forbidden). Do not push to the remote.
- Commit after each task with the message given in the task.
- Repo root: `/Users/tanner/workspace/personal/hotel`. All paths below are relative to it.

---

### Task 1: Un-break the production bundle (serverUtils leak)

The built app cannot load: `src/utils/firestore.js` (client code) imports Node-only `serverUtils.js`, which `vite.config.js` marks rollup-`external`, so `dist/assets/main-*.js` starts with a literal `import"../src/utils/serverUtils.js"` that 404s in production. The only callers of the offending functions are migrations.

**Files:**
- Create: `src/migrations/utilities/properties.js`
- Modify: `src/utils/firestore.js` (delete lines 10, 245-350: the `logMessage` import, `getPropertyPayload`, `addOrUpdateProperty`)
- Modify: `src/migrations/queued/migration_2025-04-04T05:49:30Z.js:6`
- Modify: `vite.config.js` (delete `external` + `output` from `rollupOptions`)

**Interfaces:**
- Produces: `src/migrations/utilities/properties.js` exporting `getPropertyPayload()` and `addOrUpdateProperty(propertyId, payload)` with signatures identical to the current `src/utils/firestore.js:248-350`.

- [ ] **Step 1: Confirm the breakage (baseline evidence)**

Run: `npm run build && head -c 200 dist/assets/main-*.js`
Expected: output contains `import"../src/utils/serverUtils.js"`.

- [ ] **Step 2: Create `src/migrations/utilities/properties.js`**

Move the two functions verbatim from `src/utils/firestore.js` (lines 245-350). File content — the function bodies are copied exactly, only the imports are new:

```js
import { doc, collection, setDoc, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../../firebase.js"
import { logMessage } from "../../utils/serverUtils.js"
```

then paste `getPropertyPayload` (firestore.js lines 245-284) and `addOrUpdateProperty` (lines 286-350) unchanged, keeping their `export` keywords and JSDoc.

- [ ] **Step 3: Strip the moved code from `src/utils/firestore.js`**

Delete: line 10 (`import { logMessage } from "./serverUtils.js"`), the `getPropertyPayload` block (lines 245-284), and the `addOrUpdateProperty` block (lines 286-350). Then remove now-unused names from the firestore import at the top: delete `collection,` and `addDoc` (keep `doc`, `deleteDoc`, `getDoc`, `setDoc`, `serverTimestamp`).

- [ ] **Step 4: Point the migration at the new module**

`src/migrations/queued/migration_2025-04-04T05:49:30Z.js` line 6:

```js
import { getPropertyPayload, addOrUpdateProperty } from "../utilities/properties.js"
```

- [ ] **Step 5: Delete the vite workaround**

In `vite.config.js`, inside `build.rollupOptions`, delete the entire `external: [...]` array and the entire `output: {...}` block (the `output.exclude` key is not a real Rollup option, and its commented `//manualChunks` line is the `spaced-comment` ESLint error). Result:

```js
	build: {
		target: "modules",
		outDir: "dist",
		assetsDir: "assets",
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
			},
		},
	},
```

- [ ] **Step 6: Verify**

Run: `npm run build && grep -rl serverUtils dist/assets/ | wc -l`
Expected: build succeeds, count is `0`.
Run: `npm test` → all pass. `npx eslint .` → the vite.config.js error is gone (1 error remains in the queued migration — fixed in Task 10).

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "fix: stop bundling broken serverUtils import; move property helpers to migrations"
```

---

### Task 2: Fix Firebase config in the browser build; delete dead src/db.js

`src/firebase.js` reads `process.env.VITE_*` + `dotenv.config()` — Vite compiles `process.env` to `{}`, so the shipped app initializes Firebase with all-undefined config. Node (migrations) still needs the `process.env` path. `src/db.js` is a dead duplicate init (zero importers — verified).

**Files:**
- Modify: `src/firebase.js` (full rewrite below)
- Delete: `src/db.js`

**Interfaces:**
- Produces: unchanged exports `firebaseAnalyics`, `firebaseApp`, `firebaseAuth`, `db` from `@/firebase` (12 client importers rely on these names).

- [ ] **Step 1: Rewrite `src/firebase.js`**

The `import.meta.env.VITE_*` member expressions MUST stay fully static (no indirection) or Vite will not inline them:

```js
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics, isSupported } from "firebase/analytics"
import { TRUTHYS } from "./utils/misc.js"

// Vite inlines import.meta.env.VITE_* in browser builds; Node (migrations) reads process.env
const isNode = typeof process !== "undefined" && !!process.versions?.node
const apiKey = isNode ? process.env.VITE_FIREBASE_API_KEY : import.meta.env.VITE_FIREBASE_API_KEY
const appId = isNode ? process.env.VITE_FIREBASE_APP_ID : import.meta.env.VITE_FIREBASE_APP_ID
const authDomain = isNode ? process.env.VITE_FIREBASE_AUTH_DOMAIN : import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
const databaseURL = isNode ? process.env.VITE_DATABASE_URL : import.meta.env.VITE_DATABASE_URL
const messagingSenderId = isNode
	? process.env.VITE_FIREBASE_MESSAGING_SENDER_ID : import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
const projectId = isNode ? process.env.VITE_FIREBASE_PROJECT_ID : import.meta.env.VITE_FIREBASE_PROJECT_ID
const storageBucket = isNode
	? process.env.VITE_FIREBASE_STORAGE_BUCKET : import.meta.env.VITE_FIREBASE_STORAGE_BUCKET

const __airplanMode = import.meta?.env?.VITE_AIRPLANE_MODE || false
const isAirplaneMode = TRUTHYS.includes(__airplanMode)

const firebaseConfig = {
	apiKey,
	appId,
	authDomain,
	databaseURL,
	messagingSenderId,
	projectId,
	storageBucket,
}

let firebaseAnalyics = null
let firebaseApp = null
let firebaseAuth = null
let db = null

if (!isAirplaneMode)
{
	// Initialize Firebase app only once
	firebaseApp = initializeApp(firebaseConfig)

	// Optionally initialize and export other services
	isSupported().then((supported) =>
	{
		if (supported)
		{
			firebaseAnalyics = getAnalytics(firebaseApp)
		}
	})

	firebaseAuth = getAuth(firebaseApp)
	db = getFirestore(firebaseApp)
}

export {
	firebaseAnalyics, firebaseApp, firebaseAuth, db
}
```

Caveat for Node: `import.meta.env` is undefined under plain Node, but the ternary never evaluates the right branch when `isNode` is true, and member access on `import.meta` itself is legal in any ESM context. The `__airplanMode` line already uses `import.meta?.env?.` optional chaining, which is Node-safe.

- [ ] **Step 2: Delete `src/db.js`**

```bash
git rm src/db.js
```

- [ ] **Step 3: Verify inlining and Node compatibility**

```bash
VITE_FIREBASE_API_KEY=inline-check-value npm run build
grep -c "inline-check-value" dist/assets/*.js        # Expected: >= 1 (value inlined)
grep -c "VITE_FIREBASE_API_KEY" dist/assets/*.js || true  # Expected: 0 (no property-access residue)
node --input-type=module -e "process.env.VITE_AIRPLANE_MODE='true'; await import('./src/firebase.js'); console.log('node-import OK')"
```
Expected: `node-import OK` (airplane mode skips real init — no network/credentials needed).
Run: `npm test` → all pass (`src/firebase.js` is mocked in specs).

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "fix: Firebase config was undefined in browser builds; drop dead src/db.js"
```

---

### Task 3: Fix the `.data()` regression (session restore, Google login, settings save) and email-login roles

Commit `e8d3e4a` made `addUserToFirestore`/`getUsersAccount` return plain objects; three callers still call `.data()` on them and silently break in catch blocks. Email login additionally never loads the Firestore doc at all.

**Files:**
- Test: `tests/unit/store/user.spec.js` (create), `tests/unit/utils/firestore.spec.js` (create)
- Modify: `src/App.vue:163-167`, `src/components/buttons/login/SocialLogin.vue:188-193`, `src/store/user.js:96-128`, `src/views/Login.vue:295-302`

**Interfaces:**
- Consumes: `addUserToFirestore(user)` / `getUsersAccount(user)` → `Promise<{...userDocFields, id, invalid: boolean}>` (plain object, no `.data()`).

- [ ] **Step 1: Write failing tests for the store contract**

Create `tests/unit/store/user.spec.js`:

```js
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
```

- [ ] **Step 2: Run tests, confirm the regression reproduces**

Run: `npx vitest run tests/unit/store/user.spec.js`
Expected: first test PASSES, second FAILS (`isLoggedIn` is `false` because `userDoc.data()` throws → catch commits `setIsLoggedIn(false)`).

- [ ] **Step 3: Fix `src/store/user.js` `updateUserStore` (lines 104-106)**

```js
				// 1) Fetch the Firestore document for this user
				const userDoc = await getUsersAccount(currentUser)
				const updatedUser = {
					...userDoc,
					uid: currentUser.uid,
				}
```

Also, in `initialState()` (line 6), add `isAdmin: false,` as a top-level key (after `isAuthReady`) — `setIsAdmin` writes `state.isAdmin`, which `initialState` never declares.

- [ ] **Step 4: Fix `src/App.vue` (lines 163-167)**

```js
								// Attempts to add user to firestore if necessary
								const firestoreUser = await addUserToFirestore(user)
								this.$store.dispatch("fetchUser", {
									...firestoreUser,
									uid: user.uid,
								})
```

Do NOT add an early return on `invalid` — execution must still reach `setIsLoggingIn(false)` / `setIsAuthReady(true)` below (`fetchUser` already handles the `invalid` flag).

- [ ] **Step 5: Fix `src/components/buttons/login/SocialLogin.vue` (lines 188-193)**

```js
						// Add user to Firestore if necessary
						const firestoreUser = await addUserToFirestore(user)
						const userData = {
							...firestoreUser,
							uid: firebaseAuth.currentUser.uid,
						}
						// Tell Vuex to fetch/store the user
						this.$store.dispatch("fetchUser", userData)
```

- [ ] **Step 6: Fix `src/views/Login.vue` `login()` (lines 295-302)**

Email login must load the Firestore doc (roles!) instead of dispatching the raw Auth user. Replace:

```js
				this.success = true

				// Update store
				this.$store.dispatch("fetchUser", response.user)
```

with:

```js
				this.success = true

				// Load the Firestore user doc (roles, profile) — the App.vue
				// onAuthStateChanged path is skipped while the isLoggingIn mutex is set
				const firestoreUser = await addUserToFirestore(response.user)
				this.$store.dispatch("fetchUser", {
					...firestoreUser,
					uid: response.user.uid,
				})
```

and add `import { addUserToFirestore } from "@/utils"` next to the existing imports in Login.vue's script block.

- [ ] **Step 7: Write the helper-shape contract test**

Create `tests/unit/utils/firestore.spec.js`:

```js
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
	GoogleAuthProvider: class {},
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
```

- [ ] **Step 8: Verify**

Run: `npm test` → all pass (both new files green, no existing spec broken).
Run: `npx eslint .` → no new errors.

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "fix: session restore, Google login, settings save, and email-login roles broken by plain-object refactor"
```

---

### Task 4: Admin route guard misses `/a`

**Files:**
- Test: `tests/unit/router/guard.spec.js` (create)
- Modify: `src/router/index.js:18-20,138`

- [ ] **Step 1: Write failing guard test**

Create `tests/unit/router/guard.spec.js`. The guard closure over the real store makes direct import awkward — test the predicate logic through the router instance:

```js
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

const runGuard = (path) => new Promise((resolvePromise) =>
{
	const guard = router.options?.beforeEach ?? null
	// vue-router 4 exposes registered guards via internal API only; navigate instead
	router.push(path).catch(() => {})
	// After navigation settles, currentRoute reflects where the guard sent us
	setTimeout(() => resolvePromise(router.currentRoute.value.path), 50)
})

describe("admin route guard", () =>
{
	it("redirects anonymous users away from /a (the dashboard itself)", async () =>
	{
		store.state.user.isLoggedIn = false
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
```

Note: if `router.push` in jsdom needs history setup, use `await router.push(path)` inside try/catch and drop the setTimeout — adjust until the FIRST test fails for the right reason (`landed === "/a"` for an anonymous user, proving the bypass).

- [ ] **Step 2: Run test, confirm the bypass reproduces**

Run: `npx vitest run tests/unit/router/guard.spec.js`
Expected: test 1 FAILS (anonymous user lands on `/a`), tests 2-3 pass.

- [ ] **Step 3: Fix the guard**

`src/router/index.js`: delete lines 18-20 (the comment, the `eslint-disable-next-line`, and the dead `isAdminPath` const). Change line 138 from:

```js
	if (to.path.startsWith("/a/"))
```

to:

```js
	if (to.path === "/a" || to.path.startsWith("/a/"))
```

- [ ] **Step 4: Verify**

Run: `npx vitest run tests/unit/router/guard.spec.js` → 3/3 pass.
Run: `npm test` → all pass. `npx eslint .` → no new errors.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "fix: admin guard skipped the /a dashboard route"
```

---

### Task 5: Small user-facing bug fixes (guide cards, thermometer NaN, delete confirmation)

**Files:**
- Modify: `src/views/Guides.vue:117`, `tests/unit/generated/Guides.spec.js:112`
- Modify: `src/views/ThermometerPage.vue:44`
- Modify: `src/components/entities/BookingsTable.vue:176-192`, `tests/unit/generated/BookingsTable.spec.js`

- [ ] **Step 1: Update Guides spec expectation first (TDD via existing spec)**

`tests/unit/generated/Guides.spec.js` line 112: change the `toHaveBeenCalledWith` expectation from `name: "GuideItem"` to `name: "guideItem"` (match the registered route name in `src/router/index.js:85`).
Run: `npx vitest run tests/unit/generated/Guides.spec.js` → FAILS (code still pushes `"GuideItem"`).

- [ ] **Step 2: Fix `src/views/Guides.vue` line 117**

```js
			this.$router.push({
				name: "guideItem",
				params: {
					id,
				},
			})
```

Run: `npx vitest run tests/unit/generated/Guides.spec.js` → PASSES.

- [ ] **Step 3: Fix thermometer NaN — `src/views/ThermometerPage.vue` line 44**

`debtPaid` reads `this.debt.currentBalance`, which does not exist (`currentBalance` is a sibling computed):

```js
		debtPaid ()
		{
			return this.debt.originalOwed - this.currentBalance
		},
```

(This file is in ESLint's `ignores` and coverage excludes — no test to update; verify by eye that `currentBalance` is the computed above.)

- [ ] **Step 4: Add delete confirmation — `src/components/entities/BookingsTable.vue` `deleteBooking` (line ~178)**

First line of the method body:

```js
		async deleteBooking (bookingId)
		{
			// ponytail: window.confirm over a modal — swap for DialogModal if UX ever demands it
			if (!window.confirm("Delete this booking? This cannot be undone."))
			{
				return
			}
```

- [ ] **Step 5: Update BookingsTable spec**

In `tests/unit/generated/BookingsTable.spec.js`, find the test that invokes `deleteBooking` (asserts `deleteDoc` called). At its top add:

```js
		vi.spyOn(window, "confirm").mockReturnValue(true)
```

Then add a sibling negative test right after it:

```js
	it("does not delete the booking when the confirm dialog is dismissed", async () =>
	{
		vi.spyOn(window, "confirm").mockReturnValue(false)
		const wrapper = createWrapper()
		await wrapper.vm.deleteBooking("booking-1")
		expect(deleteDoc).not.toHaveBeenCalled()
	})
```

(Match the surrounding spec's actual helper names — if the file builds wrappers differently, mirror the deletion test's arrangement, flipping only the confirm value and the assertion.)

- [ ] **Step 6: Verify + commit**

Run: `npm test` → all pass. `npx eslint .` → no new errors.

```bash
git add -A && git commit -m "fix: guide-card navigation, thermometer NaN, and unconfirmed booking deletion"
```

---### Task 6: Honest test setup and coverage

**Files:**
- Modify: `tests/setup/vitest.setup.js` (full rewrite), `vitest.config.js:38-79`
- Modify: `tests/unit/generated/FinalizeBooking.spec.js`, `tests/unit/generated/PrivacyAndSecuritySettings.spec.js:7`
- Delete: `src/store/__mocks__/` (3 files)
- Modify: `package.json` (delete `"imports"` field, lines 18-20)

- [ ] **Step 1: Rewrite `tests/setup/vitest.setup.js`**

Remove the console stubs (they swallow every render warning suite-wide) and the top-level `it()` (it injects a dummy test into all 34 spec files):

```js
import { vi } from "vitest"

// Mock global browser dialogs
global.alert = vi.fn()
global.confirm = vi.fn()
global.prompt = vi.fn()
```

- [ ] **Step 2: Fix the include glob and coverage config in `vitest.config.js`**

Line 38-40, remove `setup` from the pattern so setup files are never collected as tests:

```js
		include: [
			"tests/**/*.{test,spec}.{js,jsx,ts,tsx}",
		],
```

In `coverage`, add an `include` and prune the exclude list — delete these entries: `""` (line 56 — this stray empty string currently disables all-files reporting), `"hotel/dist/**"`, `"src/db.js"`, `"src/views/Foobar.vue"`, `"src/components/buttons/login/FacebookLogin.vue"`, `"src/router/**"`, `"src/store/**"`, `"src/utils/firestore.js"`, `"src/functions/**"`, `"**/__mocks__/**"`. Result:

```js
		coverage: {
			include: [
				"src/**",
			],
			reporter: [
				"text",
				"html",
			],
			exclude:
			[
				"src/firebase.js",
				"src/firebaseAdmin.js",
				"src/App.vue",
				"src/main.js",
				"src/components/entities/Thermometer.vue",
				"src/constants/**",
				"src/migrations/**",
				"src/views/ThermometerPage.vue",
			],
		},
```

- [ ] **Step 3: Delete dead Vue-2 mocks and the invalid package.json `imports` field**

```bash
git rm -r src/store/__mocks__/
```

In `package.json`, delete the invalid subpath-imports block (entries must start with `#`; this one can never resolve):

```json
  "imports": {
    "@/src/*": "./src/*"
  },
```

In `tests/unit/generated/PrivacyAndSecuritySettings.spec.js`, delete the `vi.mock("@/src/store/user.js", ...)` block near line 7 — it resolves to a nonexistent path and mocks nothing (the spec's own vuex store supplies the logout action).

- [ ] **Step 4: Fix the FinalizeBooking spec**

In `tests/unit/generated/FinalizeBooking.spec.js`:
1. The test named `"successfully submits booking details when Pay Now is clicked"` actually asserts `toBe(false)` (its hardcoded 2025 dates are now past). Rename it to `"rejects submission when booking dates are in the past"` and make the past-ness explicit rather than clock-dependent: pass the dates through the booking prop using luxon (already a dependency, and `getBookingStatus` derives from `booking.startDate`):

```js
		const wrapper = createWrapper({
			props: {
				booking: {
					endDate: DateTime.now().minus({
						days: 9,
					}).toISODate(),
					guestID: "g1",
					id: "b1",
					startDate: DateTime.now().minus({
						days: 10,
					}).toISODate(),
				},
			},
		})
```

(add `import { DateTime } from "luxon"` if not present; merge with however the spec's `createWrapper` passes props — flip only the dates). Delete the duplicated assertion at lines 134-135 (two identical `expect`s back to back — keep one).
2. Prune the obsolete snapshot: `npx vitest run tests/unit/generated/FinalizeBooking.spec.js -u` and confirm the diff only REMOVES the stale `renders properly` snapshot entry.

- [ ] **Step 5: Verify**

Run: `npm test`
Expected: total test count DROPS by ~34 (the injected dummy test per file is gone) plus any FinalizeBooking delta; everything green. If a spec now fails because it depended on the global `console.error` stub, add `vi.spyOn(console, "error").mockImplementation(() => {})` inside that specific spec's `beforeEach` — do not restore the global stub.
Run: `npm run test:coverage` → report now lists `src/utils/firestore.js`, `src/store/*.js`, `src/router/index.js`, and `src/views/admin/*.vue` (honest, lower headline number is expected).
Run: `npx eslint .` → no new errors.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "test: stop silencing console, stop counting setup as tests, make coverage honest"
```

---

### Task 7: Right-side-up dependency sections

**Files:**
- Modify: `package.json` dependencies/devDependencies
- Delete: `babel.config.js`

- [ ] **Step 1: Edit `package.json`**

- `dependencies`: ADD `"firebase": "^11.1.0"`. REMOVE `firebase-admin`, `dotenv`, `less`, `less-loader`.
- `devDependencies`: ADD `"firebase-admin": "^13.1.0"`, `"dotenv": "^16.4.7"`, `"globals": "^15.0.0"`, `"@eslint/js": "^8.57.0"` (phantom deps imported by eslint.config.js — pin to whatever `npm ls globals @eslint/js` currently resolves). REMOVE `"firebase"` (moving to dependencies), `"less-loader"` (webpack loader, unused by Vite — verify first: `grep -r less-loader vite.config.js vitest.config.js src/ scripts/ index.html` → no hits), `"@vitest/ui"` (unused: `grep -r "vitest/ui\|--ui" package.json scripts/` → no hits outside the lockfile). KEEP `"less"` here (Vite's LESS preprocessor needs it at build time).

- [ ] **Step 2: Sync the lockfile and verify the resolved versions**

```bash
npm ls globals @eslint/js   # note the currently-resolved versions, use them in package.json
npm install
```
Expected: lockfile updates without errors. Then:

```bash
npm ci --dry-run 2>&1 | tail -1   # confirms lockfile is in sync
npx eslint . && npm test && npm run build
```
Expected: all green — proving `globals`/`@eslint/js` resolve and less still compiles.

- [ ] **Step 3: Delete vestigial Babel config**

`babel.config.js` references `@vue/cli-plugin-babel/preset`, which is not installed (Vue CLI era; Vite uses esbuild):

```bash
git rm babel.config.js
```

Also remove the `"babel.config.js"` entry from the `coverage.exclude` array in `vitest.config.js`.

- [ ] **Step 4: Verify + commit**

Run: `npm test && npm run build` → green.

```bash
git add -A && git commit -m "chore: correct dependency sections; drop less-loader, @vitest/ui, babel config"
```

---

### Task 8: Delete dead files

**Files:**
- Delete: `src/views/Foobar.vue`, `src/components/buttons/login/FacebookLogin.vue`, `public/index.html`, `prompts/` (38 tracked files)
- Modify: `eslint.config.js:239`, `.gitignore:39`

- [ ] **Step 1: Verify then delete**

Each deletion was verified by the review (zero importers / commented-out references only), but re-verify cheaply before each `git rm`:

```bash
grep -rn "Foobar" src/ tests/ index.html --include="*.vue" --include="*.js" | grep -v "views/Foobar.vue"
# Expected: no live imports (eslint.config.js mention handled below)
git rm src/views/Foobar.vue

grep -rn "FacebookLogin" src/ tests/ | grep -v "^.*FacebookLogin.vue" | grep -v "<!--"
# Expected: only commented-out references
git rm src/components/buttons/login/FacebookLogin.vue

git rm public/index.html      # stock "Firebase Hosting Setup Complete" page; real entry is root index.html

git rm -r prompts/            # 38 one-shot LLM prompt dumps (~260KB), no tooling references
```

- [ ] **Step 2: Clean up references**

- `eslint.config.js` line 239: remove `"Foobar",` from the `vue/multi-word-component-names` ignores array.
- `.gitignore` line 39: replace `prompts/random.txt` with `prompts/`.
- If any spec file for Foobar/FacebookLogin exists (`ls tests/unit/generated/ | grep -iE "foobar|facebook"`), `git rm` it too.

- [ ] **Step 3: Verify + commit**

Run: `npx eslint . && npm test && npm run build` → green.

```bash
git add -A && git commit -m "chore: delete dead views, dead login component, stock Firebase page, prompt dumps"
```

---

### Task 9: Trim alias maps to what's actually used

Actual usage across src/ + tests/: `@` (101), `constants` (4), `store` (2), `components` (2). Everything else is dead or points at nonexistent dirs (verified).

**Files:**
- Modify: `vite.config.js:13-24`, `vitest.config.js:9-22`

- [ ] **Step 1: `vite.config.js` — replace the `alias` object and delete dead resolve config**

```js
		alias: {
			"@": resolve(__dirname, "src"),
			components: resolve(__dirname, "src/components"),
			constants: resolve(__dirname, "src/constants"),
			store: resolve(__dirname, "src/store"),
		},
```

Also delete the entire `poolOptions: { threads: {...} }` block sitting inside `resolve` (lines 28-33) — it is a Vitest option that Vite ignores entirely; the `--pool=threads` flag in the npm test scripts is what actually configures threading (the v2.7.0 change landed in the wrong file).

- [ ] **Step 2: `vitest.config.js` — replace the `alias` object identically**

```js
		alias: {
			"@": resolve(__dirname, "src"),
			components: resolve(__dirname, "src/components"),
			constants: resolve(__dirname, "src/constants"),
			store: resolve(__dirname, "src/store"),
		},
```

(This drops the broken `find: /^~/` entry, the `mocks` alias to a nonexistent `tests/__mocks__/`, and `img`/`svgs`/`styles`/`services`/`src` — all unused; `styles` is imported relatively in .vue files.)

- [ ] **Step 3: Verify + commit**

Run: `npm test && npm run build` → green (any hidden alias consumer would fail loudly here).

```bash
git add -A && git commit -m "chore: trim vite/vitest alias maps to the four aliases in use"
```

---

### Task 10: Docs and env truthfulness (README, .env.example, firebase.json)

**Files:**
- Modify: `README.md`, `.env.example`, `firebase.json`

- [ ] **Step 1: README fixes**

- `### Compiles and hot-reloads for development` code block: `npm run serve` → `npm run dev`.
- `### Lints and fixes files`: `-- See `./.eslintrc.js`` → `- See ./eslint.config.js` (also fixes the broken `--` bullet and unclosed backtick).
- `### Customize configuration`: replace the Vue CLI link line with `See the [Vite Configuration Reference](https://vite.dev/config/).`
- In the Firestore Migrations section, update the rollback usage to the new two-argument form (Task 11): `npm run migrate:rollback <migration_file.js> <migration_id>`.
- Scan the rest for references to removed files (`babel.config.js`, `prompts/`, `src/db.js`): `grep -nE "babel|prompts/|db\.js|serve" README.md` and fix any hits.

- [ ] **Step 2: Rewrite `.env.example`**

Every var the code reads, with the line-4 missing `=` fixed:

```
NODE_ENV='development'

VITE_FIREBASE_API_KEY='YOUR_API_KEY'
VITE_FIREBASE_APP_ID='YOUR_APP_ID'
VITE_FIREBASE_AUTH_DOMAIN='YOUR_AUTH_DOMAIN'
VITE_DATABASE_URL='YOUR_DATABASE_URL'
VITE_FIREBASE_DATABASE_URL='YOUR_DATABASE_URL'
VITE_FIREBASE_PROJECT_ID='YOUR_PROJECT_ID'
VITE_FIREBASE_STORAGE_BUCKET='YOUR_STORAGE_BUCKET'
VITE_FIREBASE_MESSAGING_SENDER_ID='YOUR_MESSAGING_SENDER_ID'
VITE_CI=
VITE_AIRPLANE_MODE=

# Server-side only (migrations/scripts): path to a Firebase service-account JSON
GOOGLE_APPLICATION_CREDENTIALS='./.keys/your-service-account.json'

STRIPE_SECRET_KEY=
```

(`VITE_DATABASE_URL` is read by `src/firebase.js`; `VITE_FIREBASE_DATABASE_URL` by `src/firebaseAdmin.js` — both belong here until someone unifies the names.)

- [ ] **Step 3: firebase.json**

- Delete the entire `"functions": [...]` block (lines 43-58) — there is no `functions/` directory; `firebase deploy` would fail on it.
- In the CSP header value, change `script-src 'self' 'unsafe-inline' https://apis.google.com ...` to `script-src 'self' https://apis.google.com ...` (drop ONLY the `'unsafe-inline'` token from `script-src`; the Vite build emits no inline scripts — verified against `dist/index.html`). Leave `style-src` and all COOP/COEP headers untouched (deliberate: popup login).

- [ ] **Step 4: Verify + commit**

Run: `node -e "JSON.parse(require('fs').readFileSync('firebase.json','utf8')); console.log('firebase.json OK')"`

```bash
git add -A && git commit -m "docs: truthful README/.env.example; drop phantom functions config; tighten script-src CSP"
```

---

### Task 11: Resurrect the migration tooling

Every Node entry point currently crashes on line 1 (`require` in an ESM package — reproduced). The rollback script re-runs migrations FORWARD and can never find prod-executed files. Nothing here touches Firestore during verification — syntax checks only.

**Files:**
- Modify: `src/firebaseAdmin.js`, `scripts/firestore-get-schema.js:1-2`, `src/migrations/template.js`, `src/migrations/template.batch.js`, `src/migrations/utilities/renameCollection.js:1`, `src/migrations/utilities/debugRollbacks.js:1`, `src/migrations/queued/migration_2025-04-04T05:49:30Z.js`, `scripts/migration-run.sh`, `scripts/migration-rollback.sh`, `package.json` (drop `dotenv-cli`)

- [ ] **Step 1: `src/firebaseAdmin.js` — env-var key path with fallback**

Replace the whole file:

```js
// src/firebaseAdmin.js
import "dotenv/config"
import admin from "firebase-admin"
import { readFileSync } from "fs"
import { resolve } from "path"

// Service-account key path — override in .env; falls back to the maintainer's local key
const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ||
	"./.keys/votel-f1c47-c69aa9c4722a.json"

if (!admin.apps?.length)
{
	const databaseURL = process.env.VITE_FIREBASE_DATABASE_URL
	if (!databaseURL)
	{
		console.error("ERROR: VITE_FIREBASE_DATABASE_URL is not defined in environment variables.")
		process.exit(1)
	}

	let serviceAccount
	try
	{
		serviceAccount = JSON.parse(readFileSync(resolve(keyPath), "utf8"))
	}
	catch (error)
	{
		console.error(`ERROR: Cannot read service-account key at "${keyPath}".`)
		console.error("Set GOOGLE_APPLICATION_CREDENTIALS in .env to your key's path.", error.message)
		process.exit(1)
	}

	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		databaseURL,
	})
}

const dbAdmin = admin.firestore()

export {
	admin,
	dbAdmin
}
```

- [ ] **Step 2: `scripts/firestore-get-schema.js` — ESM import**

Replace lines 1-2 with:

```js
import { dbAdmin as db } from "../src/firebaseAdmin.js"
```

- [ ] **Step 3: `src/migrations/template.js` — ESM + fix undefined function calls**

- Replace lines 1-4 with:

```js
import * as fs from "fs"
import * as path from "path"
import { fileURLToPath } from "url"
import "dotenv/config"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
```

- Replace the conditional require (lines 30-34) with a dynamic import (top-level await is legal in ESM):

```js
let db
if (CAN_RUN)
{
	const { dbAdmin, } = await import("../firebaseAdmin.js")
	db = dbAdmin
}
```

- In `migrateFoo()`, declare the counter the log lines reference (currently a ReferenceError): add `let migratedDocs = 0` right after `let failed = false`.
- In `rollbackMigration()`, add `let rolledBackDocs = 0` as the first line of the function body after the `CAN_RUN` guard.
- Lines 147 and 152: `migrateUsers()` → `migrateFoo()` (the function the file actually defines).

- [ ] **Step 4: `src/migrations/template.batch.js` — same ESM conversion + fix failure accounting**

- Apply the identical require→import conversion as Step 3 (lines 1-4 header, `__dirname` shim, dynamic import of `../firebaseAdmin.js`).
- Fix the non-iterable WriteBatch spread: add `let currentBatchIds = []` next to `let failedDocs = []` (line ~87); add `currentBatchIds.push(doc.id)` right after `batchCount++` (line ~107); in BOTH catch blocks replace `failedDocs.push(...batch)` with `failedDocs.push(...currentBatchIds)`; after every `batch = db.batch()` reset AND after each successful mid-loop commit, add `currentBatchIds = []`.
- Same `migrateUsers`→actual-function-name check at the bottom of the file (mirror whatever the file's migrate function is named).

- [ ] **Step 5: Fix the two utilities' import paths**

`src/migrations/utilities/renameCollection.js` line 1:

```js
import { dbAdmin } from "../../firebaseAdmin.js"
```

`src/migrations/utilities/debugRollbacks.js` line 1:

```js
import { dbAdmin } from "../../firebaseAdmin.js"
```

- [ ] **Step 6: Queued migration — rollback guard, idempotent IDs, lint error**

In `src/migrations/queued/migration_2025-04-04T05:49:30Z.js`:
- After the imports, add:

```js
// Rollback is not implemented — exit non-zero so the rollback script reports failure
if (process.argv.includes("--rollback"))
{
	console.error("Rollback not implemented for this migration.")
	process.exit(1)
}
```

- Line 65: `addOrUpdateProperty(null, propertyDataForUpload)` → `addOrUpdateProperty("sample_property_2025-04-04", propertyDataForUpload)` (the update path is a `setDoc(..., { merge: true })` upsert — re-runs stop duplicating docs; note: first-run docs get no `createdAt`, acceptable for seed data).
- Line 86: `dbAdmin.collection("reviews").doc()` → `dbAdmin.collection("reviews").doc("sample_review_2025-04-04")`.
- Line 134 has the suite's remaining ESLint error (`no-mixed-spaces-and-tabs`): re-indent the `// Add this to close the client app` comment line with tabs only.

- [ ] **Step 7: `scripts/migration-run.sh` — create logs dir**

After line 8 (`ENV_FILE=".env"`), add:

```bash
  mkdir -p logs
```

- [ ] **Step 8: Rewrite `scripts/migration-rollback.sh`**

Deterministic file selection (executed/ first — the whole point of rollback — then queued/), env loading matching migration-run.sh, no dotenv-cli:

```bash
#!/bin/bash

rollback_migration() {
  MIGRATIONS_DIR="src/migrations"
  QUEUED_DIR="$MIGRATIONS_DIR/queued"
  EXECUTED_DIR="$MIGRATIONS_DIR/executed"
  LOG_FILE="logs/migrations.log"
  ENV_FILE=".env"

  mkdir -p logs

  # Check for .env file
  if [ ! -f "$ENV_FILE" ]; then
    TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%S")
    echo "Error: .env file not found."
    echo "- **NODE_ENV**: N/A" >> $LOG_FILE
    echo "- **UTC Time**: $TIMESTAMP" >> $LOG_FILE
    echo "- **Status**: Failed (.env file not found)" >> $LOG_FILE
    echo "" >> $LOG_FILE
    exit 1
  fi

  # Load environment variables from .env, exporting them (same as migration-run.sh)
  set -a
  source "$ENV_FILE"
  set +a

  # Validate input
  if [ -z "$1" ] || [ -z "$2" ]; then
    echo "❌ Error: Usage: ./scripts/migration-rollback.sh <migration_file.js> <migration_id>"
    exit 1
  fi

  MIGRATION_NAME=$(basename "$1")
  MIGRATION_ID=$2

  # Look in executed/ first (rollbacks target migrations that ran), then queued/
  MIGRATION_FILE=""
  for dir in "$EXECUTED_DIR" "$QUEUED_DIR"; do
    if [ -f "$dir/$MIGRATION_NAME" ]; then
      MIGRATION_FILE="$dir/$MIGRATION_NAME"
      break
    fi
  done

  if [ -z "$MIGRATION_FILE" ]; then
    echo "❌ Error: '$MIGRATION_NAME' not found in $EXECUTED_DIR or $QUEUED_DIR."
    echo "**WARNING:** Rollback failed: '$MIGRATION_NAME' not found." >> $LOG_FILE
    echo "" >> $LOG_FILE
    exit 2
  fi

  node "$MIGRATION_FILE" --rollback "$MIGRATION_ID"
  STATUS=$?

  TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%S")

  if [ $STATUS -eq 0 ]; then
    echo "- **NODE_ENV**: $NODE_ENV" >> $LOG_FILE
    echo "- **UTC Time**: $TIMESTAMP" >> $LOG_FILE
    echo "- **Status**: Rollback Success" >> $LOG_FILE
    echo "" >> $LOG_FILE
    echo "Rollback completed successfully."
  else
    echo "- **NODE_ENV**: $NODE_ENV" >> $LOG_FILE
    echo "- **UTC Time**: $TIMESTAMP" >> $LOG_FILE
    echo "- **Status**: Rollback Failed with code $STATUS" >> $LOG_FILE
    echo "" >> $LOG_FILE
    echo "Rollback failed with status code $STATUS."
    exit $STATUS
  fi
}

# Call the main function
# @example `npm run migrate:rollback migration_2025-04-04T05:49:30Z.js migration_v2_1700000000000`
rollback_migration "$@"
```

- [ ] **Step 9: Drop dotenv-cli**

```bash
grep -rn "npx dotenv\|dotenv-cli" scripts/ package.json | grep -v package-lock
```
Expected: no hits outside devDependencies. Then remove `"dotenv-cli"` from devDependencies and run `npm install`.

- [ ] **Step 10: Verify (no Firestore writes!)**

```bash
node --check scripts/firestore-get-schema.js
node --check src/migrations/template.js
node --check src/migrations/template.batch.js
node --check src/migrations/utilities/renameCollection.js
node --check src/migrations/utilities/debugRollbacks.js
node --check src/migrations/queued/migration_2025-04-04T05:49:30Z.js
node --check src/firebaseAdmin.js
bash -n scripts/migration-run.sh && bash -n scripts/migration-rollback.sh
```
Expected: all silent (syntax OK). Then confirm the missing-key error path is clean:

```bash
VITE_FIREBASE_DATABASE_URL=https://example.firebaseio.com \
GOOGLE_APPLICATION_CREDENTIALS=/nonexistent.json \
node --input-type=module -e "await import('./src/firebaseAdmin.js')" ; echo "exit=$?"
```
Expected: the clear `Cannot read service-account key` error, `exit=1`.
Run: `npx eslint .` → **0 errors** (the queued-migration error is fixed). `npm test` → green.

- [ ] **Step 11: Commit**

```bash
git add -A && git commit -m "fix: migration tooling — ESM entry points, real rollback lookup, keyed seeds, portable creds"
```

---

### Task 12: Firestore rules that match the app (committed, NOT deployed)

The committed rules are the untouched 2021 deny-all default; the real rules live only in the Firebase console and CI never deploys rules. Author scoped rules closing the client-side role-escalation hole, and document the drift. **Do not run `firebase deploy`.**

**Files:**
- Modify: `firestore.rules` (full rewrite), `README.md` (new section)

- [ ] **Step 1: Write `firestore.rules`**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users read/write only their own doc; role fields cannot be self-granted.
    // (Admin SDK — migrations, console — bypasses rules entirely.)
    match /users/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow create: if request.auth != null && request.auth.uid == uid
        && (!('roles' in request.resource.data) || request.resource.data.roles.size() == 0)
        && (!('role_history' in request.resource.data) || request.resource.data.role_history.size() == 0);
      allow update: if request.auth != null && request.auth.uid == uid
        && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['roles', 'role_history']);
      allow delete: if request.auth != null && request.auth.uid == uid;
    }

    // Bookings are scoped to their guest
    match /bookings/{bookingId} {
      allow read, update, delete: if request.auth != null && resource.data.guestID == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.guestID == request.auth.uid;
    }

    // Public content (client only reads these)
    match /properties/{propertyId} {
      allow read: if true;
      allow write: if false;
    }
    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if false;
    }
    match /hotels/{hotelId} {
      allow read: if true;
      allow write: if false;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

- [ ] **Step 2: Add a README section (after the Hosting section)**

```markdown
## Firestore Security Rules

`firestore.rules` in this repo is **not** what is deployed — CI only deploys hosting, and the
production rules were edited in the Firebase console. The committed rules now describe what the
app actually needs (own-user docs, guest-scoped bookings, public read for properties/reviews/hotels)
and block clients from granting themselves `roles` (admin status is derived from that field).

Before deploying them:

1. Diff against production: Firebase console → Firestore → Rules.
2. Test with the emulator: `firebase emulators:start --only firestore` plus the rules unit-test SDK.
3. Deploy deliberately: `firebase deploy --only firestore:rules`.
```

- [ ] **Step 3: Verify + commit**

If the firebase CLI is available, `npx firebase-tools@latest --version >/dev/null 2>&1 && npx firebase-tools deploy --only firestore:rules --dry-run` is NOT to be run (requires auth and touches prod config) — instead just eyeball-match collection names against the code: `grep -rn "collection(db, \|doc(db, " src/ | grep -oE '"[a-z]+"' | sort -u` — expect `"bookings"`, `"hotels"`, `"properties"`, `"users"` all covered by the rules.

```bash
git add -A && git commit -m "security: committed Firestore rules now match the app and block self-granted roles"
```

---

### Task 13: Version bump, changelog, final sweep

**Files:**
- Modify: `package.json` (version), `changelog.md`

- [ ] **Step 1: Full verification suite**

```bash
npx eslint .                       # Expected: 0 errors, 0 warnings (or pre-existing warnings only)
npm test                           # Expected: all pass
npm run test:coverage 2>&1 | tail -20   # Expected: completes; honest report including store/router/firestore.js
npm run build                      # Expected: success
grep -rl serverUtils dist/assets/ | wc -l   # Expected: 0
```

Then a smoke check that the built artifact serves a loadable module graph:

```bash
(npx vite preview --port 4173 &) && sleep 2 && \
curl -s http://localhost:4173/ | grep -o '<script[^>]*src="[^"]*"' && \
curl -s -o /dev/null -w "%{content_type}\n" http://localhost:4173/assets/$(ls dist/assets | grep '^main-.*\.js$') && \
kill %1 2>/dev/null || pkill -f "vite preview" || true
```
Expected: the script tag, then `text/javascript` (not `text/html` — that was the white-screen failure mode).

- [ ] **Step 2: Bump version + changelog**

`package.json`: `"version": "2.7.0"` → `"2.7.1"`.
Read the top of `changelog.md` and add a `2.7.1` entry in the same format summarizing: fixed production build (serverUtils import, env inlining), fixed login/session-restore/settings-save regressions, admin guard on `/a`, guide-card navigation, honest test setup/coverage, dependency sections corrected, dead files removed, migration tooling runs again, Firestore rules authored (not deployed).

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "v2.7.1: repair production build, auth flows, test integrity, and migration tooling"
```

---

## Not doing (verified findings deliberately skipped)

ESLint 9 upgrade; bundle splitting (1MB warning); NavBar reload revert (deliberate, `7ab00af`); COOP tightening (breaks popup login, `f94a257`); admin stub views (feature work); Firestore migrations ledger (over-engineering); `todo.txt` (owner's notes); analytics gated on `VITE_CI` (inverting it starts tracking real users — owner's call).
