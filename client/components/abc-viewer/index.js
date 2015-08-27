'use strict';

var swig = require('swig/index');
var allTunes = require('../../data/collections/tunes');
var ABC = require('abc');

var abcConf = {
	scale: 0.6,
	paddingtop: 0,
	paddingbottom: 0,
	paddingright: 0,
	paddingleft: 0
}

module.exports = require('../../scaffolding/view').extend({

	events: {
		'click .abc-viewer__close': 'destroy'
	},
	name: 'abc-viewer',
	initialize: function (opts) {
		this.tpl = require('./tpl-full.html');
		this.parentEl = opts.parentEl;
		this.parent = opts.parent;
		this.tune = allTunes.find(opts.tuneId);
		this.opts = opts;

		this.render = this.render.bind(this);
		this.destroy = this.destroy.bind(this);
		this.listenTo(this.parent, 'destroy', this.destroy);
		// this.listenTo(practice, 'destroy', this.destroy);
		this.render();
	},

	render: function () {
		this.renderToDom(swig.render(this.tpl, {
			locals: {
				isDismissable: this.opts.isDismissable
			}
		}))
		var abc = this.opts.snippetOnly ? this.getSnippet() : this.tune.get('abc');
		var it = this;
		setTimeout(function () {
			ABC.renderAbc(it.el.querySelector('.abc-viewer__score'), abc, {}, abcConf, {});
		});
		// if (it.snippetOnly) {
		//	 snippetsStore.cacheScore(it.arrangement, it.el[0].innerHTML);
		// }
		// return this;
	},

	destroy: function () {
		this.parent.stopListening(this);
		this.simpleDestroy();
	},

	// renderScore: function () {
	//	 var it = this;
	//	 this.abc = 'X:1' +
	//	 //'\nT:' + scoreGenerator.name +
	//	 '\nM:' + this.scoreGenerator.meter +
	//	 '\nL:1/8' +
	//	 //'\nR:' + scoreGenerator.rhythm +
	//	 '\nK:' + this.arrangement.root + this.scoreGenerator.mode +
	//	 '\n' + this.abc;

	//	 setTimeout(function () {
	//		 ABCJS.renderAbc(it.el[0], it.abc, {}, it.conf, {});


	//	 }, 100);
	// }

	getSnippet: function () {
		// var it = this;

		// this.el.addClass('score-snippet');

		// snippetsStore.getCachedScore(this.arrangement, function (obj) {
		//	 it.el.html(obj.score);
		//	 it.el[0].style.width = it.el.find('svg')[0].getAttribute('width') + 'px';
		// }, function () {
		//	 it.abc = it.abc.replace(/^\|*:?/, '');
		//	 it.abc = it.abc.split('|');
		//	 it.abc = it.abc.slice(0, (it.abc[0].length < 4 ? 4 : 3)).join('|');
		//	 it.conf.scale = 0.5;
		//	 it.conf.staffwidth = 450;
		//	 it.renderScore();
		// });
	}

});




// require('src/tune/services/score-snippets');


	// snippetsStore;

// var ScoreDrawer = function (abc, snippetOnly) {
//	 this.el = el;
//	 this.scoreGenerator = scoreGenerator;
//	 this.snippetOnly = snippetOnly;
//	 this.exec();
// };

// ScoreDrawer.prototype = {
//	 exec: function () {

//		 this.el.html('');


//		 this.arrangement = this.scoreGenerator.arrangement;

//		 if (!this.arrangement) {
//			 return;
//		 }

//		 this.abc = this.arrangement.abc;
//		 this.;



//		 if (this.snippetOnly) {
//			 this.getSnippet();
//		 } else {
//			 this.renderScore();
//		 }
//	 },

//	 getSnippet: function () {
//		 var it = this;

//		 this.el.addClass('score-snippet');

//		 snippetsStore.getCachedScore(this.arrangement, function (obj) {
//			 it.el.html(obj.score);
//			 it.el[0].style.width = it.el.find('svg')[0].getAttribute('width') + 'px';
//		 }, function () {
//			 it.abc = it.abc.replace(/^\|*:?/, '');
//			 it.abc = it.abc.split('|');
//			 it.abc = it.abc.slice(0, (it.abc[0].length < 4 ? 4 : 3)).join('|');
//			 it.conf.scale = 0.5;
//			 it.conf.staffwidth = 450;
//			 it.renderScore();
//		 });
//	 },



// };

// require('angular').module('jnr.tune').directive('jDrawScore', function (jScoreSnippets) {
//	 snippetsStore = jScoreSnippets;

//	 return {
//		 link: function(scope, el, attrs) {

//			 var snippetOnly = !!attrs.snippet;

//			 attrs.$observe('tune', function(value) {
//				 if (value) {
//					 new ScoreDrawer(JSON.parse(value), snippetOnly, el);
//				 }
//			 });
//		 }
//	 };
// });
