// src/firebaseAdmin.js
const admin = require("firebase-admin")

const serviceAccount = require("../.keys/votel-f1c47-c69aa9c4722a.json")
if (!admin.apps.length) 
{
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
	})
}

const dbAdmin = admin.firestore()

module.exports = {
	admin,
	dbAdmin, 
}
