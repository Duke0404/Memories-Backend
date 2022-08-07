// Boilerplate
// Import express & its types
import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'

// MongoDB
// Import MongoClient & MongoDB types
import { MongoClient, Db, Collection, WithId, Document } from 'mongodb'

// Constant to store express object
const app: Express = express()
// Constant to store MongoDB URI
const mongoURI: string = 'mongodb://127.0.0.1:27017'
// Constant to store port number to listen on
const port: number = 8000

app.use(bodyParser.json())

const useEntries = async (operations: (collection: Collection) => Promise<void>, res: Response): Promise<void> => {
	
	
	MongoClient.connect(
		mongoURI,
		async (error: Error | undefined, client: MongoClient | undefined) => {
			if (error || !client)
				res.status(500).json({ message: 'Error connecting to db', error })

			else {	
				const db: Db = await client.db('memories-db')
				const collection: Collection<Document> = await db.collection('entries')

				await operations(collection)
			
				client.close()
			}
		}
	)
}

// GET Routes

app.get(
	"/api/entries/:entryId",
	(req: Request, res: Response) => {		
		useEntries(
			async (collection: Collection<Document>) => {
				const entryId: number = +req.params.entryId
				const entry: WithId<Document> | null = await collection.findOne({ id: entryId })
				
				if(entry)
					res.json(entry)
				else
					res.status(404).json({ message: `Entry ID: ${entryId} was not found` })
			},
			res
		)
	}
)

app.post(
	"/api/entries/:entryId/add-upvote",
	(req: Request, res: Response) => {
		useEntries(
			async (collection: Collection<Document>) => {
				const entryId: number = +req.params.entryId
				const entry: WithId<Document> | null = await collection.findOne({ id: entryId })
				
				if(entry) {
					const newEntry: WithId<Document> = {
						...entry,
						upvotes: entry.upvotes + 1
					}
					await collection.updateOne({ id: entryId }, { $set: newEntry })
					res.json(newEntry)
				} else
					res.status(404).json({ message: `Entry ID: ${entryId} was not found` })
			},
			res
		)
	}
)

app.post(
	"/api/entries/:entryId/add-comment",
	(req: Request, res: Response) => {
		useEntries(
			async (collection: Collection<Document>) => {
				const entryId: number = +req.params.entryId
				const { comment, username }: { comment: string, username: string } = req.body
				const entry: WithId<Document> | null = await collection.findOne({ id: entryId })

				if(comment.length < 1 || username.length < 1)
					res.status(400).json({ message: 'Comment and username are required' })
				
				else if(entry) {
					const newEntry: WithId<Document> = {
						...entry,
						comments: entry.comments.concat(
							{
								username: username,
								comment: comment
							}
						)
					}
					await collection.updateOne({ id: entryId }, { $set: newEntry })
					res.json(newEntry)
				} else
					res.status(404).json({ message: `Entry ID: ${entryId} was not found` })
			},
			res
		)
	}
)

app.listen(
	port,
	() => {
		console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
	}
)