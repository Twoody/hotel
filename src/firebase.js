import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics, isSupported } from "firebase/analytics"
import { TRUTHYS } from "./utils/misc.js"

// Vite inlines import.meta.env.VITE_* in browser builds; Node (migrations) reads process.env
const isNode = typeof process !== "undefined" && !!process.versions?.node
const apiKey = isNode
	? process.env.VITE_FIREBASE_API_KEY
	: import.meta.env.VITE_FIREBASE_API_KEY
const appId = isNode
	? process.env.VITE_FIREBASE_APP_ID
	: import.meta.env.VITE_FIREBASE_APP_ID
const authDomain = isNode
	? process.env.VITE_FIREBASE_AUTH_DOMAIN
	: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
const databaseURL = isNode
	? process.env.VITE_DATABASE_URL
	: import.meta.env.VITE_DATABASE_URL
const messagingSenderId = isNode
	? process.env.VITE_FIREBASE_MESSAGING_SENDER_ID
	: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
const projectId = isNode
	? process.env.VITE_FIREBASE_PROJECT_ID
	: import.meta.env.VITE_FIREBASE_PROJECT_ID
const storageBucket = isNode
	? process.env.VITE_FIREBASE_STORAGE_BUCKET
	: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET

const __airplanMode = (isNode
	? process.env.VITE_AIRPLANE_MODE
	: import.meta.env.VITE_AIRPLANE_MODE) || false
const isAirplaneMode = TRUTHYS.includes(__airplanMode)

const firebaseConfig = {
	apiKey,
	appId,
	authDomain,
	databaseURL,
	messagingSenderId,
	projectId,
	storageBucket,
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
	isSupported().then((supported) =>
	{
		if (supported)
		{
			firebaseAnalyics = getAnalytics(firebaseApp)
		}
	})

	firebaseAuth = getAuth(firebaseApp)
	db = getFirestore(firebaseApp)
}

export {
	firebaseAnalyics, firebaseApp, firebaseAuth, db
}
