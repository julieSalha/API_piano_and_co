/* 
Imports
*/
    const Models = require('../models/index');
    const bcrypt = require('bcryptjs');
    const { resolve } = require('path');
//

/*  
Controller methods
*/
    const register = req => {
        return new Promise( async (resolve, reject) => {
            // Encrypt yser password
            req.body.password = await bcrypt.hash( req.body.password, 10 );

            // TODO: encrypt RGPD data

            // Register new user
            Models.user.create( req.body )
            .then( data => resolve(data) )
            .catch( err => reject(err) );
        })
    }

    const login = (req, res) => {
        return new Promise( (resolve, reject) => {
            // Find user from email
            Models.user.findOne( { email: req.body.email }, (err, data) => {
                if( err || data === null ){ return reject('Email not found') }
                else{
                    // Check user password
                    const validatedPassword = bcrypt.compareSync( req.body.password, data.password );
                    if( !validatedPassword ){ return reject('Invalid password') }
                    else{
                        // Generate user JWT
                        const userJwt = data.generateJwt(data);
                        
                        // Set response cookie
                        res.cookie( process.env.COOKIE_NAME, userJwt, { maxAge: 700000, httpOnly: true } )

                        // Send user data
                        return resolve(data)
                    };
                }
            })
        })
    }

    // User account 
    const authMe = (req, res) => {
        const findUser = new Promise( (resolve, reject) => {
                // Find user id
                Models.user.findById( req.user._id, (err, data) => {
                    if( err || data === null ){ return reject('User not found') }
                    else{
                        // Send user data
                        return resolve(data)
                    }
                })
        });

        const findUserInerpretations = new Promise( (resolve, reject) => {
            // Find user interpretation(s)
            Models.streaming.find( { user: req.user._id }, (err, data) => {
                if( err || data === null ){ 
                    return reject('No streamings for this user') 
                }
                else{
                    return resolve(data)
                }
            })
        });

        const allPromises = Promise.all([findUser, findUserInerpretations])
        return allPromises;
    }

    // Log out
    const logout = (req, res) => {
        // Delete cookie
        res.clearCookie(process.env.COOKIE_NAME);
        req.logout();

        res.status(200).json({
            method: 'GET',
            route: `/`,
            data: null,
            error: null,
            status: 200
        });
    }
//

/* 
Export controller methods
*/
    module.exports = {
        register,
        login,
        authMe,
        logout
    }
//