/* 
Definition
*/
    const Controllers = {
        admin           : require('./admin.controller'),
        auth            : require('./auth.controller'),
        comment         : require('./comment.controller'),
        chord           : require('./chord.controller'),
        interpretation  : require('./interpretation.controller'),
        like            : require('./like.controller'),
        streaming       : require('./streaming.controller')
    }
//

/*  
Export
*/
    module.exports = Controllers;
//