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
            // Use Models to create new like
            Models.like.create( req.body )
            .then( data => resolve(data) )
            .catch( err => reject(err) )
        })
    }

    const deleteOne = req => {
        return new Promise( (resolve, reject) => {
             // Delete object
             Models.like.findByIdAndDelete( req.params.id, (err, deleted) => {
                if( err ){ return reject(err) }
                else{ return resolve(deleted) };
            })
        });
    }

    const readAll = () => {
        return new Promise( (resolve, reject) => {
            Models.like.find()
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
        return new Promise( (resolve, reject) => {
            // Mongoose population to get associated data
            Models.like.findById( id )
            .exec( (err, data) => {
                if( err ){ return reject(err) }
                else{ return resolve(data) }
            })
        })
    }

    const updateOne = req => {
        return new Promise( (resolve, reject) => {
            // Get post by ID
            Models.like.findById( req.params.id )
            .then( like => {
                // Update like
                like.potentialAction = req.body.potentialAction;
                like.subjectOf = req.body.subjectOf;
                like.author = req.body.author;

                // Save post changes
                like.save()
                .then( updatedlike => resolve(updatedlike) )
                .catch( updateError => reject(updateError) )
            })
            .catch( err => reject(err) )
        })
    }


//

//
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