const { dbAdmin, } = require("./src/firebaseAdmin")

/**
 *
 * @param oldName
 * @param newName
 */
async function renameCollection (oldName, newName) 
{
	const oldCollectionRef = dbAdmin.collection("migrations_backup").doc(oldName).collection("users")
	const newCollectionRef = dbAdmin.collection("migrations_backup").doc(newName).collection("users")

	const snapshot = await oldCollectionRef.get()
	if (snapshot.empty) 
	{
		console.log(`Old collection (${oldName}) is empty or doesn't exist.`)
		return
	}

	let count = 0
	for (const doc of snapshot.docs) 
	{
		await newCollectionRef.doc(doc.id).set(doc.data())
		count++
		console.log(`Copied document ${doc.id}`)
	}

	console.log(`Successfully copied ${count} documents from ${oldName} to ${newName}`)
}

renameCollection("migration_v2_1739775240273", "migration_2025-02-16T06:35:30Z")
	.catch(console.error)

