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
            // Use Models to create new interpretation
            Models.interpretation.create( req.body )
            .then( data => resolve(data) )
            .catch( err => reject(err) )
        })
    }

    const readAll = (req) => {
        return new Promise( (resolve, reject) => {
            Models.interpretation.find()
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
            Models.interpretation.findById( id )
            .exec( (err, data) => {
                if( err ){ return reject(err) }
                else{ return resolve(data) }
            })
        })

        const findInerpretationComments = new Promise( (resolve, reject) => {
            // Find comments interpretation
            Models.comment.find( { subjectOf: id }, (err, data) => {
                if( err || data === null ){ 
                    return reject('No comment for this interpretation') 
                }
                else{
                    return resolve(data)
                }
            })
        });

        const findInerpretationLikes = new Promise( (resolve, reject) => {
            // Find comments interpretation
            Models.like.find( { subjectOf: id }, (err, data) => {
                if( err || data === null ){ 
                    return reject('No comment for this interpretation') 
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
            Models.interpretation.findById( req.params.id )
            .then( interpretation => {
                // Update interpretation
                interpretation.title = req.body.title;
                interpretation.artist_name = req.body.artist_name;
                interpretation.track = req.body.track;
                interpretation.cover = req.body.cover;
                interpretation.duration = req.body.duration;
                interpretation.user = req.body.user;
                interpretation.creationDate = new Date();
                interpretation.dateModified = new Date();
                interpretation.isPublished = req.body.isPublished;
                interpretation.timestamps = req.body.timestamps;

                // Save post changes
                interpretation.save()
                .then( updatedinterpretation => resolve(updatedinterpretation) )
                .catch( updateError => reject(updateError) )
            })
            .catch( err => reject(err) )
        })
    }

    const deleteOne = req => {
        return new Promise( (resolve, reject) => {
             // Delete object
             Models.interpretation.findByIdAndDelete( req.params.id, (err, deleted) => {
                if( err ){ return reject(err) }
                else{ return resolve(deleted) };
            })
        });
    }
//

    // Relative comments and likes
    // const relativeInfos = (req, res) => {
    //     const findInterpretation = new Promise( (resolve, reject) => {
    //             // Find interpretation id
    //             Models.interpretation.findById( req.user._id, (err, data) => {
    //                 if( err || data === null ){ return reject('Interpretation not found') }
    //                 else{
    //                     // Send user data
    //                     return resolve(data)
    //                 }
    //             })
    //     });

    //     const findInerpretationsComments = new Promise( (resolve, reject) => {
    //         // Find comments interpretation
    //         Models.comment.find( { subjectOf: req.interpretation._id }, (err, data) => {
    //             if( err || data === null ){ 
    //                 return reject('No comment for this interpretation') 
    //             }
    //             else{
    //                 return resolve(data)
    //             }
    //         })
    //     });


    //     const findInerpretationsLikes = new Promise( (resolve, reject) => {
    //         // Find comments interpretation
    //         Models.like.find( { subjectOf: req.interpretation._id }, (err, data) => {
    //             if( err || data === null ){ 
    //                 return reject('No like for this interpretation') 
    //             }
    //             else{
    //                 return resolve(data)
    //             }
    //         })
    //     });

    //     const allPromises = Promise.all([findInterpretation, findInerpretationsComments, findInerpretationsLikes])
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