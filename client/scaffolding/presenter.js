var BB = require('exoskeleton');

var Presenter = function (options, data) {
	options = options || {};
	
	if (this instanceof BB.Collection || this instanceof BB.Model) {
		if (options.persist) {
			return this.presenter || (this.presenter = new this.Presenter(options, this));	
		} 
		return new this.Presenter(options, this);
	}
	
	this.options = options ? options : {};

	if (data instanceof BB.Collection) {
		this.collection = data;
	} else {
		this.model = data;
	} 
	this.construct && this.construct();
};

Presenter.extend = BB.extend;

module.exports = Presenter;