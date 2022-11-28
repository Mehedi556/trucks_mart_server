const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
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


// function verifyJWT(req , res , next){
//   const authHeader = req.headers.authorization;
//   if(!authHeader){
//     return res.status(401).send('unauthorised access');
//   }
//   const token = authHeader.split(' ')[1];
//   jwt.verify(token , process.env.ACCESS_TOKEN , function(err , decoded){
//     if(error){
//       return res.status(403).send({message: 'Forbidden'})
//     }
//     req.decoded = decoded;
//     next();
//   })
// }









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


    app.get('/users/admin/:email' , async (req , res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === 'Admin' });
    })





    app.get('/users/seller/:email' , async (req , res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isSeller: user?.role === 'Seller' });
    })




    app.delete('/members/:id' , async(req , res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    })




    app.post('/productDetails', async (req, res) => {
      const productDetails = req.body;
      const result = await productDetailsCollection.insertOne(productDetails);
      res.send(result);
    });




    app.get('/productDetails' ,  async (req , res) => {
      const email = req.query.email;
      // const decodedEmail = req.decoded.email;
      // if(email !== decodedEmail){
      //   return res.status(403).send({message: 'Forbidden'});
      // }
      const query = { user_email: email };
      const products = await productDetailsCollection.find(query).toArray();
      res.send(products);
    })




    app.get('/productDetails/:id', async (req, res) => {
      const id = req.params.id;
      const query = { category_id: id };
      const details = await productDetailsCollection.find(query).toArray();
      res.send(details);
    });




    app.get('/users', async (req, res) => {
      const query = {};
      const users = await usersCollection.find(query).toArray();
      res.send(users);
    });




    // app.get('/jwt' , async (req , res) => {
    //   const email = req.query.email;
    //   const query = {email: email};
    //   const user = await usersCollection.findOne(query);
    //   if(user){
    //     const token = jwt.sign({email} , process.env.ACCESS_TOKEN, {expiresIn: '1h'})
    //     return res.send({accessToken: token})
    //   }
      
    //   res.status(403).send({accessToken: ''})
    // })





    app.get('/categories', async (req, res) => {
      const query = {};
      const categories = await categoriesCollection.find(query).toArray();
      res.send(categories);
    });













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
