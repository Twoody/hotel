import { doc, deleteDoc, collection, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebase" // using the pre-initialized db

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
	 * 1) Guard Clause & Security Check
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
		successMessage.message = "User \"$(currentUser.uid)\" updated successfully"
		return successMessage
	}
	catch (error) 
	{
		successMessage.message = "Error updating Firestore user: \"$(currentUser.uid)\"."
		console.error(successMessage.message)
		return successMessage
	}
}

/**
 * 
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
		const userRef = await collection(db, "users")
		await setDoc(doc(userRef, user.uid), userPayload)

		// Search for and return the firestore user object
		querySnapshot = await getDoc(doc(db, "users", user.uid))
	}

	// Assume user is valid unless still not found
	querySnapshot.invalid = false

	// Snapshot has to exist now, otherwise issues between database and payload
	if (!querySnapshot.exists())
	{
		console.error("local firestore.js: ISSUE CREATING USER: ", user)
		querySnapshot.invalid = true 
	}
	return querySnapshot
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
 * @param {object} user - A firestore user document from the users collection.
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
	let querySnapshot = await getDoc(doc(db, "users", user.uid))
	querySnapshot.invalid = false

	if (!querySnapshot.exists())
	{
		console.error("local firestore.js: WARNING USER NO LONGER FOUND: ", user)
		querySnapshot.invalid = true 
	}
	return querySnapshot
}

/**
 * @returns {object} - Essentially a 1-to-1 match of the `user` collection
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
		state: "",
		street: "",
		zipcode: "",
	}
	return userPayload
}
