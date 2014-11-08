var Presenter = function (options, collection) {
  if (this instanceof require('exoskeleton').Collection) {
    return this.presenter || (this.presenter = new Presenter(options, this));
  }
  this.options = options ? options : {};
  this.collection = collection;
}

Presenter.prototype.toJSON = function () {
    return {
        locals: {
            sets: this.collection.models.map(function (model) {
                return model.attributes;
            })
            // .map(function (model) {
            //     return new 
            // })
        }
    }         
}

module.exports = Presenter;