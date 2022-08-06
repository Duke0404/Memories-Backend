// Boilerplate
// Import express & its types
import express, { Express, Request, Response } from 'express'

// MongoDB
// Import MongoClient & MongoDB types
import { MongoClient, Db, Collection, WithId, Document } from 'mongodb'

// Constant to store express object
const app: Express = express()
// Constant to store MongoDB URI
const mongoURI: string = 'mongodb://127.0.0.1:27017'
// Constant to store port number to listen on
const port: number = 8000

// GET Routes
app.get(
	'/api/entries/:entryId',
	(req: Request, res: Response) => {
		const entryId: number = +req.params.entryId

		MongoClient.connect(
			mongoURI,
			async (error, client) => {
				if (error || !client)
					res.status(500).json({ message: 'Error connecting to db', error })

				else {	
					const db: Db = await client.db('memories-db')

					const entryInfo: WithId<Document> | null = await db.collection('entries').findOne({ id: entryId })

					res.status(200).json(entryInfo)

					client.close()
				}
			}
		)
	}
)

/*******************************************/
// 201901011245

// const listDatabases = async (client: MongoClient) => {
// 	const databasesList = await client.db().admin().listDatabases()

// 	console.log("Databases:")

// 	databasesList.databases.forEach(db => console.log(` - ${db.name}`))
// }

// const main = async () => {
// 	const client: MongoClient = new MongoClient(mongoURI)


// 	try {
// 		await client.connect()

// 		await listDatabases(client)
// 	}

// 	catch (error) {
// 		console.log(error)
// 	}

// 	finally {
// 		await client.close()
// 	}
// }

// main().catch(console.error)

/*******************************************/

app.get(
	"/api/test",
	(req: Request, res: Response) => {
		res.status(200).send("Hello World")
	}
)

app.listen(
	port,
	() => {
		console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
	}
)