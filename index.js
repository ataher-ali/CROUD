const express = require('express')
require('dotenv').config()
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port =process.env.PORT || 5050

var cors = require('cors')

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Server On!')
  })

//mongo DB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5bmhisx.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {

    // await client.connect();
   
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  catch{
    // await client.close();
    console.log('DB Not Connect!');
  }
}
run().catch(console.dir);
  
const toys_db = client.db('kids').collection('toys')
const toys_category = client.db('kids').collection('categorys')



app.get('/toys', async(req,res)=>{
  const cursor = toys_db.find()
  const result = await cursor.toArray();
  res.send(result)
})

app.get('/categorys', async(req,res)=>{
  const cursor = toys_category.find()
  const result = await cursor.toArray();
  res.send(result)
})

app.get('/toys/:id', async(req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await toys_db.findOne(query)
  res.send(result)
})

app.get('/category/:category', async(req,res)=>{
  const category = req.params.category;
  const query = {toy_category: category}
  const result = await toys_db.find(query).toArray()
  res.send(result)
})

app.delete('/toys/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await toys_db.deleteOne(query)
  res.send(result)
})

app.put('/toys/:id', async(req,res)=>{
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const option = {upsert:true};
  const updateToy = req.body 
  const toy={
    $set:{
      toy_name:updateToy.toy_name,
      toy_Quantity:updateToy.toy_Quantity,
      toy_price:updateToy.toy_price,
      toy_category:updateToy.toy_category,
      toy_details:updateToy.toy_details,
      photo_url:updateToy.photo_url,
    }
  }
  const result = await toys_db.updateOne(filter,toy)
  res.send(result)
})

app.get('/mytoys', async (req, res) => {
  // console.log(req.query.email);
  let query ={}
  if (req.query?.email) {
    query = { email: req.query.email }
}
  const result = await toys_db.find(query).toArray();
  res.send(result);
})





app.post('/toys',(req,res)=>{
  const newCoffee = req.body
  const resp = toys_db.insertOne(newCoffee) 
  res.send(resp)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })