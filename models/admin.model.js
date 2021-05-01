/*
Import
*/
    const mongoose = require('mongoose');
    const { Schema } = mongoose;
    const jwt = require('jsonwebtoken');
    const keys = require("../services/keys");
//

/*
Definition
*/
    const MySchema = new Schema({
        // Schema.org
        '@context': { type: String, default: 'http://schema.org' },
        '@type': { type: String, default: 'Person' },

        givenName: { type: String, required:true },
        familyName: String,
        // Définir une valeur de propriété unique
        email: { unique: true, type: String, required:true },
        password:{ type: String, required:true },

        // Définir une valeur par défaut
        creationDate: { type: Date, default: new Date() },
        banished: { type: Boolean, default: false },
        timestamps: Date // Moogoose use : createAt updateAt
    })
//

/* 
Methods
*/
    MySchema.methods.generateJwt = user => {
        // Set expiration
        const expiryToken = new Date();
        expiryToken.setDate( expiryToken.getDate() + 59 );

        // Set token
        const jwtObject = {
            _id: user._id,
            email: user.email,
            password: user.password,
            banished: user.banished,
            
            // Set timeout
            expireIn: '10s',
            exp: parseInt( expiryToken.getTime() / 100, 10 )
        }

        // Retunr JWT
        return jwt.sign( jwtObject, keys.secretOrKey );
    }
//

/* 
Export
*/
    module.exports = mongoose.model('admin', MySchema)
//