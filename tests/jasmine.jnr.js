var jasmineEnv = jasmine.getEnv();

jasmine.Matchers.prototype.toBeAFunction = function(){
	return typeof this.actual === 'function';
};

jasmine.Matchers.prototype.toBeThisFunction = function(func) {
	return this.actual === func;
};

jasmine.Matchers.prototype.toBeAnArray = function(func) {
	return this.actual instanceof Array;
};

jasmine.Matchers.prototype.toBeSameTimeAs = function (targetTime) {
	return Math.pow(this.actual - targetTime, 2) < 400;
};


jasmine.Matchers.prototype.lastCalledWith = function () {

	var actualArgs = this.actual.mostRecentCall.args,
		desiredArgs = Array.prototype.slice.apply(arguments);
	for (var i = 0, il = desiredArgs.length; i <il; i++) {
		if (!jasmineEnv.equals_(actualArgs[i], desiredArgs[i])) {
			return false;
		}
	}
	return true;
};

jasmine.Matchers.prototype.recentlyCalledWith = function () {

	var actualArgs = this.actual.calls[arguments[0]].args,
		desiredArgs = Array.prototype.slice.apply(arguments);

	desiredArgs.shift();
	for (var i = 0, il = desiredArgs.length; i <il; i++) {
		if (!jasmineEnv.equals_(actualArgs[i], desiredArgs[i])) {
			return false;
		}
	}
	return true;
};