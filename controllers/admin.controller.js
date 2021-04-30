/* 
Imports
*/
    const Models = require('../models/index');
    const bcrypt = require('bcryptjs');

//

/*  
Controller methods
*/
    const register = req => {
        return new Promise( async (resolve, reject) => {
            // Encrypt yser password
            req.body.password = await bcrypt.hash( req.body.password, 10 );

            // TODO: encrypt RGPD data

            // Register new admin
            Models.admin.create( req.body )
            .then( data => {
                resolve(data) 
            })
            .catch( err => reject(err) );
        })
    }

    const login = (req, res) => {
        return new Promise( (resolve, reject) => {
            // Find admin from email
            Models.admin.findOne( { email: req.body.email }, (err, data) => {
                if( err || data === null ){ 
                    return reject('Email not found') }
                else{
                    // Check admin password
                    const validatedPassword = bcrypt.compareSync( req.body.password, data.password );
                    if( !validatedPassword ){ 
                        return reject('Invalid password') }
                    else{
                        // Generate admin JWT
                        const adminJwt = data.generateJwt(data);
                        
                        // Set response cookie
                        res.cookie( process.env.COOKIE_NAME, adminJwt, { maxAge: 700000, httpOnly: true } )

                        // Send admin data
                        return resolve(data)
                    };
                }
            })
        })
    }


    const readTrack = id => {
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

    // Admin account 
    const adminMe = (req, res) => {
        const adminSpace = new Promise( (resolve, reject) => {
            // Find user id
            Models.admin.findById( req.user._id, (err, data) => {
                if( err || data === null ){ return reject('Admin not found') }
                else{
                    // Send user data
                    return resolve(data)
                }
            })
        });

        const interpretationList = new Promise( (resolve, reject) => {
            Models.interpretation.find()
            .then( async data => {
                let collection = [];
                for( let item of data ){
                    collection.push( await readTrack(item._id) )
                }
                // Return populated data
                return resolve(collection);
            })
            .catch( err => reject(err) )
        })

        const allPromises = Promise.all([ adminSpace, interpretationList])
        return allPromises;
    }

    // Actions admin
    const createLike = req => {
        return new Promise( (resolve, reject) => {
            // Use Models to create new like
            Models.like.create( req.body )
            .then( data => resolve(data) )
            .catch( err => reject(err) )
        })
    }

    const deleteLike = req => {
        return new Promise( (resolve, reject) => {
             // Delete object
             Models.like.findByIdAndDelete( req.params.id, (err, deleted) => {
                if( err ){ return reject(err) }
                else{ return resolve(deleted) };
            })
        });
    }

    const createComment = req => {
        return new Promise( (resolve, reject) => {
            // Use Models to create new comment
            Models.comment.create( req.body )
            .then( data => resolve(data) )
            .catch( err => reject(err) )
        })
    }

    const deleteComment = req => {
        return new Promise( (resolve, reject) => {
             // Delete object
             Models.comment.findByIdAndDelete( req.params.id, (err, deleted) => {
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
        register,
        login,
        adminMe,
        createLike,
        deleteLike,
        createComment,
        deleteComment
    }
//