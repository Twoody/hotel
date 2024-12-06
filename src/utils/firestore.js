import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

/**
 * 
 */
export async function addUserToFirestore(app, user) {
	// Reference to the users collection
	//const userRef = await collection(db, "users")
	//console.log('got user')
	//const querySnapshot = await getDocs(userRef)
	//console.log('got all users')
	//querySnapshot.forEach((doc) => 
	//{
	//	console.log("Document data:", doc.data())
	//})
	if (!user || !user.uid)
	{
		console.log('firestore.js: Current function only supports `uid`; Aborting')
		return {invalid: true}
	}

	const db = getFirestore(app);
	let querySnapshot = await getDoc(doc(db, 'users', user.uid))
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
			first_name: '',
			is_email_verified: false,
			is_phone_verified: false,
			// Last name is everything that is not the first name, IFF first name exists
			last_name: '',
			phone: "",
			photoURL: "",
			state: "",
			street: "",
			zipcode: ""
		}
		// If Google account that has not been recorded
			userPayload.display_name = user.displayName || ""
			userPayload.email = user.email || ""
			userPayload.first_name = (user.displayName && user.displayName.length) ? user.displayName.split(' ')[0] : ''
			userPayload.is_email_verified = user.emailVerified || false
			// Last name is everything that is not the first name, IFF first name exists
			userPayload.last_name = (user.displayName && user.displayName.length) ? user.displayName.split(' ').slice(1).join(' ') : ''
			userPayload.phone = user.phoneNumber || ""
			userPayload.photoURL = user.photoURL || ""

		// Connect and add user to the collection
		const userRef = await collection(db, "users")
		//await setDoc(doc(userRef, user.uid), userPayload);

		// Search for and return the firestore user object
		querySnapshot = await getDoc(doc(db, 'users', user.uid))
	}

	querySnapshot.invalid = false
	return querySnapshot
}
