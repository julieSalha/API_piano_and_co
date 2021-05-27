/* 
Imports
*/
const Models = require('../models/index');
const fs = require('fs');
//

/* 
CRUD methods
*/
    const createOne = req => {
        return new Promise( (resolve, reject) => {
            
            // Write files cover and track
            let uploadTrack = req.files['track'][0];
            let formatTrack = uploadTrack.originalname.split('.')[1];
            let pathTrack = uploadTrack.fieldname + '-' + Date.now() + '-' + uploadTrack.originalname.split('.')[0] + '.' + formatTrack;

            fs.writeFile('./uploads/' + pathTrack, uploadTrack.buffer, function(err) {
                if (err) {
                    console.log('error', err);
                }
            });

            let uploadCover = req.files['cover'][0];
            console.log(uploadCover)
            let formatCover = uploadCover.originalname.split('.')[1];
            let pathCover = uploadCover.fieldname + '-' + Date.now() + '-' + uploadTrack.originalname.split('.')[0] + '.' + formatCover;

            fs.writeFile('./uploads/' + pathCover, uploadCover.buffer, function(err) {
                if (err) {
                    console.log('error', err);
                }
            });

            let newStream = {
                title: req.body.title,
                artist_name: req.body.artist_name,
                track: './uploads/' + pathTrack,
                cover: './uploads/' + pathCover,
                duration: req.body.duration,
                user: req.body.author
            }

            Models.streaming.create( newStream )
            .then( streaming => resolve(streaming))
            .catch( err => reject(err));
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

        const findStreamingComments = new Promise( (resolve, reject) => {
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

        const findStreamingLikes = new Promise( (resolve, reject) => {
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

         const allPromises = Promise.all([ findOne, findStreamingComments, findStreamingLikes])
         return allPromises;
    }

    const updateOne = req => {
        console.log('updateOne', req.body)
        return new Promise( (resolve, reject) => {
            // Write files cover and track
            let uploadTrack = req.files['track'][0];
            let formatTrack = uploadTrack.originalname.split('.')[1];
            let pathTrack = uploadTrack.fieldname + '-' + Date.now() + '-' + uploadTrack.originalname.split('.')[0] + '.' + formatTrack;

            fs.writeFile('./uploads/' + pathTrack, uploadTrack.buffer, function(err) {
                if (err) {
                    console.log('error', err);
                }
            });

            let uploadCover = req.files['cover'][0];
            console.log(uploadCover)
            let formatCover = uploadCover.originalname.split('.')[1];
            let pathCover = uploadCover.fieldname + '-' + Date.now() + '-' + uploadTrack.originalname.split('.')[0] + '.' + formatCover;

            fs.writeFile('./uploads/' + pathCover, uploadCover.buffer, function(err) {
                if (err) {
                    console.log('error', err);
                }
            });

            // TODO: delete latest ?

            // Get post by ID
            Models.streaming.findById( req.params.id )
            .then( streaming => {
                // Update streaming
                streaming.title = req.body.title;
                streaming.artist_name = req.body.artist_name;
                streaming.track = './uploads/' + pathTrack;
                streaming.cover = './uploads/' + pathCover;
                streaming.duration = req.body.duration;
                streaming.user = req.body.user;
                streaming.creationDate = new Date();
                streaming.dateModified = new Date();
                streaming.isPublished = req.body.isPublished;
                streaming.timestamps = req.body.timestamps;

                console.log('streaming', streaming);
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
             console.log('deleteOne', req.params.id)
             Models.streaming.findByIdAndDelete( req.params.id, (err, deleted) => {
                if( err ){ return reject(err) }
                else{ return resolve(deleted) };
            })
        });
    }

    const randomSelection = req => {
        return new Promise( (resolve, reject) => {
             // Random selection
             Models.streaming.aggregate[{$sample: { size: 1}}]
        });
    }

    const LastStreamings = req => {
        return new Promise( (resolve, reject) => {
             // Random selection
             Models.streaming.find().sort({ $natural: -1}).limit(10)
             .then( async data => {
                 let collection = [];
                 for( let item of data ){
                     collection.push( await readOne(item._id) )
                 }
                 return resolve(collection);
             })
             .catch( err => reject(err) )
        });
    }

/* 
Export controller methods
*/
    module.exports = {
        readAll,
        readOne,
        createOne,
        updateOne,
        deleteOne,
        randomSelection,
        LastStreamings
    }
//