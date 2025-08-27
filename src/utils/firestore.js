import {doc,
	deleteDoc,
	collection,
	getDoc,
	setDoc,
	serverTimestamp,
	addDoc} from "firebase/firestore"
import { db, firebaseAuth } from "../firebase.js"
import { GoogleAuthProvider, reauthenticateWithCredential, signInWithPopup } from "firebase/auth"
import { logMessage } from "./serverUtils.js"

/**
 * Update a user document given appropriate and supported payload fields
 *
 * @param {object} currentUser - The user object that is requesting the update
 * @param {object} newPayload - The fields that need to be updated for said user
 * @returns {object} successMessage - Whether successful or not, with appropriate message
 * @since 2.2.3
 */
export async function updateFirestoreUser (currentUser, newPayload) 
{
	/**
	 * -----------
	 * 1) Guard Clause & Security Check (todo)
	 * -----------
	 * Example approach: only allow the user to update their own record
	 * OR an admin to update any user record.
	 */
	let successMessage = {
		success: false,
		message: "DEFAULT",
	}

	if (!currentUser?.uid) 
	{
		successMessage.message = "No valid user to update."
		console.error(successMessage.message)
		return successMessage
	}
	/**
	 * For an even stricter security model, you could do something like:
	 *	 if (!currentUser.isAdmin && currentUser.uid !== newPayload.uidToUpdate) { ... } 
	 * or fetch custom claims from Firebase Auth and only allow certain roles to do certain updates.
	 */

	/**
	 * -----------
	 * 2) Connect to Firestore
	 * -----------
	 * Note: By default this example updates the *same* user’s doc as currentUser.uid.
	 * If you want to allow an admin to update someone else, pass the correct uid via newPayload or similar.
	 */
	const userDocRef = doc(db, "users", currentUser.uid)
	
	try 
	{
		const userDoc = await getDoc(userDocRef)
		if (!userDoc.exists()) 
		{
			// If user doc not found, you may want to create it or throw an error
			successMessage.message = "User document does not exist."
			console.error(successMessage.message)
			return successMessage
		}

		/**
		 * -----------
		 * 3) Perform the update
		 * -----------
		 * { merge: true } merges the fields so you only have to pass changed values.
		 */
		await setDoc(userDocRef, newPayload, {
			merge: true, 
		})

		successMessage.success = true
		successMessage.message = `User "${currentUser.uid}" updated successfully`
		return successMessage
	}
	catch (error) 
	{
		successMessage.message = `Error updating Firestore user: "${currentUser.uid}".`
		console.error(successMessage.message, error) // Added error object to console.error
		return successMessage
	}
}

/**
 * @param {object} user - A firestore user document from the users collection.
 * @since 2.2.3
 */
export async function addUserToFirestore (user) 
{
	if (!user || !user.uid)
	{
		console.error("local firestore.js: Current function only supports `uid`; Aborting: 093")
		return {
			invalid: true,
		}
	}

	let querySnapshot = await getDoc(doc(db, "users", user.uid))

	// If user not found in db, send payload to db to add user, then request the user again
	if (!querySnapshot.exists())
	{
		const userPayload = getFirestoreUserPayload()
		// If Google account that has not been recorded
		userPayload.display_name = user.displayName || ""
		userPayload.email = user.email || ""
		userPayload.first_name = (user.displayName && user.displayName.length) ?
			user.displayName.split(" ")[0] : ""
		userPayload.is_email_verified = user.emailVerified || false
		// Last name is everything that is not the first name, IFF first name exists
		userPayload.last_name = (user.displayName && user.displayName.length) ?
			user.displayName.split(" ").slice(1).join(" ") : ""
		userPayload.phone = user.phoneNumber || ""
		userPayload.photoURL = user.photoURL || ""

		// Connect and add user to the collection
		await setDoc(doc(db, "users", user.uid), userPayload)

		// Search for and return the firestore user object
		querySnapshot = await getDoc(doc(db, "users", user.uid))
	}

	// Add .data() to return the document data, and retain invalid flag separately if needed
	const userData = querySnapshot.exists() ? querySnapshot.data() : null
	if (!userData) 
	{
		console.error("local firestore.js: ISSUE CREATING OR FETCHING USER: ", user)
		return {
			invalid: true, 
		}
	}
    
	return {
		...userData,
		id: querySnapshot.id,
		invalid: false, 
	} // Return data with id
}

