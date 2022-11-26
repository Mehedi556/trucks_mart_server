const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.emwzks8.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const usersCollection = client.db('trucksMart').collection('users');
    const categoriesCollection = client.db('trucksMart').collection('categories');
    const productDetailsCollection = client.db('trucksMart').collection('productDetails');



    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });






    app.get('/users', async (req, res) => {
      const query = {};
      const users = await usersCollection.find(query).toArray();
      res.send(users);
    });



    app.get('/categories' , async (req , res) => {
        const query = {};
        const categories = await categoriesCollection.find(query).toArray();
        res.send(categories);
    })















  } finally {
  }
}
run().catch(console.log);

app.get('/', (req, res) => {
  res.send('Server site server is running');
});

app.listen(port, () => {
  console.log(`Server site server running on port ${port}`);
});
