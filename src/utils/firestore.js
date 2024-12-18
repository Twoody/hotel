import { doc, collection, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebase" // using the pre-initialized db

/**
 * 
 * @param user
 */
export async function addUserToFirestore (user) 
{
	if (!user || !user.uid)
	{
		console.error("local firestore.js: Current function only supports `uid`; Aborting")
		return {
			invalid: true,
		}
	}

	let querySnapshot = await getDoc(doc(db, "users", user.uid))

	// If user not found in db, send payload to db to add user, then request the user again
	if (!querySnapshot.exists())
	{
		// TODO: Probably make this compatible with facebook user creations? 
		// 		It was only started for users using google to login
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
