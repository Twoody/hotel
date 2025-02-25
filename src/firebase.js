import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"

const isAirplaneMode = import.meta.env.VITE_AIRPLANE_MODE

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	databaseURL: import.meta.env.VITE_DATABASE_URL,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
}

let firebaseAnalyics = null
let firebaseApp = null
let firebaseAuth = null
let db = null

if (!isAirplaneMode)
{
	// Initialize Firebase app only once
	firebaseApp = initializeApp(firebaseConfig)

	// Optionally initialize and export other services
	firebaseAnalyics = getAnalytics(firebaseApp)
	firebaseAuth = getAuth(firebaseApp)
	db = getFirestore(firebaseApp)
}

export {
	firebaseAnalyics, firebaseApp, firebaseAuth, db 
}
