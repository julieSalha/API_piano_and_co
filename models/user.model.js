/*
Import
*/
    const mongoose = require('mongoose');
    const { Schema } = mongoose;
    const jwt = require('jsonwebtoken');
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
        gender: { type: String, enum: ["male", "female", "other"], required:true},
        date_of_birth: {type: Date ,default: Date.now},
        profile_picture: { type: String, required:true},
        adress: {type: String},
        biography: String,
        password:{ type: String, required:true },

        // Définir une valeur de propriété unique
        email: { unique: true, type: String, required:true },

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
        return jwt.sign( jwtObject, process.env.JWT_SECRET );
    }
//

/* 
Export
*/
    module.exports = mongoose.model('user', MySchema)
//