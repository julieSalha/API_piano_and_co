/* 
Import
*/
    // NPM moodules
    const mongoose = require('mongoose'); //=> https://www.npmjs.com/package/mongoose
//

/*  
Define class
*/
    class MONGOClass { 
        constructor(){
            // Set MongoDB url
            this.mongoUrl = process.env.MONGO_URL;
        };

        connectDb(){
            return new Promise( (resolve, reject) => {
                mongoose.connect(this.mongoUrl || 'mongodb://127.0.0.1:27017/api-piano', { useNewUrlParser: true, useUnifiedTopology: true })
                .then(resolve('connected to mongodb..'))
                .catch( dbErr => reject(`MongoDB not connected`, dbErr) )
            });
        };
    };
//

/* 
Export class
*/
    module.exports = MONGOClass;
//