# hotel

## Table of Contents

- [Project Setup](#project-setup)
- [Compiles and Hot-reloads for Development](#compiles-and-hot-reloads-for-development)
- [Compiles and Minifies for Production](#compiles-and-minifies-for-production)
- [Lints and Fixes Files](#lints-and-fixes-files)
- [Customize Configuration](#customize-configuration)
- [Documentation](#documentation)
- [Hosting](#hosting)
- [Troubleshooting](#troubleshooting)
- [Firestore Migrations](#firestore-migrations)
  - [Migration Template](#migration-template)
  - [Migration Creation Script](#migration-creation-script)
  - [Migration Execution Script](#migration-execution-script)
  - [Considerations](#considerations)

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

- Uses `eslint`
-- See `./.eslintrc.js

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### Documentation

Most main documentation can be found in [the front end library `teahub`](https://github.com/twoody/teahub).

`teahub` is maintained by the same author as this project. The purpose of having the components live in this
isolated library is because many of the components were used between different applications.
And when one application bug needed fixed, it had to be committed twice.

- Note: `teahub`'s `fortawesome` installations require a local usage within `hotel` too.

## Hosting

Hosting is done on `firebase`.
**There is a GitHub workflow enabled on the `main` branch to deploy to production when merged and pushed to `remote`.**

- See `.github/workflows/`

- Helpful commands involve:
-- `npm ci && npm run build && firebase deploy --only hosting`

### Hosting `admin.passtow.com`

The `admin.passtow.com` subdomain is hosted using Firebase Hosting. It is configured as a separate target within Firebase to ensure that requests are routed correctly.

#### Configuration Steps:
1. **Add Hosting Target in Firebase**
   - Run the command:
   ```sh
   firebase target:apply hosting admin admin.passtow.com
   ```

2. **Update `firebase.json`**
   - Ensure that `firebase.json` includes the `admin` target:
   ```json
   {
     "hosting": [
       {
         "target": "admin",
         "public": "dist/admin",
         "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
       }
     ]
   }
   ```

3. **Deploy the Admin Subdomain**
   - After building the admin project, deploy it with:
   ```sh
   npm run build:admin && firebase deploy --only hosting:admin
   ```

4. **Set Up a Custom Domain in Firebase**
   - In the Firebase Console, navigate to `Hosting > Custom Domains` and add `admin.passtow.com`.
   - Follow the provided DNS configuration steps to link the domain to Firebase.

This setup ensures that the admin interface is accessible at `https://admin.passtow.com` while keeping it separate from the user-facing site.

### Troubleshooting

If issues arise when trying to `firebase projects:list` or `firebase login`, try to reauth:

- `firebase login --reauth`

### Firebase Costly Mistakes

Infinite loops in functions. The easiest way to do this is to update a timestamp in a database in a function that triggers on updates (a noop write won’t trigger an event). I tried to propose detection mechanisms for this, but it would have required a very large mandate where every event emitter had to plumb tracing info from request to event to be successful. Sorry that I failed.

Data models that grow N2 with your user base. This can be a trap in no-SQL databases due to the necessary normalization, which is why I’d recommend learning about Firebase Data Connect. It has a minimum price, but JOINs can keep your database small and your charges more linear, making it the best choice for certain applications (security is also simpler).

Unbounded storage without any garbage collection or monetization strategy. If your users add 50GB/mo in storage and you keep it all around forever, each month will bill 50GB * the number of months your app has been around.

## Firestore Migrations

This project includes a custom migration system to safely update the Firestore schema and manage data transformations.

### Overview

The migration process is broken into three main parts:
1. **Migration Template**
2. **Migration Creation**
3. **Migration Execution**

### 1. Migration Template (`src/migrations/template.js`)

- **Purpose:**
  Defines the logic to update Firestore documents to a new schema version.
  - **Backup:** For each document in the `users` collection that is not up-to-date, a backup is created in a dedicated backup subcollection.
  - **Update:** The document is updated with the new schema (e.g., adding a new field and updating the `schemaVersion`).
  - **Batching:** Operations are grouped into batches and committed periodically.
  - **Rollback:** A rollback function is available to restore documents from the backup if necessary.

- **Environment Safeguards:**
  - In development mode, the Firestore Emulator is used.
  - In production mode, a 5-second delay is provided before running the migration, allowing time to cancel if needed.

### 2. Migration Creation Script (`scripts/migrate-firestore.js`)

- **Purpose:**
  Automates the creation of a new migration file from the template.

- **Process:**
  - Verifies that the template file and the `queued` directory exist.
  - Copies `src/migrations/template.js` to a new file in `src/migrations/queued`, naming it with a timestamp (e.g., `migration_1990-10-17T09:01:09Z.js`).
  - This queued migration is then ready to be executed.

### 3. Migration Execution Script (`scripts/migration-run.sh`)

- **Purpose:**
  Handles the execution of queued migration files.

- **Process:**
  - **Environment Loading:** Reads environment variables from a `.env` file.
  - **Migration Selection:** Identifies the latest migration file in the `queued` directory.
  - **Execution:** Runs the migration using Node.js.
  - **Logging:** Records the outcome (NODE_ENV, UTC timestamp, and status) in `logs/migrations.log`.
  - **Post-Execution (Production Only):**
    - If the migration is successful and running in production, the migration file is annotated with a success comment and moved to the `executed` directory to prevent re-execution.

### Considerations

- **Batch Write Limits:**
  Each document update in the migration script performs two write operations (backup and update). Firestore allows up to 500 write operations per batch.
  **Recommendation:** Adjust the commit threshold (e.g., commit every 250 documents) to ensure that you remain within Firestore's limits.

- **Environment & Logging:**
  - Ensure that the `.env` file is properly formatted to avoid issues when exporting variables.
  - Be aware that in non-production environments, migration files remain in the `queued` directory after execution, which might lead to re-running migrations.

## Running Separate Admin and User Servers

Vite does not allocate keywords for environment variables like `VITE_HOST` and `VITE_PORT`.
Instead, we need to explicitly pass them into the Vite config.

### Step 1: Update vite.config.js to Read Environment Variables
```javascript
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const host = process.env.VITE_HOST || "localhost";
const port = process.env.VITE_PORT || 5173;

export default defineConfig({
  plugins: [vue()],
  server: {
    host,
    port: parseInt(port, 10),
  },
});
```

### Step 2: Update package.json Scripts
```json
"scripts": {
  "serve:admin": "VITE_HOST=admin.localhost VITE_PORT=5174 vite",
  "serve:user": "VITE_HOST=localhost VITE_PORT=5173 vite"
}
```

### Step 3: Start Both Servers
```
npm run serve:user
npm run serve:admin
```

### Step 4: Add admin.localhost to `/etc/hosts`
```sh
127.0.0.1 admin.localhost
```

### Step 5: Access the Servers
- User: http://localhost:5173
- Admin: http://admin.localhost:5174

