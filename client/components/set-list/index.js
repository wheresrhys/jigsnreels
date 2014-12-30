var SetView = require('../set');
var SearchView = require('../search');

module.exports = require('../../scaffolding/view').extend({
	tpl: require('./tpl.html'),
	name: 'set-list',
	events: {},
	initialize: function (opts) {
		this.sets = opts.sets;
		this.parentEl = opts.parentEl;
		this.render = this.render.bind(this);
		this.destroy = this.simpleDestroy.bind(this);
		this.listenTo(this.sets, 'sync', this.render);
		this.staticRender();
	},

	staticRender: function () {
		this.renderToDom(this.swig.render(this.tpl), true);
		this.listEl = this.el.querySelector('.set-list__list');
		this.search = new SearchView(this.childOpts('search', {
			limit: -1,
			items: this.sets.models,
			getSubjects: function (set) {
				return set.getTunes().concat([{
					get: function (key) {
						return key === 'name' ? set.get('name') : []
					}
				}])
			}
		}));
		this.listenTo(this.search, 'results', this.render)
		this.listenTo(this.search, 'invalid', this.render)
		this.render();
	},

	render: function (results) {
		var self = this;
		// don't rerender when we're applying no filter to an already unfiltered list
		if (!results && !this.filtered && this.listEl.innerHTML) {
			return;
		}
		this.filtered = !!results;
		this.listEl.innerHTML = '';
		var sets = results || this.sets.models.sort(function (m1, m2) {
			var m1l = m1.tunebooks().length;
			var m2l = m2.tunebooks().length;
			return (m1l === m2l) ? 0 : (m1l > m2l) ? 1 : -1;
		});
		sets.forEach(function (model) {
			setTimeout(function () {
				var setView = new SetView(self.childOpts(self.listEl, {
					set: model
				})).render();
			});
		});

		return this;
	}

});