import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	databaseURL: import.meta.env.VITE_DATABASE_URL,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
}

// Initialize Firebase app only once
const firebaseApp = initializeApp(firebaseConfig)

// Optionally initialize and export other services
const firebaseAuth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)

export {
	firebaseApp, firebaseAuth, db 
}
