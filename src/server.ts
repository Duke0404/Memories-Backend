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
	async (req: Request, res: Response) => {
		const entryId: number = +req.params.entryId

		MongoClient.connect(
			mongoURI,
			async (error, client) => {
				if (error || !client)
					res.status(500).json({ message: 'Error connecting to db', error })

				else {	
					const db: Db = client.db('memories-db')
					const collection: Collection<Document> = db.collection('entries')

					const entryInfo: WithId<Document> | null = await collection.findOne({ id: entryId })

					if(entryInfo)
						res.status(200).json(entryInfo)

					else
						res.status(404).json({ message: 'Entry not found', error })

					client.close()
				}
			}
		)
	}
)

app.listen(
	port,
	() => {
		console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
	}
)