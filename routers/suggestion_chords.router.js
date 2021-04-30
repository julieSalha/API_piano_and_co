/*
Imports
*/
    // Node
    const express = require('express');

    // Axios
    const axios = require('axios');
//

/*
Routes definition
*/
    class RouterClass {
        constructor(){
            this.router = express.Router(); 
        }

        routes(){
            
            this.router.get('/', async (req, res) => {
                try {
                    // CHORDS SUGGESTER HOOK THEORY
                    const response = await axios.get(process.env.HOOK_THEORY_API_NODES + req.query.chord, {
                        headers: {
                            Authorization: 'Bearer 7711e8fd721d77c53937f86b593ff8c8',
                            'content-type': 'text/json'
                        }
                    });
                    // Success 🎉
                    const arrayChords = response.data;
                    res.json(arrayChords);

                } catch (error) {
                    console.log(this.error);
                }
            });
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
    module.exports = RouterClass;
//