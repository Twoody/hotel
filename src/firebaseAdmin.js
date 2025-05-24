// src/firebaseAdmin.js
import "dotenv/config" 
// import * as admin from "firebase-admin";
import admin from "firebase-admin"
import { createRequire } from "module"

const require = createRequire(import.meta.url)
const serviceAccount = require("../.keys/votel-f1c47-c69aa9c4722a.json")

if (!admin.apps?.length) 
{
	const databaseURL = process.env.VITE_FIREBASE_DATABASE_URL
	if (!databaseURL) 
	{
		console.error("ERROR: VITE_FIREBASE_DATABASE_URL is not defined in environment variables.")
		process.exit(1) 
	}

	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		databaseURL: databaseURL, // Use the variable
	})
}

const dbAdmin = admin.firestore()

// Use ES Module export syntax instead of module.exports
export {
	admin,
	dbAdmin
}
