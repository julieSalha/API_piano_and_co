/* 
Imports
*/
    const JwtStrategy = require('passport-jwt').Strategy;
    const UserModel = require('../models/user.model');
    const AdminModel = require('../models/admin.model');
    const keys = require("./keys");
//

/* 
Methods
*/
    // Extract token from cookie
    const cookieExtractor = (req, res) => {
        let token = null;
        if( req && req.cookies){ 
            token = req.cookies[process.env.COOKIE_NAME];
        }
        return token;
    }


    // JWT authentication user
    const authJwt = passport => {
        // JWT options for passport
        const opts = {
            jwtFromRequest: cookieExtractor, 
            secretOrKey: keys.secretOrKey
        }

        // JWT strategy
        passport.use('user-rule', new JwtStrategy(opts, (jwtPayload, done) => {
            UserModel.findOne({ _id: jwtPayload._id }, (err, admin) => {
                if (err) { 
                    return done(err, false)
                }
                if (admin) { 
                    return done(null, admin) 
                }
                else { return done(null, false) }
            });
        })); 

        passport.use('admin-rule', new JwtStrategy(opts, (jwtPayload, done) => {
            AdminModel.findOne({ _id: jwtPayload._id }, (err, admin) => {
                if (err) { 
                    return done(err, false)
                }
                if (admin) { 
                    return done(null, admin) 
                }
                else { return done(null, false) }
            });
        })); 
    }
//

/* 
Export
*/
    module.exports = {
        setAuthentication: (passport) => {
            authJwt(passport);   
        }
    }
//