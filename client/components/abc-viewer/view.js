'use strict';

var swig = require('swig/index');
var allTunes = require('../../collections/tunes');

module.exports = require('../../scaffolding/view').extend({
    // tpl: require('./tpl.html'),
    events: {},
    initialize: function (opts) {
        this.parentEl = opts.parentEl;
        this.tune = allTunes.filter(function (tune) {
            return tune.get('_id') == opts.tuneId;
        })[0]

        this.render = this.render.bind(this);
        this.destroy = this.simpleDestroy.bind(this);
        // this.listenTo(this.practice, 'sync', this.render);
        this.listenTo(opts.parentView, 'destroy', this.destroy);
        // this.listenTo(practice, 'destroy', this.destroy);
        this.render();


    },

    render: function () {
        this.renderToDom(this.tune.get('abc'), true);
        return this;
    }

});




// require('src/tune/services/score-snippets');

// var ABCJS = require('abcjs'),
//     snippetsStore;

// var ScoreDrawer = function (scoreGenerator, snippetOnly, el) {
//     this.el = el;
//     this.scoreGenerator = scoreGenerator;
//     this.snippetOnly = snippetOnly;
//     this.exec();
// };

// ScoreDrawer.prototype = {
//     exec: function () {
        
//         this.el.html('');


//         this.arrangement = this.scoreGenerator.arrangement;

//         if (!this.arrangement) {
//             return;
//         }

//         this.abc = this.arrangement.abc;
//         this.conf = {
//             scale: 0.6,
//             paddingtop: 0,
//             paddingbottom: 0,
//             paddingright: 0,
//             paddingleft: 0
//         };

        

//         if (this.snippetOnly) {
//             this.getSnippet();
//         } else {
//             this.renderScore();
//         } 
//     },

//     getSnippet: function () {
//         var self = this;

//         this.el.addClass('score-snippet');

//         snippetsStore.getCachedScore(this.arrangement, function (obj) {
//             self.el.html(obj.score);
//             self.el[0].style.width = self.el.find('svg')[0].getAttribute('width') + 'px';
//         }, function () {
//             self.abc = self.abc.replace(/^\|*:?/, '');
//             self.abc = self.abc.split('|');
//             self.abc = self.abc.slice(0, (self.abc[0].length < 4 ? 4 : 3)).join('|');
//             self.conf.scale = 0.5;
//             self.conf.staffwidth = 450;
//             self.renderScore();
//         });
//     },

//     renderScore: function () {
//         var self = this;
//         this.abc = 'X:1' +
//         //'\nT:' + scoreGenerator.name + 
//         '\nM:' + this.scoreGenerator.meter + 
//         '\nL:1/8' + 
//         //'\nR:' + scoreGenerator.rhythm + 
//         '\nK:' + this.arrangement.root + this.scoreGenerator.mode + 
//         '\n' + this.abc;

//         setTimeout(function () {
//             ABCJS.renderAbc(self.el[0], self.abc, {}, self.conf, {});  

//             if (self.snippetOnly) {
//                 snippetsStore.cacheScore(self.arrangement, self.el[0].innerHTML);
//             }  
//         }, 100);        
//     }

// };

// require('angular').module('jnr.tune').directive('jDrawScore', function (jScoreSnippets) {
//     snippetsStore = jScoreSnippets;

//     return {
//         link: function(scope, el, attrs) {
            
//             var snippetOnly = !!attrs.snippet;

//             attrs.$observe('tune', function(value) {
//                 if (value) {
//                     new ScoreDrawer(JSON.parse(value), snippetOnly, el);
//                 }
//             });
//         }
//     };
// });