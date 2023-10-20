const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())


//brandProject
//wPTvTN3i76sCklYc



const uri = "mongodb+srv://brandProject:wPTvTN3i76sCklYc@cluster0.jthhcqv.mongodb.net/?retryWrites=true&w=majority";
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const foodBrandsCollection = client.db('foodsBrandDB').collection('foodCompany');

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const foodProductsCollection = client.db("foodsBrandDB").collection("products");
    const cartCollection = client.db("foodsBrandDB").collection("carts")
   //get data from server and set to client

   app.post('/cart', async (req, res) => {
    const cartProduct = req.body
    console.log(cartProduct);
    const result = await cartCollection.insertOne(cartProduct)
    res.send(result)
  })

  app.get('/cart', async (req, res) => {
    const cursor = cartCollection.find()
    const result = await cursor.toArray()
    res.send(result)
  })

  app.delete('/cart/:id', async (req, res) => {
    const id = req.params.id
    const query = {_id: new ObjectId(id)}
    const result = await cartCollection.deleteOne(query)
    res.send(result)
  })

   app.post('/product', async (req, res) => {
    const brandFood = req.body
    console.log(brandFood);
    const result = await foodProductsCollection.insertOne(brandFood)
    res.send(result)
  })

  app.get('/product', async (req, res) => {
    const cursor = foodProductsCollection.find()
    const result = await cursor.toArray()
    res.send(result)
  })

  app.get('/product/:id', async (req, res) =>{
    const id = req.params.id
    const query = {_id: new ObjectId(id)}
    const result = await foodProductsCollection.findOne(query)
    res.send(result)
  })

     //send data to home page featured card
     app.get('/foodCompany', async(req,res)=>{
        const cursor = foodBrandsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/foodCompany/:id', async (req, res) => {
        const id= req.params.id
        const query = {_id: new ObjectId(id)}
        const foodBrand = await foodBrandsCollection.findOne(query)
        res.send(foodBrand);
      })

      app.put('/product/:id', async (req, res) =>{
        const id = req.params.id
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true} 
        const updatedProduct = req.body
        const product = {
          $set: {
             ProductName: updatedProduct.ProductName,
             productCompany: updatedProduct.productCompany,  
             ProductType: updatedProduct.ProductType, 
             price: updatedProduct.price, 
             description: updatedProduct.description, 
             rating: updatedProduct.rating, 
             photo: updatedProduct.photo
          }
        }
        const result = await foodProductsCollection.updateOne(filter, product, options)
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




app.get('/', (req, res) => {
    res.send('Server in running 😊')
})


app.listen(port, () => {
    console.log(`Server is running on:${port}`);
})