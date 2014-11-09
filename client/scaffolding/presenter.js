var BB = require('exoskeleton');

var Presenter = function (options, data) {
	
	if (this instanceof BB.Collection || this instanceof BB.Model) {
		return this.presenter || (this.presenter = new this.Presenter(options, this));
	}
	
	this.options = options ? options : {};

	if (data instanceof BB.Collection) {
		this.collection = data;
	} else {
		this.model = data;
	} 
};

Presenter.extend = BB.extend;

module.exports = Presenter;