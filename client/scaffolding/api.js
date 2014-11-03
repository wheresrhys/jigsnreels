'use strict';

// List of API URLs.
var URLs = {
  tunes: function () {
    return '/api/tunes';
  },
  // tune: function(id) {
  //   return '/api/tunes/'+ id;
  // },
  sets: function () {
    return '/api/sets';
  },
  performances: function (user) {
    return '/api/performances/' + user;
  }
};

// Helper for accessing the URL list. Think of it as something similar
// to Rails' URL helpers.
exports.url = function(type) {
  URLs[type] && URLs[type].apply(this, [].slice.call(arguments, 1));
};