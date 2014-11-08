var swig = require('swig/index');
var proto = {
    events: {
//         "click .expand" : "expand",
// //      "click thead th ": "sort",
//         "click .view-switch": "viewSwitch",
// //      "click .new ": "newTune",
//         "keyup .filter" :  "filterTunes",
//         "keyup .search" :  "searchTunes"
    },

    
    initialize: function(sets, el) {
        this.sets = sets;
        this.parent = el;
        this.listenTo(this.sets, 'sync', this.render.bind(this));
        this.listenTo(this.sets, 'sync', jlog);
        this.render();
    },
    render: function () {
        var frag = document.createDocumentFragment();
        frag.appendChild(document.createElement('div'));
        frag = frag.firstChild;
        frag.innerHTML = swig.render(require('./tpl.html'), this.sets.Presenter().toJSON());
        if (this.el.tagName === frag.firstChild.tagName && this.el.className === frag.firstChild.className) {
            this.el.innerHTML = '';
            while(frag.firstChild.firstChild) {
                this.el.appendChild(frag.firstChild.firstChild);
            }
        } else {
            this.setElement(frag.firstChild);
            this.parent.appendChild(this.el);
        }
        return this;
    } 
        // var that = this,
        //     masteredTuneCount,
        //     onceMasteredTuneCount,
        //     tuneCount;
            
        // if (JNR.app.instrumentId) {
        //     masteredTuneCount = _.filter(JNR.app.tuneBook, function (model) {
        //         return model.get('standard') > 2;
        //     }).length;
        //     onceMasteredTuneCount = _.filter(JNR.app.tuneBook, function (model) {
        //         return model.get('best') > 2;
        //     }).length;
        //     tuneCount = JNR.app.tuneBook.length;
        // } else {
        //     onceMasteredTuneCount = masteredTuneCount = tuneCount = 0;
        //     JNR.app.allTunes.each(function (model) {
        //         var performances = model.get('performances').models.slice(),
        //             performance;
        //         if (performances.length) {
        //             tuneCount++;
        //             while (performance = performances.shift()) {
        //                 if (performance.get('standard') > 2) {
        //                     onceMasteredTuneCount++;
        //                     masteredTuneCount++;
        //                     break;
        //                 }
        //                 if (performance.get('best') > 2 ) {
        //                     onceMasteredTuneCount++;
        //                 }
        //             }
        //         }
        //     });
        // }
        
        // this.$el.html(this.template({
        //     instrument: JNR.app.instrumentName || 'All instruments',
        //     tuneCount: tuneCount,
        //     masteredTuneCount: masteredTuneCount,
        //     onceMasteredTuneCount: onceMasteredTuneCount
        // }));
        // this.$tbody = this.$el.find("tbody");
        // this.sortCol = "practiceUrgency";
        // this.tuneBook = JNR.app.tuneBook;
        // this.addDummyPerformance();
        // that.sort();
        
        // //that.list.on('add', this.addOne, this);
    
        // this.$el.find(".filter, .search").val("");
        // this.$modeFilter = this.$el.find(".filter[data-datum=mode]");
        // this.$rhythmFilter = this.$el.find(".filter[data-datum=rhythm]");
        // this.$rootFilter = this.$el.find(".filter[data-datum=root]");
        
        // return this;
};



module.exports = require('exoskeleton').NativeView.extend(proto);