// src/firebaseAdmin.js
import "dotenv/config"
import admin from "firebase-admin"
import { readFileSync } from "fs"
import { resolve } from "path"

// Service-account key path — override in .env; falls back to the maintainer's local key
const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ||
	"./.keys/votel-f1c47-c69aa9c4722a.json"

if (!admin.apps?.length)
{
	const databaseURL = process.env.VITE_FIREBASE_DATABASE_URL
	if (!databaseURL)
	{
		console.error("ERROR: VITE_FIREBASE_DATABASE_URL is not defined in environment variables.")
		process.exit(1)
	}

	let serviceAccount
	try
	{
		serviceAccount = JSON.parse(readFileSync(resolve(keyPath), "utf8"))
	}
	catch (error)
	{
		console.error(`ERROR: Cannot read service-account key at "${keyPath}".`)
		console.error("Set GOOGLE_APPLICATION_CREDENTIALS in .env to your key's path.", error.message)
		process.exit(1)
	}

	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		databaseURL,
	})
}

const dbAdmin = admin.firestore()

export {
	admin,
	dbAdmin
}
