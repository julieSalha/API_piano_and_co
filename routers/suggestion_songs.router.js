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
                    // SONGS SUGGESTER HOOK THEORY
                    const songs = await axios.get(process.env.HOOK_THEORY_API_SONGS + req.query.song, {
                        headers: {
                            Authorization: 'Bearer 7711e8fd721d77c53937f86b593ff8c8',
                            'content-type': 'text/json'
                        }
                    });
                    // Success 🎉
                    const arraySongs = songs.data;
                    res.json(arraySongs);

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