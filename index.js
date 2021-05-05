const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectID;

let dbStream;

const uri = "mongodb+srv://piano:tV2JFGMSB4VMfPs@piano.282nm.mongodb.net/test";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//console.log('client',client);

async function run() {
  try {
    await client.connect()
    .then(db => dbStream = db)
    .catch(err => console.log(err))
    console.log('dbStream',dbStream)
    const database = client.db('api-piano');
    const tracksCollection = database.collection('tracks');
    // Query for a movie that has the title 'Back to the Future'
    // const query = { name: 'C Major' };
    // const chord = await tracks.findOne(query);
    // console.log(chord);

  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);