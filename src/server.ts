//Boilerplate
import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'

//Iterfaces
// interface storageTempInterface {
// 	id: number
// 	upvotes: number
// }

//Data
const storageTemp: any = {
	201901011245: {
		upvotes: 0,
		comments: [],
	},
	202001011246: {
		upvotes: 0,
		comments: [],
	},
	202201011247: {
		upvotes: 0,
		comments: [],
	},
	201401011248: {
		upvotes: 0,
		comments: [],
	},
}

const app: Express = express()
const port: number = 8000

app.use(bodyParser.json())

//Data


//POST Routes
app.post(
	'/api/entries/:id/upvote',
	(req: Request, res: Response) => {
		const entryId: number = parseInt(req.params.id)

		storageTemp[entryId].upvotes++
		res.status(200).send(`Enrty now has ${storageTemp[entryId].upvotes} upvotes`)
	}
)

app.post(
	'/api/entries/:id/add-comment',
	(req: Request, res: Response) => {
		const entryId: number = parseInt(req.params.id)
		const userName: string = req.body.userName
		const comment: string = req.body.comment

		storageTemp[entryId].comments.push(
			{ userName, comment }
		)

		res.status(200).send('Comment added')
	}
)

app.listen(
	port,
	() => {
		console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
	}
)