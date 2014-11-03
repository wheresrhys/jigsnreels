// A generic presenter object for Backbone.Model
// =============================================

// presenter = new ModelPresenter({model: model});
function ModelPresenter (options) {
  var options = options ? options : {};
  this.model = options.model;
}

// Pass a template object and it’ll output it with the presenter’s
// model attributes.
ModelPresenter.prototype.partial = function(name) {
  return JST[name](_.extend(this, this.model.attributes));
}

ModelPresenter.extend = require('exoskeleton').extend;