/**
 * Deletes a user's document from the Firestore users collection.
 *
 * @param {object} user - The Firebase user object to delete (must include `uid`).
 * @returns {object} successMessage - Indicates whether the operation was successful.
 */
export async function deleteUserFromFirestore (user) 
{
	let successMessage = {
		success: false,
		message: "DEFAULT",
	}

	if (!user || !user.uid) 
	{
		successMessage.message = "No valid user to delete."
		console.error(successMessage.message)
		return successMessage
	}

	const userDocRef = doc(db, "users", user.uid)

	try 
	{
		// Delete the user document from Firestore
		await deleteDoc(userDocRef)
		successMessage.success = true
		successMessage.message = `User document "${user.uid}" deleted successfully.`
		console.info(successMessage.message)
		return successMessage
	}
	catch (error) 
	{
		successMessage.message = `Error deleting Firestore user document: "${user.uid}".`
		console.error(successMessage.message, error)
		return successMessage
	}
}

/**
 * @param {object} user - A firestore user object (needs uid).
 * @since 2.2.3
 */
export async function getUsersAccount (user) 
{
	if (!user || !user.uid)
	{
		console.error("local firestore.js: Current function only supports `uid`; Aborting: 255")
		return {
			invalid: true,
		}
	}

	// Search for and return the firestore user object
	const userDocRef = doc(db, "users", user.uid)
	const querySnapshot = await getDoc(userDocRef)
    
	if (!querySnapshot.exists()) 
	{
		console.warn("local firestore.js: WARNING USER NOT FOUND: ", user.uid) // Changed to warn
		return {
			invalid: true, 
		}
	}
	// Return the document data along with its ID
	return {
		...querySnapshot.data(),
		id: querySnapshot.id,
		invalid: false, 
	}
}

/**
 * @returns {object} - Essentially a 1-to-1 match of the `users` collection schema
 */
export function getFirestoreUserPayload ()
{
	const userPayload = 
	{
		city: "",
		country: "",
		display_name: "",
		email: "",
		first_name: "",
		is_email_verified: false,
		is_phone_verified: false,
		// Last name is everything that is not the first name, IFF first name exists
		last_name: "",
		phone: "",
		photoURL: "",
		role_history: [],
		roles: [],
		state: "",
		street: "",
		zipcode: "",
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
	}
	return userPayload
}

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

/**
 * @returns {boolean} Was reauthentication done
 * @since 2.4.0
 */
export async function reauthenticateGoogleUser ()
{
	const user = firebaseAuth.currentUser
	if (!user)
	{
		console.error("No user is currently signed in.")
		return false
	}

	const providerData = user.providerData.find((p) => p.providerId === "google.com")
	if (!providerData)
	{
		// console.info("`google.com` provider not found");
		return true // No Google provider to reauthenticate, so consider it "successful" in that context.
	}

	try
	{
		const provider = new GoogleAuthProvider()

		// 🔹 Force Google sign-in popup to get a fresh credential
		const result = await signInWithPopup(firebaseAuth, provider)
		const credential = GoogleAuthProvider.credentialFromResult(result)

		if (!credential)
		{
			// This case should ideally be caught by signInWithPopup throwing an error
			throw new Error("Failed to obtain Google credential for reauthentication.")
		}

		// 🔹 Re-authenticate with the fresh credential
		await reauthenticateWithCredential(user, credential)
		console.info("User reauthenticated successfully.")
		return true
	}
	catch (error)
	{
		console.error("Reauthentication failed:", error)
		// Handle specific errors if needed, e.g., 'auth/user-mismatch', 'auth/provider-already-linked'
		alert("Session expired or reauthentication failed. Please sign in again.") // Inform user
		return false
	}
}
