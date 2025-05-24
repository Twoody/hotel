// Filename: migrations/create_collections_v2.js
import "dotenv/config"
import { dbAdmin, admin } from "../../firebaseAdmin.js"
import { logMessage } from "../../utils/serverUtils.js"

/**
 * Migration script to create 'properties' and 'reviews' collections in Firestore
 * based on schema-v2 by adding sample documents.
 */
async function runMigration () 
{
	console.log("Starting Firestore collection migration (schema-v2)...")

	try 
	{
		// --- Properties Collection ---
		console.log("Attempting to create sample document in \"properties\" collection...")
		const propertiesCollectionRef = dbAdmin.collection("properties")

		// Define sample data matching the 'properties' schema
		const samplePropertyData = {
			daily_rate: 125.75,
			address: "1 Example Ave",
			city: "Schema City",
			state: "EX",
			zip_code: "12345",
			status: 1, // Example: 1 for 'active', 0 for 'inactive'
			allowed_dogs: 1,
			allowed_cats: 1,
			allowed_babies: 1, // Assuming boolean-like (1=yes, 0=no) or count
			allowed_toddlers: 1,
			allowed_kids: 2,
			allowed_adults: 4,
			cleaning_fee: 80.00,
			pet_deposit: 250.00,
			pet_fee: 50.00,
			kid_deposit: 0.00, // Example: no specific deposit for kids
			amenities: {
				wifi: true,
				parking: true,
				kitchen: true,
				pool: false,
				gym: false,
				air_conditioning: true,
				heating: true,
				washer: true,
				dryer: true,
				tv: true,
				// Add other potential amenities as needed, ensuring keys match potential future use
			},
			property_managers: [
				"managerUserId_abc",
				"managerUserId_xyz",
			],
			createdAt: admin.firestore.FieldValue.serverTimestamp(), // Use server timestamp
			updatedAt: admin.firestore.FieldValue.serverTimestamp(), // Use server timestamp
		}

		// Add the sample document. This implicitly creates the collection if it doesn't exist.
		// Using .add() generates a unique document ID.
		const propertyDocRef = await propertiesCollectionRef.add(samplePropertyData)
		console.log(`Successfully added sample document to "properties" with ID: ${propertyDocRef.id}`)

		// --- Reviews Collection ---
		console.log("Attempting to create sample document in \"reviews\" collection...")
		const reviewsCollectionRef = dbAdmin.collection("reviews")

		// Define sample data matching the 'reviews' schema
		const sampleReviewData = {
			propertyId: propertyDocRef.id, // Link to the sample property created above
			guestId: "guestUserId_123",
			rating: 4.5, // Example rating
			review: "A wonderful place to stay. Clean, comfortable, and well-located. Amenities were great.",
			createdAt: admin.firestore.FieldValue.serverTimestamp(), // Use server timestamp
		}

		// Add the sample review document.
		const reviewDocRef = await reviewsCollectionRef.add(sampleReviewData)
		console.log(`Successfully added sample document to "reviews" with ID: ${reviewDocRef.id}`)

		console.log("Firestore collection migration (schema-v2) completed successfully.")

	}
	catch (error) 
	{
		console.error("Error during Firestore migration (schema-v2):", error)
		// Optionally re-throw or handle specific errors
		throw error // Re-throwing to indicate failure to the caller
	}
}

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
	db = dbAdmin
}

const SCHEMA_VERSION = 3
const MIGRATION_ID = `migration_v${SCHEMA_VERSION}_${Date.now()}`

console.log(db.foo)
console.log(MIGRATION_ID)
if (ENV === "production") 
{
	console.warn("⚠️ WARNING: Running migration in PRODUCTION mode!")
	console.log("You have 5 seconds to cancel (CTRL+C)...")
	logMessage("Running migration", "info")
	setTimeout(() => runMigration(), 5000)
	logMessage("Migration complete", "info")
	process.exit(0)
}
else 
{
	console.log("lower envs not supported yet")
	logMessage("Completed lower environment compilation", "info")
	process.exit(0)
}

