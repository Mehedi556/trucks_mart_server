const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000 ;

//Middleware
app.use(cors())
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.emwzks8.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{

        








    }
    finally{

    }
}
























app.get('/' , (req , res) => {
    res.send('Server site server is running');
})

app.listen(port , () => {
    console.log(`Doctors portal running on port ${port}`)
})