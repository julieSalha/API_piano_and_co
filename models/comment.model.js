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
        '@type': { type: String, default: 'Comment' },
        
        content:{ type: String, required: true },
        // Associate the interpretation
        subjectOf: {
            type: Schema.Types.ObjectId,
            ref: 'interpretation'
        },
        // Associate the user profil 
        author: {
            type: Schema.Types.ObjectId,
            ref: 'user'
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
    module.exports = mongoose.model('comment', MySchema)
//