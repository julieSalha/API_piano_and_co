  
/* 
Imports
*/
    // NPM modules
    require('dotenv').config(); //=> https://www.npmjs.com/package/dotenv
    const express = require('express'); //=> https://www.npmjs.com/package/express
    const bodyParser = require('body-parser'); //=> https://www.npmjs.com/package/body-parser
    const cookieParser = require('cookie-parser'); //=> https://www.npmjs.com/package/cookie-parser
    const passport = require('passport'); //=> https://www.npmjs.com/package/passport
    const path = require('path'); //=> https://www.npmjs.com/package/path
    const cors = require('cors'); //=> https://www.npmjs.com/package/cors
    const session = require('express-session'); //=> https://www.npmjs.com/package/express-session

    // Services
    const MONGOclass = require('./services/mongo.class');

    // Streaming
    const methodOverride = require('method-override');
    const multer = require('multer');
    const GridFsStorage = require('multer-gridfs-storage');
    const crypto = require('crypto');

//

/*
Server class
*/
class ServerClass{
    constructor(){
        this.server = express();
        this.port = process.env.PORT;
        this.MongoDB = new MONGOclass;
    }

    init(){
        // Set CORS
        this.server.use( (req, res, next) => {
        // Define allowed origins
        const allowedOrigins = process.env.ALLOWED_ORIGINS.split(', ');
        const origin = req.headers.origin;

        // Setup CORS
        if(allowedOrigins.indexOf(origin) > -1){ res.setHeader('Access-Control-Allow-Origin', origin)}
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Methods', ['GET', 'PUT', 'POST', 'DELETE', 'POST']);
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

        // Use next() function to continue routing
        next();
        });

        // Set server view engine
        this.server.set( 'view engine', 'ejs' );

        // Static path configuration
        this.server.set( 'views', __dirname + '/www' );
        this.server.use( express.static(path.join(__dirname, 'www')) );

        //=> Body-parser
        this.server.use(bodyParser.json({limit: '1000000000mb'}));
        this.server.use(bodyParser.urlencoded({ extended: true }));

        //=> Use CookieParser to setup serverside cookies
        this.server.use(cookieParser(process.env.COOKIE_SECRET));

        // Start server configuration
        this.config();
    }

    config(){
        // Set authentication
        const { setAuthentication } = require('./services/auth.service');
        setAuthentication(passport);

        // Set AUTH router
        const AuthRouterClass = require('./routers/auth.router');
        const authRouter = new AuthRouterClass( { passport } );
        this.server.use('/auth', authRouter.init());

        // Set API router
        const ApiRouterClass = require('./routers/api.router');
        const apiRouter = new ApiRouterClass( { passport } );
        this.server.use('/api', apiRouter.init());

        // Set backend router
        const BackendRouterClass = require('./routers/backend.router')
        const backendRouter = new BackendRouterClass( { passport } );
        this.server.use('/', backendRouter.init());

        // Set Suggestion router (Chords)
        const ChordSuggestionRouterClass = require('./routers/suggestion_chords.router');
        const chordSuggestionRouter = new ChordSuggestionRouterClass( { passport } );
        this.server.use('/suggest_chord', chordSuggestionRouter.init());

        // Set Suggestion router (Songs)
        const SongSuggestionRouterClass = require('./routers/suggestion_songs.router');
        const songSuggestionRouter = new SongSuggestionRouterClass( { passport } );
        this.server.use('/suggest_song', songSuggestionRouter.init());

        // Streaming files router
        const streamingFilesRouterClass = require('./routers/streaming.router');
        const streamingFilesRouter = new streamingFilesRouterClass( { passport } );
        this.server.use('/upload', streamingFilesRouter.init());

        /* 
        GridFs Configuration
        */

        // create storage engine
        const storage = new GridFsStorage({
            url: process.env.MONGO_URL,
            file: (req, file) => {
                return new Promise((resolve, reject) => {
                    crypto.randomBytes(16, (err, buf) => {
                        if (err) {
                            return reject(err);
                        }
                        const filename = buf.toString('hex') + path.extname(file.originalname);
                        const fileInfo = {
                            filename: filename,
                            bucketName: 'uploads'
                        };
                        resolve(fileInfo);
                    });
                });
            }
        });

        const upload = multer({ storage });

        // Launch server
        this.launch();
    }

    launch(){
        // Start MongoDB connection
        this.MongoDB.connectDb()
        .then( db => {
            // Start server
            this.server.listen(this.port, () => {
                console.log({
                    node: `http://localhost:${this.port}`,
                    mongo: db.url,
                });
            });
        })
        .catch( dbErr => console.log('MongoDB Error', dbErr));
    }
}
//

/* 
Start server
*/
    const NODEapi_boilerplate = new ServerClass();
    NODEapi_boilerplate.init();
//