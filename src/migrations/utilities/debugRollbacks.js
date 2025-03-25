const { dbAdmin, } = require("./src/firebaseAdmin")

/**
 *
 * @param name
 */
async function debugCollection (name) 
{
	const ref = dbAdmin.collection("migrations_backup").doc(name).collection("users")
	const snapshot = await ref.get()

	console.log(`Debugging collection path: migration_backups/${name}/users`)
	console.log(`Documents found: ${snapshot.size}`)

	snapshot.forEach((doc) => console.log(`- ${doc.id}`))
}

debugCollection("migration_v2_1739775240273").catch(console.error)

