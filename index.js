const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8r9nhhc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productCollection = client.db('emaJhon').collection('products');

        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = productCollection.find(query)
            const products = await cursor.skip(page * size).limit(size).toArray()
            const count = await productCollection.estimatedDocumentCount()
            res.send({ count, products })
        })

        app.post('/productsByIds', async (req, res) => {
            const ids = req.body;
            const objectIds = ids.map(id => ObjectId(id))
            const query = { _id: { $in: objectIds } };
            const cursor = productCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

    }
    finally {

    }

}
run().catch(err => console.error(err))



app.get('/', (req, res) => {
    res.send('Ema-John Simple Server is running')
})



app.listen(port, () => {
    console.log(`Ema-john Simple is running on port ${port}`)
})