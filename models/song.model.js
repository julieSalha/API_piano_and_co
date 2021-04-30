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
        '@type': { type: String, default: 'Track' },

        title:{ type: String, required:true },
        artist_name:{ type: String, required:true },
        url_song:{ type: String, required:true },
        key:{ type: String, required:true },
        chords:{ type: [Number], required:true },
        cover:{ type: String, required:true },
        duration:{ type: String, required:true },
        url_tabs:{ type: String, required:true },

        // Associer le profil artist
        artist: {
            type: Schema.Types.ObjectId,
            ref: 'artist'
        },

        // Définir une valeur par défaut
        creationDate: { type: Date, default: new Date() },
        dateModified: { type: Date, default: new Date() },
        isPublished: { type: Boolean, default: false },
        timestamps: Date // Moogoose use : createAt updateAt,
    })
//

/* 
Export
*/
    module.exports = mongoose.model('song', MySchema)
//