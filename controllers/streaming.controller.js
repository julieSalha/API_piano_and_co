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
                return resolve(collection);
            })
            .catch( err => reject(err) )
        })
    }

    const readOne = id => {
        const findOne = new Promise( (resolve, reject) => {
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
//

    // Relative comments and likes
    // const relativeInfos = (req, res) => {
    //     const findstreaming = new Promise( (resolve, reject) => {
    //             // Find streaming id
    //             Models.streaming.findById( req.user._id, (err, data) => {
    //                 if( err || data === null ){ return reject('streaming not found') }
    //                 else{
    //                     // Send user data
    //                     return resolve(data)
    //                 }
    //             })
    //     });

    //     const findInerpretationsComments = new Promise( (resolve, reject) => {
    //         // Find comments streaming
    //         Models.comment.find( { subjectOf: req.streaming._id }, (err, data) => {
    //             if( err || data === null ){ 
    //                 return reject('No comment for this streaming') 
    //             }
    //             else{
    //                 return resolve(data)
    //             }
    //         })
    //     });


    //     const findInerpretationsLikes = new Promise( (resolve, reject) => {
    //         // Find comments streaming
    //         Models.like.find( { subjectOf: req.streaming._id }, (err, data) => {
    //             if( err || data === null ){ 
    //                 return reject('No like for this streaming') 
    //             }
    //             else{
    //                 return resolve(data)
    //             }
    //         })
    //     });

    //     const allPromises = Promise.all([findstreaming, findInerpretationsComments, findInerpretationsLikes])
    //     return allPromises;
    // }

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