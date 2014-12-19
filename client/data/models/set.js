'use strict';
var allTunes = require('../collections/tunes');

module.exports = require('backbone-es6').Model.extend({
	idAttribute: '_id',
	viewModel: require('../view-models/set'),
	url: function () {
		return require('../../scaffolding/api').url('sets', this.id);
	},

	defaults: {
		tunes: [],
		keys: [],
		name: ''
	},
	tunebooks: function () {
		var pieces = require('../collections/pieces');
		return pieces.getTunebooksForResource(this).filter(function (tb) {
			return tb.isListed === true;
		}).map(function (tb) {
			return tb.name;
		});
	},
	parse: function (resp) {
		if (typeof resp.tunes[0] === 'object') {
			allTunes.add(resp.tunes, {parse: true});
			resp.tunes = resp.tunes.map(function (tune) {
				return tune._id;
			})
		}
		if (resp.piece) {
			this.trigger('newPiece', resp.piece);
			delete resp.piece;
		}
		return resp;
	},
	tuneNames: function () {
		return this.get('tunes').map(function (tuneId) {
			return allTunes.filter(function (tune) {
				return tune.get('_id') === tuneId;
			})[0].get('name');
		});
	},
	appendTune: function (tuneId) {
		var tune = allTunes.filter(function (tune) {
			return tune.get('_id') === tuneId;
		})[0];

		var tunes = this.get('tunes').length ? this.get('tunes') : [];
		var keys = this.get('keys').length ? this.get('keys') : [];

		tunes.push(tuneId);
		keys.push(tune.get('keys')[0]);
		this.set('tunes', tunes);
		this.set('keys', keys);
		this.trigger('change');
	},
	removeTune: function (tuneId) {
		var tunes = this.get('tunes');
		var pos = tunes.indexOf(tuneId);
		this.get('tunes').splice(pos, 1);
		this.get('keys').splice(pos, 1);
		this.trigger('change');
	},
	moveTuneUp: function (tuneId) {
		var tunes = this.get('tunes');
		var pos = tunes.indexOf(tuneId);
		if (!pos) return;
		var key = this.get('keys')[pos];
		this.get('tunes').splice(pos, 1);
		this.get('tunes').splice(pos - 1, 0, tuneId);
		this.get('keys').splice(pos, 1);
		this.get('keys').splice(pos - 1, 0, key);
		this.trigger('change');
	},
	changeTuneKey: function (newKey, tuneId) {
		this.attributes.keys[this.get('tunes').indexOf(tuneId)] = newKey;
		this.trigger('change');
	},
	delete: function () {
		var id = this.get('_id');
		this.destroy();
	}
}, {});