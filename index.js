const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.port || 8000;

// middleware
app.use(express.json());
app.use(cors());

// mongodb connection with env 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lkytz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
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

    // create a collection in database
    const DB = client.db('MoviesDB').collection('Movies')

    // send data from ui > server> database
    app.post('/add-movies', async (req, res) => {
      const user = req.body
      console.log('new movies', user);
      const result = await DB.insertOne(user);
      res.send(result)
    })

    // send data from database > server > ui
    app.get('/all-movies', async (req, res) => {
      const cursor = DB.find()
      const result = await cursor.toArray()
      res.send(result)
    })


    // delete data from database
    app.delete('/all-movies/:idName', async (req, res) => {
      const id = req.params.idName
      const query = { _id: new ObjectId(id) }
      const result = await DB.deleteOne(query)
      res.send(result)
    })

    // load a single data in api
    app.get('/all-movies/:movieid', async (req, res) => {
      const id = req.params.movieid
      const query = { _id: new ObjectId(id) }
      const movie = await DB.findOne(query)
      res.send(movie)
    })



    // create a new database for favourite movie list
    const favouriteMovies=client.db('Favorite-movies').collection('Fav-movies')
  
    // create favourite movie databse
    app.post('/favourite-movies',async(req,res)=>{
      const favMovie=req.body
      const result= await favouriteMovies.insertOne(favMovie)
      res.send(result)
    })

    // send favourite movie to user
    app.get('/favourite-movies', async(req,res)=>{
      const cursor = favouriteMovies.find()
      const results = await cursor.toArray()
      res.send(results)
    })

    // delete a favourite movie form database
    app.delete('/favourite-movies/:idnam',async(req,res)=>{
      const id=req.params.idnam
      const query={_id:new ObjectId(id)}
      const deleteMovie=await favouriteMovies.deleteOne(query)
      res.send(deleteMovie)
    })



  } finally {
    console.log('i am erro');
  }
}
run().catch(error => console.log(error));

app.get('/', (req, res) => {
  res.send('Hellllllo user');
})

app.listen(port, () => {
  console.log('server running...');
})