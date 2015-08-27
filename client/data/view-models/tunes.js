var sortName = function (tune) {
	return tune.name.replace(/^(The|A) +/i, '').toLowerCase();
};

var TunesViewModel = module.exports = function (collection) {
	if (!collection) {
		return new TunesViewModel(this);
	}
	this.collection = collection;
	this.out = {
		tunes: this.collection.models.map(function (model) {
			return model.viewModel();
		})
	}
}

TunesViewModel.prototype = {

	childDo: function (methods) {
		var it = this;
		if (!(methods instanceof Array)) {
			methods = [methods];
		}
		this.out.tunes = this.out.tunes.map(function (model) {
			return methods.reduce(function (chain, method) {
				return chain[method]();
			}, model)
		});
		return this;
	},

	sortByName: function () {
		this.out.tunes = this.out.tunes.sort(function (a, b) {
			return sortName(a) > sortName(b) ? 1: -1;
		})
		return this;
	},

	groupBy: function (prop) {
		var hash = {};
		this.out.tunes.forEach(function (tune) {
			tune[prop + 's'].forEach(function (group) {
				group = group.toLowerCase();
				hash[group] ? hash[group].push(tune) : (hash[group] = [tune]);
			});
		});
		this.out.tunes = hash;
		this.out.types = Object.keys(hash).sort();
		this.out.isGrouped = true;
		return this;
	},

	sortBy: function (sorter) {

		if (this.out.isGrouped) {
			this.out.types.forEach(function (key) {
				this.out.tunes[key] = this.out.tunes[key].sort(sorter);
			}.bind(this))
		} else {
			this.out.tunes = this.out.tunes.sort(sorter)
		}

		return this;
	},

	end: function (standalone) {
		if (standalone) {
			return {
				locals: this.out
			};
		} else {
			return this.out;
		}
	}
}