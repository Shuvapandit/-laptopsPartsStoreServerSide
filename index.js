const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eys2p.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
 try{
 await client.connect();
const partsCollection = client.db('allinone').collection('partsstore');
const purchaseCollection = client.db('allinone').collection('purchase');
/* admin */
const userCollection = client.db('allinone').collection('users');
                
app.get('/partsstore', async(req, res) =>{
 const query = {};
const cursor = partsCollection.find(query);
const parts = await cursor.toArray();
res.send(parts);})
/* single user */
app.get('/partsstore/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const part = await partsCollection.findOne(query);
  res.send(part);
})
app.post('/purchase', async (req, res) => {
  const purchase = req.body;
  const result = await purchaseCollection.insertOne(purchase);
  res.send(result);
})
 /* admin */
 app.put('/user/:email', async (req, res) => {
  const email = req.params.email;
  const user = req.body;
  const filter = { email: email };
  const options = { upsert: true };
  const updateDoc = {
    $set: user,
  };
  const result = await userCollection.updateOne(filter, updateDoc, options);
  const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
  res.send({ result,token});
})

  




}

finally{
                
}
}
                
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello From All!n1store')
})

app.listen(port, () => {
  console.log(`All!n1store' App listening on port ${port}`)
})