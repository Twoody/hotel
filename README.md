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
