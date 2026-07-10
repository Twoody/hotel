# Package Improvements — Design

**Date:** 2026-07-10
**Status:** Approved (user delegated judgment: "I will step away and trust your judgement")
**Source:** 97-agent review workflow — 88 findings raised, 78 adversarially confirmed, 10 refuted. Every finding below was independently verified with reproduced evidence (build output inspection, `node` crash repros, grep of all callers).

## Context

`hotel` is a Vue 3 + Vite + Firebase SPA (~10k LOC src, 183 passing tests). Baseline health: tests green, build "succeeds", 2 ESLint errors. However, **the HEAD build produces a non-functional artifact** (the currently *deployed* bundle predates the breakage — the next deploy would ship a white screen).

## Approaches considered

- **A. Fix only the P0 breakage** — leaves 70 verified defects (broken scripts, inverted dependency sections, misleading coverage) in place.
- **B. Fix all 78 findings** — includes risky/medium refactors (ESLint 9 upgrade, bundle splitting, migration ledger) with real regression potential and low payoff.
- **C. Fix all verified trivial/small high-value items + targeted tests; skip risky or deliberate-behavior changes** ← **chosen.** Root-cause fixes, mostly deletions, each independently verifiable.

## Scope

### Phase 1 — Restore the app (P0: HEAD build is broken)

1. **Broken static import kills the whole bundle.** `src/utils/firestore.js` imports `logMessage` from `serverUtils.js` (Node-only, fs/path); `vite.config.js` marks it rollup-`external`, so `dist/assets/main-*.js` begins with `import"../src/utils/serverUtils.js"` → module MIME error → white screen (reproduced via `vite preview` + curl). The only client-reachable caller chain is `getPropertyPayload`/`addOrUpdateProperty`, used solely by the queued migration.
   **Fix:** move those two functions to `src/migrations/utilities/properties.js` (imports `db` from `../../firebase.js`, `logMessage` from `../../utils/serverUtils.js`); update the queued migration import; strip `logMessage` import and now-unused `collection`/`addDoc` from `firestore.js`; delete `external` + the invalid `output.exclude` block from `vite.config.js`. **Verify:** `grep -r serverUtils dist/assets` → no matches.

2. **Firebase config compiles to `undefined` in the browser.** `src/firebase.js` (the live module — 12 client importers) reads `process.env.VITE_*` + `dotenv.config()`; Vite compiles that to `{}` (verified in bundle: `var Ki={};…Ki.VITE_FIREBASE_API_KEY`). Regression from `e8d3e4a`.
   **Fix:** drop dotenv import/config; per-var Node-guarded ternary — `const isNode = typeof process !== "undefined" && !!process.versions?.node`, then `isNode ? process.env.X : import.meta.env.X` with **fully static** `import.meta.env.VITE_*` member expressions (required for Vite inlining; verified). Node branch keeps `npm run migrate:run` working (its shell sources `.env`). **Verify:** built bundle contains inlined values, `node -e 'import("./src/firebase.js")'` doesn't throw.

3. **`.data()` called on plain objects — login/session-restore broken at HEAD.** `e8d3e4a` made `addUserToFirestore`/`getUsersAccount` return plain objects; three callers still call `.data()`: `App.vue:165` (session restore), `SocialLogin.vue:190` (Google login), `store/user.js:105` (updateUserStore → silently force-logs-out after saving settings). All swallowed by catch blocks.
   **Fix:** use returned object directly at all three sites (`{ ...firestoreUser, uid }`). In App.vue do **not** early-return on `invalid` (must still reach `setIsLoggingIn(false)`/`setIsAuthReady(true)`).

4. **Email/password login loses roles/isAdmin.** `Login.vue` sets the `isLoggingIn` mutex before `signInWithEmailAndPassword`, so App.vue's handler skips the Firestore doc load; `fetchUser` gets the raw Auth user (no roles).
   **Fix:** in `login()`, after sign-in call `addUserToFirestore(response.user)` and dispatch `fetchUser({ ...fsUser, uid })`.

5. **Admin guard misses `/a`.** Guard checks `to.path.startsWith("/a/")`; dashboard route is `/a`. **Fix:** `to.path === "/a" || to.path.startsWith("/a/")`; delete dead `isAdminPath` const + its eslint-disable.

6. **Guide cards dead on click.** `Guides.vue` pushes route name `"GuideItem"`; registered name is `"guideItem"`. **Fix:** one-word edit + update the spec assertion.

7. **Thermometer NaN.** `debtPaid` reads nonexistent `this.debt.currentBalance` instead of computed `this.currentBalance`. One-line fix (page is a deliberate personal feature — keep it).

8. **Booking deletion has no confirmation** (permanent Firestore delete on a mis-tap). **Fix:** `if (!window.confirm("Delete this booking?")) return` + stub `window.confirm` in the existing spec.

### Phase 2 — Dependency & config hygiene (deletions and moves)

