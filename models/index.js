/* 
Definition
*/
    const Models = {
        admin           : require('./admin.model'),
        chord           : require('./chord.model'),
        comment         : require('./comment.model'),
        interpretation  : require('./interpretation.model'),
        like            : require('./like.model'),
        playlist        : require('./playlist.model'),
        song            : require('./song.model'),
        streaming       : require('./streaming.model'),
        user            : require('./user.model')
    } 
//

/* 
Export
*/
    module.exports = Models;
// 