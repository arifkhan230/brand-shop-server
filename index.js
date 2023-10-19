const express = require('express');
const cors = require('cors');
const brands = require('./brand.json');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cwfli1i.mongodb.net/?retryWrites=true&w=majority`;

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
    const productCollection = client.db('productDb').collection('products')
    const brandCollection = client.db('productDb').collection('brands')

    

    app.get('/products',async(req,res)=>{
        const result = await productCollection.find().toArray();
        res.send(result)
    })

    app.get('/brands',async(req,res)=>{
        const result = await brandCollection.find().toArray();
        res.send(result)
    })

    app.post('/products', async(req,res) =>{
        const product = req.body;
        const result = await productCollection.insertOne(product)
        res.send(result)
    })

    app.get('/products/:brandName', async(req,res) =>{
        const brandName = req.params.brandName;
        console.log(brandName)
        const query = {brand: brandName} 
        console.log(query)
        const result = await productCollection.find(query).toArray();
        console.log(result)
        res.send(result)
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







app.get('/', (req,res)=>{
    res.send('My brand server is running')
})

app.listen(port, ()=>{
    console.log(`My brand is running in port : ${port}`)
})

