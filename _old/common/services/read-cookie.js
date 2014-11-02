'use strict';

/* istanbul ignore next: copied */ 
module.exports = function readCookie (name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            /* istanbul ignore next: copied */ 
            c = c.substring(1,c.length);
        }
        /* istanbul ignore if: copied */ 
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length,c.length);
        }
    }
    return null;
};