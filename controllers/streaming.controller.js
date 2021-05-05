/* 
Imports
*/
const Models = require('../models/index');
//

/* 
CRUD methods
*/
    const createOne = req => {
        return new Promise( (resolve, reject) => {
            // Use Models to create new streaming
            Models.streaming.create( req.body )
            .then( data => resolve(data) )
            .catch( err => reject(err) )
        })
    }

    const readAll = (req) => {
        return new Promise( (resolve, reject) => {
            Models.streaming.find()
            .then( async data => {
                let collection = [];
                for( let item of data ){
                    collection.push( await readOne(item._id) )
                }
                // Return populated data
                return resolve(collection);
            })
            .catch( err => reject(err) )
        })
    }

    const readOne = id => {
        const findOne = new Promise( (resolve, reject) => {
            // Mongoose population to get associated data
            Models.streaming.findById( id )
            .exec( (err, data) => {
                if( err ){ return reject(err) }
                else{ return resolve(data) }
            })
        })

        const findInerpretationComments = new Promise( (resolve, reject) => {
            // Find comments streaming
            Models.comment.find( { subjectOf: id }, (err, data) => {
                if( err || data === null ){ 
                    return reject('No comment for this streaming') 
                }
                else{
                    return resolve(data)
                }
            })
        });

        const findInerpretationLikes = new Promise( (resolve, reject) => {
            // Find comments streaming
            Models.like.find( { subjectOf: id }, (err, data) => {
                if( err || data === null ){ 
                    return reject('No comment for this streaming') 
                }
                else{
                    return resolve(data)
                }
            })
        });

         const allPromises = Promise.all([ findOne, findInerpretationComments, findInerpretationLikes])
         return allPromises;
    }

    const updateOne = req => {
        return new Promise( (resolve, reject) => {
            // Get post by ID
            Models.streaming.findById( req.params.id )
            .then( streaming => {
                // Update streaming
                streaming.title = req.body.title;
                streaming.artist_name = req.body.artist_name;
                streaming.track = req.body.track;
                streaming.cover = req.body.cover;
                streaming.duration = req.body.duration;
                streaming.user = req.body.user;
                streaming.creationDate = new Date();
                streaming.dateModified = new Date();
                streaming.isPublished = req.body.isPublished;
                streaming.timestamps = req.body.timestamps;

                // Save post changes
                streaming.save()
                .then( updatedstreaming => resolve(updatedstreaming) )
                .catch( updateError => reject(updateError) )
            })
            .catch( err => reject(err) )
        })
    }

    const deleteOne = req => {
        return new Promise( (resolve, reject) => {
             // Delete object
             Models.streaming.findByIdAndDelete( req.params.id, (err, deleted) => {
                if( err ){ return reject(err) }
                else{ return resolve(deleted) };
            })
        });
    }



    //CRUD Tracks stream
    //Promises doc https://docs.mongodb.com/drivers/node/current/fundamentals/promises/
    // POST one
    // const newTrack = {
    //     title: "Shallow",
    //     artist_name: "Lady Gaga",
    //     track: "/mytrack.mp3",
    //     cover: "/mycover.jpg",
    //     duration: "04:05",
    //     user: "60360110375fba79362d7711"
    // }

    // const result = await tracksCollection.insertOne(newTrack);
    // console.dir(result.insertedCount);

    // GET all tracks by user id
    // const query = { user: "60360110375fba79362d7711"};

    // const options = {
    //     // sort matched documents in descending order by rating
    //     sort: { rating: -1 },
    // };

    // const cursor = await tracksCollection.find(query, options);

    // if ((await cursor.count()) === 0) {
    //     console.log('no documents found')
    // }

    // await cursor.forEach(console.dir)

    // GET ONE by id

    // const oneTrack =  tracksCollection.findOne({"_id" : ObjectId("60928d79590b0f2222d0e24d")})
    // console.log('oneTrack',oneTrack);

    // DELETE one or many
    // const doc = {
    //     pageViews: {
    //       $gt: 10,
    //       $lt: 32768
    //     }
    //   };

    //   const deleteResult = await collection.deleteOne(doc);
    //     const deleteManyResult = await collection.deleteMany(doc);

    //     console.dir(deleteResult.deletedCount);
    //     console.dir(deleteManyResult.deletedCount);

    // UPDATE ONE
    // const filter = { _id: ObjectId("60928edc75733a2260f151c2")};
    // const updateDocument = {
    //     $set: {
    //         title: "Shallowwwww"
    //     },
    // }

    // const result = await tracksCollection.updateOne(filter, updateDocument);

/* 
Export controller methods
*/
    module.exports = {
        readAll,
        readOne,
        createOne,
        updateOne,
        deleteOne
    }
//