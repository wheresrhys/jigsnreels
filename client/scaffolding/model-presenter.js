// A generic presenter object for Backbone.Model
// =============================================

// presenter = new ModelPresenter({model: model});
function ModelPresenter (options) {
  var options = options ? options : {};
  this.model = options.model;
  this.construct && this.construct();
}

// Pass a template object and it’ll output it with the presenter’s
// model attributes.
ModelPresenter.prototype.partial = function(name) {
  return JST[name](_.extend(this, this.model.attributes));
}

ModelPresenter.proytotype.extend = require('exoskeleton').extend;

module.exports = ModelPresenter;