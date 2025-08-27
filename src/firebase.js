import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics, isSupported } from "firebase/analytics"
import { TRUTHYS } from "./utils/misc.js"
import dotenv from "dotenv"

dotenv.config()
const apiKey = process.env.VITE_FIREBASE_API_KEY
const appId = process.env.VITE_FIREBASE_APP_ID
const authDomain = process.env.VITE_FIREBASE_AUTH_DOMAIN
const databaseURL = process.env.VITE_DATABASE_URL
const messagingSenderId = process.env.VITE_FIREBASE_MESSAGING_SENDER_ID
const projectId = process.env.VITE_FIREBASE_PROJECT_ID
const storageBucket = process.env.VITE_FIREBASE_STORAGE_BUCKET

const __airplanMode = import.meta?.env?.VITE_AIRPLANE_MODE || false
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
