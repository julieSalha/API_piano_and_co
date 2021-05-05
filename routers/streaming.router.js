/*
Imports
*/
    // Node
    const express = require('express');

    // Inner
    const Controllers = require('../controllers/index')
    const { checkFields } = require('../services/request.service');
    const Mandatory = require('../services/mandatory.service');
    const { renderSuccessVue, renderErrorVue, sendBodyError,sendFieldsError,sendApiSuccessResponse,sendApiErrorResponse } = require('../services/response.service');

    const multer = require('multer');
    const mongodb = require('mongodb');
    const MongoClient = require('mongodb').MongoClient;
    const ObjectID = require('mongodb').ObjectID;

    // Node.js dependencies
    const { Readable } = require('stream');
//

/*
Routes definition
*/
    class StreamingRouter {
        constructor( { passport } ){
            this.passport = passport
            this.router = express.Router(); 
        } 

        routes(){


            // CRUD: define route to create object
            this.router.post('/', this.passport.authenticate('user-rule', { session: false }), (req, res) => {
                console.log('post track', req.body);
                const storage = multer.memoryStorage();
                const upload = multer({ storage: storage, limits: { fields: 1, fileSize: 60000000000000000, files: 1, parts: 2 }});


                upload.single('file')(req, res, (err) => {
                    console.log('req.body.name', req.body.name);
                    //console.log('req.body.file', req.body.file);
                    
                    if (err) {
                        console.log('err', err);
                        return res.status(400).json({ message: "Upload Request Validation Failed" });
                    } else if(!req.body.name) {
                        //console.log('!req.body.name')
                        return res.status(400).json({ message: "No track name in request body" });
                    }

                    let trackName = req.body.name;
                    //console.log('trackName',trackName);
                    
                    // Covert buffer to Readable Stream
                    const readableTrackStream = new Readable();
                    readableTrackStream.push(req.file.buffer);
                    readableTrackStream.push(null);

                    //console.log('req', req.db)

                    // let bucket = new mongodb.GridFSBucket(db, {
                    //      bucketName: 'tracks'
                    // });

                    // console.log('bucket',bucket);
            
            //     // let uploadStream = bucket.openUploadStream(trackName);
            //     // let id = uploadStream.id;
            //     // readableTrackStream.pipe(uploadStream);
            
            //     // uploadStream.on('error', () => {
            //     //     return res.status(500).json({ message: "Error uploading file" });
            //     // });
            
            //     // uploadStream.on('finish', () => {
            //     //     return res.status(201).json({ message: "File uploaded successfully, stored under Mongo ObjectID: " + id });
            //     // });
            //     });


                });
                // Check body data
                // if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 ){ 
                //     return sendBodyError(`/api/${req.params.endpoint}`, 'POST', res, 'No data provided in the reqest body')
                // }
                // else {
                //     // Check body data
                //     const { ok, extra, miss } = checkFields( Mandatory[req.params.endpoint], req.body );

                //     // Error: bad fields provided
                //     if( !ok ){ 
                //         return sendFieldsError(`/api/${req.params.endpoint}`, 'POST', res, 'Bad fields provided', miss, extra) 
                //     }
                //     else{
                //         // Add author _id
                //         req.body.author = req.user._id;

                //         // Use the controller to create new object
                //         Controllers[req.params.endpoint].createOne(req)
                //         .then( apiResponse => sendApiSuccessResponse(`/api/${req.params.endpoint}`, 'POST', res, 'Request succeed', apiResponse) )
                //         .catch( apiError => sendApiErrorResponse(`/api/${req.params.endpoint}`, 'POST', res, 'Request failed', apiError) );
                //     }
                // }
            });

                        // /**
            //  * POST /tracks
            //  */
            // this.router.post('/', this.passport.authenticate('user-rule', { session: false, failureRedirect: '/' }) , (req, res) => {
            //     console.log('post track')
            //     const storage = multer.memoryStorage();
            //     console.log('storage',storage);
            //     const upload = multer({ storage: storage, limits: { fields: 1, fileSize: 6000000, files: 1, parts: 2 }});
            //     console.log('upload',upload);

            //     upload.single('track')(req, res, (err) => {
            //         console.log('req.body', req.body);
            //     if (err) {
            //         console.log('err', err);
            //         return res.status(400).json({ message: "Upload Request Validation Failed" });
            //     } else if(!req.body.name) {
            //         console.log('!req.body.name')
            //         return res.status(400).json({ message: "No track name in request body" });
            //     }
                
            //     let trackName = req.body.name;
            //     console.log('trackName',trackName);
                
            //     // Covert buffer to Readable Stream
            //     // const readableTrackStream = new Readable();
            //     // readableTrackStream.push(req.file.buffer);
            //     // readableTrackStream.push(null);
            
            //     // let bucket = new mongodb.GridFSBucket(db, {
            //     //     bucketName: 'tracks'
            //     // });
            
            //     // let uploadStream = bucket.openUploadStream(trackName);
            //     // let id = uploadStream.id;
            //     // readableTrackStream.pipe(uploadStream);
            
            //     // uploadStream.on('error', () => {
            //     //     return res.status(500).json({ message: "Error uploading file" });
            //     // });
            
            //     // uploadStream.on('finish', () => {
            //     //     return res.status(201).json({ message: "File uploaded successfully, stored under Mongo ObjectID: " + id });
            //     // });
            //     });
            // });
 
            // GET one track  /tracks/:trackID
            this.router.get('/:id', this.passport.authenticate('user-rule', { session: false }), (req, res) => {
                console.log('dbStream',dbStream);
                // Use the controller to get data
                // Controllers[req.params.endpoint].readAll()
                // .then( apiResponse => {
                //     sendApiSuccessResponse(`/api/${req.params.endpoint}`, 'GET', res, 'Request succeed', apiResponse)

                // })
                // .catch( apiError => {
                //     sendApiErrorResponse(`/api/${req.params.endpoint}`, 'GET', res, 'Request failed', apiError)
                // } );
            })
            // /**
            //  * GET /tracks/:trackID
            //  */
            // this.router.get('/:trackID', (req, res) => {
            //     try {
            //         const trackID = new ObjectID(req.params.trackID);
            //     } catch(err) {
            //         return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
            //     }
            //         res.set('content-type', 'audio/mp3');
            //         res.set('accept-ranges', 'bytes');
            
            //         let bucket = new mongodb.GridFSBucket(db, {
            //         bucketName: 'tracks'
            //         });
            
            //         let downloadStream = bucket.openDownloadStream(trackID);
            
            //         downloadStream.on('data', (chunk) => {
            //             res.write(chunk);
            //         });
                
            //         downloadStream.on('error', () => {
            //             res.sendStatus(404);
            //         });
                
            //         downloadStream.on('end', () => {
            //             res.end();
            //         });
            // });


  
            // app.listen(3005, () => {
            //     console.log("App listening on port 3005!");
            // });

            // // Define route home
            // this.router.get('/', this.passport.authenticate('user-rule', { session: false, failureRedirect: '/login' }), (req, res) => {
            //     Controllers.admin.adminMe(req, res)
            //     .then(apiResponse => {
            //         console.log('apiResponse me', apiResponse);
            //         renderSuccessVue('index', '/', 'GET', res, 'Request succeed', apiResponse)
            //     })
            //     .catch(apiError => renderErrorVue('index', '/login', 'GET', res, 'Request failed', apiError))
            // });
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


