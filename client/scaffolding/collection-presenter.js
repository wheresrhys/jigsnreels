// A generic presenter object for Backbone.Model
// =============================================

// presenter = new CollectionPresenter({collection: collection});
function CollectionPresenter (options) {
  if (!(this instanceof CollectionPresenter)) return (new CollectionPresenter(options));
  var options = options ? options : {};
  this.collection = options.collection;
  this.construct && this.construct();
}



// Pass a template object and it’ll output it with the presenter’s
// collection attributes.
CollectionPresenter.prototype.partial = function(name) {
  return JST[name](this);
}

CollectionPresenter.extend = require('exoskeleton').extend;

module.exports = CollectionPresenter;