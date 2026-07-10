import { doc, collection, setDoc, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../../firebase.js"
import { logMessage } from "../../utils/serverUtils.js"

/**
 * @returns {object} - A default payload structure for a 'properties' document.
 */
export function getPropertyPayload ()
{
	return {
		daily_rate: 0.0,
		address: "",
		city: "",
		state: "",
		zip_code: "",
		status: 0, // Example: 0 for 'inactive', 1 for 'active'
		propertyType: "", // Example: 'AIRBNB', 'CONDO', 'HOUSE'
		allowed_dogs: 0,
		allowed_cats: 0,
		allowed_babies: 0,
		allowed_toddlers: 0,
		allowed_kids: 0,
		allowed_adults: 0,
		cleaning_fee: 0.0,
		pet_deposit: 0.0,
		pet_fee: 0.0,
		kid_deposit: 0.0,
		amenities: {
			wifi: false,
			parking: false,
			kitchen: false,
			pool: false,
			gym: false,
			air_conditioning: false,
			heating: false,
			washer: false,
			dryer: false,
			tv: false,
		},
		property_managers: [], // Array of user UIDs
		createdAt: "", // will be handled by `addOrUpdateProperty`
		updatedAt: "", // will be handled by `addOrUpdateProperty`
	}
}

/**
 * Creates or updates a property document in the 'properties' collection.
 * If `propertyId` is provided, it attempts to update the existing document.
 * Otherwise, it creates a new document.
 * Timestamps (`createdAt`, `updatedAt`) are handled automatically.
 *
 * @param {string | null} propertyId - The ID of the property to update, or null to create a new one.
 * @param {object} payload - The data for the property. Should not include `createdAt` or `updatedAt`.
 * @returns {object} An object with `success` (boolean), `message` (string), and `propertyId` (string).
 */
export async function addOrUpdateProperty (propertyId, payload)
{
	const result = {
		success: false,
		message: "Operation failed",
		propertyId: propertyId,
	}

	try
	{
		let operationType
		const propertiesCollectionRef = collection(db, "properties")

		if (propertyId)
		{ // Update existing property
			operationType = "updated"
			const propertyRef = doc(propertiesCollectionRef, propertyId)
			const dataToUpdate = {
				...payload,
				updatedAt: serverTimestamp(), // Client SDK serverTimestamp
			}
			// Ensure createdAt is not part of the payload for an update to prevent accidental overwrite.
			// If the payload schema might contain it, explicitly delete it: delete dataToUpdate.createdAt;
			await setDoc(propertyRef, dataToUpdate, {
				merge: true,
			})
			result.propertyId = propertyId
		}
		else
		{ // Create new property
			operationType = "created"
			const dataToCreate = {
				...payload,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			}
			const docRef = await addDoc(propertiesCollectionRef, dataToCreate)
			result.propertyId = docRef.id
		}

		result.success = true
		result.message = `Property "${result.propertyId}" ${operationType} successfully.`
		logMessage(result.message, "properties.log")
		return result
	}
	catch (error)
	{
		const action = propertyId ? "updating" : "creating"
		result.message =
			`Error ${action} property ${result.propertyId
				? `"${result.propertyId}"` : "(new)"}: ${error.message}`
		logMessage(result.message, "properties.errors.log")
		return result
	}
}