9. **package.json:** move `firebase` → dependencies (it's the bundled runtime SDK); move `firebase-admin`, `dotenv` → devDependencies (Node tooling only); **delete** `less-loader` from both sections (webpack loader, unused by Vite); dedupe `less` → devDependencies only; add phantom deps `globals` + `@eslint/js` (imported by eslint.config.js, undeclared); remove unused `@vitest/ui`; remove `dotenv-cli` **after** Phase 4 makes rollback source `.env` (its only consumer); delete invalid `"imports"` field (subpath imports must start with `#`; its one consumer is a no-op `vi.mock` — delete that too). Run `npm install` to resync the lockfile (CI `npm ci` fails otherwise).
10. **Delete dead files:** `babel.config.js` (Vue-CLI vestige, preset not installed), `src/db.js` (zero importers), `src/views/Foobar.vue` (imports nonexistent component; + its coverage/lint excludes), `FacebookLogin.vue` (only reference is commented out), `src/store/__mocks__/` (Vue-2-era, throws under Vue 3), `public/index.html` (stock Firebase welcome page), `prompts/` (38 tracked one-shot LLM prompt dumps, ~260KB; gitignore `prompts/`).
11. **vite.config.js:** delete misplaced `poolOptions` (a Vitest option inside `resolve` — does nothing; `--pool=threads` flag in npm scripts already does the work); delete dead alias entries; fix the `spaced-comment` lint error (removed with the `output` block in Phase 1).
12. **Alias maps:** trim vite + vitest configs to the identical four used entries (`@`, `components`, `constants`, `store`); delete broken `find: /^~/` and `mocks` entries (point at nonexistent dirs).
13. **eslint:** fix `no-mixed-spaces-and-tabs` in the queued migration; end state `npx eslint .` → 0 errors.
14. **README:** fix stale commands/config references (`npm run serve` → `npm run dev`, `.eslintrc.js` → `eslint.config.js`, etc.).
15. **.env.example:** fix `VITE_FIREBASE_APP_ID'YOUR_APP_ID'` (missing `=`); ensure every env var the code actually reads is present.
16. **firebase.json:** remove the `functions` codebase block (no `functions/` dir exists); remove `'unsafe-inline'` from `script-src` only (build emits no inline scripts — verified; keep it in `style-src`; leave COOP alone — deliberate, popup login).

### Phase 3 — Test suite integrity

17. **vitest.setup.js:** stop stubbing `console.error`/`console.log` globally (hides real breakage); delete the bogus top-level `it()` (it runs as a test in **all 34 spec files** — 18.6% of the suite is copies of a dummy test); fix the include glob so setup files aren't collected as tests.
18. **Coverage honesty:** delete the stray `""` exclude entry (it currently disables all-files reporting); add `coverage.include: ["src/**"]`; remove stale excludes (`hotel/dist/**`) and the excludes hiding `utils/firestore.js`, `store/**`, `router/**` from the report. Headline % will drop — that's the honest number.
19. **FinalizeBooking spec:** rename the mislabeled "successfully submits" test (it asserts failure), give it explicit past dates on the booking prop, drop the duplicated assertion + obsolete snapshot entry.
20. **New targeted tests** (for code this work touches): user store `fetchUser`/`updateUserStore` with the plain-object helper shape (the exact regression class that shipped); router admin guard (`/a`, `/a/users`, anonymous vs admin); `addUserToFirestore`/`getUsersAccount` return shapes.

### Phase 4 — Migration tooling (every entry point currently crashes)

21. **ESM conversions** (`"type": "module"` made these crash on line 1, reproduced): `scripts/firestore-get-schema.js`, `src/migrations/template.js` (also calls undefined `migrateUsers()` → `migrateFoo()`), `template.batch.js`, `utilities/debugRollbacks.js`; fix `utilities/*` import paths (`./src/firebaseAdmin.js` → `../../firebaseAdmin.js`).
22. **template.batch.js failure accounting:** `failedDocs.push(...batch)` spreads a non-iterable WriteBatch (error path throws, masking the real error) → track `currentBatchIds` array.
23. **firebaseAdmin.js:** replace hardcoded `require("../.keys/votel-f1c47-….json")` with `GOOGLE_APPLICATION_CREDENTIALS` env var (read via `fs.readFileSync` + `JSON.parse`, cwd-resolved, clear error when missing), falling back to the existing path so the owner's local flow keeps working. Document in `.env.example`.
24. **Shell scripts:** `mkdir -p logs` in both (logging currently fails on fresh clones); rollback sources `.env` like run does (drops `npx dotenv`, fixes empty `NODE_ENV` in audit log); rollback takes the migration **filename** as an argument and searches `executed/` then `queued/` (today it can never find a prod-executed migration and silently runs the newest queued file **forward**).
25. **Queued migration:** add `--rollback` guard (exit 1, "not implemented") so rollback can't re-run it forward; deterministic doc IDs (`setDoc(..., {merge: true})` upsert) so re-runs don't duplicate data.

### Phase 5 — Security (safe subset; nothing deployed)

26. **firestore.rules:** the committed file is the untouched deny-all default from 2021; real rules live only in the Firebase console and CI never deploys rules (verified: both workflows are hosting-only). Author proper scoped rules: `users/{uid}` owner-only read/write with `roles`/`role_history` mutation blocked (closes the client-side privilege-escalation hole — admin status currently derives from a user-writable field); `bookings` guest-scoped; `properties`/`reviews` public-read. **Do not deploy** — add a README section explaining the drift and the `firebase deploy --only firestore:rules` sync step (owner must diff against console rules first).

### Explicitly skipped (verified but not worth the risk/effort)

- ESLint 9 upgrade — working, EOL is not breakage; medium-risk churn.
- Bundle splitting (1MB chunk warning) — cosmetic; revisit if load time matters.
- NavBar full-page reload on settings — added deliberately (`7ab00af`); not mine to revert.
- COOP tightening — `unsafe-none` was a deliberate fix for popup login (`f94a257`).
- Admin stub views — feature work, not cleanup.
- Firestore migrations ledger — over-engineering for one-off seed scripts.
- `todo.txt` deletion — owner's personal notes.

## Error handling & testing strategy

Each phase ends with: `npx eslint .` (0 errors), `npm test` (all green), `npm run build` + `grep -r serverUtils dist/assets` (empty). Phase 1 additionally: `vite preview` smoke check that the built app serves a loadable module graph, and `node` smoke-imports of `firebase.js`/migration modules for the Node branch. Nothing in this plan deploys anything; all production-facing changes (firebase.json, rules) take effect only on the owner's next deliberate deploy.
