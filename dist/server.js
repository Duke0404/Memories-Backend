//Boilerplate
import express from 'express';
import bodyParser from 'body-parser';
//Iterfaces
// interface upvoteStoreInterface {
// 	id: number
// 	upvotes: number
// }
//Data
const upvoteStore = {
    201901011245: {
        upvotes: 0
    },
    202001011246: {
        upvotes: 0
    },
    202201011247: {
        upvotes: 0
    },
    201401011248: {
        upvotes: 0
    },
};
const app = express();
const port = 8000;
app.use(bodyParser.json());
//Data
//POST Routes
app.post('/api/entries/:id/upvote', (req, res) => {
    const entryId = parseInt(req.params.id);
    upvoteStore[entryId].upvotes++;
    res.status(200).send(`Enrty now has ${upvoteStore[entryId].upvotes} upvotes`);
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
