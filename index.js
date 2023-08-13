const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rm5ydmz.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
// const uri = `mongodb+srv://coffeeShop:NZVCCDcPbFPI3ZAf@cluster0.rm5ydmz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const coffeeCollections = client.db("coffeeShop").collection("coffees");


    app.get("/coffees", async (req, res) => {
      const result = await coffeeCollections.find().toArray();
      res.send(result)
    });
    app.get('/coffees/:id', async (req, res) =>{
      const id = req.params.id;
      // console.log(id)
      const query = {_id : new ObjectId(id)};
      const result = await coffeeCollections.findOne(query);
      res.send(result)

    })

    app.post("/coffees", async (req, res) => {
      const coffee = req.body;
      const result = await coffeeCollections.insertOne(coffee);
      res.send(result);
    });

    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const option = {upsert: true};
      const updatedCoffee = req.body;
      const coffee = {
        $set: {
          name: updatedCoffee.name,
          quantity: updatedCoffee.quantity,
          supplier: updatedCoffee.supplier,
          taste: updatedCoffee.taste,
          category: updatedCoffee.category,
          details: updatedCoffee.details,
          photo: updatedCoffee.photo,
          price: updatedCoffee.price,
          chef: updatedCoffee.chef
        }
      }
      
      const result = await coffeeCollections.updateOne(filter,coffee, option, );
      res.send(result)
    });

    app.delete('/coffees/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id : new ObjectId (id)}
      const result = await coffeeCollections.deleteOne(query)
      res.send(result)

    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("coffee shop is running");
});

app.listen(port, () => {
  console.log(`coffee shop is running on port ${port}`);
});
