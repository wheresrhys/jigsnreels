module.exports = require('../scaffolding/presenter').extend({
  toJSON: function () {
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
});
