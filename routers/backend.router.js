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
//

/*
Routes definition
*/
    class BackendRouter {
        constructor( { passport } ){
            this.passport = passport
            this.router = express.Router(); 
        } 

        routes(){
            // Define route home
            this.router.get('/', this.passport.authenticate('admin-rule', { session: false, failureRedirect: '/login' }), (req, res) => {
                Controllers.admin.adminMe(req, res)
                .then(apiResponse => {
                    console.log('apiResponse me', apiResponse);
                    renderSuccessVue('index', '/', 'GET', res, 'Request succeed', apiResponse)
                })
                .catch(apiError => renderErrorVue('index', '/login', 'GET', res, 'Request failed', apiError))
            });

            // Define route login
            this.router.get('/login', (req, res) => {
                renderSuccessVue('login', '/login', 'GET', res, 'Request succeed', null)
            });

            // AUTH ADMIN: Register
            this.router.post('/register', async (req, res) => {
                // Check body data
                if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 ){ 
                    return sendBodyError('/auth/register', 'POST', res, 'No data provided in the reqest body')
                }
                else{
                    // Check body data
                    const { ok, extra, miss } = checkFields( Mandatory.admin_register, req.body );

                    // Error: bad fields provided
                    if( !ok ){ 
                        return renderErrorVue('index', '/login', 'POST', res, 'Bad fields provided', { extra, miss }) }
                    else{
                        Controllers.admin.register(req)
                        .then( data => {
                            // TODO: send validation email
                            return renderSuccessVue('login', '/login', 'GET', res, 'Admin registered, login', data, true);
                        } )
                        .catch( err => {
                            return renderErrorVue('login', '/login', 'GET', res, 'Admin not registered', err, false);
                        });
                    }
                }
            })

            // // AUTH ADMIN login route
            this.router.post('/login', (req, res) => {
                // Check body data
                if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 ){ 
                    return res.render('index', { err: 'No data provided in the reqest body', data: null })
                }
                else{
                    // Check body data
                    const { ok, extra, miss } = checkFields( Mandatory.login, req.body );

                    // Error: bad fields provided
                    if( !ok ){ 
                        return renderErrorVue('index', '/login', 'POST', res, 'Bad fields provided', { extra, miss }) }
                    else{
                        Controllers.admin.login(req, res)
                        .then( data => {
                            return renderSuccessVue('/', '/', 'GET', res, 'User loged', data, true)
                        })
                        .catch( err => {
                            return renderErrorVue('index', '/login', 'GET', res, 'User not loged', err, true);
                        } );
                    }
                }
            })

            // Actions admin

            // Likes
            this.router.post('/like', this.passport.authenticate('admin-rule', { session: false }), (req, res) => {
                // Check body data
                if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 ){ 
                    return sendBodyError(`/api/like`, 'POST', res, 'No data provided in the reqest body')
                }
                else{
                    // Check body data
                    const { ok, extra, miss } = checkFields( Mandatory.like, req.body );

                    // Error: bad fields provided
                    if( !ok ){ 
                        return sendFieldsError(`/api/like`, 'POST', res, 'Bad fields provided', miss, extra) 
                    }
                    else{
                        // Add author _id
                        req.body.author = req.user._id;

                        // Use the controller to create new object
                        Controllers.admin.createLike(req)
                        .then( apiResponse => sendApiSuccessResponse(`/api/like`, 'POST', res, 'Request succeed', apiResponse) )
                        .catch( apiError => sendApiErrorResponse(`/api/like`, 'POST', res, 'Request failed', apiError) );
                    }
                }
            })

            this.router.delete('/like/:id', this.passport.authenticate('admin-rule', { session: false }), (req, res) => {
                // Use the controller to delete data
                Controllers.admin.deleteLike(req)
                .then( apiResponse => sendApiSuccessResponse(`/api/like/${req.params.id}`, 'DELETE', res, 'Request succeed', apiResponse) )
                .catch( apiError => sendApiErrorResponse(`/api/like/${req.params.id}`, 'DELETE', res, 'Request failed', apiError) );
            })

            // Comments
            this.router.post('/comment', this.passport.authenticate('admin-rule', { session: false }), (req, res) => {
                // Check body data
                if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 ){ 
                    return sendBodyError(`/api/comment`, 'POST', res, 'No data provided in the reqest body')
                }
                else{
                    // Check body data
                    const { ok, extra, miss } = checkFields( Mandatory.comment, req.body );

                    // Error: bad fields provided
                    if( !ok ){ 
                        return sendFieldsError(`/api/comment`, 'POST', res, 'Bad fields provided', miss, extra) 
                    }
                    else{
                        // Add author _id
                        req.body.author = req.user._id;

                        // Use the controller to create new object
                        Controllers.admin.createComment(req)
                        .then( apiResponse => sendApiSuccessResponse(`/api/comment`, 'POST', res, 'Request succeed', apiResponse) )
                        .catch( apiError => sendApiErrorResponse(`/api/comment`, 'POST', res, 'Request failed', apiError) );
                    }
                }
            })

            this.router.delete('/comment/:id', this.passport.authenticate('admin-rule', { session: false }), (req, res) => {
                // Use the controller to delete data
                Controllers.admin.deleteComment(req)
                .then( apiResponse => sendApiSuccessResponse(`/api/comment/${req.params.id}`, 'DELETE', res, 'Request succeed', apiResponse) )
                .catch( apiError => sendApiErrorResponse(`/api/comment/${req.params.id}`, 'DELETE', res, 'Request failed', apiError) );
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
    module.exports = BackendRouter;
//