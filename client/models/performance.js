JNR.models.Performance = Backbone.RelationalModel.extend({
	urlRoot: "/rest/performances",
	defaults: {
		my_abc: '',
		highest_note: '',
		lowest_note: '',
		standard: 0,
		updated: 0,
		notes: '',
		best: 0,
		difficulty: 0,
		last_practiced: JNR.now(),
		special_attention: 0,
		ignore: 0,
		slipping: 0,
		practiceUrgency: 0,
		daysSinceLastPractice: 0,
		rank: 0,
		sortRank: 0 
	},
	initialize: function (attrs, options) {
		this.dummy = options && options.dummy;
		this.cleanABC();
		if (!this.get("lowest_note") && ! this.dummy) {
			this.saveABC();
		}
		
	},
	afterDataPopulate: function() {
		this.cleanABC();
		if (!this.get("lowest_note")) {
			this.saveABC();
		}
		this.calculateRanking();
	},
	cleanABC: function () {
		var abc = this.get('my_abc');
		if(abc.match(/^X\:1/)) {

			abc = abc.split('\n');
			var line, foundStart = false, newAbc = [];

			while(line = abc.shift()){
				if(!foundStart && !line.match(/^(X|T|M|L|R|K)\:/)) {
				newAbc.push(line);
				foundStart = true;
				} else if (foundStart) {
				if (line.indexOf('W:Variation from') === 0) {
					break;
				} else {
					newAbc.push(line);
				}
				}
			}
			this.set('my_abc', newAbc.join('\n'));
			this.save();

		}
		
	},
	
	calculateRanking: function () {
		this.setRank();
		this.setPracticeStatus();
	},
//	relations: [
//        {
//            type: 'HasOne',
//            key: 'tune',
//            relatedModel: 'JNR.models.Tune',
//            reverseRelation: {
//                key: 'performances'
//            }
//        }
//    ],
	toJSON: function (dontCleanUp) {
		var json = Backbone.RelationalModel.prototype.toJSON.apply(this);
		if(!dontCleanUp) {
			delete json.slipping;
			delete json.practiceUrgency;
			delete json.daysSinceLastPractice;
			delete json.rank;
			delete json.sortRank;
			delete json.noPerformance;
		} else {
			
		}
		return json;
	},
	
	saveSpecial: function(obj) {
		var now = JNR.now(),
			test = this.toJSON(),
			tuneObj = {},
			adjustTune = false,
			practice = false;
		
		for (var key in obj) {
			if (!test.hasOwnProperty(key)) {
				tuneObj[key] = obj[key];
				delete obj[key];
				adjustTune = true;
			}
		}
		
		if(typeof obj.standard === 'number') {
			practice = true;
			obj["last_practiced"] = now;
			if(obj.standard > this.get('best')) {
				obj.best = obj.standard;
			}
			
		}
		
		this.set(obj);
		if (adjustTune) {
			this.get('tune').save(tuneObj);
		}
		this.setRank();
		this.setPracticeStatus(practice);
		if (practice) {
			this.trigger("practiced");
		}
		if(this.dummy) {
			if (this.get('best') > 0 || this.get('special_attention')) {
				this.set({
					updated: 1,
					tune_id: this.get('tune').get('id'),
					my_abc: this.get('tune').get('my_abc') || this.get('tune').get('session_abc')
				});
				JNR.app.allPerformances.add(this);
				this.dummy = false; //TODO better evaluation of whether to save as new
			} else {
				//return;
			}
			
		}
		
		this.save();
	},

	sync: function () {
		return this.dummy || Backbone.sync.apply(this, arguments);
	},
	
	setPracticeStatus: function (practice) {
		var gap = this.get("best") - this.get("standard"),
			daysSinceLastPractice = JNR.now() - this.get("last_practiced") || 0 ,
			practiceUrgency = 0,
			uniqueVersion = this.get('tune').get('performances').length === 1;
		
		//if (this.get('best') > 0 || this.get('special')) {
			practiceUrgency = gap + (daysSinceLastPractice * (this.get('difficulty')+1)) + this.get('rank');
//			if (Math.floor(this.get('standard')/2) === 1 && this.get('tune').get('popularity') > 1) {
			if (this.get('standard') === 2 && this.get('best') > 2 && this.get('tune').get('popularity') > 1) {	
				practiceUrgency += this.get('tune').get('popularity') * daysSinceLastPractice;
			}
			if (this.get("standard") < 3) {
				practiceUrgency += (2*gap) ;
			}
			if (uniqueVersion) {
				practiceUrgency += 5;
			}
		//} 
		
		this.set({
			practiceUrgency: practiceUrgency,
			daysSinceLastPractice: daysSinceLastPractice,
			sortRank: this.get('rank') * Math.pow(Math.random(),0.1) + this.get('best')
		});
		
		if(this.collection && practice) {
			this.trigger("rankingChanged");
		//	this.collection.sort();
		}
	},
	setRank: function () {
		
		this.randomNum = 1;//this.randomNum || Math.random();
		
		var rating = this.get('tune').get("rating"),
			popularity = this.get('tune').get("popularity"),
			difficulty = this.get('difficulty');
		this.set("rank", Math.max(rating + popularity - difficulty/2, 1));
	},
	saveABC: (function () {
		var notes = ["G,","A,","B,"].concat("CDEFGABcdefgab".split("")).concat(["c'","d'","e'"]),
			n,
			nl = notes.length,
			getLowestNote = function (abc) {
				for(n=0;n<nl;n++) {
					if(abc.indexOf(notes[n])>-1) {
						return notes[n];
					}
				}
			},
			getHighestNote = function (abc) {
				for(n=nl-1;n;n--) {
					if(abc.indexOf(notes[n])>-1) {
						return notes[n];
					}
				}
			};
		
		return function (obj) {
			var abc = obj ? obj.my_abc : this.get("my_abc");
			if(!abc) {
				return;
			}
			this.set({
				highest_note: getHighestNote(abc),
				lowest_note: getLowestNote(abc)
			})
			if (this.dummy) {
				this.get('tune').save({my_abc: abc});
				this.set('my_abc', abc);
			} else {
				this.save(obj || {});
			}
			
		}
	}())
});