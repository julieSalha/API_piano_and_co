/* 
Import
*/
    // NPM moodules
    const mongoose = require('mongoose'); //=> https://www.npmjs.com/package/mongoose
    const mongodb = require('mongodb');

    const { MongoClient } = require("mongodb");
    const ObjectId = require('mongodb').ObjectID;
    let dbStream;
    const uri = "mongodb+srv://piano:tV2JFGMSB4VMfPs@piano.282nm.mongodb.net/test";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//

/*  
Define class
*/
    class MONGOClass { 
        constructor(){
            // Set MongoDB url
            this.mongoUrl = process.env.MONGO_URL;
        };

        async run() {
                try {
                  await client.connect()
                  .then(db => dbStream = db)
                  .catch(err => console.log(err))
                  //console.log('dbStream',dbStream)
                  const database = client.db('api-piano');
                  const tracksCollection = database.collection('tracks');
                  //console.log('tracksCollection',tracksCollection)
                  // Query for a movie that has the title 'Back to the Future'
                  // const query = { name: 'C Major' };
                  // const chord = await tracks.findOne(query);
                  // console.log(chord);
              
                } finally {
                  // Ensures that the client will close when you finish/error
                  await client.close();
                }
        };

    };

/* 
Export class
*/
    module.exports = MONGOClass;
//