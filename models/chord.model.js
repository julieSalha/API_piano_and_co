/*
Import
*/
    const mongoose = require('mongoose');
    const { Schema } = mongoose;
//

/*
Definition
});
*/
    const MySchema = new Schema({
        // Schema.org
        '@context': { type: String, default: 'http://schema.org' },
        '@type': { type: String, default: 'musicalKey' },

        key:{ type: String, required:true },
        name:{ type: String, required:true },
        chords:{
            type: [
                {
                    params: {
                        roman: {
                            type: String,
                            required: true,
                        },
                        array: [String]
                    }
                }
            ]
        },

        // Default values
        creationDate: { type: Date, default: new Date() },
        dateModified: { type: Date, default: new Date() },
        timestamps: Date // Moogoose use : createAt updateAt,
    })
//

/* 
Export
*/
    module.exports = mongoose.model('chord', MySchema)
//