//TODO: merging items

var JNR = window.JNR || {};
(function ( JNR, $, window, document, undefined ) {
	
	// Internal module cache.
	var modules = {};
	
	JNR.models = {};
	JNR.collections = {};
	JNR.controllers = {};
	JNR.views = {};
	JNR.now = function () {
		return Math.floor((new Date()).getTime() / (1000*60*60*24));
	};
	JNR.init = function() {
		 Backbone.emulateHTTP = true;
		
		 for(var key in JNR.views) {
			 if(JNR.views.hasOwnProperty(key)) {
				 JNR.views[key].prototype.getTemplates && JNR.views[key].prototype.getTemplates();
			 }
		 }
		 
		 	var playbackTexts = [
				'Novice',
				'Hand-holding',//Can vaguely play it',
				'Sloppy/Slow',
				'Playalong',
				'Starter',
				'Solo'
			],
			popularityTexts = [
				'Unknown',
				'Rare',
				'Some sessions',
				'Standard'
			],
			ratingTexts = [
				'Crap',
				'meh',
				'Predictable',//Nice but bit plodding',
				'Decent',
				'Really nice', //Oooh... it did something there',
				'Special'//My word, my word, my word...'
			],
			difficultTexts = [
				'unrated', 
				'Easy-peasy',
				'Straightforward', 
				'Tricky Bits', 
				'Really hard'
			];
		
		Handlebars.registerHelper('starRating', function(rating) {
			var out = "<select class='star-rating' >";


			for(var i=0, l=6; i<l; i++) {
				out += "<option value='" + i + "' ";
				if(rating === i) {
					out += " selected='selected' "
				}
				out += ">" + ratingTexts[i] + "</option>";
			}

			return out + "</select>";
		});
		
		
		Handlebars.registerHelper('playback', function(rating) {
			var out = "<select class='star-rating' >";
			out += "<option value='null' selected='selected'> --- </option>"

			for(var i=0, l=6; i<l; i++) {
				out += "<option value='" + i + "' ";
//				if(rating === i) {
//					out += " selected='selected' "
//				}
				out += ">" + playbackTexts[i] + "</option>";
			}

			return out + "</select>";
		});
		
		Handlebars.registerHelper('popular', function(rating) {
			var out = "<select class='popularity' >";


			for(var i=0, l=4; i<l; i++) {
				out += "<option value='" + i + "' ";
				if(rating === i) {
					out += " selected='selected' "
				}
				out += ">" + popularityTexts[i] + "</option>";
			}

			return out + "</select>";
		});
		
		Handlebars.registerHelper('difficult', function(rating) {
			var out = "<select class='popularity' >";


			for(var i=0, l=5; i<l; i++) {
				out += "<option value='" + i + "' ";
				if(rating === i) {
					out += " selected='selected' "
				}
				out += ">" + difficultTexts[i] + "</option>";
			}

			return out + "</select>";
		});
		
		this.app = new JNR.views.App({el: $('#wrapper')});
		this.app.start();
	}

	
	

})( JNR, jQuery, window, document );

$(function() {JNR.init()});








