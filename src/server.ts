// Boilerplate
// Import express & its types
import express, { Express, Request, Response } from 'express'

// MongoDB
// Import MongoClient & MongoDB types
import { MongoClient, Db, Collection, WithId, Document } from 'mongodb'

// Constant to store express object
const app: Express = express()
// Constant to store MongoDB URI
const mongoURI: string = 'mongodb://localhost:27017'
// Constant to store port number to listen on
const port: number = 8000

// GET Routes
app.get(
	'/api/entries/:entryId',
	(req: Request, res: Response) => {
		const entryId: number = +req.params.entryId

		MongoClient.connect(
			mongoURI,
			{},
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

// const client: MongoClient = new MongoClient(mongoURI)

// async function run() {
// 	try {
// 		await client.connect()

//     // database and collection code goes here
// 		const db: Db = client.db('memories-db')
// 		const collection: Collection<Document> = db.collection('entries')

//     // find code goes here
// 		const entryInfo: WithId<Document> | null = await collection.findOne({ id: 201401011248 })
		
//     // iterate code goes here

// 	}

// 	finally {
// 		await client.close();
// 	}

// }

// run().catch(console.dir);

app.listen(
	port,
	() => {
		console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
	}
)