const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware..........
app.use(cors());
app.use(express.json());


// mongodb atlas..........

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oswrsby.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const toyCollection = client.db('allToy').collection('toys');


        // finding all toys ..

        app.get('/toys', async (req, res) => {
            const cursor = toyCollection.find().limit(20);
            const result = await cursor.toArray();
            res.send(result);
        })

        // search toy with email

        app.get("/myToy/:email", async (req, res) => {
            console.log(req.params.id);
            const jobs = await toyCollection
                .find({
                    email: req.params.email,
                })
                .toArray();
            res.send(jobs);
        });

        // search a unique toy

        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.findOne(query);
            res.send(result);
        });

        // search by a category

        app.get('/toy/:text', async (req, res) => {
            if (req.params.text == 'lego-cars'
                || req.params.text == 'lego-city'
                || req.params.text == 'lego-star-wars') {
                const result = await toyCollection.find(
                    { subCategory: req.params.text }
                ).toArray();
                return res.send(result)
            }
        });

        // for add operation

        app.post('/toys', async (req, res) => {
            const toy = req.body;
            console.log(toy)
            const result = await toyCollection.insertOne(toy);
            res.send(result);
        });



        // for update operation

        app.put('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedToy = req.body;
            const toy = {
                $set: {
                    price: updatedToy.price,
                    quantity: updatedToy.quantity,
                    detail: updatedToy.detail
                }
            }
            const result = await toyCollection.updateOne(filter, toy, options);
            res.send(result);

        });


        // for delete operation

        app.delete('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toyCollection.deleteOne(query);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);










app.get('/', (req, res) => {
    res.send('assignment eleven server running')
})

app.listen(port, () => {
    console.log(`assignment eleven server running on port ${port}`)
})