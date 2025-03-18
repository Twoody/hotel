const fs = require("fs")
const path = require("path")
require("dotenv").config()

const ENV = process.env.NODE_ENV
let canRun = false

if (!ENV) 
{
	console.error("ERROR: No NODE_ENV configured or found")
	logMessage("Bailing: Inproper config", "error")
	process.exit(1)
}
else if (ENV === "development") 
{
	canRun = true
	console.log("Running in DEVELOPMENT mode...")
	process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080" // Use Firestore Emulator
}
else 
{
	// TODO: Configure list of supported envs and set `canRun` to true IFF NODE_ENV is in that list
	canRun = true
	console.log(`Running in ${process.env.NODE_ENV.toUpperCase()} mode...`)
}

let db
if (canRun) 
{
	const { dbAdmin: dbAdmin, } = require("../../firebaseAdmin")
	db = dbAdmin
}

const SCHEMA_VERSION = 3
const MIGRATION_ID = `migration_v${SCHEMA_VERSION}_${Date.now()}`

/**
 *
 * @param message
 * @param type
 */
function logMessage (message, type = "info") 
{
	const logDir = path.resolve(__dirname, "../../../logs")
	if (!fs.existsSync(logDir)) 
	{
		fs.mkdirSync(logDir)
	}

	const logFile = type === "error" ? "migrations_errors.log" : "migrations.log"
	const logPath = path.join(logDir, logFile)

	const timestamp = new Date().toISOString()
	fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`)
}

/**
 *
 */
async function migrateUsers () 
{
	if (!canRun) 
	{
		return
	}
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

			const backupRef = db.collection(`migrations_backup/${MIGRATION_ID}/users`).doc(doc.id)
			batch.set(backupRef, data)

			const roles = data.email === "tanner.l.woody@gmail.com" ? [
				"admin",
			] : [
				"user",
			]

			batch.update(docRef, {
				roles,
				role_history: [
					{
						role: roles[0],
						assigned_by: "system",
						timestamp: "2025-02-13T12:00:00Z",
					},
				],
				schemaVersion: SCHEMA_VERSION,
			})

			batchCount++
			migratedDocs++

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
		console.warn(`⚠️  Migration finished with ${failedDocs.length} failed document(s). Check logs.`)
		process.exit(1)
	}
	process.exit(0)
}

if (process.argv.includes("--rollback")) 
{
	console.error("Rollback logic not implemented for this migration.")
	process.exit(1)
}
else 
{
	if (ENV === "production") 
	{
		console.warn("⚠️ WARNING: Running migration in PRODUCTION mode!")
		console.log("You have 5 seconds to cancel (CTRL+C)...")
		setTimeout(() => migrateUsers(), 5000)
	}
	else 
	{
		migrateUsers()
	}
}
