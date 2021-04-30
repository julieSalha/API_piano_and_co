/*
Imports
*/
    // Node
    const express = require('express');

    // Inner
    const { checkFields } = require('../services/request.service');
    const Mandatory = require('../services/mandatory.service');
    const { sendBodyError,sendFieldsError,sendApiSuccessResponse,sendApiErrorResponse } = require('../services/response.service')

    // Import controllers
    const Controllers = require('../controllers/index')
//

/*
Routes definition
*/
    class ApiRouter {
        constructor( { passport } ){
            this.router = express.Router(); 
            this.passport = passport
        }

        routes(){

            // Define index route
            this.router.get('/', (req, res) => {
                // Return API definition
                return res.json({ defintion: 'TODO: add API definition' })
            })

            // CRUD: define route to create object
            this.router.post('/:endpoint', this.passport.authenticate('user-rule', { session: false }), (req, res) => {
                // Check body data
                if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 ){ 
                    return sendBodyError(`/api/${req.params.endpoint}`, 'POST', res, 'No data provided in the reqest body')
                }
                else{
                    // Check body data
                    const { ok, extra, miss } = checkFields( Mandatory[req.params.endpoint], req.body );

                    // Error: bad fields provided
                    if( !ok ){ 
                        return sendFieldsError(`/api/${req.params.endpoint}`, 'POST', res, 'Bad fields provided', miss, extra) 
                    }
                    else{
                        // Add author _id
                        req.body.author = req.user._id;

                        // Use the controller to create new object
                        Controllers[req.params.endpoint].createOne(req)
                        .then( apiResponse => sendApiSuccessResponse(`/api/${req.params.endpoint}`, 'POST', res, 'Request succeed', apiResponse) )
                        .catch( apiError => sendApiErrorResponse(`/api/${req.params.endpoint}`, 'POST', res, 'Request failed', apiError) );
                    }
                }
            })
 
            // CRUD: define route to read all objects
            this.router.get('/:endpoint', (req, res) => {
                // Use the controller to get data
                Controllers[req.params.endpoint].readAll()
                .then( apiResponse => {
                    sendApiSuccessResponse(`/api/${req.params.endpoint}`, 'GET', res, 'Request succeed', apiResponse)

                })
                .catch( apiError => {
                    sendApiErrorResponse(`/api/${req.params.endpoint}`, 'GET', res, 'Request failed', apiError)
                } );
            })
 
            // CRUD: define route to read one object
            this.router.get('/:endpoint/:id', (req, res) => {
                // Use the controller to get data
                Controllers[req.params.endpoint].readOne(req.params.id)
                .then( apiResponse => {
                    sendApiSuccessResponse(`/api/${req.params.endpoint}/${req.params.id}`, 'GET', res, 'Request succeed', apiResponse)
                } )
                .catch( apiError => sendApiErrorResponse(`/api/${req.params.endpoint}/${req.params.id}`, 'GET', res, 'Request failed', apiError) );
            })

            // CRUD: define route to update one object
            this.router.put('/:endpoint/:id', this.passport.authenticate('user-rule', { session: false }), (req, res) => {
                // Check body data
                if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 ){ 
                    return sendBodyError(`/api/${req.params.endpoint}/${req.params.id}`, 'PUT', res, 'No data provided in the reqest body')
                }
                else{
                    // Check body data
                    const { ok, extra, miss } = checkFields( Mandatory[req.params.endpoint], req.body );

                    // Error: bad fields provided
                    if( !ok ){ return sendFieldsError(`/api/${req.params.endpoint}/${req.params.id}`, 'PUT', res, 'Bad fields provided', miss, extra) }
                    else{

                        // Use the controller to update data
                        Controllers[req.params.endpoint].updateOne(req)
                        .then( apiResponse => sendApiSuccessResponse(`/api/${req.params.endpoint}/${req.params.id}`, 'PUT', res, 'Request succeed', apiResponse) )
                        .catch( apiError => sendApiErrorResponse(`/api/${req.params.endpoint}/${req.params.id}`, 'PUT', res, 'Request failed', apiError) );
                    }
                }
            })

            // CRUD: define route to delete one object
            this.router.delete('/:endpoint/:id', this.passport.authenticate('user-rule', { session: false }), (req, res) => {
                // Use the controller to delete data
                Controllers[req.params.endpoint].deleteOne(req)
                .then( apiResponse => sendApiSuccessResponse(`/api/${req.params.endpoint}/${req.params.id}`, 'DELETE', res, 'Request succeed', apiResponse) )
                .catch( apiError => sendApiErrorResponse(`/api/${req.params.endpoint}/${req.params.id}`, 'DELETE', res, 'Request failed', apiError) );
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
    module.exports = ApiRouter;
//