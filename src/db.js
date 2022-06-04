import firebase from "firebase/app"
import "firebase/firestore"
const firebaseConfig = {
	apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
	appId: process.env.VUE_APP_FIREBASE_APP_ID,
	authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.VUE_APP_DATABASE_URL,
	messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
	projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
}

// Get a Firestore instance
export const db = firebase
	.initializeApp(firebaseConfig)
	.firestore()

// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
const { TimeStamp, GeoPoint, } = firebase.firestore
export {
	TimeStamp, GeoPoint 
}

// if using Firebase JS SDK < 5.8.0
db.settings({
	timestampsInSnapshots: true, 
})
