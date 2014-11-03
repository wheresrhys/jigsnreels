JNR.views.Tune = Backbone.View.extend({

    events: {
		"change .field" : "edit",
		"click .editable" : "editText"
    },
    initialize: function (options) {
		this.model.on('change', this.render, this);
		this.model.on('destroy', this.remove, this);
		this.model.on('practiced', this.unsetPlayingStandard, this);
    },

	unsetPlayingStandard: function () {
		$("[data-datum=standard]").find("option:first-child").attr("selected", "selected");
	},
    remove: function() {
		$(this.el).remove();
    },
	edit: function (ev) {
		var obj = {};
		if ($(ev.target).is("select")) {
			obj[$(ev.target).closest('[data-datum]').data("datum")] = +$(ev.target).find("option:selected").val();
		} else {
			obj[$(ev.target).closest('[data-datum]').data("datum")] = $(ev.target).is(":checked");
		}
			
		this.model.saveSpecial(obj);
		
	},
	editText: function (ev) {
		
		ev.preventDefault();
		
		var datum = $(ev.target).data("datum") 
		
		var $td = $(ev.target),
			origVal = $td.text(),
			$textarea = $("<textarea></textarea>").text(origVal);
		$td.html($textarea);
		$textarea.focus();
		var that = this;
		$textarea.on("keyup", function (ev) {
			if(ev.keyCode === 13 && !ev.shiftKey) {
				ev.preventDefault();
				save();
				return false;
			}
		}).on("click", function (ev) {
			ev.stopPropagation();
		}).on("blur", save);
		
		
		function save() {
			var val = $textarea.val().trim();
			if (datum === "my_abc" && val.indexOf("X:") === -1) {
				JNR.app.currentView.trigger("abcTidied:" + that.model.cid.substr(1));
				val = val.replace(/\x20*\|\x20*/g, "|").replace(/\x20{2,}/g, " ");
			}
			$td.text(val);
			if (val !== origVal) {
				var obj = {};
				
				obj[datum] = val;
				if (datum === "my_abc") {
					that.model.saveABC(obj);
				} else {
					that.model.saveSpecial(obj);
				}
			}
		}
	}
 });