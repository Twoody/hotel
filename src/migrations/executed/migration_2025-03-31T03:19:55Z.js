// Executed Successfully: 2025-04-02 04:23:43
// Executed Successfully: 2025-04-02 03:59:12
const admin = require("firebase-admin")
const fs = require("fs")
const path = require("path")
require("dotenv").config()

const ENV = process.env.NODE_ENV.toLowercase()
let CAN_RUN = false

if (!ENV) 
{
	console.error("ERROR: No NODE_ENV configured or found")
	logMessage("Bailing: Improper config", "error")
	process.exit(1)
}
else if (ENV === "development") 
{
	CAN_RUN = true
	console.log("Running in DEVELOPMENT mode...")
	process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080"
}
else 
{
	CAN_RUN = true
	console.log(`Running in ${ENV.toUpperCase()} mode...`)
}

let db
if (CAN_RUN) 
{
	const { dbAdmin, } = require("../../firebaseAdmin")
	db = dbAdmin
}

const SCHEMA_VERSION = 2
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
 * @param collectionName
 * @param transformDoc
 */
async function migrateCollection (collectionName, transformDoc) 
{
	if (!CAN_RUN) 
	{
		return
	}

	console.log(`Starting migration for '${collectionName}'...`)
	logMessage(`Migration ${MIGRATION_ID} started for '${collectionName}'.`)

	const collectionRef = db.collection(collectionName)
	const snapshot = await collectionRef.get()

	let batch = db.batch()
	let batchCount = 0
	let migratedDocs = 0
	let failedDocs = []

	for (const doc of snapshot.docs) 
	{
		const data = doc.data()

		if (!data.schemaVersion || data.schemaVersion < SCHEMA_VERSION) 
		{
			const docRef = collectionRef.doc(doc.id)
			const backupRef = db.collection(`migrations_backup/${MIGRATION_ID}/${collectionName}`).doc(doc.id)
      
			batch.set(backupRef, data)

			const newData = transformDoc(data)
			batch.set(docRef, newData, {
				merge: true, 
			})

			migratedDocs++
			batchCount++

			logMessage(`[${collectionName}] Prepared migration for document ID: ${doc.id}`)

			if (batchCount >= 500) 
			{
				try 
				{
					await batch.commit()
					logMessage(`[${collectionName}] Committed 500 document updates.`)
				}
				catch (error) 
				{
					logMessage(`[${collectionName}] Batch commit failed: ${error.message}`, "error")
					failedDocs.push(doc.id)
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
			logMessage(`[${collectionName}] Final batch committed.`)
		}
		catch (error) 
		{
			logMessage(`[${collectionName}] Final batch commit failed: ${error.message}`, "error")
			failedDocs.push("final_batch_error")
		}
	}

	logMessage(`[${collectionName}] Migration completed: ${migratedDocs} documents migrated.`)
	if (failedDocs.length > 0) 
	{
		logMessage(`[${collectionName}] ${failedDocs.length} document(s) failed. IDs: ${failedDocs.join(", ")}`, "error")
		process.exit(1)
	}
}

// ---------------------------
// USERS COLLECTION MIGRATION
// ---------------------------
/**
 *
 */
async function migrateUsers () 
{
	await migrateCollection("users", (data) => ({
		display_name: data.display_name || "",
		email: data.email || "",
		first_name: data.first_name || "",
		last_name: data.last_name || "",
		phone: data.phone || "",
		photoURL: data.photoURL || "",
		address: {
			street: data.street || "",
			city: data.city || "",
			state: data.state || "",
			country: data.country || "",
			zipcode: data.zipcode || "",
		},
		bio: "",
		averageRating: 0,
		totalBookings: 0,
		preferences: {
			pets: false,
			children: false,
			smoking: false,
		},
		is_email_verified: !!data.is_email_verified,
		is_phone_verified: !!data.is_phone_verified,
		roles: data.roles || {},
		role_history: data.role_history || {},
		schemaVersion: SCHEMA_VERSION,
		createdAt: data.createdAt || admin.firestore.FieldValue.serverTimestamp(),
		updatedAt: admin.firestore.FieldValue.serverTimestamp(),
	}))
}

// ---------------------------
// HOTELS -> PROPERTIES MIGRATION
// ---------------------------
/**
 *
 */
async function migrateHotelsToProperties () 
{
	await migrateCollection("hotels", (data) => ({
		daily_rate: data.daily_rate || 0,
		address: data.address || "",
		city: data.city || "",
		state: data.state || "",
		zip_code: data.zip_code || "",
		status: data.status || 0,
		allowed_dogs: data.allowed_dogs || 0,
		allowed_cats: data.allowed_cats || 0,
		allowed_babies: data.allowed_babies || 0,
		allowed_toddlers: data.allowed_toddlers || 0,
		allowed_kids: data.allowed_kids || 0,
		allowed_adults: data.allowed_adults || 0,
		cleaning_fee: data.cleaning_fee || 0,
		pet_deposit: data.pet_deposit || 0,
		pet_fee: data.pet_fee || 0,
		kid_deposit: data.kid_deposit || 0,
		amenities: {
			wifi: false,
			parking: false,
		},
		property_managers: [],
		schemaVersion: SCHEMA_VERSION,
		createdAt: admin.firestore.FieldValue.serverTimestamp(),
		updatedAt: admin.firestore.FieldValue.serverTimestamp(),
	}))
}

// ---------------------------
// BOOKINGS COLLECTION MIGRATION
// ---------------------------
/**
 *
 */
async function migrateBookings () 
{
	await migrateCollection("bookings", (data) => ({
		propertyId: data.propertyId || "",
		guestId: data.guestID || "",
		hostId: data.hostID ? String(data.hostID) : "",
		startDate: data.startDate || "",
		endDate: data.endDate || "",
		status: "confirmed",
		totalPrice: 0,
		pricingDetails: {
			dailyRate: 0,
			cleaningFee: 0,
			petFee: 0,
			childFee: 0,
			taxes: 0,
		},
		countGuests: data.countGuests?.total || 0,
		countChildren: data.countChildren?.total || 0,
		countPets: data.countPets?.total || 0,
		bookedAt: data.bookedAt || admin.firestore.FieldValue.serverTimestamp(),
		schemaVersion: SCHEMA_VERSION,
		createdAt: data.createdAt || admin.firestore.FieldValue.serverTimestamp(),
		updatedAt: admin.firestore.FieldValue.serverTimestamp(),
	}))
}

// ----------------------------------
// 🚀 MAIN MIGRATION EXECUTION BLOCK
// ----------------------------------
/**
 *
 */
async function runMigrations () 
{
	await migrateUsers()
	await migrateHotelsToProperties()
	await migrateBookings()

	console.log("🎉 All migrations completed successfully.")
	logMessage(`All migrations for ${MIGRATION_ID} completed.`)
	process.exit(0)
}

if (process.argv.includes("--rollback")) 
{
	const idx = process.argv.indexOf("--rollback")
	const migrationId = process.argv[idx + 1]
	if (!migrationId) 
	{
		console.error("❌ Please provide a migration ID for rollback.")
		process.exit(1)
	}
	// implement rollback logic here (similar to original)
}
else 
{
	if (ENV === "production") 
	{
		console.warn("⚠️ WARNING: Running migration in PRODUCTION mode!")
		console.log("You have 5 seconds to cancel (CTRL+C)...")
		setTimeout(runMigrations, 5000)
	}
	else 
	{
		runMigrations()
	}
}
