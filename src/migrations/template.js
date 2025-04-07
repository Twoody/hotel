const admin = require("firebase-admin")
const fs = require("fs")
const path = require("path")
require("dotenv").config()

const ENV = process.env.NODE_ENV
let CAN_RUN = false

// ✅ Initialize Firebase Admin SDK with correct environment
if (!ENV)
{
	console.error("ERROR: No NODE_ENV configured or found")
	logMessage("Bailing: Inproper config", "error")
	process.exit(1)
}
else if (ENV === "development") 
{
	CAN_RUN = true
	console.log("Running in DEVELOPMENT mode...")
	process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080" // Use Firestore Emulator
}
else 
{
	// TODO: Configure list of supported envs and set `CAN_RUN` to true IFF NODE_ENV is in that list
	CAN_RUN = true
	console.log(`Running in ${process.env.NODE_ENV.toUpperCase()} mode...`)
}

let db
if (CAN_RUN) 
{
	const { dbAdmin: dbAdmin, } = require("../../firebaseAdmin") // Adjust the path as needed
	db = dbAdmin
}

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

// ===============================
// 🔄 FIRESTORE MIGRATION FUNCTION
// @param `NODE_ENV=development`
// @param `NODE_ENV=production`
// @example `node migrateUsers.js`
// ===============================
/**
 *
 */
async function migrateFoo () 
{
	if (!CAN_RUN)
	{
		return
	}

	let failed = false
	console.log(`Starting migration to schema version ${SCHEMA_VERSION}...`)
	logMessage(`Migration ${MIGRATION_ID} started.`)

	// Do database changes here

	console.log(`Migration complete: ${migratedDocs} documents updated.`)
	logMessage(`Migration ${MIGRATION_ID} completed. Updated ${migratedDocs} documents.`)
    
	if (failed) 
	{
		logMessage(`Migration ${MIGRATION_ID} failed`, "error")
		console.warn(`⚠️  Migration failed. Check logs.`)
		process.exit(1)
	}
	process.exit(0)
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
	if (!CAN_RUN)
	{
		return
	}
	console.log(`Rolling back migration ${migrationId}...`)
	logMessage(`Starting rollback for migration ${migrationId}.`)

	// Do rollback stuff here

	console.log(`Rollback complete: ${rolledBackDocs} documents restored.`)
	logMessage(`Rollback for migration ${migrationId} completed. Restored ${rolledBackDocs} documents.`)
	process.exit(0)
}

// ===============================
// 🚀 EXECUTE MIGRATION WITH SAFEGUARDS
// ===============================
if (process.argv.includes("--rollback")) 
{
	const rollbackFlagIndex = process.argv.indexOf("--rollback")
	const migrationId = process.argv[rollbackFlagIndex + 1]

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
