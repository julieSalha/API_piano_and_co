/* 
Imports
*/
const Models = require('../models/index');
//

/* 
CRUD methods
*/

    const readAll = () => {
        return new Promise( (resolve, reject) => {
            Models.chord.find()
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
            Models.chord.findById( id )
            .exec( (err, data) => {
                if( err ){ return reject(err) }
                else{ return resolve(data) }
            })
        })
    }
//

//
/* 
Export controller methods
*/
    module.exports = {
        readAll
    }
//