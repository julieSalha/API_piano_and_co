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
            // Use Models to create new user
            Models.user.create( req.body )
            .then( data => resolve(data) )
            .catch( err => reject(err) )
        })
    }

    const readAll = () => {
        return new Promise( (resolve, reject) => {
            Models.user.find()
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
            Models.user.findById( id )
            .exec( (err, data) => {
                if( err ){ return reject(err) }
                else{ return resolve(data) }
            })
        })
    }

    const updateOne = req => {
        return new Promise( (resolve, reject) => {
            // Get post by ID
            Models.user.findById( req.params.id )
            .then( user => {
                // Update user
                user.givenName = req.body.givenName;
                user.familyName = req.body.familyName;
                user.gender = req.body.gender;
                user.date_of_birth = req.body.date_of_birth;
                user.profile_picture = req.body.profile_picture;
                user.adress = req.body.adress;
                user.biography = req.body.biography;
                user.password = req.body.password;
                user.email = req.body.email;
                user.creationDate = new Date();
                user.banished = req.body.banished;
                user.timestamps = req.body.timestamps;

                // Save post changes
                user.save()
                .then( updateduser => resolve(updateduser) )
                .catch( updateError => reject(updateError) )
            })
            .catch( err => reject(err) )
        })
    }

    const deleteOne = req => {
        return new Promise( (resolve, reject) => {
             // Delete object
             Models.user.findByIdAndDelete( req.params.id, (err, deleted) => {
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