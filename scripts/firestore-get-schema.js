const { dbAdmin: dbAdmin, } = require("../src/firebaseAdmin")
const db = dbAdmin

/**
 *
 */
async function extractSchema () 
{
	const collections = await db.listCollections()
	let schema = {}

	for (const col of collections) 
	{
		schema[col.id] = {}
		const snapshot = await col.limit(10).get() // Sample docs to infer schema

		snapshot.docs.forEach((doc) => 
		{
			Object.entries(doc.data()).forEach(([
				field,
				value,
			]) => 
			{
				schema[col.id][field] = typeof value
			})
		})
	}

	console.log(JSON.stringify(schema, null, 2))
}

extractSchema()
