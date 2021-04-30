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
            // Use Models to create new playlist
            Models.playlist.create( req.body )
            .then( data => resolve(data) )
            .catch( err => reject(err) )
        })
    }

    const readAll = () => {
        return new Promise( (resolve, reject) => {
            Models.playlist.find()
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
            Models.playlist.findById( id )
            .exec( (err, data) => {
                if( err ){ return reject(err) }
                else{ return resolve(data) }
            })
        })
    }

    const updateOne = req => {
        return new Promise( (resolve, reject) => {
            // Get post by ID
            Models.playlist.findById( req.params.id )
            .then( playlist => {
                // Update playlist
                playlist.title = req.body.title;
                playlist.description = req.body.description;
                playlist.numTracks = req.body.numTracks;
                playlist.tracksID = req.body.tracksID;
                playlist.tracksTitle = req.body.tracksTitle;
                playlist.tracksArtistID = req.body.tracksArtistID;
                playlist.tracksArtistName = req.body.tracksArtistName;
                playlist.creationDate = new Date();
                playlist.timestamps = req.body.timestamps;

                // Save playlist changes
                playlist.save()
                .then( updatedplaylist => resolve(updatedplaylist) )
                .catch( updateError => reject(updateError) )
            })
            .catch( err => reject(err) )
        })
    }

    const deleteOne = req => {
        return new Promise( (resolve, reject) => {
             // Delete object
             Models.playlist.findByIdAndDelete( req.params.id, (err, deleted) => {
                if( err ){ return reject(err) }
                else{ return resolve(deleted) };
            })
        });
    }
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