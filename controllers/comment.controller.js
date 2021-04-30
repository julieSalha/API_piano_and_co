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
            // Use Models to create new comment
            Models.comment.create( req.body )
            .then( data => resolve(data) )
            .catch( err => reject(err) )
        })
    }

    const deleteOne = req => {
        return new Promise( (resolve, reject) => {
             // Delete object
             Models.comment.findByIdAndDelete( req.params.id, (err, deleted) => {
                if( err ){ return reject(err) }
                else{ return resolve(deleted) };
            })
        });
    }

    const readAll = () => {
        return new Promise( (resolve, reject) => {
            Models.comment.find()
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
            Models.comment.findById( id )
            .exec( (err, data) => {
                if( err ){ return reject(err) }
                else{ return resolve(data) }
            })
        });

        const findCommentsLikes = new Promise( (resolve, reject) => {
            // Find comments interpretation
            Models.like.find( { subjectOf: id }, (err, data) => {
                if( err || data === null ){ 
                    return reject('No like for this comment') 
                }
                else{
                    return resolve(data)
                }
            })
        });

         const allPromises = Promise.all([ findOne, findCommentsLikes])
         return allPromises;
    }

    const updateOne = req => {
        return new Promise( (resolve, reject) => {
            // Get post by ID
            Models.comment.findById( req.params.id )
            .then( comment => {
                // Update comment
                comment.content = req.body.content;
                comment.subjectOf = req.body.subjectOf;
                comment.author = req.body.author;

                // Save post changes
                comment.save()
                .then( updatedcomment => resolve(updatedcomment) )
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