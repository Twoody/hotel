// Executed Successfully: 2025-04-02 03:59:12
const admin = require("firebase-admin")
const fs = require("fs")
const path = require("path")
require("dotenv").config()

const ENV = process.env.NODE_ENV
let CAN_RUN = false

if (!ENV) 
{
	console.error("ERROR: No NODE_ENV configured or found")
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
 */
async function migrateSchema () 
{
	if (!CAN_RUN) 
	{
		return
	}

	console.log(`Starting migration to schema version ${SCHEMA_VERSION}...`)

	const usersRef = db.collection("users")
	const snapshot = await usersRef.get()

	let batch = db.batch()
	let batchCount = 0
	let migratedDocs = 0

	for (const doc of snapshot.docs) 
	{
		const data = doc.data()

		if (!data.schemaVersion || data.schemaVersion < SCHEMA_VERSION) 
		{
			const docRef = usersRef.doc(doc.id)
			const backupRef = db.collection(`migrations_backup/${MIGRATION_ID}/users`).doc(doc.id)
			batch.set(backupRef, data)

			const newData = {
				display_name: data.display_name || "",
				email: data.email,
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
				is_email_verified: data.is_email_verified || false,
				is_phone_verified: data.is_phone_verified || false,
				roles: data.roles || {},
				role_history: data.role_history || {},
				createdAt: data.createdAt || admin.firestore.FieldValue.serverTimestamp(),
				updatedAt: admin.firestore.FieldValue.serverTimestamp(),
				schemaVersion: SCHEMA_VERSION,
			}

			batch.set(docRef, newData)
			batchCount++
			migratedDocs++

			if (batchCount >= 500) 
			{
				await batch.commit()
				batch = db.batch()
				batchCount = 0
			}
		}
	}

	if (batchCount > 0) 
	{
		await batch.commit()
	}

	console.log(`Migration complete: ${migratedDocs} documents updated.`)
}

if (process.argv.includes("--rollback")) 
{
	console.error("Rollback script is not implemented in this example.")
	process.exit(1)
}
else 
{
	if (ENV === "production") 
	{
		console.warn("⚠️ WARNING: Running migration in PRODUCTION mode!")
		setTimeout(() => migrateSchema(), 5000)
	}
	else 
	{
		migrateSchema()
	}
}
