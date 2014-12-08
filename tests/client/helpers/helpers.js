Helpers = window.Helpers || {};

window._ = require('lodash');
if (window.shimIndexedDB) {
	window.shimIndexedDB.__useShim();
}
Helpers.getValidTunes = function (n, props) {
	var tunes = [],
		tune;
	while(n--) {
		tune = {
			name: 'valid' + (n + 1),
			arrangements: [{_id: 'arrId'}],
			performances: [{
				arrangement: 'arrId',
				instrument: 'instrument1',
				best: 3
			}]
		};
		if (props) {
			if (props instanceof Array) {
				angular.extend(tune, props[n] || {});
			} else {
				angular.extend(tune, props);
			}
		}
		tunes.unshift(tune);
	}

	return tunes;
};

Helpers.fireEvent = function (el, event) {
	var evt = document.createEvent('HTMLEvents');
	evt.initEvent(event, false, true);
	el.dispatchEvent(evt);
};

Helpers.applyDirective = function (compile, rootScope, directiveHTML) {
	return compile(directiveHTML)(rootScope);
};
