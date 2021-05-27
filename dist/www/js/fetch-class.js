/******/ (() => { // webpackBootstrap
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";/************************************************************************/
var __webpack_exports__ = {};
class FETCHrequest {
    constructor(url, requestType, data = null) {
        this.url = url;
        this.requestType = requestType;
        this.data = data;

        this.fetchOptions = {
            method: requestType,
            credentials : 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if( this.requestType === 'POST' || this.requestType === 'PUT' || this.requestType === 'DELETE'){
            this.fetchOptions.body = JSON.stringify(data);
        };
    }
    sendRequest(){
        return new Promise( (resolve, reject) => {
            fetch( this.url, this.fetchOptions )
            .then( fetchResponse => {
                if( fetchResponse.ok ){
                    return fetchResponse.json();
                }
                else{
                    return fetchResponse.json()
                    .then( message => reject(message) )
                };
            })
            .then( jsonData => resolve(jsonData))
            .catch( jsonError => reject(jsonError));
        })
    }
}
module.exports = __webpack_exports__;
/******/ })()
;