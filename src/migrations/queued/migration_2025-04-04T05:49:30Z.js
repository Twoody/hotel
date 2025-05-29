// src/utils/migrations.js
import { firebaseApp } from "../../firebase.js"; // Adjust path if needed
import { deleteApp } from "firebase/app";
import { dbAdmin, admin } from "../../firebaseAdmin.js"
import { logMessage } from "../../utils/serverUtils.js"
import { getPropertyPayload, addOrUpdateProperty } from "../../utils/firestore.js"

/**
 * Runs a single migration.
 * Each migration is explicitly defined as a function.
 */
export async function setupPropertyAndReviews () 
{
	logMessage("Migration starting", "properties.log")
	console.log("Starting Firestore migration...")
	try 
	{
		// Define sample data matching the 'properties' schema
		// Timestamps (createdAt, updatedAt) will be handled by addOrUpdateProperty
		const samplePropertyData = {
			daily_rate: 125.75,
			address: "1 Example Ave",
			city: "Schema City",
			state: "EX",
			zip_code: "12345",
			status: 1, // Example: 1 for 'active', 0 for 'inactive'
			propertyType: "AIRBNB",
			allowed_dogs: 1,
			allowed_cats: 1,
			allowed_babies: 1,
			allowed_toddlers: 1,
			allowed_kids: 2,
			allowed_adults: 4,
			cleaning_fee: 80.00,
			pet_deposit: 250.00,
			pet_fee: 50.00,
			kid_deposit: 0.00,
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
				// Add other potential amenities as needed
			},
			property_managers: [
				"managerUserId_abc",
				"managerUserId_xyz",
			],
		}

		// Combine with default payload to ensure all fields are present if sample is sparse
		const propertyDataForUpload = {
			...getPropertyPayload(),
			...samplePropertyData, 
		}

		// Create "properties" document using the new utility function
		// Pass null as the first argument to indicate creation of a new property
		const propertyResult = await addOrUpdateProperty(null, propertyDataForUpload)

		if (!propertyResult.success || !propertyResult.propertyId) 
		{
			logMessage(`Migration: Failed to create property - ${propertyResult.message}`, "properties.error.log")
			console.error("Migration: Failed to create property document.", propertyResult.message)
			throw new Error(`Migration: Property creation failed - ${propertyResult.message}`)
		}

		const propertyId = propertyResult.propertyId
		console.info(`\tCreated properties doc with ID: ${propertyId}`)

		// Example Migration: create "reviews" collection (still uses dbAdmin directly)
		const sampleReviewData = {
			propertyId: propertyId, // Use the ID from the created property
			guestId: "guestUserId_123",
			rating: 4.5,
			review: "Excellent stay!",
			createdAt: admin.firestore.FieldValue.serverTimestamp(),
			updatedAt: admin.firestore.FieldValue.serverTimestamp(),
		}
		const reviewRef = dbAdmin.collection("reviews").doc() // Using dbAdmin for reviews
		await reviewRef.set(sampleReviewData)

		console.info(`\tCreated reviews doc with ID: ${reviewRef.id}`)

		logMessage("Migration completed successfully.", "properties.log")
	}
	catch (error) 
	{
		// Error is already logged by addOrUpdateProperty if it originated there,
		// or by the preceding console.error if propertyResult was unsuccessful.
		// This top-level catch ensures the overall migration status is reported.
		logMessage(`Migration failed overall: ${error.message}`, "poperties.error.log")
		console.error("Migration failed overall:", error.message)
		throw error
	}
	return
}

(async function() 
{
	try 
	{
		await setupPropertyAndReviews()
	
	}
	catch (error) 
	{
		// This ensures that any unhandled rejection from setupPropertyAndReviews,
		// including those re-thrown, are caught and logged at the script's exit point.
		// console.error('Migration script execution failed:', err); // Redundant if already logged
		console.error("Migration failed overall:", error.message)
		throw error
	}
	finally 
	{
		// Always try to close the Firebase app connection
		try 
		{
			await admin.app().delete()
			await dbAdmin.terminate?.()
			await admin.terminate?.()
			console.log("Firebase Admin SDK connection closed successfully.")
		}
		catch (closeError) 
		{
			console.error("Error closing Firebase Admin SDK connection:", closeError)
		}
		    // Add this to close the client app
    if (firebaseApp) { // Check if it was initialized
        try {
            await deleteApp(firebaseApp);
            console.log("Firebase Client SDK connection closed successfully.");
        } catch (closeError) {
            console.error("Error closing Firebase Client SDK connection:", closeError);
        }
    }

	}

})()
