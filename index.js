const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
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


    const advertiseCollection = client.db('trucksMart').collection('advertiseItems');


    const ordersCollection = client.db('trucksMart').collection('myOrders');


    const paymentsCollection = client.db('trucksMart').collection('payments');



    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });




    app.put('/users/verify/:email' , async (req , res) => {
      const email = req.params.email;
      const filter = { user_email: email };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          status: 'verified'
        }
      }
      const result = await productDetailsCollection.updateOne(filter , updatedDoc , options);
      res.send(result);
      
      
    })


    // ---------------------------------
// serious

// app.get('/users/verified/:email' , async (req , res) => {
//   const email = req.params.email;
//   const query = { email };
//   const user = await usersCollection.findOne(query);
//   res.send({ isVerified: user?.role === 'Admin' });
// })










    


    

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






    app.get('/users/buyer/:email' , async (req , res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isBuyer: user?.role === 'Buyer' });
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




    app.get('/sellers', async (req, res) => {
      const query = {role: 'Seller'};
      const users = await usersCollection.find(query).toArray();
      res.send(users);
    });



    app.get('/buyers', async (req, res) => {
      const query = {role: 'Buyer'};
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



app.post('/advertise' , async (req , res) => {
  const advertiseItem = req.body;
  const advertise = await advertiseCollection.insertOne(advertiseItem);
  res.send(advertise);
})


app.get('/advertise' , async (req , res) => {
  const email = req.query.email;
  const query = {user_email: email};
  const items = await advertiseCollection.find(query).toArray();
  res.send(items);
})




app.post('/myorders' , async (req , res) => {
  const ordersItem = req.body;
  const orders = await ordersCollection.insertOne(ordersItem);
  console.log(orders)
  res.send(orders);
})


app.get('/myorders' , async (req , res) => {
  const email = req.query.email;
  const query = {email: email};
  const order = await ordersCollection.find(query).toArray();
  res.send(order);
})



app.get('/orders/:id' , async (req , res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const order = await ordersCollection.findOne(query);
  res.send(order);
})




app.post('/create-payment-intent' , async (req , res) => {
  const orders = req.body;
  const price = orders.price;
  const amount = price * 100;

  const paymentIntent = await stripe.paymentIntents.create({
    currency: 'usd',
    amount: amount,
    "payment_method_types": [
      "card"
    ]
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
})


app.post('/payments' , async (req , res) => {
  const payment = req.body;
  const result = await paymentsCollection.insertOne(payment);
  const id = payment.ordersId;
  const filter = {_id:ObjectId(id)};
  const updatedDoc = {
    $set: {
      paid: true,
      transactionId: payment.transactionId
    }
  }
  const updateResult = await ordersCollection.updateOne(filter , updatedDoc )
  res.send(result);
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
