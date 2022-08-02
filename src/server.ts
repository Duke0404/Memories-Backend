//Boilerplate
import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'

//MongoDB
import { MongoClient } from 'mongodb'

//Iterfaces
// interface storageTempInterface {
// 	id: number
// 	upvotes: number
// }

const app: Express = express()
const port: number = 8000

app.use(bodyParser.json())

//GET Routes
app.get(
	'/api/entries/:id',
	async (req: Request, res: Response) => {
		const entryId: number = +req.params.id

		await MongoClient.connect(
			'mongodb://localhost:27017',
			async (error, client) => {
				if (error || client === undefined)
					res.status(500).json({ message: 'Error connecting to db', error })

				else {	
					const db = client.db('memories-db')
					const entryInfo = await db.collection('entries').findOne({ id: entryId })
					res.status(200).json(entryInfo)
					client.close()
				}
			}
		)
	}
)

//POST Routes
// app.post(
// 	'/api/entries/:id/upvote',
// 	(req: Request, res: Response) => {
// 		const entryId: number = parseInt(req.params.id)

// 		storageTemp[entryId].upvotes++
// 		res.status(200).send(`Enrty now has ${storageTemp[entryId].upvotes} upvotes`)
// 	}
// )

// app.post(
// 	'/api/entries/:id/add-comment',
// 	(req: Request, res: Response) => {
// 		const entryId: number = parseInt(req.params.id)
// 		const userName: string = req.body.userName
// 		const comment: string = req.body.comment

// 		storageTemp[entryId].comments.push(
// 			{ userName, comment }
// 		)

// 		res.status(200).send('Comment added')
// 	}
// )

app.listen(
	port,
	() => {
		console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
	}
)