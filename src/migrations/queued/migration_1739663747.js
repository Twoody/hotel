const admin = require("firebase-admin")
const fs = require("fs")
const path = require("path")
require("dotenv").config()

// ✅ Initialize Firebase Admin SDK with correct environment
if (process.env.NODE_ENV === "development") 
{
	console.log("Running in DEVELOPMENT mode...")
	process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080" // Use Firestore Emulator
}
else 
{
	console.log(`Running in ${process.env.NODE_ENV.toUpperCase()} mode...`)
}

admin.initializeApp()
const db = admin.firestore()

// ===============================
// 🔄 SCHEMA VERSION CONTROL
// ===============================
const SCHEMA_VERSION = 2
const MIGRATION_ID = `migration_v${SCHEMA_VERSION}_${Date.now()}` // Unique ID for backup tracking

/**
 * Creates a migration log entry
 *
 * @param message
 * @param type
 */
function logMessage (message, type = "info") 
{
	const logDir = path.resolve(__dirname, "logs")
	if (!fs.existsSync(logDir)) 
	{
		fs.mkdirSync(logDir)
	}

	const logFile = type === "error" ? "migrations_errors.log" : "migrations.log"
	const logPath = path.join(logDir, logFile)

	const timestamp = new Date().toISOString()
	fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`)
}

// ===============================
// 🔄 FIRESTORE MIGRATION FUNCTION
// @param `NODE_ENV=development`
// @param `NODE_ENV=production`
// @example `node migrateUsers.js`
// ===============================
/**
 *
 */
async function migrateUsers () 
{
	console.log(`Starting migration to schema version ${SCHEMA_VERSION}...`)
	logMessage(`Migration ${MIGRATION_ID} started.`)

	const usersRef = db.collection("users")
	const snapshot = await usersRef.get()

	let batch = db.batch()
	let batchCount = 0
	let migratedDocs = 0
	let failedDocs = []

	for (const doc of snapshot.docs) 
	{
		const data = doc.data()

		if (!data.schemaVersion || data.schemaVersion < SCHEMA_VERSION) 
		{
			const docRef = usersRef.doc(doc.id)

			// 🔹 Step 1: Create a Backup before Update
			const backupRef = db.collection(`migrations_backup/${MIGRATION_ID}/users`).doc(doc.id)
			batch.set(backupRef, data) // Store old data

			// 🔹 Step 2: Update the Document with the New Schema
			batch.update(docRef, { 
				newField: "default value", 
				schemaVersion: SCHEMA_VERSION, 
			})

			batchCount++
			migratedDocs++

			// ✅ Commit batch every 500 operations
			if (batchCount >= 500) 
			{
				try 
				{
					await batch.commit()
					logMessage("Committed 500 document updates.")
				}
				catch (error) 
				{
					console.error("Batch commit failed:", error)
					logMessage(`Batch commit failed: ${error.message}`, "error")
					failedDocs.push(...batch)
				}
				batch = db.batch()
				batchCount = 0
			}
		}
	}

	// ✅ Commit the remaining batch
	if (batchCount > 0) 
	{
		try 
		{
			await batch.commit()
			logMessage("Final batch committed.")
		}
		catch (error) 
		{
			console.error("Final batch commit failed:", error)
			logMessage(`Final batch commit failed: ${error.message}`, "error")
			failedDocs.push(...batch)
		}
	}

	console.log(`Migration complete: ${migratedDocs} documents updated.`)
	logMessage(`Migration ${MIGRATION_ID} completed. Updated ${migratedDocs} documents.`)
    
	if (failedDocs.length > 0) 
	{
		logMessage(`Migration ${MIGRATION_ID} encountered ${failedDocs.length} failed documents.`, "error")
		console.warn(`⚠️ Migration finished with ${failedDocs.length} failed document(s). Check logs.`)
	}
}

// ===============================
// 🔄 ROLLBACK FUNCTION
// @example `node migrateUsers.js --rollback migration_v2_1700000000000`
// ===============================
/**
 *
 * @param migrationId
 */
async function rollbackMigration (migrationId) 
{
	console.log(`Rolling back migration ${migrationId}...`)
	logMessage(`Starting rollback for migration ${migrationId}.`)

	const backupRef = db.collection(`migrations_backup/${migrationId}/users`)
	const snapshot = await backupRef.get()

	let batch = db.batch()
	let batchCount = 0
	let rolledBackDocs = 0

	for (const doc of snapshot.docs) 
	{
		const originalData = doc.data()
		const userRef = db.collection("users").doc(doc.id)

		batch.set(userRef, originalData) // Restore old data
		batchCount++
		rolledBackDocs++

		// ✅ Commit batch every 500 operations
		if (batchCount >= 500) 
		{
			try 
			{
				await batch.commit()
				logMessage("Committed rollback for 500 documents.")
			}
			catch (error) 
			{
				console.error("Rollback batch commit failed:", error)
				logMessage(`Rollback batch commit failed: ${error.message}`, "error")
			}
			batch = db.batch()
			batchCount = 0
		}
	}

	// ✅ Commit remaining rollback batch
	if (batchCount > 0) 
	{
		try 
		{
			await batch.commit()
			logMessage("Final rollback batch committed.")
		}
		catch (error) 
		{
			console.error("Final rollback commit failed:", error)
			logMessage(`Final rollback commit failed: ${error.message}`, "error")
		}
	}

	console.log(`Rollback complete: ${rolledBackDocs} documents restored.`)
	logMessage(`Rollback for migration ${migrationId} completed. Restored ${rolledBackDocs} documents.`)
}

// ===============================
// 🚀 EXECUTE MIGRATION WITH SAFEGUARDS
// ===============================
if (process.argv.includes("--rollback")) 
{
	const migrationId = process.argv[2]
	if (!migrationId) 
	{
		console.error("❌ Please provide a migration ID for rollback.")
		process.exit(1)
	}
	rollbackMigration(migrationId)
}
else 
{
	if (process.env.NODE_ENV === "production") 
	{
		console.warn("⚠️ WARNING: Running migration in PRODUCTION mode!")
		console.log("You have 5 seconds to cancel (CTRL+C)...")

		setTimeout(() => 
		{
			migrateUsers()
		}, 5000)
	}
	else 
	{
		migrateUsers()
	}
}
