/*
Import
*/
    const mongoose = require('mongoose');
    const { Schema } = mongoose;
//

/*
Definition
*/
    const MySchema = new Schema({
        // Schema.org
        '@context': { type: String, default: 'http://schema.org' },
        '@type': { type: String, default: 'MusicPlaylist' },

        //IDUser: Number,
        title: String,
        description: String,
        numTracks: Number,
        tracksID: [Number],
        tracksTitle: [String],
        tracksArtistID: [Number],
        tracksArtistName: [String],

        // Définir une valeur par défaut
        creationDate: { type: Date, default: new Date() },
        timestamps: Date // Moogoose use : createAt updateAt
    })
//

/* 
Export
*/
    module.exports = mongoose.model('playlist', MySchema)
//