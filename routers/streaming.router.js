/*
Imports
*/
    const mongoose = require('mongoose');
    // Node
    const express = require('express');

    // Inner
    const { sendBodyError,sendFieldsError,sendApiSuccessResponse,sendApiErrorResponse } = require('../services/response.service')

    // Import multer
    const multer = require('multer');

    // Import controllers
    const Controllers = require('../controllers/index')
//

/*
Routes definition
*/
    class StreamingRouter {
        constructor( { passport } ){
            this.router = express.Router(); 
            this.passport = passport

            this.connect = mongoose.createConnection(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
            this.gfs;
            this.connect.once('open', () => {
                this.gfs = new mongoose.mongo.GridFSBucket(this.connect.db, {
                    bucketName: 'uploads'
                });
            });
            // this.storage = multer.diskStorage({
            //     destination: function(req, file, cb) {
            //         cb(null, './uploads')
            //     },
            //     filename: function(req, file, cb) {
            //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            //         cb(null, file.fieldname + '-' + uniqueSuffix)
            //     }
            // },{

            // })

            this.storage = multer.memoryStorage();

            this.upload = multer({ storage: this.storage, dest: './uploads' });
            this.allUpload = this.upload.fields([{name: 'track', maxCount: 1}, {name: 'cover', maxCount: 1}])
        }

        routes(){

            // CRUD: define route to create streaming
            this.router.post('/', this.passport.authenticate('user-rule', { session: false }), this.allUpload, (req, res, next) => {
                // Check body data
                if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 || typeof req.files === 'undefined' || req.files === null ){ 
                    return sendBodyError(`/upload`, 'POST', res, 'No data provided in the reqest body')
                }
                else {
                    // Add author _id
                    req.body.author = req.user._id;
                    
                    Controllers.streaming.createOne(req, this.gfs)
                    .then( apiResponse => sendApiSuccessResponse(`/upload`, 'POST', res, 'Request succeed', apiResponse) )
                    .catch( apiError => sendApiErrorResponse(`/upload`, 'POST', res, 'Request failed', apiError) );
                }
            })
 
            // // CRUD: define route to read all streamings
            this.router.get('/', (req, res) => {
                // Use the controller to get data
                Controllers.streaming.readAll()
                .then( apiResponse => {
                    sendApiSuccessResponse(`/upload`, 'GET', res, 'Request succeed', apiResponse)

                })
                .catch( apiError => {
                    sendApiErrorResponse(`/upload`, 'GET', res, 'Request failed', apiError)
                } );
            })
 
            // CRUD: define route to read one object
            this.router.get('/:id', (req, res) => {
                // Use the controller to get data
                Controllers.streaming.readOne(req.params.id)
                .then( apiResponse => {
                    sendApiSuccessResponse(`/upload/${req.params.id}`, 'GET', res, 'Request succeed', apiResponse)
                } )
                .catch( apiError => sendApiErrorResponse(`/upload/${req.params.id}`, 'GET', res, 'Request failed', apiError) );
            })

            // CRUD: define route to update one object
            this.router.put('/:id', this.passport.authenticate('user-rule', { session: false }), this.allUpload, (req, res) => {
                // Check body data
                console.log('req body', req.body)
                console.log('req files', req.files)
                if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 || typeof req.files === 'undefined' || req.files === null ){ 
                    return sendBodyError(`/upload/${req.params.id}`, 'PUT', res, 'No data provided in the reqest body')
                }
                else{
                    // Use the controller to update data
                    Controllers.streaming.updateOne(req)
                    .then( apiResponse => sendApiSuccessResponse(`/upload/${req.params.id}`, 'PUT', res, 'Request succeed', apiResponse) )
                    .catch( apiError => sendApiErrorResponse(`/upload/${req.params.id}`, 'PUT', res, 'Request failed', apiError) );
                }
            })

            // CRUD: define route to delete one object
            this.router.delete('/:id', this.passport.authenticate('user-rule', { session: false }), (req, res) => {
                // Use the controller to delete data
                Controllers.streaming.deleteOne(req)
                .then( apiResponse => sendApiSuccessResponse(`/upload/${req.params.id}`, 'DELETE', res, 'Request succeed', apiResponse) )
                .catch( apiError => sendApiErrorResponse(`/upload/${req.params.id}`, 'DELETE', res, 'Request failed', apiError) );
            })
        }

        init(){
            // Get route fonctions
            this.routes();

            // Sendback router
            return this.router;
        };
    }
//

/*
Export
*/
    module.exports = StreamingRouter;
//

