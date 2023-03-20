const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.laf8zrf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('smartChef').collection('services');
        const reviewCollection = client.db('smartChef').collection('reviews');
        const itemCollection = client.db('smartChef').collection('items')

        app.get('/serviceAll', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query).limit(3);
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        // app.get('/reviews/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) };
        //     const service = await reviewCollection.findOne(query);
        //     res.send(reviews);
        // })

        app.post('/review', async (req, res) => {
            const reviewInfo = req.body;
            const result = await reviewCollection.insertOne(reviewInfo);
            res.send(result);
        })

        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const review = req.body.review;
            const query = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    review: review
                }
            }
            const result = await reviewCollection.updateOne(query, updateDoc);
            res.send(result);
        })

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })

        app.post('/addservice', async (req, res) => {
            const addService = req.body;
            const result = await serviceCollection.insertOne(addService);
            res.send(result);
        })

        app.get('/foodsAll', async (req, res) => {
            const query = {};
            const foodsAll = await itemCollection.find(query).toArray();
            res.send(foodsAll);
        })
        app.get('/foods', async (req, res) => {
            const query = {};
            const foods = await itemCollection.find(query).limit(3).toArray();
            res.send(foods);
        })

    }
    finally {

    }
}
run().catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('smart chef is running')
})

app.listen(port, () => {
    console.log(`smart chef running on ${port}`)
})