/* 
Definition
*/
    const Mandatory = {
        artist: [ 'first_name', 'last_name', 'gender', 'date_of_birth', 'profile_picture', 'biography' ],
        admin_register: [ 'givenName', 'familyName', 'email', 'password' ],
        admin_login: ['email', 'password' ],
        comment: [ 'content', 'subjectOf', 'author' ],
        interpretation: [ 'title', 'artist_name', 'track', 'cover', 'duration', 'user'],
        key: [ 'key', 'name', 'chords'],
        login: [ 'email' , 'password'  ],
        like: [ 'potentialAction' , 'subjectOf', 'author' ],
        register: [ 'givenName', 'familyName', 'gender', 'date_of_birth', 'profile_picture', 'adress', 'biography', 'password', 'email' ],
        song: [ 'title', 'artist_name', 'url_song', 'key', 'chords', 'cover', 'duration', 'url_tabs', 'artist' ],
    } 
//

/* 
Export
*/ 
    module.exports = Mandatory;
//